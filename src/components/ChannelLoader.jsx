import classNames from 'classnames/bind'
import { useCallback, useContext, useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import AsyncSelect from 'react-select/async'
import { useArena } from '../hooks/useArena'
import { DesktopContext } from './DesktopContext'

function ChannelLoader () {
  const desktop = useContext(DesktopContext)
  const arena = useArena()
  const select = useRef(null)

  useHotkeys('shift+l', () => select.current.focus())

  const loadChannels = useCallback(async query => {
    const results = await arena.search(query).channels({ page: 1, per: 10 })

    return results
  })

  const handleSelectChange = channel => {
    desktop.setNewTileChannel(channel)
    desktop.addToTopRight()
  }

  return (
    <div className='p-2 w-[400px] z-30'>
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
        classNames={{
          container: state =>
            classNames('bg-background border-2 border-primary/70 rounded-md px-2', {
              'border-secondary': state.isFocused
            }),
          menu: () => 'left-0 bg-background border-2 border-primary/70 border-t-background rounded-b-md',
          menuList: () => 'scrollbar-thin scrollbar-thumb-primary/70 scrollbar-track-primary/25',
          option: state => classNames('py-1 px-2', { 'bg-secondary/50 text-white': state.isFocused })
        }}
      />
    </div>
  )
}

export default ChannelLoader
