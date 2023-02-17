import { WindowContext } from '@/context/WindowContext'
import classNames from 'classnames/bind'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import BlocksGrid from './BlocksGrid'
import BlocksList from './BlocksList'
import Spinner from './Spinner'
import WindowToolbar from './WindowToolbar'
import blocksReducer from '@/reducers/blocksReducer'

function Window ({ path, channel }) {
  const arena = useArena()
  const channelObj = useMemo(() => {
    if (arena) return arena.channel(channel.id)
  }, [arena, channel])

  const { data } = useSession()
  const [loadingStatus, setLoadingStatus] = useState('inactive')
  const [blocks, dispatchBlocks] = useReducer(blocksReducer, [])
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

  const canWrite = useMemo(() => {
    if (channel.open) {
      return true
    } else {
      return channel.user_id === data.user.id
    }
  }, [channel, data.user])

  const canDelete = useMemo(() => {
    return channel.user_id === data.user.id
  }, [channel, data.user])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    setLoadingStatus('active')

    const results = await arena.channel(channel.id).contents({ page, per: blockPageSize })

    try {
      dispatchBlocks({ type: 'prepend', blocks: results.contents })
    } catch (error) {
      setError(error)
    } finally {
      setLoadingStatus('waiting')
    }
  }, [arena, channel, page])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const loadMore = useCallback(() => {
    const nextPage = page + 1

    if (nextPage >= totalPages) {
      setLoadingStatus('complete')
    } else {
      setPage(nextPage)
    }
  }, [page, totalPages])

  const connectBlock = useCallback(
    async block => {
      block.processing = true
      dispatchBlocks({ type: 'append', blocks: [block] })

      let result

      try {
        if (block.class === 'Channel') {
          result = await channelObj.connect.channel(block.id)
        } else {
          result = await channelObj.connect.block(block.id)
        }
        // Replace copied block with updated data from response after connection
        dispatchBlocks({ type: 'update', block: result })

        return result
      } catch (error) {
        setError(error)
        dispatchBlocks({ type: 'remove', block: block })
      }
    },
    [channelObj]
  )

  const disconnectBlock = useCallback(
    async block => {
      // We check for authorization here to prevent an error when "moving" a block from a
      // channel that the user doesn't have delete access to. It might be better to do this in
      // the Block components useDrag.end callback, but we need to know the drop target's channel
      // there somehow

      if (!canDelete) return

      block.processing = true
      dispatchBlocks({ type: 'update', block: block })

      try {
        await channelObj.disconnect.connection(block.connection_id)

        dispatchBlocks({ type: 'remove', block: block })

        return true
      } catch (error) {
        setError(error)
        block.processing = null
        dispatchBlocks({ type: 'update', block: block })
      }
    },
    [channelObj, canDelete]
  )

  const [{ isActive }, dropRef] = useDrop({
    accept: 'block',
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver()
    }),
    canDrop: (item, monitor) => determineCanDrop(item, monitor)
  })

  const handleDrop = (item, monitor) => {
    connectBlock(item)

    return item
  }

  const determineCanDrop = (item, monitor) => {
    if (loadingStatus === 'active') {
      // console.log('Cannot drop', 'Blocks are loading')
      return false
    }

    if (blocks.find(block => block.id === item.id)) {
      // console.log('Cannot drop', 'Block already connected')
      return false
    }

    if (!canWrite) {
      // console.log('Cannot drop', 'Unauthorized')
      return false
    }

    return true
  }

  const renderBlocks = () => {
    if (view === 'grid') {
      return <BlocksGrid blocks={blocks} />
    } else {
      return <BlocksList blocks={blocks} />
    }
  }

  const contextValues = useMemo(
    () => ({
      loadingStatus,
      loadMore,
      connectBlock,
      disconnectBlock,
      canDelete
    }),
    [loadingStatus, loadMore, connectBlock, disconnectBlock, canDelete]
  )

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

        {!blocks.length && loadingStatus === 'active' && (
          <div className='flex items-center justify-center w-full h-full'>
            <Spinner />
          </div>
        )}

        {!blocks.length && loadingStatus !== 'active' && <BlankSlate />}

        <WindowContext.Provider value={contextValues}>{renderBlocks()}</WindowContext.Provider>
      </div>
    </MosaicWindow>
  )
}

function BlankSlate () {
  return <div className='flex items-center justify-center w-full h-full'>No blocks</div>
}

export default Window
