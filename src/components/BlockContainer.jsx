import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { DesktopContext } from '../context/DesktopContext'
import classNames from 'classnames'
import { WindowContext } from '@/context/WindowContext'

function BlockContainer ({ data, children }) {
  const desktopCtx = useContext(DesktopContext)
  const windowCtx = useContext(WindowContext)

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
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    if (data.class === 'Channel') {
      desktopCtx.addChannel(data)
    } else {
      desktopCtx.setBlockViewerData(data)
    }
  }

  return (
    <div ref={drag} onDoubleClick={handleDoubleClick} className={classNames({ 'opacity-25': isDragging })}>
      {children}
    </div>
  )
}

export default BlockContainer
