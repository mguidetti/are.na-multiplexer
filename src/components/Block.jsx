import classNames from 'classnames'
import { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { DesktopContext } from './DesktopContext'

function Block ({ data, disconnectBlock }) {
  const desktop = useContext(DesktopContext)

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...data },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()

        if (result && result.dropEffect === 'move') {
          disconnectBlock(data)
        }
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    if (data.class === 'Channel') {
      desktop.loadChannel(data)
    } else {
      desktop.setQuickLookBlockData(data)
    }
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
      default:
        return <DefaultBlock data={data} />
    }
  }

  return (
    <div
      ref={drag}
      onDoubleClick={handleDoubleClick}
      className={classNames(
        'border text-primary border-transparent hover:border-secondary aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer',
        { 'opacity-25': isDragging }
      )}
    >
      {renderBlock(data)}
    </div>
  )
}

function AttachmentBlock ({ data }) {
  return (
    <div className='h-full w-full bg-primary/10 flex items-center justify-center'>
      <p className='text-center text-xs'>{data.title}</p>
    </div>
  )
}

function ChannelBlock ({ data }) {
  return (
    <div
      className={`h-full w-full flex items-center justify-center border-2 channel-status-${data.status} channel-block p-2`}
    >
      <p className='text-center text-xs-relative text-inherit'>{data.title}</p>
    </div>
  )
}

function ImageBlock ({ data }) {
  return (
    <>
      <img src={data.image.thumb.url} className='aspect-square object-contain w-full h-full p-0' />
    </>
  )
}

function TextBlock ({ data }) {
  return (
    <div className='border border-primary/25 p-2 h-full w-full overflow-hidden'>
      <p className='text-xs-relative'>{data.content}</p>
    </div>
  )
}

function DefaultBlock ({ data }) {
  return (
    <div className='h-full w-full flex items-center justify-center p-2'>
      <p className='text-center text-xs-relative'>{data.title}</p>
    </div>
  )
}

export default Block
