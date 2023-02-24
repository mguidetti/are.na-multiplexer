import ArenaMarkIcon from '@/icons/arena-mark.svg'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { DesktopContext } from '../context/DesktopContext'
import Spinner from './Spinner'

dayjs.extend(relativeTime)

function AttachmentBlock ({ data }) {
  const renderBody = () => {
    if (data.image) {
      return <ImageBlock data={data} />
    } else {
      return <span className='text-2xl font-bold uppercase'>{data.generated_title}</span>
    }
  }

  return (
    <a href={data.attachment.url} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col '>
      {renderBody()}
    </a>
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
        <div className='absolute inset-0 z-10 flex items-center justify-center'>
          <Spinner />
        </div>
      )}

      <img
        src={data.image?.thumb?.url}
        alt=''
        className='h-full w-full flex-1 object-scale-down blur-sm brightness-50'
        hidden={imageLoaded}
      />
      <img
        src={data.image?.large?.url}
        alt=''
        className='h-full w-full flex-1 object-scale-down'
        onLoad={handleImageLoaded}
        hidden={!imageLoaded}
      />
    </>
  )
}

function LinkBlock ({ data }) {
  return (
    <>
      <a href={data.source.url} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col gap-y-2'>
        <div className='underline'>{data.source.url}</div>
        <ImageBlock data={data} />
      </a>
    </>
  )
}

function MediaBlock ({ data }) {
  const embed = { __html: data.embed.html }

  return (
    <>
      <div dangerouslySetInnerHTML={embed} className='flex h-full w-full items-center justify-center p-16' />
    </>
  )
}

function TextBlock ({ data }) {
  const body = { __html: data.content_html }

  return (
    <div
      dangerouslySetInnerHTML={body}
      className='prose prose-invert self-start text-base prose-li:!my-0 lg:prose-lg'
    />
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
    <div className='fixed inset-0 z-50 h-screen w-screen bg-background/30 p-8'>
      <div className='relative z-50 flex h-full w-full items-center justify-center overflow-hidden rounded-sm border-2 border-secondary bg-background/70 p-8 drop-shadow-panel'>
        {renderBlock()}
        <button onClick={close} className='absolute top-0 right-0 p-1'>
          <XMarkIcon className='h-7 w-7 text-secondary hover:text-primary' title='Close' strokeWidth='1.5' />
        </button>
        <a
          href={`https://are.na/block/${blockData.id}`}
          className='absolute bottom-0 left-0 p-2'
          target='_blank'
          rel='noreferrer'
          title='View at Are.na'
        >
          <ArenaMarkIcon className='w-8 text-secondary hover:text-primary' />
        </a>

        {infoVisible && <BlockInfo blockData={blockData} setInfoVisible={setInfoVisible} />}
        {!infoVisible && (
          <button onClick={() => setInfoVisible(true)} title='Show info' className='absolute bottom-0 right-0 p-2'>
            <InformationCircleIcon className='h-7 w-7 text-secondary hover:text-primary' />
          </button>
        )}
      </div>
      <div onClick={close} className='absolute inset-0 cursor-pointer' />
    </div>
  )
}

function BlockInfo ({ blockData, setInfoVisible }) {
  return (
    <div className='absolute bottom-0 right-0 max-w-[70vw] rounded-sm border-t-2 border-l-2 border-secondary bg-background/90 py-2 px-4 text-sm text-primary'>
      <button onClick={() => setInfoVisible(false)} className='absolute top-0 right-0 p-1'>
        <XMarkIcon className='h-7 w-7 text-secondary hover:text-primary' title='Close' strokeWidth='2' />
      </button>

      <div className='mr-6'>
        <h1 className='truncate font-bold'>{blockData.generated_title}</h1>
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
