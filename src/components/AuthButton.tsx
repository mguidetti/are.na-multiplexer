import { useSession, signIn } from 'next-auth/react'
import ArenaMark from '@/icons/arena-mark.svg'
import Spinner from './Spinner'

export default function AuthButton () {
  const session = useSession()
  const { status } = session
  const loading = status === 'loading'

  if (loading) {
    return (
      <div className='h-14'>
        <Spinner className='h-12 w-12' />
        <div className='mt-2 text-sm text-zinc-600'>Loading</div>
      </div>
    )
  } else {
    return (
    <div className='flex h-14 flex-col items-center justify-center'>
      <button
        onClick={() => signIn('arena')}
        className='flex items-center gap-x-2 rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2 text-zinc-300 hover:border-secondary hover:bg-secondary/20 hover:text-secondary'
      >
        <ArenaMark className='w-8' />
        Sign in with Are.na
      </button>
    </div>
    )
  }
}
