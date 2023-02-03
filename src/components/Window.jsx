import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicWindow } from 'react-mosaic-component'
import arena from '../data/arenaClient'
import Block from './Block'
import Spinner from './Spinner'

function Window ({ path, channelId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState([])
  const [blocks, setBlocks] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channel = await arena.channel(channelId).get()
        setChannel(channel)
        setBlocks(channel.contents)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannel()
  }, [])

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'block',
    drop: item => handleDrop(item),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    canDrop: (item, monitor) => handleCanDrop(item, monitor)
  })

  const handleDrop = item => {
    setBlocks(blocks => [...blocks, item])
  }

  const handleCanDrop = (item, monitor) => {
    return !blocks.find(block => block.connection_id === item.connection_id)
  }

  const isActive = canDrop && isOver

  return (
    <MosaicWindow
      title={channel.title}
      path={path}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div className={classNames('p-2 overflow-y-auto h-full', { 'bg-green-100': isActive })} ref={dropRef}>
        {isLoading && (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        <div className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'>
          {blocks.length && blocks.map(block => <Block key={block.id} data={block} />)}
        </div>
      </div>
    </MosaicWindow>
  )
}

export default Window
