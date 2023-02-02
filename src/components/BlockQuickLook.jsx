import { MosaicContext } from './MosaicContext'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'

function BlockQuickLook ({ blockData }) {
  const mosaic = useContext(MosaicContext)
  const [imageLoaded, setImageLoaded] = useState(null)

  useHotkeys('esc', () => close(), { enabled: blockData !== null })

  const close = () => {
    mosaic.setQuickLookBlockData(null)
    setImageLoaded(false)
  }

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }

  return (
    <div className='fixed top-0 left-0 h-screen w-screen z-50 p-6 cursor-pointer' onClick={close}>
      <div className='h-full w-full flex justify-center items-center z-50 bg-black bg-opacity-80 backdrop-blur-sm border-black border-2 rounded-md shadow-md'>
        <div className='p-8 text-white'>
          {!imageLoaded && <Spinner />}

          {blockData.image && (
            <img
              src={blockData.image.display.url}
              className='flex-1 aspect-square object-contain max-w-full max-h-full'
              onLoad={handleImageLoaded}
              hidden={!imageLoaded}
            />
          )}
        </div>
      </div>
    </div> 
  )
}

export default BlockQuickLook
