import {useDrag} from 'react-dnd'

function Block ({ blockData }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'block',
    item: { blockData },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <div ref={dragRef} className='border border-black bg-white aspect-square w-full h-full flex flex-col justify-center items-center'>
      {blockData.image && <img src={blockData.image.thumb.url} className='aspect-square object-contain max-w-full' />}
      {!blockData.image && <p className='text-center text-xs pt-2'>{blockData.title}</p>}
    </div>
  )
}

export default Block
