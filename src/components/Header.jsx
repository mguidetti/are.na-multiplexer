import ChannelLoader from './ChannelLoader'
import ChannelCreator from './ChannelCreator'
import { useSession, signOut } from 'next-auth/react'
import ArenaMark from '@/icons/arena-mark.svg'
import SignOutIcon from '@/icons/sign-out.svg'

function Header () {
  const session = useSession() || {}
  const { data } = session

  return (
    <div className='grid grid-cols-[1fr_1fr_1fr] gap-x-4 px-4 items-center bg-zinc-900 text-primary/70 py-2'>
      <div className='flex items-center gap-x-2'>
        <ArenaMark className='w-12' />
        <span className='font-mono'>
          Are.na Multi Plexer 
          <a href='https://github.com/mguidetti/are.na-shelf' target='_blank' className='underline decoration-2 hover:text-secondary'>
            v{process.env.npm_package_version}
          </a>
        </span>
      </div>
      <div className='flex-1 flex justify-center items-center'>
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

export default Header
