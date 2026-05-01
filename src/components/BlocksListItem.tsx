import { useBlockContext } from '@/context/BlockContext'
import SquareIcon from '@/icons/square.svg'
import { ChannelContents } from '@/types/arena'
import { Block, Channel } from '@aredotna/sdk/api'
import classNames from 'classnames'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

function ChannelBody ({ data }: {data: Channel}) {
  return (
    <div
      className={classNames('contents', {
        'channel-status-private': data.visibility === 'private',
        'channel-status-public': data.visibility === 'public',
        'channel-status-closed': data.visibility === 'closed'
      })}
    >
      <div className='channel-block flex items-center justify-center'>
        <SquareIcon className='aspect-square h-full w-full object-contain' strokeWidth='2' />
      </div>
      <div className='channel-block truncate font-bold'>{`${data.owner.name} / ${data.title}`}</div>
    </div>
  )
}

function BlockBody ({ data }: {data: Block}) {
  const image = 'image' in data ? data.image : null

  return (
    <>
      <div className='flex items-center justify-center'>
        {image && <img src={image.small.src} alt='' className='aspect-square object-contain' />}
      </div>
      <div className='truncate text-primary'>{data.title ?? 'Untitled'}</div>
    </>
  )
}

function BlocksListItem ({ data }: {data: ChannelContents}) {
  const { isPending, isHovering } = useBlockContext()

  return (
    <div
      className={'hover:bg-dot-grid-secondary relative grid cursor-pointer grid-cols-[1.5em_1fr] items-center gap-x-4 py-1 px-2'}
    >
      {data.type === 'Channel' ? <ChannelBody data={data as Channel} /> : <BlockBody data={data as Block} />}

      {isPending && (
        <div className='absolute flex h-full w-full items-center justify-start bg-background/70 px-2 py-1'>
          <Spinner className='h-full' />
        </div>
      )}

      {isHovering && (
        <div className='absolute right-0 flex gap-x-2 px-2'>
          <BlockActions />
        </div>
      )}
    </div>
  )
}

export default BlocksListItem
