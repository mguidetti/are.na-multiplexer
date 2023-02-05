import Block from './Block'

function ListBlock ({ data, disconnectBlock }) {
  return (
      <Block data={data} disconnectBlock={disconnectBlock}>
        <div className='grid grid-cols-[min-content_1fr] gap-x-4 items-center py-1 text-md-relative hover:bg-secondary/30 cursor-pointer'>
          <div className='w-[calc(1.5em*var(--scale))]'>
            {data.image && <img src={data.image.thumb.url} className='aspect-square object-contain' />}
          </div>
          <div className='truncate'>{data.generated_title}</div>
        </div>
      </Block>
  )
}

export default ListBlock
