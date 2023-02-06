import ChannelLoader from './ChannelLoader'
import ChannelCreator from './ChannelCreator'
import { useSession, signOut } from 'next-auth/react'
import AmuxIcon from '@/icons/amux.svg'
import SignOutIcon from '@/icons/sign-out.svg'
import GithubIcon from '@/icons/github.svg'
import React from 'react'

function Header () {
  const session = useSession() || {}
  const { data } = session

  return (
    <div className='grid grid-cols-[1fr_1fr_1fr] gap-x-4 px-4 items-center bg-zinc-900 text-primary/70 py-2'>
      <div className='flex items-center gap-x-3'>
        <AmuxIcon className='w-10 opacity-80' fill="currentColor" />
        <span className='font-mono text-xs'>
          Are.na Multiplexer<br/>
          <a href='https://github.com/mguidetti/are.na-shelf' target='_blank' className='hover:text-secondary'>
            v{process.env.npm_package_version}
            <GithubIcon className="inline h-4 text-inherit ml-1" /> 
          </a>
        </span>
      </div>
      <div className='flex-1 flex justify-center items-center gap-x-2'>
        <ChannelLoader />
        <ChannelCreator />
      </div>
      <div className='text-right flex gap-x-2 justify-end items-center'>
        {data?.user?.name}
        <button onClick={() => signOut()} className='p-1 hover:text-secondary' title='Sign out'>
          <SignOutIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default React.memo(Header)
