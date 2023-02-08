import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useOutsideClick } from '@/hooks/useOutsideClick'

function UserMenu () {
  const session = useSession() || {}
  const { data } = session
  const [isOpen, setIsOpen] = useState(false)

  const ref = useOutsideClick(() => setIsOpen(false))

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className='relative flex justify-center items-center w-9 h-9 marker:p-2 bg-zinc-800 select-none'>
        <span className='font-bold absolute'>{data.user.intitals}</span>
        <img src={data.user.avatar} alt='User avatar' className='absolute w-full h-full object-contain' />
      </button>

      <div hidden={!isOpen} className='absolute top-12 right-4 z-40' ref={ref}>
        <div className='flex flex-col bg-zinc-900 text-primary/70 border-2 border-primary/70 rounded'>
          <button
            onClick={() => signOut()}
            className='p-2 px-4 hover:bg-secondary/10 hover:text-secondary hover'
            title='Sign out'
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
