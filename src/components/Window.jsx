import ArenaMarkIcon from '@/icons/arena-mark.svg'
import ArrowsPointingOutIcon from '@/icons/arrows-pointing-out.svg'
import ListBulletIcon from '@/icons/list-bullet.svg'
import MinusIcon from '@/icons/minus.svg'
import PlusIcon from '@/icons/plus.svg'
import Squares2x2Icon from '@/icons/squares-2x2.svg'
import XMarkIcon from '@/icons/x-mark.svg'
import classNames from 'classnames/bind'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicContext, MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import GridBlock from './GridBlock'
import ListBlock from './ListBlock'
import Spinner from './Spinner'

function Window ({ path, channelData }) {
  const mosaic = useContext(MosaicContext)
  const arena = useArena()

  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState(channelData)
  const [blocks, setBlocks] = useState([])
  const [error, setError] = useState(null)
  const [scale, setscale] = useState(1)
  const [view, setView] = useState('grid')

  const scaleMultiplier = 1.25
  const minScale = 0.75
  const maxScale = 3

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

  const incrementScale = () => {
    const value = scale * scaleMultiplier
    const clampedValue = Math.min(Math.max(value, minScale), maxScale)

    setscale(clampedValue)
  }

  const decrementScale = () => {
    const value = scale / scaleMultiplier
    const clampedValue = Math.min(Math.max(value, minScale), maxScale)

    setscale(clampedValue)
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
        style={{ '--scale': scale }}
        className={classNames(
          'overflow-y-auto scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit h-full text-[calc(1rem*var(--scale))]',
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
      <div className='p-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(10em,1fr))]'>
        {blocks.map(block => (
          <GridBlock key={block.id} data={block} disconnectBlock={disconnectBlock} />
        ))}
      </div>
    )
  }

  function BlocksList () {
    return (
      <ul className='p-2 divide-y divide divide-primary/70 text-primary'>
        {blocks.map(block => (
          <li key={block.id}>
            <ListBlock data={block} disconnectBlock={disconnectBlock} />
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
      <div className='flex justify-end items-center'>
        <a
          href={`https://www.are.na/${channel.owner_slug}/${channel.slug}`}
          className='hover:text-secondary px-2'
          target='_blank'
        >
          <ArenaMarkIcon className='w-6' />
        </a>

        <button onClick={toggleView} className='hover:text-secondary px-1'>
          {view === 'list' && <Squares2x2Icon className='w-5 h-5' />}
          {view === 'grid' && <ListBulletIcon className='w-5 h-5' />}
        </button>

        <button onClick={incrementScale} className='hover:text-secondary px-1'>
          <PlusIcon className='w-5 h-5' strokeWidth='2' />
        </button>

        <button onClick={decrementScale} className='hover:text-secondary px-1'>
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
