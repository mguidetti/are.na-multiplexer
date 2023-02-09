import { DesktopContext } from '../context/DesktopContext'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'
import XMarkIcon from '@/icons/x-mark.svg'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import dayjs from 'dayjs'

function AttachmentBlock ({ data }) {
  return (
    <>
      <ImageBlock data={data} />
    </>
  )
}

function ImageBlock ({ data }) {
  const [imageLoaded, setImageLoaded] = useState(null)

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }

  return (
    <>
      {!imageLoaded && <Spinner />}
      <img
        src={data.image?.display?.url}
        alt=''
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
      <a href={data.source.url} target='_blank' rel='noreferrer'>
        <ImageBlock data={data} />
      </a>
    </>
  )
}

function MediaBlock ({ data }) {
  return (
    <>
      <a href={data.source.url} target='_blank' rel='noreferrer'>
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

function BlockQuickLook ({ blockData }) {
  const desktop = useContext(DesktopContext)

  useHotkeys('esc', () => close(), { enabled: blockData !== null })

  const close = () => {
    desktop.setQuickLookBlockData(null)
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

  if (!blockData) {
    return
  }

  return (
    <div className='fixed top-0 left-0 h-screen w-screen z-50 p-8 bg-background/30'>
      <div className='relative h-full w-full overflow-hidden flex justify-center items-center z-50 bg-background bg-opacity-70  border-2 border-secondary rounded-sm p-8 drop-shadow-panel'>
        {renderBlock()}

        <div className='absolute bottom-0 right-0 text-primary text-sm border-secondary border-t-2 border-l-2 py-2 px-4 rounded-sm bg-background bg-opacity-90 text-right'>
          <h1 className='font-bold'>{blockData.generated_title}</h1>
          <p className=''>
            Connected {dayjs(blockData.connected_at).format('MMM D, YYYY HH:MM:ss ZZ')} by {blockData.user.full_name}
          </p>
          {blockData.source && (
            <a href={blockData.source.url} className='underline' target='_blank' rel='noreferrer'>
              {blockData.source.url}
            </a>
          )}
          {blockData.description && <p>{blockData.description}</p>}
        </div>

        <button onClick={close} className='fixed top-0 right-0'>
          <XMarkIcon className='w-8 hover:text-secondary' strokeWidth='1.5' />
        </button>
        <a
          href={`https://are.na/block/${blockData.id}`}
          className='fixed bottom-0 left-0 p-2'
          target='_blank'
          rel='noreferrer'
        >
          <ArenaMarkIcon className='w-8 hover:text-secondary' />
        </a>
      </div>
      <div onClick={close} className='absolute inset-0 cursor-pointer' />
    </div>
  )
}

export default BlockQuickLook
