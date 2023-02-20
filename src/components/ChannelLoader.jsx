import classNames from 'classnames/bind'
import { useCallback, useContext, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import AsyncSelect from 'react-select/async'
import { useArena } from '../hooks/useArena'
import { DesktopContext } from '../context/DesktopContext'
import debounce from 'debounce-promise'

function ChannelLoader () {
  const desktop = useContext(DesktopContext)
  const arena = useArena()
  const select = useRef(null)
  const [query, setQuery] = useState('')

  useHotkeys('/', () => select.current?.focus(), { ignoreModifiers: true, preventDefault: true })

  const loadChannels = useCallback(
    debounce(async query => {
      const results = await arena.search.channels(query, { page: 1, per: 10 })

      return results.channels
    }, 200),
    [arena]
  )

  const handleSelectChange = channel => {
    desktop.addChannelWindow(channel)
    setQuery('')
  }

  return (
    <div className='max-w-[24rem] w-full z-30'>
      <AsyncSelect
        ref={select}
        cacheOptions
        blurInputOnSelect
        placeholder='Load Channel'
        loadingMessage={() => 'Searching...'}
        components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
        getOptionLabel={e => ` ${e.user.full_name} / ${e.title}`}
        getOptionValue={e => e.id}
        loadOptions={loadChannels}
        onChange={handleSelectChange}
        unstyled
        value={query}
        classNames={{
          control: ({ isFocused, menuIsOpen }) =>
            classNames('bg-background border-2 rounded-md border-primary/70 px-2 font-bold', {
              'bg-secondary/10 !text-secondary !border-secondary': isFocused,
              '!rounded-b-none !border-b-0 !transition-none': menuIsOpen
            }),
          placeholder: ({ isFocused }) => classNames('font-normal', { hidden: isFocused }),
          menu: () => 'bg-zinc-900 border-2 border-t-0 border-secondary rounded-b-md drop-shadow-panel',
          menuList: () => 'scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-secondary/30 rounded-b-md',
          loadingMessage: () => 'p-2',
          option: ({ data, isFocused }) =>
            classNames('py-1 px-2 text-primary font-bold truncate', {
              'bg-secondary/50': isFocused,
              '!text-public-channel': data.status === 'public',
              '!text-private-channel': data.status === 'private'
            }),
          noOptionsMessage: () => 'p-2 whitespace-nowrap',
          valueContainer: () => 'whitespace-nowrap'
        }}
      />
    </div>
  )
}

export default ChannelLoader
