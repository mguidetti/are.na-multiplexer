import { BlockContext } from '@/context/BlockContext'
import SquareIcon from '@/icons/square.svg'
import { useContext } from 'react'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

function ChannelBody ({ data }) {
  return (
    <>
      <div className='w-[calc(1.5em*var(--scale))] flex items-center justify-center channel-block'>
        <SquareIcon className='w-6 h-6' strokeWidth='1' />
      </div>
      <div className='truncate channel-block'>{`${data.user.full_name} / ${data.title}`}</div>
    </>
  )
}

function BlockBody ({ data }) {
  return (
    <>
      <div className='w-[calc(1.5em*var(--scale))] flex items-center justify-center'>
        {data.image && <img src={data.image.thumb.url} alt='' className='aspect-square object-contain' />}
      </div>
      <div className='truncate text-primary'>{data.title || data.generated_title}</div>
    </>
  )
}

function BlocksListItem ({ data }) {
  const blockCtx = useContext(BlockContext)

  return (
    <div
      className={`relative grid grid-cols-[min-content_1fr] gap-x-4 items-center py-1 px-2 text-md-relative hover:bg-secondary/30 cursor-pointer border-b border-[var(--color)] channel-status-${data.status}`}
    >
      {data.class === 'Channel' ? <ChannelBody data={data} /> : <BlockBody data={data} />}

      {data.processing && (
        <div className='absolute h-full w-full flex justify-start items-center bg-background bg-opacity-75 py-1 px-2'>
          <Spinner className='h-full' />
        </div>
      )}

      {blockCtx.isHovering && (
        <div className='absolute right-0 flex gap-x-2 px-2'>
          <BlockActions data={data} />
        </div>
      )}
    </div>
  )
}

export default BlocksListItem
