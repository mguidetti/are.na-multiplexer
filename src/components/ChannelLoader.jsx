import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import arena from '../data/arenaClient'

function ChannelLoader () {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <LoadChannelButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <LoadChannelDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

function LoadChannelDialog ({ isOpen, setIsOpen }) {
  const [isLoading, setIsLoading] = useState(true)
  const [channels, setChannels] = useState([])

  const searchChannels = async event => {
    setChannels([])
    setIsLoading(true)

    const results = await arena
      .search(event.target.value)
      .channels({ page: 2, per: 3 })

    setChannels(results)
    setIsLoading(false)
  }

  const dialogClasses = classNames(
    'absolute border rounded-md p-4 z-30 bg-white mx-auto top-10 left-0 w-72 shadow-xl',
    { hidden: !isOpen }
  )

  return (
    <div className={dialogClasses}>
      <div className='flex flex-col gap-y-2'>
        <input
          type='text'
          onChange={searchChannels}
          className='border rounded p-2'
          placeholder='Search channels'
        />

        <select
          name='channels-list'
          id='channels-list'
          className='border rounded p-2'
        >
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
        <button className='border p-2 rounded'>Load into new window</button>
        <button className='border p-2 rounded' onClick={() => setIsOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  )
}

function LoadChannelButton ({ isOpen, setIsOpen }) {
  return (
    <button className='border p-2 rounded' onClick={() => setIsOpen(!isOpen)}>
      Add Channel
    </button>
  )
}

export default ChannelLoader
