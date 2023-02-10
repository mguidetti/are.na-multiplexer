import { DesktopContext } from '@/context/DesktopContext'
import { WindowContext } from '@/context/WindowContext'
import EyeIcon from '@/icons/eye.svg'
import TrashIcon from '@/icons/trash.svg'
import { useContext, useState } from 'react'
import BlockContainer from './BlockContainer'
import Spinner from './Spinner'

function BlocksGridItem ({ data }) {
  const [isHovering, setIsHovering] = useState(false)

  const handleHover = () => {
    setIsHovering(prevState => !prevState)
  }

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
    <BlockContainer data={data}>
      <div
        className='group relative text-primary aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer hover:outline hover:outline-2 hover:outline-secondary'
        onMouseOver={handleHover}
        onMouseOut={handleHover}
      >
        {renderBlock()}
        <div className='absolute h-full w-full group-hover:bg-secondary z-10 opacity-20' />
        {data.processing && (
          <div className='absolute h-full w-full flex justify-center items-center bg-background bg-opacity-75'>
            <Spinner />
          </div>
        )}

        {isHovering && <Actions data={data} />}
      </div>
    </BlockContainer>
  )
}

function Actions ({ data }) {
  const desktopCtx = useContext(DesktopContext)
  const windowCtx = useContext(WindowContext)

  const handleView = () => {
    if (data.class === 'Channel') {
      desktopCtx.addChannel(data)
    } else {
      desktopCtx.setBlockViewerData(data)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to disconnect this block?')) {
      windowCtx.disconnectBlock(data)
    }
  }

  return (
    <div className='absolute bottom-0 flex gap-x-2 p-1 z-10 w-full text-secondary drop-shadow-md justify-end'>
      <button className='w-5 h-5 hover:scale-125' title='View' onClick={handleView}>
        <EyeIcon />
      </button>
      {windowCtx.canDelete && (
        <button className='w-5 h-5 hover:scale-125' title='Disconnect' onClick={handleDelete}>
          <TrashIcon />
        </button>
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
  return (
    <div className='border border-primary/25 p-2 h-full w-full overflow-hidden'>
      <p className='text-sm-relative truncate whitespace-normal'>{data.content}</p>
    </div>
  )
}

export default BlocksGridItem
