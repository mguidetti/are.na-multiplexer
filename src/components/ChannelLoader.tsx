import { ArenaChannel } from '@/types/arena'
import classNames from 'classnames'
import debounce from 'debounce-promise'
import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { ControlProps, DropdownIndicatorProps, OptionProps, PlaceholderProps, SelectInstance, SingleValue } from 'react-select'
import AsyncSelect from 'react-select/async'
import { useSession } from 'next-auth/react'
import { useDesktopActionsContext, useDesktopContext } from '../context/DesktopContext'
import { useArena } from '../hooks/useArena'

type Option = ArenaChannel

function ChannelLoader () {
  const { addChannelWindow } = useDesktopActionsContext()
  const { channels: desktopChannels } = useDesktopContext()
  const arena = useArena()
  const { data: sessionData } = useSession()
  const canSearch = sessionData?.user.tier === 'premium' || sessionData?.user.tier === 'supporter'
  const select = useRef<SelectInstance<Option>>(null)

  useHotkeys('/', () => canSearch && select.current?.focus(), {
    ignoreModifiers: true,
    preventDefault: true
  })

  const loadOptions = debounce(async (inputValue: string) => {
    if (!inputValue || !arena) return []

    const results = await arena.searchChannels(inputValue, { page: 1, per: 20 })
    return results.channels
  }, 200)

  const handleSelectChange = (channel: SingleValue<Option>) => {
    addChannelWindow(channel as ArenaChannel)
  }

  return (
    <div className='z-30 w-full max-w-[24rem]'>
      <AsyncSelect
        ref={select}
        cacheOptions
        blurInputOnSelect
        isDisabled={!canSearch}
        placeholder={canSearch ? 'Search channels' : 'Search requires Premium subscription'}
        loadingMessage={() => 'Searching...'}
        components={{
          DropdownIndicator: ({ isFocused }: DropdownIndicatorProps<Option>) => (
            <div className={classNames('px-1 text-sm font-bold border rounded border-zinc-700 text-zinc-700 font-mono', { hidden: isFocused })}>/</div>
          ),
          IndicatorSeparator: () => null
        }}
        getOptionLabel={(option: Option) => `${option.owner.name} / ${option.title}`}
        loadOptions={loadOptions}
        isOptionDisabled={(option: Option) => option.id in desktopChannels}
        onChange={handleSelectChange}
        unstyled
        value={null}
        classNames={{
          control: ({ isFocused, menuIsOpen, isDisabled }: ControlProps<Option>) =>
            classNames(
              'bg-background border-2 rounded-md border-zinc-600 px-2 font-bold',
              {
                'opacity-50': isDisabled,
                'bg-secondary/10 !text-secondary':
                  isFocused,
                '!rounded-b-none !border-b-0 !transition-none': menuIsOpen
              }
            ),
          placeholder: ({ isFocused }: PlaceholderProps<Option>) =>
            classNames('font-normal', { hidden: isFocused }),
          menu: () =>
            'bg-zinc-900 border-2 border-t-0 border-zinc-600 rounded-b-md drop-shadow-panel',
          menuList: () =>
            'scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-800 rounded-b-md',
          loadingMessage: () => 'p-2',
          option: ({ data, isFocused, isDisabled }: OptionProps<Option>) =>
            classNames('py-1 px-2 text-primary font-bold truncate', {
              'bg-secondary/50': isFocused && !isDisabled,
              'opacity-50 pointer-events-none': isDisabled,
              '!text-public-channel': data.visibility === 'public',
              '!text-private-channel': data.visibility === 'private'
            }),
          noOptionsMessage: () => 'p-2 whitespace-nowrap',
          valueContainer: () => 'whitespace-nowrap'
        }}
      />
    </div>
  )
}

export default ChannelLoader
