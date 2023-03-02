import { useSession, signOut } from 'next-auth/react'
import * as Popover from '@radix-ui/react-popover'

function UserMenu () {
  const session = useSession()
  const { data: sessionData } = session

  return (
    <Popover.Root>
      <Popover.Trigger className='relative ml-2 flex h-7 w-7 select-none items-center justify-center bg-zinc-800'>
        <span className='absolute text-xs font-bold'>{sessionData?.user.initials}</span>
        {sessionData?.user.image && <img src={sessionData?.user.image} alt='User avatar' className='absolute h-full w-full object-contain' />}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          align={'end'}
          className='z-20 flex flex-col rounded border-2 border-zinc-600 bg-zinc-900 text-zinc-400 drop-shadow-panel'
        >
          <button
            onClick={() => signOut()}
            className='p-2 px-4 hover:bg-secondary/10 hover:text-secondary'
            title='Sign out'
          >
            Sign out
          </button>
          <Popover.Arrow className='text-zinc-600' fill='currentColor' height="7" width="14" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default UserMenu
