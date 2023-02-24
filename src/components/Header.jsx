import AmuxIcon from '@/icons/amux.svg'
import React from 'react'
import ChannelCreator from './ChannelCreator'
import ChannelLoader from './ChannelLoader'
import ChannelsIndexMenu from './ChannelsIndexMenu'
import Info from './Info'
import SaveLoadLayoutMenu from './SaveLoadLayoutMenu'
import UserMenu from './UserMenu'

function Header () {
  return (
    <div className='grid grid-cols-[minmax(auto,150px)_1fr_minmax(10px,150px)] items-center gap-x-4 bg-zinc-900 px-4 py-2 text-zinc-400'>
      <div>
        <a
          href='https://github.com/mguidetti/are.na-multiplexer'
          className='flex items-center gap-x-3 font-mono text-xs hover:text-secondary'
          target='_blank'
          rel='noreferrer'
        >
          <AmuxIcon className='w-8 opacity-80' fill='currentColor' />
          <span className='hidden md:inline'>
            Are.na
            <br />
            Multiplexer
          </span>
        </a>
      </div>
      <div className='flex flex-1 items-center justify-center gap-x-2'>
        <ChannelLoader />
        <ChannelsIndexMenu />
        <ChannelCreator />
      </div>
      <div className='flex items-center justify-end gap-x-1 text-right'>
        <SaveLoadLayoutMenu />
        <Info />
        <UserMenu />
      </div>
    </div>
  )
}

export default React.memo(Header)
