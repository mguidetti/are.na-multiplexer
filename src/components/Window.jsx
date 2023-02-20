import { WindowContext } from '@/context/WindowContext'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
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
import { isHotkeyPressed } from 'react-hotkeys-hook'
import blocksReducer from '@/reducers/blocksReducer'

function Window ({ path, channel, scale, view }) {
  const arena = useArena()
  const channelObj = useMemo(() => {
    if (arena) return arena.channel(channel.id)
  }, [arena, channel])

  const { data } = useSession()
  const [loadingStatus, setLoadingStatus] = useState('inactive')
  const [blocks, dispatchBlocks] = useReducer(blocksReducer, [])
  const [page, setPage] = useState(1)
  const [error, setError] = useState(null)
  const [isActiveDrop, setIsActiveDrop] = useState(false)

  const blockPageSize = 50
  const totalPages = useMemo(() => Math.ceil(channel.length / blockPageSize), [channel])
  const isLoading = useMemo(() => loadingStatus === 'active', [loadingStatus])

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

  const canWrite = useMemo(() => {
    if (channel.open) {
      return true
    } else {
      return channel.user_id === data.user.id
    }
  }, [channel, data.user])

  const canDelete = useMemo(() => channel.user_id === data.user.id, [channel, data.user])

  const canDrop = useCallback(
    block => {
      if (!canWrite) {
        console.debug('Cannot drop', 'Unauthorized')
        return false
      }

      if (isLoading) {
        console.debug('Cannot drop', 'Blocks are loading')
        return false
      }

      if (blocks.find(b => b.id === block.id)) {
        console.debug('Cannot drop', 'Block already connected')
        return false
      }

      return true
    },
    [blocks, canWrite, isLoading]
  )

  const { setNodeRef } = useDroppable({
    id: channel.id,
    disabled: !canDrop,
    data: {
      accepts: ['block']
    }
  })

  useDndMonitor({
    onDragOver (event) {
      const block = event.active.data.current.block

      setIsActiveDrop(event.over?.id === channel.id && canDrop(block))
    },
    onDragEnd (event) {
      const block = event.active.data.current.block

      if (isActiveDrop) {
        if (canDrop(block)) {
          const blockClone = structuredClone(block)
          // Clear connection_id to not loose draggable ref on original block
          blockClone.connection_id = null

          connectBlock(blockClone)
        }

        setIsActiveDrop(false)
      } else if (event.active.data.current.originId === channel.id) {
        if (isHotkeyPressed('alt') && canDelete) {
          disconnectBlock(block)
        }
      } else {
      }
    }
  })

  const connectBlock = useCallback(
    async block => {
      dispatchBlocks({
        type: 'append',
        blocks: [{ ...block, ...{ processing: true, connection_id: null } }]
      })

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
      dispatchBlocks({ type: 'update', block: { ...block, ...{ processing: true } } })

      try {
        await channelObj.disconnect.connection(block.connection_id)

        dispatchBlocks({ type: 'remove', block: block })

        return true
      } catch (error) {
        setError(error)
        dispatchBlocks({ type: 'update', block: { ...block, ...{ processing: null } } })
      }
    },
    [channelObj]
  )

  const renderBlocks = () => {
    if (view === 'grid') {
      return <BlocksGrid blocks={blocks} />
    } else {
      return <BlocksList blocks={blocks} />
    }
  }

  const contextValues = useMemo(
    () => ({
      canDelete,
      channel,
      connectBlock,
      disconnectBlock,
      loadingStatus,
      loadMore,
      scale,
      view
    }),
    [loadingStatus, loadMore, connectBlock, disconnectBlock, canDelete, channel, scale, view]
  )

  return (
    <MosaicWindow
      title={`${channel.user.full_name} / ${channel.title}`}
      className={`channel-status-${channel.status}`}
      path={path}
      toolbarControls={<WindowToolbar channel={channel} scale={scale} view={view} />}
    >
      <div
        style={{ '--scale': scale }}
        ref={setNodeRef}
        className={classNames('h-full text-[calc(1rem*var(--scale))]', { 'bg-dot-grid-secondary': isActiveDrop })}
      >
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        {!blocks.length && isLoading && (
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
