import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { MosaicContext } from './MosaicContext'

function Block ({ blockData }) {
  const mosaic = useContext(MosaicContext)

  const [{ isDragging }, dragRef] = useDrag({
    type: 'block',
    item: { blockData },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    mosaic.setQuickLookBlockData(blockData)   
  }

  return (
    <div
      ref={dragRef}
      onDoubleClick={handleDoubleClick}
      className='border border-black bg-white aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer'
    >
      {blockData.image && <img src={blockData.image.thumb.url} className='aspect-square object-contain max-w-full' />}
      {!blockData.image && <p className='text-center text-xs pt-2'>{blockData.title}</p>}
    </div>
  )
}

export default Block
