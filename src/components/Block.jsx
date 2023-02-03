import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { MosaicContext } from './MosaicContext'

function Block ({ data }) {
  const mosaic = useContext(MosaicContext)

  const [{ isDragging }, dragRef] = useDrag({
    type: 'block',
    item: { ...data },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    mosaic.setQuickLookdata(data)   
  }

  return (
    <div
      ref={dragRef}
      onDoubleClick={handleDoubleClick}
      className='border border-white hover:border-black bg-white aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer'
    >
      {data.image && <img src={data.image.thumb.url} className='aspect-square object-contain w-full h-full p-0' />}
      {!data.image && <p className='text-center text-xs pt-2'>{data.title}</p>}
    </div>
  )
}

export default Block
