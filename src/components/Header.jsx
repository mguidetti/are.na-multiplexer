import ChannelLoader from './ChannelLoader'
import ChannelCreator from './ChannelCreator'
import UserMenu from './UserMenu'
import AmuxIcon from '@/icons/amux.svg'
import React from 'react'

function Header () {
  return (
    <div className='grid grid-cols-[1fr_1fr_1fr] gap-x-4 px-4 items-center bg-zinc-900 text-primary/70 py-2'>
      <div>
        <a
          href='https://github.com/mguidetti/are.na-multiplexer'
          className='hover:text-secondary font-mono text-xs flex items-center gap-x-3'
          target='_blank'
          rel='noreferrer'
        >
          <AmuxIcon className='w-8 opacity-80' fill='currentColor' />
          <span>
            Are.na
            <br />
            Multiplexer
          </span>
        </a>
      </div>
      <div className='flex-1 flex justify-center items-center gap-x-2'>
        <ChannelLoader />
        <ChannelCreator />
      </div>
      <div className='text-right flex gap-x-2 justify-end items-center'>
        <UserMenu />
      </div>
    </div>
  )
}

export default React.memo(Header)
