import { DesktopContext } from '../context/DesktopContext'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'
import XMarkIcon from '@/icons/x-mark.svg'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import InfoIcon from '@/icons/info.svg'

dayjs.extend(relativeTime)

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
      {!imageLoaded && (
        <div className='absolute z-10 flex justify-center items-center inset-0'>
          <Spinner />
        </div>
      )}

      <img
        src={data.image?.thumb?.url}
        alt=''
        className='object-scale-down w-full h-full blur-sm brightness-50 flex-1'
        hidden={imageLoaded}
      />
      <img
        src={data.image?.large?.url}
        alt=''
        className='object-scale-down w-full h-full flex-1'
        onLoad={handleImageLoaded}
        hidden={!imageLoaded}
      />
    </>
  )
}

function LinkBlock ({ data }) {
  return (
    <>
      <a href={data.source.url} target='_blank' rel='noreferrer' className='h-full w-full flex'>
        <ImageBlock data={data} />
      </a>
    </>
  )
}

function MediaBlock ({ data }) {
  const embed = { __html: data.embed.html }

  return (
    <>
      <div dangerouslySetInnerHTML={embed} className='aspect-video w-full h-full p-16' />
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

function BlockViewer ({ blockData }) {
  const desktop = useContext(DesktopContext)
  const [infoVisible, setInfoVisible] = useState(false)

  useHotkeys('esc', () => close(), { enabled: blockData !== null })
  useHotkeys('i', () => setInfoVisible(prevState => !prevState), { enabled: blockData !== null })

  const close = () => {
    desktop.setBlockViewerData(null)
    setInfoVisible(false)
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
    <div className='fixed inset-0 h-screen w-screen z-50 p-8 bg-background/30'>
      <div className='relative h-full w-full overflow-hidden flex justify-center items-center z-50 bg-background bg-opacity-70  border-2 border-secondary rounded-sm p-8 drop-shadow-panel'>
        {renderBlock()}
        <button onClick={close} className='absolute top-0 right-0 p-1'>
          <XMarkIcon className='w-8 hover:text-secondary' title='Close' strokeWidth='1.5' />
        </button>
        <a
          href={`https://are.na/block/${blockData.id}`}
          className='absolute bottom-0 left-0 p-2'
          target='_blank'
          rel='noreferrer'
          title='View at Are.na'
        >
          <ArenaMarkIcon className='w-8 hover:text-secondary' />
        </a>

        {infoVisible && <BlockInfo blockData={blockData} setInfoVisible={setInfoVisible} />}
        {!infoVisible && (
          <button onClick={() => setInfoVisible(true)} title='Show info' className='absolute bottom-0 right-0 p-2'>
            <InfoIcon className='w-6 hover:text-secondary' />
          </button>
        )}
      </div>
      <div onClick={close} className='absolute inset-0 cursor-pointer' />
    </div>
  )
}

function BlockInfo ({ blockData, setInfoVisible }) {
  return (
    <div className='absolute bottom-0 right-0 text-primary text-sm border-secondary border-t-2 border-l-2 py-2 px-4 rounded-sm bg-background bg-opacity-90 text-right max-w-[70vw]'>
      <button onClick={() => setInfoVisible(true)} className='absolute top-0 right-0 p-1'>
        <XMarkIcon className='w-6 hover:text-secondary' title='Close' strokeWidth='1.5' />
      </button>

      <div className='mr-6'>
        <h1 className='font-bold truncate'>{blockData.generated_title}</h1>
        {blockData.description && <p className='truncate'>{blockData.description}</p>}
        <p className='truncate'>
          Added {dayjs(blockData.connected_at).fromNow()} by {blockData.user.full_name}
        </p>
        {blockData.source && (
          <span className='block truncate'>
            Source:{' '}
            <a href={blockData.source.url} className='underline' target='_blank' rel='noreferrer'>
              {blockData.source.title}
            </a>
          </span>
        )}
      </div>
    </div>
  )
}

export default BlockViewer
