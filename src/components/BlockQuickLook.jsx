import { MosaicContext } from './MosaicContext'
import { useContext } from 'react'

function BlockQuickLook ({ blockData }) {
  const mosaic = useContext(MosaicContext)

  const handleKeyDown = event => {
    console.log(event)
    if (event.key === 'Escape') {
      close()
    }
  }

  const close = () => {
    mosaic.setQuickLookBlockData(null)
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      className='fixed top-0 left-0 h-screen w-screen flex justify-center items-center z-50'
    >
      <div className='border bg-white rounded drop-shadow-xl'>
        <div className='absolute -top-2 -right-2'>
          <button className='p-4 text-xl' onClick={close}>X</button>
        </div>
        <div className='p-8 text-white'>
          {blockData.image && (
            <img src={blockData.image.display.url} className='aspect-square object-contain max-w-full' />
          )}
          {blockData.title}
        </div>
      </div>
    </div>
  )
}

export default BlockQuickLook
