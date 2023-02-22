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
    <div className='grid grid-cols-[minmax(auto,150px)_1fr_minmax(10px,150px)] gap-x-4 px-4 items-center bg-zinc-900 text-zinc-400 py-2'>
      <div>
        <a
          href='https://github.com/mguidetti/are.na-multiplexer'
          className='flex items-center font-mono text-xs hover:text-secondary gap-x-3'
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
      <div className='flex items-center justify-center flex-1 gap-x-2'>
        <ChannelLoader />
        <ChannelsIndexMenu />
        <ChannelCreator />
      </div>
      <div className='flex items-center justify-end text-right gap-x-1'>
        <SaveLoadLayoutMenu />
        <Info />
        <UserMenu />
      </div>
    </div>
  )
}

export default React.memo(Header)
