import classNames from 'classnames/bind'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import Spinner from './Spinner'
import Blocks from './Blocks'
import WindowToolbar from './WindowToolbar'

function Window ({ path, channel }) {
  const arena = useArena()

  const [isLoading, setIsLoading] = useState(true)
  const [blocks, setBlocks] = useState([])
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1)
  const [view, setView] = useState('grid')

  const blockPageSize = 50
  const totalPages = useMemo(() => Math.ceil(channel.length / blockPageSize), [channel])
  const scaleDefaults = {
    multiplier: 1.25,
    min: 0.75,
    max: 3
  }

  useEffect(() => {
    fetchBlocks()
  }, [arena, page])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    setIsLoading(true)

    const results = await arena.channel(channel.id).contents({ page, per: blockPageSize })

    try {
      setBlocks(blocks => [...blocks, ...results.contents])
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [arena, channel.id, page])

  const loadMore = useCallback(() => {
    if (page <= totalPages) {
      setPage(page + 1)
    }
  }, [page, totalPages])

  const addBlock = useCallback(
    async block => {
      setBlocks(blocks => [...blocks, block])

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.connect.block(block.id)

      console.log(result)

      // TODO: should update the block that was added with new info (connection_id, etc)
    },
    [arena, channel.id]
  )

  const disconnectBlock = useCallback(
    async block => {
      removeBlock(block)

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.disconnect.block(block.id)

      console.log(result)
    },
    [arena, channel.id]
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

  return (
    <MosaicWindow
      title={`${channel.user.full_name} / ${channel.title}`}
      className={`channel-status-${channel.status}`}
      path={path}
      toolbarControls={
        <WindowToolbar
          scaleDefaults={scaleDefaults}
          scale={scale}
          setScale={setScale}
          view={view}
          setView={setView}
          channel={channel}
        />
      }
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
}

function BlankSlate () {
  return <div className='w-full h-full flex items-center justify-center'>No blocks</div>
}

export default Window
