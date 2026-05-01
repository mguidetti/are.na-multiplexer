import { useBlockViewerActionsContext, useBlockViewerContext } from '@/context/BlockViewerContext'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import { ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import * as Dialog from '@radix-ui/react-dialog'
import { ChannelContents } from '@/types/arena'
import { Block } from '@aredotna/sdk/api'
import { useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import BlockInfo from './BlockInfo'
import Spinner from './Spinner'

function AttachmentBlock ({ data }: { data: Block }) {
  const renderBody = () => {
    if ('image' in data && data.image) {
      return <ImageBlock data={data} />
    } else {
      return <span className='text-2xl font-bold uppercase'>{data.title ?? 'Untitled'}</span>
    }
  }

  return (
    <a href={'attachment' in data ? data.attachment?.url : undefined} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col '>
      {renderBody()}
    </a>
  )
}

function ImageBlock ({ data }: { data: Block }) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoaded = () => {
    setImageLoaded(true)
  }

  const image = 'image' in data ? data.image : null

  return (
    <>
      {!imageLoaded && (
        <div className='absolute inset-0 z-10 flex items-center justify-center'>
          <Spinner />
        </div>
      )}

      <img
        src={image?.small?.src}
        alt=''
        className='h-full w-full flex-1 object-scale-down blur-sm brightness-50'
        hidden={imageLoaded}
      />
      <img
        src={image?.large?.src}
        alt=''
        className='h-full w-full flex-1 object-scale-down'
        onLoad={handleImageLoaded}
        hidden={!imageLoaded}
      />
    </>
  )
}

function LinkBlock ({ data }: { data: Block }) {
  return (
    <a href={data.source?.url} target='_blank' rel='noreferrer' className='flex h-full w-full flex-col gap-y-2'>
      <div className='underline'>{data.source?.url}</div>
      <ImageBlock data={data} />
    </a>
  )
}

function MediaBlock ({ data }: { data: Block }) {
  const embed = { __html: ('embed' in data ? data.embed?.html : '') || '' }

  return (
    <div dangerouslySetInnerHTML={embed} className='flex h-full w-full items-center justify-center p-16' />
  )
}

function TextBlock ({ data }: { data: Block }) {
  const body = { __html: ('content' in data && typeof data.content === 'object' ? data.content?.html : '') || '' }

  return (
    <div
      dangerouslySetInnerHTML={body}
      className='prose prose-invert self-start text-base prose-li:!my-0 lg:prose-lg'
    />
  )
}

function BlockViewer () {
  const { close, next, prev } = useBlockViewerActionsContext()
  const viewerState = useBlockViewerContext()
  const [infoVisible, setInfoVisible] = useState(true)

  const blockData = viewerState?.block ?? null
  const blocks = viewerState?.blocks ?? []

  const blockItems = useMemo(
    () => blocks.filter((b: ChannelContents) => b.type !== 'Channel') as Block[],
    [blocks]
  )
  const currentIndex = blockData ? blockItems.findIndex(b => b.id === blockData.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < blockItems.length - 1

  useHotkeys('i', () => setInfoVisible(prevState => !prevState), { enabled: blockData !== null })
  useHotkeys('left', () => hasPrev && prev(), { enabled: blockData !== null }, [hasPrev, prev])
  useHotkeys('right', () => hasNext && next(), { enabled: blockData !== null }, [hasNext, next])

  if (!blockData) {
    return null
  }

  const renderBlock = () => {
    switch (blockData.type) {
      case 'Attachment':
        return <AttachmentBlock key={blockData.id} data={blockData} />
      case 'Image':
        return <ImageBlock key={blockData.id} data={blockData} />
      case 'Embed':
        return <MediaBlock key={blockData.id} data={blockData} />
      case 'Link':
        return <LinkBlock key={blockData.id} data={blockData} />
      case 'Text':
        return <TextBlock key={blockData.id} data={blockData} />
    }
  }

  return (
    <Dialog.Root open={blockData !== null} onOpenChange={open => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 z-50 backdrop-brightness-50 backdrop-grayscale'/>
        <Dialog.Content className='absolute inset-6 z-50 flex rounded-sm border-2 border-secondary bg-background/70 drop-shadow-panel'>
          <div className='relative flex flex-1 items-center justify-center p-4'>
            {renderBlock()}
          </div>

          <div className='w-[25vw] border-l-2 border-secondary' hidden={!infoVisible}>
            <BlockInfo blockData={blockData} setInfoVisible={setInfoVisible} />
          </div>

          <Dialog.Close asChild>
            <button title="Close Block Viewer" className='absolute top-0 right-0 p-1'>
              <XMarkIcon className='h-7 w-7 text-secondary hover:text-primary' strokeWidth='1.5' />
            </button>
          </Dialog.Close>

          {hasPrev && (
            <button
              onClick={prev}
              title='Previous block'
              className='absolute left-0 top-1/2 -translate-y-1/2 p-1'
            >
              <ChevronLeftIcon className='h-8 w-8 text-secondary hover:text-primary' />
            </button>
          )}

          {hasNext && (
            <button
              onClick={next}
              title='Next block'
              className='absolute top-1/2 -translate-y-1/2 p-1'
              style={{ right: infoVisible ? '25vw' : 0 }}
            >
              <ChevronRightIcon className='h-8 w-8 text-secondary hover:text-primary' />
            </button>
          )}

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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default BlockViewer
