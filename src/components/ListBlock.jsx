import Block from './Block'
import SquareIcon from '@/icons/square.svg'

function ListBlock ({ data, disconnectBlock }) {
  function ChannelBody () {
    return (
      <>
        <div className='w-[calc(1.5em*var(--scale))] flex items-center justify-center channel-block'>
          <SquareIcon className='w-6 h-6' strokeWidth="1" />
        </div>
        <div className='truncate channel-block'>{`${data.user.full_name} / ${data.title}`}</div>
      </>
    )
  }

  function BlockBody () {
    return (
      <>
        <div className='w-[calc(1.5em*var(--scale))] flex items-center justify-center'>
          {data.image && <img src={data.image.thumb.url} className='aspect-square object-contain' />}
        </div>
        <div className='truncate'>
          {data.title || data.generated_titel}
        </div>
      </>
    )
  }

  return (
    <Block data={data} disconnectBlock={disconnectBlock}>
      <div className={`grid grid-cols-[min-content_1fr] gap-x-4 items-center py-1 text-md-relative hover:bg-secondary/30 cursor-pointer channel-status-${data.status}`}>
        {data.class === 'Channel' ? <ChannelBody /> : <BlockBody />}
      </div>
    </Block>
  )
}

export default ListBlock
