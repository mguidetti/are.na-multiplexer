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
  const [query, setQuery] = useState('')

  useHotkeys('/', () => select.current?.focus(), { ignoreModifiers: true, preventDefault: true })

  const loadChannels = useCallback(async query => {
    const results = await arena.search.channels(query, { page: 1, per: 10 })

    return results.channels
  })

  const handleSelectChange = channel => {
    desktop.loadChannel(channel)
    setQuery('')
  }

  return (
    <div className='p-2 w-[500px] z-30'>
      <AsyncSelect
        ref={select}
        cacheOptions
        blurInputOnSelect={true}
        placeholder={'Load channel'}
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
              '!rounded-b-none !border-b-transparent ': menuIsOpen
            }),
          menu: () => '-mt-1 bg-background border-2 border-t-0 border-secondary rounded-b-md',
          menuList: () => 'scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-secondary/30 rounded-b-md',
          option: ({ data, isFocused }) =>
            classNames('py-1 px-2 text-primary font-bold truncate', {
              'bg-secondary/50': isFocused,
              '!text-public-channel': data.status === 'public',
              '!text-private-channel': data.status === 'private'
            })
        }}
      />
    </div>
  )
}

export default ChannelLoader
