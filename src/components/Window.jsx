import classNames from 'classnames/bind'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicContext, MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import Block from './Block'
import Spinner from './Spinner'
import XMarkIcon from '@/icons/x-mark.svg'
import PlusIcon from '@/icons/plus.svg'
import MinusIcon from '@/icons/minus.svg'
import ArrowsPointingOutIcon from '@/icons/arrows-pointing-out.svg'
import ListBulletIcon from '@/icons/list-bullet.svg'
import Squares2x2Icon from '@/icons/squares-2x2.svg'

function Window ({ path, channelData }) {
  const mosaic = useContext(MosaicContext)
  const arena = useArena()

  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState(channelData)
  const [blocks, setBlocks] = useState([])
  const [error, setError] = useState(null)
  const [gridCellSize, setGridCellSize] = useState(150)
  const [view, setView] = useState('grid')

  const gridCellSizeMultiplier = 1.25

  useEffect(() => {
    fetchBlocks()
  }, [arena])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    const results = await arena.channel(channel.id).contents({ page: 1, per: 25 })

    try {
      setBlocks(results.contents)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [arena])

  const addBlock = useCallback(
    async block => {
      setBlocks(blocks => [...blocks, block])

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.connect.block(block.id)

      console.log(result)

      // TODO: should update the block that was added with new info (connection_id, etc)
    },
    [arena]
  )

  const disconnectBlock = useCallback(
    async block => {
      removeBlock(block)

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.disconnect.block(block.id)

      console.log(result)
    },
    [arena]
  )

  const removeBlock = block => {
    setBlocks(blocks => blocks.filter(b => b.id !== block.id))
  }

  const [{ isActive }, dropRef] = useDrop({
    accept: 'block',
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver()
    }),
    canDrop: (item, monitor) => handleCanDrop(item, monitor)
  })

  const handleDrop = (item, monitor) => {
    addBlock(item)

    return item
  }

  const handleCanDrop = (item, monitor) => {
    return !isLoading && !blocks.find(block => block.id === item.id)
  }

  const incrementGrid = () => {
    setGridCellSize(gridCellSize * gridCellSizeMultiplier)
  }

  const decrementGrid = () => {
    setGridCellSize(gridCellSize / gridCellSizeMultiplier)
  }

  const remove = () => {
    mosaic.mosaicActions.remove(path)
  }

  const expand = () => {
    mosaic.mosaicActions.expand(path)
  }

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid')
  }

  return (
    <MosaicWindow
      title={`${channel.user.full_name} / ${channel.title}`}
      className={`channel-status-${channel.status}`}
      path={path}
      toolbarControls={<ToolbarControls />}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div
        className={classNames(
          'overflow-y-auto scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit h-full',
          { 'bg-secondary/25': isActive }
        )}
        ref={dropRef}
      >
        {isLoading && (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        <Blocks />
      </div>
    </MosaicWindow>
  )

  function Blocks () {
    if (blocks.length) {
      if (view == 'grid') {
        return <BlocksGrid />
      } else {
        return <BlocksList />
      }
    } else {
      return <BlankSlate />
    }
  }

  function BlocksGrid () {
    return (
      <div
        className='p-2 grid gap-2'
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${gridCellSize}px,1fr))` }}
      >
        {blocks.map(block => (
          <Block key={block.id} data={block} disconnectBlock={disconnectBlock} />
        ))}
      </div>
    )
  }

  function BlocksList () {
    return (
      <ul className='p-2 divide-y divide divide-primary/70 text-primary'>
        {blocks.map(block => (
          <li className='py-1 text-md grid grid-cols-[min-content_1fr] gap-x-4 items-center'>
            <div className='w-8 h-8'>
              {block.image && <img src={block.image.thumb.url} className='aspect-square object-contain' />}
            </div>
            <div>{block.title}</div>
          </li>
        ))}
      </ul>
    )
  }

  function BlankSlate () {
    return <div className='w-full h-full flex items-center justify-center'>No blocks</div>
  }

  function ToolbarControls () {
    return (
      <div className='flex justify-end'>
        <button onClick={toggleView} className='hover:text-secondary px-1'>
          {view === 'list' && (<Squares2x2Icon className='w-5 h-5' />)}
          {view === 'grid' && (<ListBulletIcon className='w-5 h-5' />)}
        </button>

        <button onClick={incrementGrid} className='hover:text-secondary px-1'>
          <PlusIcon className='w-5 h-5' strokeWidth='2' />
        </button>

        <button onClick={decrementGrid} className='hover:text-secondary px-1'>
          <MinusIcon className='w-5 h-5' strokeWidth='2' />
        </button>

        <button onClick={expand} className='hover:text-secondary px-1'>
          <ArrowsPointingOutIcon className='w-5 h-5' />
        </button>

        <button onClick={remove} className='hover:text-secondary px-1'>
          <XMarkIcon className='w-5 h-5' strokeWidth='2' />
        </button>
      </div>
    )
  }
}

export default Window
