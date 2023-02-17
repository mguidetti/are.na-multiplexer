import { useSession, signOut } from 'next-auth/react'
import * as Popover from '@radix-ui/react-popover'

function UserMenu () {
  const session = useSession() || {}
  const { data } = session

  return (
    <Popover.Root>
      <Popover.Trigger className='relative flex items-center justify-center select-none w-9 h-9 bg-zinc-800'>
        <span className='absolute font-bold'>{data.user.intitals}</span>
        <img src={data.user.avatar} alt='User avatar' className='absolute object-contain w-full h-full' />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align={'end'}
          className='z-20 flex flex-col border-2 rounded bg-zinc-900 text-primary/70 border-primary/70 drop-shadow-panel'
        >
          <button
            onClick={() => signOut()}
            className='p-2 px-4 hover:bg-secondary/10 hover:text-secondary hover'
            title='Sign out'
          >
            Sign out
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default UserMenu
