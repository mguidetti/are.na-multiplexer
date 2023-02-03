import classNames from 'classnames/bind'
import { useContext, useState, useRef } from 'react'
import arena from '../data/arenaClient'
import { DesktopContext } from './DesktopContext'
import { useHotkeys } from 'react-hotkeys-hook'

function ChannelLoader () {
  const desktop = useContext(DesktopContext)

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState('')

  const searchInputRef = useRef(null)

  useHotkeys('shift+l', () => open(), { enabled: !isOpen })
  useHotkeys('esc', () => close(), { enabled: isOpen })

  const open = () => {
    setIsOpen(true)

    setTimeout(() => searchInputRef.current.focus(), 50)
  }

  const reset = () => {
    setChannels([])
  }

  const close = () => {
    setIsOpen(false)
    reset()
  }

  const searchChannels = async event => {
    reset()
    setIsLoading(true)

    const results = await arena.search(event.target.value).channels({ page: 1, per: 10 })

    setIsLoading(false)

    if (results.length) {
      setChannels(results)
      setSelectedChannel(results[0].id)
    } else {
      console.log('no results')
    }
  }

  const handleSelectChange = event => {
    setSelectedChannel(event.target.value)
  }

  const handleLoad = () => {
    desktop.setNewTileChannelId(selectedChannel)
    desktop.addToTopRight()
    close()
  }

  const dialogClasses = classNames(
    'fixed border-2 bg-black bg-opacity-80 backdrop-blur-md rounded-md p-4 z-30 bg-black mx-auto top-12 left-0 right-0 w-1/2 shadow-xl',
    { hidden: !isOpen }
  )

  return (
    <div className='relative'>
      <button
        className={classNames('border py-1 px-4 rounded-lg text-primary hover:bg-secondary/50', { 'bg-secondary/50': isOpen })}
        onClick={open}
      >
        Load Channel
      </button>

      <div className={dialogClasses}>
        <div className='flex flex-col gap-y-2'>
          <input
            type='text'
            ref={searchInputRef}
            onChange={searchChannels}
            className='border border-inherit rounded p-2 bg-transparent'
            placeholder='Search channels'
          />
          <select
            name='channels-list'
            id='channels-list'
            className='border rounded p-2 bg-black appearance-none'
            onChange={handleSelectChange}
          >
            {isLoading && (
              <option selected disabled>
                Loading...
              </option>
            )}
            {channels &&
              channels.map(channel => (
                <option key={channel.id} value={channel.id}>
                  {channel.title}
                </option>
              ))}
          </select>
        </div>

        <div className='flex gap-x-2 mt-4'>
          <button className='border p-2 rounded hover:bg-secondary/50' onClick={handleLoad}>
            Load into new window
          </button>
          <button className='border p-2 rounded hover:bg-secondary/50' onClick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChannelLoader
