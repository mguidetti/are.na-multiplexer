import { useBlockViewerActionsContext, useBlockViewerContext } from '@/context/BlockViewerContext'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ArenaBlock } from 'arena-ts'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import BlockInfo from './BlockInfo'
import Spinner from './Spinner'

function AttachmentBlock ({ data }: { data: ArenaBlock }) {
  const renderBody = () => {
    if (data.image) {
      return <ImageBlock data={data} />
    } else {
      return <span className='text-2xl font-bold uppercase'>{data.generated_title}</span>
    }
  }

  return (
    <a href={data.attachment?.url} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col '>
      {renderBody()}
    </a>
  )
}

function ImageBlock ({ data }: { data: ArenaBlock }) {
  const [imageLoaded, setImageLoaded] = useState(false)

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

function LinkBlock ({ data }: { data: ArenaBlock }) {
  return (
    <a href={data.source?.url} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col gap-y-2'>
      <div className='underline'>{data.source?.url}</div>
      <ImageBlock data={data} />
    </a>
  )
}

function MediaBlock ({ data }: { data: ArenaBlock }) {
  const embed = { __html: data.embed?.html || '' }

  return (
    <div dangerouslySetInnerHTML={embed} className='flex h-full w-full items-center justify-center p-16' />
  )
}

function TextBlock ({ data }: { data: ArenaBlock }) {
  const body = { __html: data.content_html || '' }

  return (
    <div
      dangerouslySetInnerHTML={body}
      className='prose prose-invert self-start text-base prose-li:!my-0 lg:prose-lg'
    />
  )
}

function BlockViewer () {
  const setBlockViewerData = useBlockViewerActionsContext()
  const blockData = useBlockViewerContext()
  const [infoVisible, setInfoVisible] = useState(true)

  const close = () => {
    setBlockViewerData(null)
  }

  useHotkeys('esc', () => close(), { enabled: blockData !== null })
  useHotkeys('i', () => setInfoVisible(prevState => !prevState), { enabled: blockData !== null })

  if (!blockData) {
    return null
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
    <div className='fixed inset-0 z-50 p-6 backdrop-brightness-50 backdrop-grayscale'>
      <div className='relative z-50 flex h-full w-full rounded-sm border-2 border-secondary bg-background/70 drop-shadow-panel'>
        <div className='flex flex-1 items-center justify-center p-4'>
          {renderBlock()}
        </div>

        <div className='w-[25vw] border-l-2 border-secondary' hidden={!infoVisible}>
          <BlockInfo blockData={blockData} setInfoVisible={setInfoVisible} />
        </div>

        <button onClick={close} title="Close Block Viewer" className='absolute top-0 right-0 p-1'>
          <XMarkIcon className='h-7 w-7 text-secondary hover:text-primary' strokeWidth='1.5' />
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

        {!infoVisible && (
          <button onClick={() => setInfoVisible(true)} title='Show Info' className='absolute bottom-0 right-0 p-2'>
            <InformationCircleIcon className='h-7 w-7 text-secondary hover:text-primary' />
          </button>
        )}
      </div>
    </div>
  )
}

export default BlockViewer
