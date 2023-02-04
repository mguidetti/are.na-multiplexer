import { DesktopContext } from './DesktopContext'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'

function BlockQuickLook ({ blockData }) {
  const desktop = useContext(DesktopContext)
  const [imageLoaded, setImageLoaded] = useState(null)

  useHotkeys('esc', () => close(), { enabled: blockData !== null })

  const close = () => {
    desktop.setQuickLookBlockData(null)
    setImageLoaded(false)
  }

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }

  return (
    <div className='fixed top-0 left-0 h-screen w-screen z-50 p-8 cursor-pointer' onClick={close}>
      <div className='relative h-full w-full overflow-hidden flex justify-center items-center z-50 bg-background bg-opacity-80 backdrop-blur-md border-2 border-secondary rounded-sm'>
        {!imageLoaded && <Spinner />}

        {blockData.image && (
          <img
            src={blockData.image.display.url}
            className=' aspect-square object-contain max-h-full max-w-full p-8'
            onLoad={handleImageLoaded}
            hidden={!imageLoaded}
          />
        )}

        <div className="absolute top-0 right-0 text-primary border-secondary border-2 m-2 p-4 rounded-sm bg-background bg-opacity-80 backdrop-blur-md text-right">
          <div className="text-xl">{blockData.generated_title}</div>
          <div className="mt-2 text-sm">{blockData.connected_at}</div>
        </div>
      </div>
    </div>
  )
}

export default BlockQuickLook
