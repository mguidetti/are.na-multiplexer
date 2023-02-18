import { DesktopContext } from '@/context/DesktopContext'
import { WindowContext } from '@/context/WindowContext'
import { BlockContext } from '@/context/BlockContext'
import classNames from 'classnames'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useDrag } from 'react-dnd'

function BlockContainer ({ data, children }) {
  const desktopCtx = useContext(DesktopContext)
  const windowCtx = useContext(WindowContext)
  const [isHovering, setIsHovering] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...data },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()

        if (result && result.dropEffect === 'move') {
          windowCtx.disconnectBlock(data)
        }
      }
    },
    canDrag: (item, monitor) => !data.processing,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleView = useCallback(() => {
    if (data.class === 'Channel') {
      desktopCtx.addChannel(data)
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
      isHovering
    }),
    [data, handleDelete, handleView, isHovering]
  )

  return (
    <div
      ref={drag}
      onDoubleClick={handleView}
      className={classNames({ 'opacity-25': isDragging, 'pointer-events-none': data.processing })}
      onMouseOver={handleHover}
      onMouseOut={handleHover}
    >
      <BlockContext.Provider value={contextValues}>{children}</BlockContext.Provider>
    </div>
  )
}

export default BlockContainer
