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
    <div className='group relative text-primary aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer hover:outline hover:outline-2 hover:outline-secondary'>
      {renderBlock()}

      <div className='absolute h-full w-full group-hover:bg-secondary z-10 opacity-20' />

      {data.processing && (
        <div className='absolute h-full w-full flex justify-center items-center bg-background bg-opacity-75'>
          <Spinner />
        </div>
      )}

      {blockCtx.isHovering && (
        <div className='absolute bottom-0 flex gap-x-2 p-1 z-10 w-full text-secondary drop-shadow-md justify-end'>
          <BlockActions data={data} />
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
      <div className='bg-zinc-800 p-2 h-full w-full overflow-hidden flex items-center justify-center'>
        <p className='text-md-relative font-bold truncate whitespace-normal'>{data.generated_title}</p>
      </div>
    )
  }
}

function ChannelBlock ({ data }) {
  return (
    <div
      className={`h-full w-full flex flex-col space-y-2 items-center justify-center border-2 channel-status-${data.status} channel-block p-2`}
    >
      <span className='text-center text-base-relative font-bold text-inherit truncate whitespace-normal'>
        {data.title}
      </span>
      <span className='text-xs-relative text-center'>
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
      <img src={data.image?.thumb?.url} alt='' className='aspect-square object-contain w-full h-full p-0' />
    </>
  )
}

function TextBlock ({ data }) {
  const body = { __html: data.content_html }

  return (
    <div className='border border-primary/25 p-2 h-full w-full overflow-hidden'>
      <div dangerouslySetInnerHTML={body} className='text-xs-relative truncate whitespace-normal prose prose-invert prose-sm' />
    </div>
  )
}

export default BlocksGridItem
