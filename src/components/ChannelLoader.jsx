import classNames from 'classnames/bind'
import debounce from 'debounce-promise'
import { useContext, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import AsyncSelect from 'react-select/async'
import { DesktopContext } from '../context/DesktopContext'
import { useArena } from '../hooks/useArena'

function ChannelLoader () {
  const desktop = useContext(DesktopContext)
  const arena = useArena()
  const select = useRef(null)
  const [query, setQuery] = useState('')

  useHotkeys('/', () => select.current?.focus(), {
    ignoreModifiers: true,
    preventDefault: true
  })

  const loadChannels = debounce(async query => {
    const results = await arena.search.channels(query, { page: 1, per: 20 })

    return results.channels
  }, 200)

  const handleSelectChange = channel => {
    desktop.addChannelWindow(channel)
    setQuery('')
  }

  return (
    <div className='z-30 w-full max-w-[24rem]'>
      <AsyncSelect
        ref={select}
        cacheOptions
        blurInputOnSelect
        placeholder='Search channels'
        loadingMessage={() => 'Searching...'}
        components={{
          DropdownIndicator: ({ isFocused }) => (
            <div className={classNames('px-1 text-sm font-bold border rounded border-zinc-700 text-zinc-700 font-mono', { hidden: isFocused })}>/</div>
          ),
          IndicatorSeparator: () => null
        }}
        getOptionLabel={e => ` ${e.user.full_name} / ${e.title}`}
        getOptionValue={e => e.id}
        loadOptions={loadChannels}
        onChange={handleSelectChange}
        unstyled
        value={query}
        classNames={{
          control: ({ isFocused, menuIsOpen }) =>
            classNames(
              'bg-background border-2 rounded-md border-zinc-600 px-2 font-bold',
              {
                'bg-secondary/10 !text-secondary':
                  isFocused,
                '!rounded-b-none !border-b-0 !transition-none': menuIsOpen
              }
            ),
          placeholder: ({ isFocused }) =>
            classNames('font-normal', { hidden: isFocused }),
          menu: () =>
            'bg-zinc-900 border-2 border-t-0 border-zinc-600 rounded-b-md drop-shadow-panel',
          menuList: () =>
            'scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800 rounded-b-md',
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
