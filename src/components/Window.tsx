import { WindowContext, WindowContextType } from '@/context/WindowContext'
import getErrorMessage from '@/lib/getErrorMessage'
import blocksReducer from '@/reducers/blocksReducer'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { ChannelContents } from '@/types/arena'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { CSSProperties, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { isHotkeyPressed } from 'react-hotkeys-hook'
import { MosaicWindow } from 'react-mosaic-component'
import { MosaicPath } from 'react-mosaic-component/lib/types'
import { useArena } from '../hooks/useArena'
import { DraggingBlockData } from './BlockContainer'
import BlocksGrid from './BlocksGrid'
import BlocksList from './BlocksList'
import { ChannelWindowState } from './Desktop'
import Spinner from './Spinner'
import WindowToolbar from './WindowToolbar'

export interface WindowProps {
  path: MosaicPath,
  data: ChannelWindowState
}

export type LoadingStatusState = 'inactive' | 'active' | 'waiting' | 'complete'

function Window ({ path, data, data: { data: channel, scale, view } }: WindowProps) {
  const arena = useArena()

  const { data: sessionData } = useSession()
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusState>('inactive')
  const [blocks, dispatchBlocks] = useReducer(blocksReducer, [])
  const [page, setPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [error, setError] = useState('')
  const [isActiveDrop, setIsActiveDrop] = useState(false)
  const [draggingBlock, setDraggingBlock] = useState<ChannelContents | null>()

  const blockPageSize = 50
  const isLoading = useMemo(() => loadingStatus === 'active', [loadingStatus])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    setLoadingStatus('active')

    const results = await arena.channels.contents(channel.id, { page, per: blockPageSize })

    try {
      dispatchBlocks({ type: 'prepend', blocks: results.data })
      setHasMorePages(results.meta.has_more_pages)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoadingStatus('waiting')
    }
  }, [arena, channel, page])

  useEffect(() => {
    fetchBlocks()
  }, [fetchBlocks])

  const loadMore = useCallback(() => {
    if (!hasMorePages) {
      setLoadingStatus('complete')
    } else {
      setPage(p => p + 1)
    }
  }, [hasMorePages])

  const canWrite = useMemo(() => {
    if (channel.can?.add_to) {
      return true
    } else {
      return channel.owner.id === sessionData?.user.id
    }
  }, [channel, sessionData?.user])

  const canDelete = useMemo(() => channel.owner.id === sessionData?.user.id, [channel, sessionData?.user])

  const canDrop = useCallback(
    (block: ChannelContents) => {
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

  // The draggingBlock state is needed in order to disable the droppable window
  // based off conditions in canDrop, which requires the block data as an
  // argument. This is needed to prevent blocks being disconnected when holding
  // ALT and dropping over a window that doesn't actually connect the dragging
  // block. (Example: dropping over a window where the block is already
  // connected)
  //
  // However, this is a duplicate of the same state in BlockDndContext that
  // drives BlockOverlay. Not sure how to access that here. Can DndContext be
  // added to? Custom pointer sensor? Should be refactored some time later.

  const { setNodeRef } = useDroppable({
    id: channel.id,
    disabled: draggingBlock != null && !canDrop(draggingBlock)
  })

  useDndMonitor({
    onDragOver (event) {
      const { active, over } = event
      const { block } = active.data.current as { block: DraggingBlockData['block'] }

      if (channel.id === over?.id) {
        setDraggingBlock(block)
        setIsActiveDrop(canDrop(block))
      } else {
        setIsActiveDrop(false)
      }
    },
    onDragEnd (event) {
      const { active, over } = event
      const { block } = active.data.current as { block: DraggingBlockData['block'] }
      const { window } = active.data.current as { window: DraggingBlockData['window'] }

      setDraggingBlock(null)
      setIsActiveDrop(false)

      // If this window is where the block was dropped...
      if (channel.id === over?.id) {
        if (canDrop(block)) {
          connectBlock(block)
        }
        // If this window is the window the dropped block was dragged from...
      } else if (over && channel.id === window.id) {
        if (isHotkeyPressed('alt') && canDelete) {
          disconnectBlock(block)
        }
      }
    },
    onDragCancel () {
      setDraggingBlock(null)
      setIsActiveDrop(false)
    }
  })

  const connectBlock = useCallback(
    async (block: ChannelContents) => {
      if (!canWrite) return

      // Optimistic append with null connection (pending state)
      dispatchBlocks({
        type: 'append',
        blocks: [{ ...block, connection: null }]
      })

      try {
        const connectableType = block.type === 'Channel' ? 'Channel' : 'Block'
        const result = await arena?.connections.create({
          connectable_id: block.id,
          connectable_type: connectableType,
          channel_ids: [channel.id]
        })
        const newConnection = result?.data?.[0]

        if (newConnection) {
          dispatchBlocks({
            type: 'update',
            block: { ...block, connection: newConnection }
          })
        }
      } catch (error) {
        setError(getErrorMessage(error))
        dispatchBlocks({ type: 'remove', id: block.id })
      }
    },
    [arena, canWrite, channel.id]
  )

  const disconnectBlock = useCallback(
    async (block: ChannelContents) => {
      if (!canDelete) return

      const targetId = block.connection?.id

      dispatchBlocks({ type: 'update', block: { ...block, connection: null } })

      try {
        if (targetId) {
          await arena?.connections.delete(targetId)
          dispatchBlocks({ type: 'remove', id: block.id })
        } else {
          throw new Error('Block is missing connection id')
        }
      } catch (error) {
        setError(getErrorMessage(error))
        dispatchBlocks({ type: 'update', block: { ...block, connection: block.connection } })
      }
    },
    [arena, canDelete]
  )

  const renderBlocks = () => {
    if (view === 'grid') {
      return <BlocksGrid blocks={blocks} />
    } else {
      return <BlocksList blocks={blocks} />
    }
  }

  const contextValues = useMemo<WindowContextType>(
    () => ({
      blocks,
      canDelete,
      channel,
      connectBlock,
      disconnectBlock,
      isLoading,
      loadMore,
      scale,
      view
    }),
    [blocks, isLoading, loadMore, connectBlock, disconnectBlock, canDelete, channel, scale, view]
  )

  return (
    <MosaicWindow
      title={`${channel.owner.name} / ${channel.title}`}
      className={classNames({
        'channel-status-private': channel.visibility === 'private',
        'channel-status-public': channel.visibility === 'public',
        'channel-status-closed': channel.visibility === 'closed'
      })}
      path={path}
      toolbarControls={<WindowToolbar data={data} />}
    >
        <div
        style={{ '--scale': scale } as CSSProperties}
        ref={setNodeRef}
        className={classNames('h-full text-[calc(1rem*var(--scale))]', {
          'bg-dot-grid-secondary': isActiveDrop
        })}
      >
        {error && <div className='text-red-500'>Error: {error}</div>}

        {!blocks.length && isLoading && (
          <div className='flex h-full w-full items-center justify-center'>
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
  return <div className='flex h-full w-full items-center justify-center'>No blocks</div>
}

export default Window
