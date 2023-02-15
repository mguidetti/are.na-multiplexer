import { DesktopContext } from '@/context/DesktopContext'
import { WindowContext } from '@/context/WindowContext'
import { BlockContext } from '@/context/BlockContext'
import classNames from 'classnames'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'

function BlockContainer ({ data, children }) {
  const desktopCtx = useContext(DesktopContext)
  const windowCtx = useContext(WindowContext)
  const [isHovering, setIsHovering] = useState(false)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: data.connection_id,
    data: {
      type: 'block',
      block: { ...data },
      originId: windowCtx.channel.id,
      view: windowCtx.view,
      scale: windowCtx.scale
    }
  })

  const handleView = useCallback(() => {
    if (data.class === 'Channel') {
      desktopCtx.addChannelWindow(data)
    } else {
      desktopCtx.setBlockViewerData(data)
    }
  }, [data, desktopCtx])

  const handleDelete = useCallback(() => {
    desktopCtx.setDialog({
      isOpen: true,
      title: 'Are you sure you want to disconnect this block?',
      message: "This cannot be undone",
      onConfirm: () => windowCtx.disconnectBlock(data)
    })
  }, [data, desktopCtx, windowCtx])

  const handleHover = () => {
    setIsHovering(prevState => !prevState)
  }

  const contextValues = useMemo(
    () => ({
      data,
      handleDelete,
      handleView,
      isDragging,
      isHovering
    }),
    [data, handleDelete, handleView, isDragging, isHovering]
  )

  return (
    <div
      ref={setNodeRef}
      onDoubleClick={handleView}
      className={classNames('relative select-none', {
        'opacity-50': isDragging,
        'pointer-events-none': data.processing
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
