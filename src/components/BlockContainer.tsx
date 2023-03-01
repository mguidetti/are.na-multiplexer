import { BlockContext, BlockContextType } from '@/context/BlockContext'
import { useDesktopContext } from '@/context/DesktopContext'
import { useDialogActionsContext } from '@/context/DialogContext'
import { useWindowContext } from '@/context/WindowContext'
import { UniqueIdentifier, useDraggable } from '@dnd-kit/core'
import { ArenaChannelContents } from 'arena-ts'
import classNames from 'classnames'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { ChannelWindowState } from './Desktop'

export interface DraggingBlockData {
  type: 'block',
  block: ArenaChannelContents,
  window: {
    id: number,
    view: ChannelWindowState['view'],
    scale: ChannelWindowState['scale']
  }
}

interface BlockContainerProps {
  data: ArenaChannelContents,
  children: ReactNode
}

function BlockContainer ({ data, children }: BlockContainerProps) {
  const { addChannelWindow, setBlockViewerData } = useDesktopContext()
  const { channel, view, scale, disconnectBlock } = useWindowContext()
  const [isHovering, setIsHovering] = useState(false)
  const isPending = useMemo(() => data.connection_id === undefined, [data])
  const setDialog = useDialogActionsContext()

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: data.connection_id as UniqueIdentifier,
    data: {
      type: 'block',
      block: { ...data },
      window: {
        id: channel.id,
        view,
        scale
      }
    }
  })

  const handleView = useCallback(() => {
    if (data.class === 'Channel') {
      addChannelWindow(data)
    } else {
      setBlockViewerData(data)
    }
  }, [data, addChannelWindow, setBlockViewerData])

  const handleDelete = useCallback(() => {
    setDialog({
      isOpen: true,
      title: 'Are you sure you want to disconnect this block?',
      message: 'This cannot be undone',
      onConfirm: () => disconnectBlock(data)
    })
  }, [data, setDialog, disconnectBlock])

  const handleHover = () => {
    setIsHovering(prevState => !prevState)
  }

  const contextValues = useMemo<BlockContextType>(
    () => ({
      data,
      handleDelete,
      handleView,
      isPending,
      isDragging,
      isHovering
    }),
    [data, handleDelete, handleView, isPending, isDragging, isHovering]
  )

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={handleView}
      className={classNames('relative select-none', {
        'opacity-50': isDragging,
        'pointer-events-none': isPending
      })}
      onMouseOver={handleHover}
      onMouseOut={handleHover}
      {...listeners}
      {...attributes}
    >
      <BlockContext.Provider value={contextValues}>{children}</BlockContext.Provider>
    </div>
  )
}

export default BlockContainer
