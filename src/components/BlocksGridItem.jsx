import { BlockContext } from '@/context/BlockContext'
import { useContext } from 'react'
import BlockActions from './BlockActions'
import Spinner from './Spinner'

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
    <div className='relative flex flex-col items-center justify-center w-full h-full cursor-pointer text-primary aspect-square'>
      {renderBlock()}

      {(blockCtx.isHovering || blockCtx.isDragging) && (
        <div className='absolute w-full h-full bg-dot-grid-secondary'>
          {blockCtx.isHovering && (
            <div className='absolute bottom-0 right-0 flex justify-end p-1 pl-2 gap-x-2 text-secondary drop-shadow-md'>
              <BlockActions data={data} />
            </div>
          )}
        </div>
      )}

      {data.processing && (
        <div className='absolute flex items-center justify-center w-full h-full bg-opacity-75 bg-background'>
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
      <div className='flex items-center justify-center w-full h-full p-2 overflow-hidden bg-zinc-800'>
        <p className='font-bold truncate whitespace-normal text-md-relative'>{data.generated_title}</p>
      </div>
    )
  }
}

function ChannelBlock ({ data }) {
  return (
    <div
      className={`bg-background h-full w-full flex flex-col space-y-2 items-center justify-center border-2 channel-status-${data.status} channel-block p-2`}
    >
      <span className='font-bold text-center truncate whitespace-normal text-base-relative text-inherit'>
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
      <img src={data.image?.thumb?.url} alt='' className='object-contain w-full h-full p-0 aspect-square' />
    </>
  )
}

function TextBlock ({ data }) {
  const body = { __html: data.content_html }

  return (
    <div className='w-full h-full p-2 overflow-hidden border border-primary/25'>
      <div
        dangerouslySetInnerHTML={body}
        className='prose-sm prose truncate whitespace-normal text-xs-relative prose-invert'
      />
    </div>
  )
}

export default BlocksGridItem
