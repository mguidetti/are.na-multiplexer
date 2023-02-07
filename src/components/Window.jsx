import ArenaMarkIcon from '@/icons/arena-mark.svg'
import ArrowsPointingOutIcon from '@/icons/arrows-pointing-out.svg'
import ListBulletIcon from '@/icons/list-bullet.svg'
import MinusIcon from '@/icons/minus.svg'
import PlusIcon from '@/icons/plus.svg'
import Squares2x2Icon from '@/icons/squares-2x2.svg'
import XMarkIcon from '@/icons/x-mark.svg'
import classNames from 'classnames/bind'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicContext, MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import Spinner from './Spinner'
import Blocks from './Blocks'

function Window ({ path, channelData }) {
  const mosaic = useContext(MosaicContext)
  const arena = useArena()

  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState(channelData)
  const [blocks, setBlocks] = useState([])
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [scale, setscale] = useState(1)
  const [view, setView] = useState('grid')

  const blockPageSize = 50
  const totalPages = useMemo(() => channel.length / blockPageSize, [channel])
  const scaleMultiplier = 1.25
  const minScale = 0.75
  const maxScale = 3

  useEffect(() => {
    fetchBlocks()
  }, [arena, page])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    setIsLoading(true)

    const results = await arena.channel(channel.id).contents({ page: page, per: blockPageSize })

    try {
      setBlocks([...blocks, ...results.contents])
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [arena, page])

  const loadMore = useCallback(() => {
    if (page <= totalPages) {
      setPage(page + 1)
    }
  }, [page])

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
        className={classNames('h-full text-[calc(1rem*var(--scale))]', { 'bg-secondary/25': isActive })}
        ref={dropRef}
      >
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        {!blocks.length && isLoading && (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}

        {!blocks.length && !isLoading && <BlankSlate />}

        <Blocks
          blocks={blocks}
          disconnectBlock={disconnectBlock}
          view={view}
          loadMore={loadMore}
          isLoading={isLoading}
        />
      </div>
    </MosaicWindow>
  )

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

function BlankSlate () {
  return <div className='w-full h-full flex items-center justify-center'>No blocks</div>
}

export default Window
