import ChannelLoader from './ChannelLoader'
import { useSession, signOut } from 'next-auth/react'
import ArenaMark from '@/icons/arena-mark.svg'
import SignOutIcon from '@/icons/sign-out.svg'

function Header () {
  const session = useSession() || {}
  const { data } = session

  return (
    <div className='grid grid-cols-3 gap-x-4 items-start bg-background text-primary/70'>
      <div className='flex items-center gap-x-2 p-3'>
        <ArenaMark className='w-8' />
        <span>A.MUX</span>
      </div>
      <div className='flex-1 flex justify-center'>
        <ChannelLoader />
      </div>
      <div className='text-right flex gap-x-2 justify-end items-center p-3'>
        {data?.user?.name}
        <button onClick={() => signOut()} className='p-1 hover:text-secondary' title='Sign out'>
          <SignOutIcon className='w-5' />
        </button>
      </div>
    </div>
  )
}

export default Header
