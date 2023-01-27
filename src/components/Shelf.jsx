import Draggable from 'react-draggable'

function Shelf () {
  return (
    <Draggable>
      <div
        id='shelf'
        className='max-w-md h-24 flex items-center justify-center drop-shadow-lg bg-slate-500 rounded-md'
      >
        shelf
      </div>
    </Draggable>
  )
}

export default Shelf
