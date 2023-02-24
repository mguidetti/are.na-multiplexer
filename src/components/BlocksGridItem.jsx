import { BlockContext } from '@/context/BlockContext'
import { useContext } from 'react'
import BlockActions from './BlockActions'
import Spinner from './Spinner'
import classNames from 'classnames'

function BlocksGridItem ({ data }) {
  const blockCtx = useContext(BlockContext)

  const renderBlock = () => {
    switch (data.class) {
      case 'Attachment':
        return <AttachmentBlock data={data} />
      case 'Channel':
        return <ChannelBlock data={data} />
      case 'Image':
        return <ImageBlock data={data} />
      case 'Media':
        return <ImageBlock data={data} />
      case 'Link':
        return <ImageBlock data={data} />
      case 'Text':
        return <TextBlock data={data} />
    }
  }

  return (
    <div className='relative flex aspect-square h-full w-full cursor-pointer flex-col items-center justify-center text-primary'>
      {renderBlock()}

      {(blockCtx.isHovering || blockCtx.isDragging) && (
        <div className='bg-dot-grid-secondary absolute h-full w-full'>
          {blockCtx.isHovering && (
            <div className='absolute bottom-0 right-0 flex justify-end gap-x-2 p-1 pl-2 text-secondary drop-shadow-md'>
              <BlockActions data={data} />
            </div>
          )}
        </div>
      )}

      {data.processing && (
        <div className='absolute flex h-full w-full items-center justify-center bg-background/70'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

function AttachmentBlock ({ data }) {
  if (data.image) {
    return <ImageBlock data={data} />
  } else {
    return (
      <div className='flex h-full w-full items-center justify-center overflow-hidden bg-zinc-800 p-2'>
        <p className='truncate whitespace-normal font-bold'>{data.generated_title}</p>
      </div>
    )
  }
}

function ChannelBlock ({ data }) {
  return (
    <div
      className={classNames('flex h-full w-full flex-col items-center justify-center space-y-2 border-2 bg-background channel-block p-2', {
        'channel-status-private': data.status === 'private',
        'channel-status-public': data.status === 'public',
        'channel-status-closed': data.status === 'closed'
      })}
    >
      <span className='truncate whitespace-normal text-center text-base-relative font-bold text-inherit'>
        {data.title}
      </span>
      <span className='text-center text-xs-relative'>
        by {data.user.full_name}
        <br />
        {data.length} blocks
      </span>
    </div>
  )
}

function ImageBlock ({ data }) {
  return (
    <>
      <img src={data.image?.thumb?.url} alt='' className='aspect-square h-full w-full object-contain p-0' />
    </>
  )
}

function TextBlock ({ data }) {
  const body = { __html: data.content_html }

  return (
    <div className='h-full w-full overflow-hidden border border-primary/25 p-2'>
      <div
        dangerouslySetInnerHTML={body}
        className='prose prose-sm prose-invert truncate whitespace-normal text-xs-relative'
      />
    </div>
  )
}

export default BlocksGridItem
