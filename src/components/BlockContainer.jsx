import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { DesktopContext } from '../context/DesktopContext'
import classNames from 'classnames'

function BlockContainer ({ data, disconnectBlock, children }) {
  const desktop = useContext(DesktopContext)

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...data },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()

        if (result && result.dropEffect === 'move') {
          disconnectBlock(data)
        }
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    if (data.class === 'Channel') {
      desktop.addChannel(data)
    } else {
      desktop.setQuickLookBlockData(data)
    }
  }

  return (
    <div ref={drag} onDoubleClick={handleDoubleClick} className={classNames({ 'opacity-25': isDragging })}>
      {children}
    </div>
  )
}

export default BlockContainer
