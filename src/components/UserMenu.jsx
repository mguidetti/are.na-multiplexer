import { useSession, signOut } from 'next-auth/react'
import * as Popover from '@radix-ui/react-popover'

function UserMenu () {
  const session = useSession() || {}
  const { data } = session

  return (
    <Popover.Root>
      <Popover.Trigger className='relative flex items-center justify-center ml-2 select-none w-9 h-9 bg-zinc-800'>
        <span className='absolute font-bold'>{data.user.intitals}</span>
        <img src={data.user.avatar} alt='User avatar' className='absolute object-contain w-full h-full' />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align={'end'}
          className='z-20 flex flex-col border-2 rounded bg-zinc-900 text-zinc-400 border-zinc-600 drop-shadow-panel'
        >
          <button
            onClick={() => signOut()}
            className='p-2 px-4 hover:bg-secondary/10 hover:text-secondary hover'
            title='Sign out'
          >
            Sign out
          </button>
          <Popover.Arrow className='text-zinc-600' fill='currentColor' />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default UserMenu
