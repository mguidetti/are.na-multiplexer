import classNames from 'classnames/bind'
import { useCallback, useContext, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import AsyncSelect from 'react-select/async'
import { useArena } from '../hooks/useArena'
import { DesktopContext } from './DesktopContext'

function ChannelLoader () {
  const desktop = useContext(DesktopContext)
  const arena = useArena()
  const select = useRef(null)

  const [isOpen, setIsOpen] = useState(false)

  useHotkeys('shift+l', () => open(), { enabled: !isOpen })
  useHotkeys('esc', () => close(), { enabled: isOpen })

  const open = () => {
    setIsOpen(true)
    setTimeout(() => select.current.focus(), 50)
  }

  const close = () => {
    setIsOpen(false)
  }

  const loadChannels = useCallback(async query => {
    const results = await arena.search(query).channels({ page: 1, per: 10 })

    return results
  })

  const handleSelectChange = channel => {
    desktop.setNewTileChannelId(channel.id)
    desktop.addToTopRight()
    close()
  }

  const dialogClasses = classNames('fixed z-30 mx-auto top-12 left-0 right-0 w-1/2', { hidden: !isOpen })

  return (
    <div className='relative'>
      <button
        className={classNames(
          'border-2 border-t-0 border-primary/70 py-1 px-4 rounded-b-lg text-primary/70 hover:bg-secondary/50 hover:border-secondary transition-all',
          {
            'bg-secondary/75 pt-2 4 hover:bg-secondary/75': isOpen
          }
        )}
        onClick={open}
      >
        Load Channel
      </button>

      <div className={dialogClasses}>
        <AsyncSelect
          ref={select}
          cacheOptions
          defaultOptions={[]}
          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
          getOptionLabel={e => e.title}
          getOptionValue={e => e.id}
          loadOptions={loadChannels}
          onChange={handleSelectChange}
          unstyled
          classNames={{
            container: () => 'bg-background bg-opacity-80 backdrop-blur-md border-2 rounded-md px-2',
            menu: () =>
              'bg-background bg-opacity-80 backdrop-blur-md border-2 border-t-0 rounded-b-md thin-scrollbar',
            option: state => (state.isFocused ? 'py-1 px-2 bg-secondary/75 text-white' : 'py-1 px-2')
          }}
        />
      </div>
    </div>
  )
}

export default ChannelLoader
