import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useOutsideClick } from '@/hooks/useOutsideClick'

function UserMenu () {
  const session = useSession() || {}
  const { data } = session
  const [isOpen, setIsOpen] = useState(false)

  const ref = useOutsideClick(() => setIsOpen(false))

  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(true)} className='flex justify-center items-center w-9 h-9 marker:p-2 bg-zinc-800 select-none'>
        <span className='font-bold absolute'>{data.user.intitals}</span>
        <img src={data.user.avatar} alt='User avatar' className='absolute w-full h-full object-contain' />
      </button>

      <div hidden={!isOpen} className='absolute top-12 right-0 z-40 w-24' ref={ref}>
        <div className='flex flex-col bg-zinc-900 text-primary/70 border-2 border-primary/70 rounded drop-shadow-panel'>
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
