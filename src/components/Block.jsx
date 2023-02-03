import classNames from 'classnames'
import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { MosaicContext } from './MosaicContext'

function Block ({ data, removeBlock }) {
  const mosaic = useContext(MosaicContext)

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...data },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()

        if (result && result.dropEffect === 'move') {
          removeBlock(data.id)
        }
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    mosaic.setQuickLookBlockData(data)
  }

  return (
    <div
      ref={drag}
      onDoubleClick={handleDoubleClick}
      className={classNames(
        'border border-white hover:border-black bg-white aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer',
        { 'opacity-10': isDragging }
      )}
    >
      {data.image && <img src={data.image.thumb.url} className='aspect-square object-contain w-full h-full p-0' />}
      {!data.image && <p className='text-center text-xs pt-2'>{data.title}</p>}
    </div>
  )
}

export default Block
