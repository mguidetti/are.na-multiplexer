import { MosaicWindow } from 'react-mosaic-component'
import BlocksList from './BlocksList'
import Spinner from './Spinner'
import { useEffect, useState } from 'react'
import arena from '../data/arenaClient'

function Window ({ path, totalWindowCount, channelId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState([])
  const [error, setError] = useState(null)

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

  return (
    <MosaicWindow
      title={channel.title}
      createNode={() => totalWindowCount + 1}
      path={path}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div className='p-2 overflow-y-auto h-full'>
        {isLoading && <Spinner />}
        {error && <div className='text-red-500'>Error: {error.message}</div>}
        {channel.contents && <BlocksList blocks={channel.contents} />}
      </div>
    </MosaicWindow>
  )
}

export default Window
