import { BlockContext } from '@/context/BlockContext'
import SquareIcon from '@/icons/square.svg'
import { useContext } from 'react'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

function ChannelBody ({ data }) {
  return (
    <>
      <div className='flex items-center justify-center channel-block'>
        <SquareIcon className='object-contain w-full h-full aspect-square' strokeWidth='2' />
      </div>
      <div className='font-bold truncate channel-block'>{`${data.user.full_name} / ${data.title}`}</div>
    </>
  )
}

function BlockBody ({ data }) {
  return (
    <>
      <div className='flex items-center justify-center'>
        {data.image && <img src={data.image.thumb.url} alt='' className='object-contain aspect-square' />}
      </div>
      <div className='truncate text-primary'>{data.title || data.generated_title}</div>
    </>
  )
}

function BlocksListItem ({ data }) {
  const blockCtx = useContext(BlockContext)

  return (
    <div
      className={`relative grid grid-cols-[1.5em_1fr] gap-x-4 items-center py-1 px-2 text-md-relative hover:bg-dot-grid-secondary cursor-pointer channel-status-${data.status}`}
    >
      {data.class === 'Channel' ? <ChannelBody data={data} /> : <BlockBody data={data} />}

      {data.processing && (
        <div className='absolute flex items-center justify-start w-full h-full px-2 py-1 bg-opacity-75 bg-background'>
          <Spinner className='h-full' />
        </div>
      )}

      {blockCtx.isHovering && (
        <div className='absolute right-0 flex px-2 gap-x-2'>
          <BlockActions data={data} />
        </div>
      )}
    </div>
  )
}

export default BlocksListItem
