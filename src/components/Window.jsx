import classNames from 'classnames/bind'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicContext, MosaicWindow } from 'react-mosaic-component'
import { useArena } from '../hooks/useArena'
import Block from './Block'
import Spinner from './Spinner'

function Window ({ path, channelData }) {
  const mosaic = useContext(MosaicContext)
  const arena = useArena()

  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState(channelData)
  const [blocks, setBlocks] = useState([])
  const [error, setError] = useState(null)
  const [gridCellSize, setGridCellSize] = useState(150)
  const [view, setView] = useState('grid')

  const gridCellSizeMultiplier = 1.25

  useEffect(() => {
    fetchBlocks()
  }, [arena])

  const fetchBlocks = useCallback(async () => {
    if (!arena) return

    const results = await arena.channel(channel.id).contents({ page: 1, per: 25 })

    try {
      setBlocks(results.contents)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [arena])

  const addBlock = useCallback(
    async block => {
      setBlocks(blocks => [...blocks, block])

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.connect.block(block.id)

      console.log(result)

      // TODO: should update the block that was added with new info (connection_id, etc)
    },
    [arena]
  )

  const disconnectBlock = useCallback(
    async block => {
      removeBlock(block)

      const channelObj = arena.channel(channel.id)
      const result = await channelObj.disconnect.block(block.id)

      console.log(result)
    },
    [arena]
  )

  const removeBlock = block => {
    setBlocks(blocks => blocks.filter(b => b.id !== block.id))
  }

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
    return !isLoading && !blocks.find(block => block.id === item.id)
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

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid')
  }

  return (
    <MosaicWindow
      title={`${channel.user.full_name} / ${channel.title}`}
      className={`channel-status-${channel.status}`}
      path={path}
      toolbarControls={<ToolbarControls />}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div
        className={classNames(
          'overflow-y-auto scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit h-full',
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

        <Blocks />
      </div>
    </MosaicWindow>
  )

  function Blocks () {
    if (blocks.length) {
      if (view == 'grid') {
        return <BlocksGrid />
      } else {
        return <BlocksList />
      }
    } else {
      return <BlankSlate />
    }
  }

  function BlocksGrid () {
    return (
      <div
        className='p-2 grid gap-2'
        style={{ gridTemplateColumns: `repeat(auto-fill,minmax(${gridCellSize}px,1fr))` }}
      >
        {blocks.map(block => (
          <Block key={block.id} data={block} disconnectBlock={disconnectBlock} />
        ))}
      </div>
    )
  }

  function BlocksList () {
    return (
      <ul className='p-2 divide-y divide divide-primary/70 text-primary'>
        {blocks.map(block => (
          <li className='py-1 text-md grid grid-cols-[min-content_1fr] gap-x-4 items-center'>
            <div className='w-8 h-8'>
              {block.image && <img src={block.image.thumb.url} className='aspect-square object-contain' />}
            </div>
            <div>{block.title}</div>
          </li>
        ))}
      </ul>
    )
  }

  function BlankSlate () {
    return <div className='w-full h-full flex items-center justify-center'>No blocks</div>
  }

  function ToolbarControls () {
    return (
      <div className='flex justify-end'>
        <button onClick={toggleView} className='hover:text-secondary px-1'>
          {view === 'list' && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke-width='1.5'
              stroke='currentColor'
              class='w-5 h-5'
            >
              <path
                stroke-linecap='round'
                stroke-linejoin='round'
                d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
              />
            </svg>
          )}

          {view === 'grid' && (
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' class='w-5 h-5'>
              <path
                fill-rule='evenodd'
                d='M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 15.25a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 10a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1V10z'
                clip-rule='evenodd'
              />
            </svg>
          )}
        </button>

        <button onClick={incrementGrid} className='hover:text-secondary px-1'>
          <svg fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-5 h-5'>
            <path d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>

        <button onClick={decrementGrid} className='hover:text-secondary px-1'>
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
