import classNames from 'classnames'
import React, { useContext } from 'react'
import { useDrag } from 'react-dnd'
import { DesktopContext } from './DesktopContext'

function Block ({ data, removeBlock }) {
  const desktop = useContext(DesktopContext)

  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { ...data },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult()

        if (result && result.dropEffect === 'move') {
          removeBlock(data.id)
        }
      }
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const handleDoubleClick = () => {
    desktop.setQuickLookBlockData(data)
  }

  const renderBlock = () => {
    switch (data.class) {
      case 'Attachment':
        return <AttachmentBlock data={data} />
      case 'Image':
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

function ImageBlock ({ data }) {
  return (
    <React.Fragment>
      <img src={data.image.thumb.url} className='aspect-square object-contain w-full h-full p-0' />
    </React.Fragment>
  )
}

function TextBlock ({ data }) {
  return (
    <div className='border border-primary/25 p-2 h-full w-full overflow-hidden'>
      <p className='text-xs'>{data.content}</p>
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

function DefaultBlock ({ data }) {
  return (
    <div className='h-full w-full flex items-center justify-center'>
      <p className='text-center text-xs'>{data.title}</p>
    </div>
  )
}

export default Block
