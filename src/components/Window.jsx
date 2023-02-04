import classNames from 'classnames/bind'
import { useContext, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicContext, MosaicWindow } from 'react-mosaic-component'
import { useArena } from '@/hooks/useArena'
import Block from './Block'
import Spinner from './Spinner'

function Window ({ path, channelId }) {
  const mosaic = useContext(MosaicContext)
  const arena = useArena()

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

  const remove = () => {
    mosaic.mosaicActions.remove(path)
  }

  const expand = () => {
    mosaic.mosaicActions.expand(path)
  }

  return (
    <MosaicWindow
      title={channel.title}
      className={`channel-status-${channel.status}`}
      path={path}
      toolbarControls={<ToolbarControls />}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div
        className={classNames(
          'p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit h-full',
          { 'bg-secondary/25': isActive }
        )}
        ref={dropRef}
      >
        {isLoading && (
          <div className='w-full h-full flex items-center justify-center'>
            <Spinner />
          </div>
        )}
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        <div className='grid gap-2' style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${gridCellSize}px,1fr))` }}>
          {blocks.length && blocks.map(block => <Block key={block.id} data={block} removeBlock={removeBlock} />)}
        </div>
      </div>
    </MosaicWindow>
  )

  function ToolbarControls () {
    return (
      <div className='flex justify-end'>
        <button onClick={incrementGrid} className='hover:text-secondary px-1'>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-5 h-5'>
            <path d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>

        <button onClick={decrementGrid} className='hover:text-secondar px-1'>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-5 h-5'>
            <path d='M19.5 12h-15' />
          </svg>
        </button>

        <button onClick={expand} className='hover:text-secondary px-1'>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-5 h-5'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15'
            />
          </svg>
        </button>

        <button onClick={remove} className='hover:text-secondary px-1'>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-5 h-5'>
            <path d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
    )
  }
}

export default Window
