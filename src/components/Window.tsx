import { WindowContext, WindowContextType } from '@/context/WindowContext'
import getErrorMessage from '@/lib/getErrorMessage'
import blocksReducer from '@/reducers/blocksReducer'
import { useDndMonitor, useDroppable } from '@dnd-kit/core'
import { ArenaChannelContents } from 'arena-ts'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { CSSProperties, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useDrop } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
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
  const channelObj = useMemo(() => {
    if (arena) return arena.channel(channel.slug)
  }, [arena, channel])

  const { data: sessionData } = useSession()
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusState>('inactive')
  const [blocks, dispatchBlocks] = useReducer(blocksReducer, [])
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const [isActiveDrop, setIsActiveDrop] = useState(false)
  const [draggingBlock, setDraggingBlock] = useState<ArenaChannelContents | null>()

  const blockPageSize = 50
  const totalPages = useMemo(() => Math.ceil(channel.length / blockPageSize), [channel])
  const isLoading = useMemo(() => loadingStatus === 'active', [loadingStatus])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    setLoadingStatus('active')

    const results = await arena.channel(channel.slug).contents({ page, per: blockPageSize })

    try {
      dispatchBlocks({ type: 'prepend', blocks: results.contents as ArenaChannelContents[] })
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
      return channel.user_id === sessionData?.user.id
    }
  }, [channel, sessionData?.user])

  const canDelete = useMemo(() => channel.user_id === sessionData?.user.id, [channel, sessionData?.user])

  const canDrop = useCallback(
    (block: ArenaChannelContents) => {
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

  const [{ isOver: fileIsOver }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop (item: { files: File[] }) {
      handleFileDrop(item.files)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }))

  const handleFileDrop = async (files: File[]) => {
    console.log(files)
  }

  // const createBlock = useCallback(async (content: string) => {
  //   if (!arena) return

  //   const results = await arena.channel(channel.slug).createBlock({ content })

  //   console.debug(results)

  //   return results
  // }, [arena, channel])

  const connectBlock = useCallback(
    async (block: ArenaChannelContents) => {
      if (!canWrite) return

      dispatchBlocks({
        type: 'append',
        blocks: [{ ...block, ...{ connection_id: undefined } }]
      })

      let result

      try {
        if (block.class === 'Channel') {
          result = await channelObj?.connect.channel(block.id)
        } else {
          result = await channelObj?.connect.block(block.id)
        }

        if (result) {
        // Replace copied block with updated data from response after connection
          dispatchBlocks({ type: 'update', id: block.id, payload: result })
        }
      } catch (error) {
        setError(getErrorMessage(error))
        dispatchBlocks({ type: 'remove', id: block.id })
      }
    },
    [canWrite, channelObj]
  )

  const disconnectBlock = useCallback(
    async (block: ArenaChannelContents) => {
      if (!canDelete) return

      const targetId = block.connection_id

      dispatchBlocks({ type: 'update', id: block.id, payload: { ...block, ...{ connection_id: undefined } } })

      try {
        if (targetId) {
          await channelObj?.disconnect.connection(targetId)

          dispatchBlocks({ type: 'remove', id: block.id })
        } else {
          throw new Error('Block is missing connection_id ')
        }
      } catch (error) {
        setError(getErrorMessage(error))
        dispatchBlocks({ type: 'update', id: block.id, payload: { ...block, ...{ connection_id: targetId } } })
      }
    },
    [canDelete, channelObj]
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
      canDelete,
      channel,
      connectBlock,
      disconnectBlock,
      isLoading,
      loadMore,
      scale,
      view
    }),
    [isLoading, loadMore, connectBlock, disconnectBlock, canDelete, channel, scale, view]
  )

  return (
    <MosaicWindow
      title={`${channel.user?.username} / ${channel.title}`}
      className={classNames('relative', {
        'channel-status-private': channel.status === 'private',
        'channel-status-public': channel.status === 'public',
        'channel-status-closed': channel.status === 'closed'
      })}
      path={path}
      toolbarControls={<WindowToolbar data={data} />}
    >
        <div
        ref={el => { setNodeRef(el); drop(el) }}
        style={{ '--scale': scale } as CSSProperties}
        className={classNames('h-full text-[calc(1rem*var(--scale))]', {
          'bg-dot-grid-secondary': isActiveDrop
        })}>
          {error && <div className='text-red-500'>Error: {error}</div>}

          {!blocks.length && isLoading && (
            <div className='flex h-full w-full items-center justify-center'>
              <Spinner />
            </div>
          )}

        {!blocks.length && loadingStatus !== 'active' && <BlankSlate />}

          <WindowContext.Provider value={contextValues}>{renderBlocks()}</WindowContext.Provider>

          <div className={classNames('hidden absolute inset-0 bg-secondary/30 backdrop-contrast-50 items-center justify-center', { '!flex': fileIsOver })}>
            <span className='text-2xl font-bold text-secondary'>Drop fields to add</span>
          </div>
        </div>
    </MosaicWindow>
  )
}

function BlankSlate () {
  return <div className='flex h-full w-full items-center justify-center'>No blocks</div>
}

export default Window
