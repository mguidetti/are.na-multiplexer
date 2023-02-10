import BlockContainer from './BlockContainer'
import SquareIcon from '@/icons/square.svg'
import EyeIcon from '@/icons/eye.svg'
import TrashIcon from '@/icons/trash.svg'
import { DesktopContext } from '@/context/DesktopContext'
import { WindowContext } from '@/context/WindowContext'
import { useContext, useState } from 'react'
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
    <div class='absolute right-0 flex gap-x-2 px-2'>
      <button className='w-5 h-5 hover:text-secondary' title='View' onClick={handleView}>
        <EyeIcon />
      </button>
      {windowCtx.canDelete && (
        <button className='w-5 h-5 hover:text-secondary' title='Disconnect' onClick={handleDelete}>
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

function BlocksListItem ({ data }) {
  const [isHovering, setIsHovering] = useState(false)

  const handleHover = () => {
    setIsHovering(prevState => !prevState)
  }

  return (
    <li>
      <BlockContainer data={data}>
        <div
          className={`relative grid grid-cols-[min-content_1fr] gap-x-4 items-center py-1 px-2 text-md-relative hover:bg-secondary/30 cursor-pointer border-b border-[var(--color)] channel-status-${data.status}`}
          onMouseOver={handleHover}
          onMouseOut={handleHover}
        >
          {data.class === 'Channel' ? <ChannelBody data={data} /> : <BlockBody data={data} />}

          {data.processing && (
            <div className='absolute h-full w-full flex justify-start items-center bg-background bg-opacity-75 py-1 px-2'>
              <Spinner className='h-full' />
            </div>
          )}

          {isHovering && <Actions data={data} />}
        </div>
      </BlockContainer>
    </li>
  )
}

export default BlocksListItem
