import { DesktopContext } from './DesktopContext'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'
import XMarkIcon from '@/icons/x-mark.svg'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import dayjs from 'dayjs'

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

  function AttachmentBlock ({ data }) {
    return (
      <>
        <ImageBlock data={data} />
      </>
    )
  }

  function ImageBlock ({ data }) {
    return (
      <>
        {!imageLoaded && <Spinner />}
        <img
          src={data.image?.display?.url}
          className='aspect-square object-contain w-full h-full'
          onLoad={handleImageLoaded}
          hidden={!imageLoaded}
        />
      </>
    )
  }

  function LinkBlock ({ data }) {
    return (
      <>
        <a href={data.source.url} target='_blank'>
          <ImageBlock data={data} />
        </a>
      </>
    )
  }

  function MediaBlock ({ data }) {
    return (
      <>
        <a href={data.source.url} target='_blank'>
          <ImageBlock data={data} />
        </a>
      </>
    )
  }

  function TextBlock ({ data }) {
    return (
      <>
        <p className='text-base self-start justify-self-start'>{data.content}</p>
      </>
    )
  }

  const renderBlock = () => {
    switch (blockData.class) {
      case 'Attachment':
        return <AttachmentBlock data={blockData} />
      case 'Image':
        return <ImageBlock data={blockData} />
      case 'Media':
        return <MediaBlock data={blockData} />
      case 'Link':
        return <LinkBlock data={blockData} />
      case 'Text':
        return <TextBlock data={blockData} />
    }
  }

  return (
    <div className='fixed top-0 left-0 h-screen w-screen z-50 p-8'>
      <div className='relative h-full w-full overflow-hidden flex justify-center items-center z-50 bg-background bg-opacity-80 backdrop-blur-md border-2 border-secondary rounded-sm p-8'>
        {renderBlock()}

        <div className='absolute bottom-0 right-0 text-primary text-sm border-secondary border-t-2 border-l-2 py-2 px-4 rounded-sm bg-background bg-opacity-80 backdrop-blur-md text-right'>
          <h1 className='font-bold'>{blockData.generated_title}</h1>
          <p className=''>Connected {dayjs(blockData.connected_at).format("MMM D, YYYY HH:MM:ss ZZ")} by {blockData.user.full_name}</p>
          {blockData.source && <a href={blockData.source.url} target="_blank" className="underline">{blockData.source.url}</a>}
          {blockData.description && <p>{blockData.description}</p>}
        </div>

        <button onClick={close} className='fixed top-0 right-0'>
          <XMarkIcon className='w-8 hover:text-secondary' strokeWidth='1.5' />
        </button>
        <a href={`https://are.na/block/${blockData.id}`} target='_blank' className='fixed bottom-0 left-0 p-2'>
          <ArenaMarkIcon className="w-8 hover:text-secondary" />
        </a>
      </div>
      <div onClick={close} className='absolute inset-0 cursor-pointer'></div>
    </div>
  )
}

export default BlockQuickLook
