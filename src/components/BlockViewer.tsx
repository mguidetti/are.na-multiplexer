import { useBlockViewerActionsContext, useBlockViewerContext } from '@/context/BlockViewerContext'
import { useArena } from '@/hooks/useArena'
import ArenaMarkIcon from '@/icons/arena-mark.svg'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ArenaBlock, ArenaChannelWithDetails, ConnectionData } from 'arena-ts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Spinner from './Spinner'
import classNames from 'classnames'
import { useDesktopActionsContext } from '@/context/DesktopContext'

dayjs.extend(relativeTime)

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
  const [infoVisible, setInfoVisible] = useState(false)

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
    <div className='fixed inset-0 z-50 h-screen w-screen p-6 backdrop-brightness-50 backdrop-grayscale'>
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

function BlockConnectionsList ({ blockData }: {blockData: ArenaBlock & ConnectionData}) {
  const [connections, setConnections] = useState<ArenaChannelWithDetails[]>([])
  const arena = useArena()
  const { addChannelWindow } = useDesktopActionsContext()
  const setBlockViewerData = useBlockViewerActionsContext()

  const fetchChannels = useCallback(async () => {
    if (!arena) return
    const results = await arena.block(blockData.id).channels()

    setConnections(results.channels)
  }, [arena, blockData])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  const handleChannelClick = (channel: ArenaChannelWithDetails) => {
    addChannelWindow(channel)
    setBlockViewerData(null)
  }

  if (connections.length) {
    return (
      <ul className='mt-2 max-h-72 space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-secondary/30 scrollbar-thumb-secondary/70'>
        {connections.map(channel => (
          <li key={channel.id}>
            <button
              onClick={() => handleChannelClick(channel)}
              className={classNames('w-full rounded-sm border-2 p-2 text-left truncate flex items-end channel-block', {
                'channel-status-private': channel.status === 'private',
                'channel-status-public': channel.status === 'public',
                'channel-status-closed': channel.status === 'closed'
              })}
            >
              <span className='flex-1 font-bold'>{channel.title}</span>
              <span className='text-sm'>by {channel.user?.username}</span></button>
          </li>
        ))}
      </ul>
    )
  } else {
    return <div className='text-secondary'><Spinner className='mr-2 inline h-6 w-6'/>Loading connections</div>
  }
}

interface BlockInfoProps {
  blockData: ArenaBlock & ConnectionData,
  setInfoVisible: Dispatch<SetStateAction<boolean>>
}

function BlockInfo ({ blockData, setInfoVisible }: BlockInfoProps) {
  return (
    <div className='absolute bottom-0 right-0 max-w-[70vw] rounded-sm border-t-2 border-l-2 border-secondary bg-background/90 py-2 px-4 text-zinc-400'>
      <button onClick={() => setInfoVisible(false)} className='absolute top-0 right-0 p-1'>
        <XMarkIcon className='h-7 w-7 text-secondary hover:text-primary' title='Close' strokeWidth='2' />
      </button>

      <div className='mr-6'>
        <h1 className='truncate text-base font-bold'>{blockData.generated_title}</h1>
        {blockData.description && <p className='truncate'>{blockData.description}</p>}
        <p className='truncate'>
          Added {dayjs(blockData.connected_at).fromNow()} by {blockData.user.username}
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

      <div className='my-5 border border-secondary/50'></div>

      <div>
          <h2 className='text-base font-bold text-secondary'>Connections</h2>
          <BlockConnectionsList blockData={blockData}/>
      </div>
    </div>
  )
}

export default BlockViewer
