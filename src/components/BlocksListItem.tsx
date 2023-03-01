import { useBlockContext } from '@/context/BlockContext'
import SquareIcon from '@/icons/square.svg'
import { ArenaBlock, ArenaChannelContents, ArenaChannelWithDetails } from 'arena-ts'
import classNames from 'classnames'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

function ChannelBody ({ data }: {data: ArenaChannelWithDetails}) {
  return (
    <div
      className={classNames('contents', {
        'channel-status-private': data.status === 'private',
        'channel-status-public': data.status === 'public',
        'channel-status-closed': data.status === 'closed'
      })}
    >
      <div className='channel-block flex items-center justify-center'>
        <SquareIcon className='aspect-square h-full w-full object-contain' strokeWidth='2' />
      </div>
      <div className='channel-block truncate font-bold'>{`${data.user?.username} / ${data.title}`}</div>
    </div>
  )
}

function BlockBody ({ data }: {data:ArenaBlock}) {
  return (
    <>
      <div className='flex items-center justify-center'>
        {data.image && <img src={data.image.thumb.url} alt='' className='aspect-square object-contain' />}
      </div>
      <div className='truncate text-primary'>{data.title || data.generated_title}</div>
    </>
  )
}

function BlocksListItem ({ data }: {data: ArenaChannelContents}) {
  const { isPending, isHovering } = useBlockContext()

  return (
    <div
      className={'hover:bg-dot-grid-secondary relative grid cursor-pointer grid-cols-[1.5em_1fr] items-center gap-x-4 py-1 px-2'}
    >
      {data.class === 'Channel' ? <ChannelBody data={data} /> : <BlockBody data={data} />}

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
