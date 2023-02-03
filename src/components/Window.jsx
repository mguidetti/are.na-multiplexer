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
  const [gridCellSize, setGridCellSize] = useState(150)

  const gridCellSizeMultiplier = 1.25

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

  const [{ isActive }, dropRef] = useDrop({
    accept: 'block',
    drop: (item, monitor) => handleDrop(item, monitor),
    collect: monitor => ({
      isActive: monitor.canDrop() && monitor.isOver()
    }),
    canDrop: (item, monitor) => handleCanDrop(item, monitor)
  })

  const handleDrop = (item, monitor) => {
    addBlock(item)

    return item
  }

  const handleCanDrop = (item, monitor) => {
    return !isLoading && !blocks.find(block => block.connection_id === item.connection_id)
  }

  const addBlock = block => {
    setBlocks(blocks => [...blocks, block])
  }

  const removeBlock = id => {
    setBlocks(blocks => blocks.filter(block => block.id !== id))
  }

  const incrementGrid = () => {
    setGridCellSize(gridCellSize * gridCellSizeMultiplier)
  }

  const decrementGrid = () => {
    setGridCellSize(gridCellSize / gridCellSizeMultiplier)
  }

  return (
    <MosaicWindow
      title={channel.title}
      className={`channel-status-${channel.status}`}
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

        <div class='text-white flex justify-end gap-x-2'>
          <button onClick={incrementGrid} className='p-1 border rounded'>
            Zoom +
          </button>
          <button onClick={decrementGrid} className='p-1 border rounded'>
            Zoom -
          </button>
        </div>

        <div
          className='grid gap-2'
          style={{ 'grid-template-columns': `repeat(auto-fill,minmax(${gridCellSize}px,1fr))` }}
        >
          {blocks.length && blocks.map(block => <Block key={block.id} data={block} removeBlock={removeBlock} />)}
        </div>
      </div>
    </MosaicWindow>
  )
}

export default Window
