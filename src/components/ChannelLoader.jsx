import classNames from 'classnames/bind'
import { useContext, useState } from 'react'
import arena from '../data/arenaClient'
import { MosaicContext } from './MosaicContext'

function ChannelLoader () {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        className={classNames('border py-2 px-4 rounded', { 'animate-pulse': isOpen })}
        onClick={() => setIsOpen(!isOpen)}
      >
        Add Channel
      </button>

      <LoadChannelDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

function LoadChannelDialog ({ isOpen, setIsOpen }) {
  const [isLoading, setIsLoading] = useState(true)
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('')
  const mosaic = useContext(MosaicContext)

  const searchChannels = async event => {
    reset()

    const results = await arena.search(event.target.value).channels({ page: 1, per: 10 })

    setChannels(results)
    setIsLoading(false)
    setSelectedChannel(results[0].id)
  }

  const handleSelectChange = event => {
    setSelectedChannel(event.target.value)
  }

  const handleLoad = event => {
    mosaic.setNewTileChannelId(selectedChannel)
    mosaic.addToTopRight()
    close()
  }

  const reset = () => {
    setChannels([])
    setIsLoading(true)
  }

  const close = () => {
    setIsOpen(false)
    reset()
  }

  const dialogClasses = classNames(
    'fixed border rounded-md p-4 z-30 bg-white mx-auto top-16 left-0 right-0 w-1/2 shadow-xl',
    { hidden: !isOpen }
  )

  return (
    <div className={dialogClasses}>
      <div className='flex flex-col gap-y-2'>
        <input type='text' onChange={searchChannels} className='border rounded p-2' placeholder='Search channels' />

        <select name='channels-list' id='channels-list' className='border rounded p-2' onChange={handleSelectChange}>
          {isLoading && <option disabled>Loading...</option>}
          {channels &&
            channels.map(channel => (
              <option key={channel.id} value={channel.id}>
                {channel.title}
              </option>
            ))}
        </select>
      </div>

      <div className='flex gap-x-2 mt-4'>
        <button className='border p-2 rounded' onClick={handleLoad}>
          Load into new window
        </button>
        <button className='border p-2 rounded' onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default ChannelLoader
