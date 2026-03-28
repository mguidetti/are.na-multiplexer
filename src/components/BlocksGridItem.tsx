import { useBlockContext } from '@/context/BlockContext'
import { ArenaBlock, ArenaChannel, ArenaChannelContents } from '@/types/arena'
import classNames from 'classnames'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

function BlocksGridItem ({ data }: {data: ArenaChannelContents}) {
  const { isPending, isDragging, isHovering } = useBlockContext()

  const renderBlock = () => {
    if (data.type === 'Channel') {
      return <ChannelBlock data={data as ArenaChannel} />
    }

    switch (data.type) {
      case 'Attachment':
        return <AttachmentBlock data={data} />
      case 'Image':
        return <ImageBlock data={data} />
      case 'Embed':
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

      {(isHovering || isDragging) && (
        <div className='bg-dot-grid-secondary absolute h-full w-full'>
          {isHovering && (
            <div className='absolute bottom-0 right-0 flex justify-end gap-x-2 p-1 pl-2 text-secondary drop-shadow-md'>
              <BlockActions />
            </div>
          )}
        </div>
      )}

      {isPending && (
        <div className='absolute flex h-full w-full items-center justify-center bg-background/70'>
          <Spinner />
        </div>
      )}
    </div>
  )
}

function AttachmentBlock ({ data }: {data: ArenaBlock}) {
  if ('image' in data && data.image) {
    return <ImageBlock data={data} />
  } else {
    return (
      <div className='flex h-full w-full items-center justify-center overflow-hidden bg-zinc-800 p-2'>
        <p className='truncate whitespace-normal font-bold'>{data.title ?? 'Untitled'}</p>
      </div>
    )
  }
}

function ChannelBlock ({ data }: {data: ArenaChannel}) {
  return (
    <div
      className={classNames('flex h-full w-full flex-col items-center justify-center space-y-2 border-2 bg-background channel-block p-2', {
        'channel-status-private': data.visibility === 'private',
        'channel-status-public': data.visibility === 'public',
        'channel-status-closed': data.visibility === 'closed'
      })}
    >
      <span className='truncate whitespace-normal text-center text-base-relative font-bold text-inherit'>
        {data.title}
      </span>
      <span className='text-center text-xs-relative'>
        by {data.owner.name}
        <br />
        {data.counts.contents} blocks
      </span>
    </div>
  )
}

function ImageBlock ({ data }: {data: ArenaBlock}) {
  const image = 'image' in data ? data.image : null

  return (
    <img src={image?.small?.src} alt='' className='aspect-square h-full w-full object-contain p-0' />
  )
}

function TextBlock ({ data }: {data: ArenaBlock}) {
  const body = { __html: ('content' in data && typeof data.content === 'object' ? data.content?.html : '') || '' }

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
