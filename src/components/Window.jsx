import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { MosaicWindow } from 'react-mosaic-component'
import arena from '../data/arenaClient'
import Block from './Block'
import Spinner from './Spinner'

function Window ({ path, totalWindowCount, channelId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState([])
  const [error, setError] = useState(null)
  const [basket, setBasket] = useState([])

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channel = await arena.channel(channelId).get()
        setChannel(channel)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChannel()
  }, [])

  const [{ isOver }, dropRef] = useDrop({
    accept: 'block',
    drop: item => handleDrop(item),
    collect: monitor => ({
      isOver: monitor.isOver(),
    })
  })

  const handleDrop = (item) => {
    setBasket(basket => (!basket.includes(item) ? [...basket, item] : basket))
  }

  return (
    <MosaicWindow
      title={channel.title}
      createNode={() => totalWindowCount + 1}
      path={path}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div className={classNames('p-2 overflow-y-auto h-full', {"bg-green-100": isOver})} ref={dropRef}>
        {isLoading && <div className="w-full h-full flex items-center justify-center"><Spinner /></div>}
        {error && <div className='text-red-500'>Error: {error.message}</div>}

        <div className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'>
          {basket && basket.map(block => (
            <Block key={block.blockData.id} blockData={block.blockData} />
          ))}
          {channel.contents && channel.contents.map(block => (
            <Block key={block.id} blockData={block} />
          ))}
        </div>

      </div>
    </MosaicWindow>
  )
}

export default Window
