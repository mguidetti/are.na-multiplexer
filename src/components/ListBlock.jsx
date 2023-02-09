import BlockContainer from './BlockContainer'
import SquareIcon from '@/icons/square.svg'

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
      <div className='truncate'>{data.title || data.generated_title}</div>
    </>
  )
}

function ListBlock ({ data }) {
  return (
    <BlockContainer data={data}>
      <div
        className={`grid grid-cols-[min-content_1fr] gap-x-4 items-center py-1 px-2 text-md-relative hover:bg-secondary/30 cursor-pointer channel-status-${data.status}`}
      >
        {data.class === 'Channel' ? <ChannelBody data={data} /> : <BlockBody data={data} />}
      </div>
    </BlockContainer>
  )
}

export default ListBlock
