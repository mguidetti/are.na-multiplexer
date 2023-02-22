import { useSession, signIn } from 'next-auth/react'
import ArenaMark from '@/icons/arena-mark.svg'
import Spinner from './Spinner'

export default function AuthButton () {
  const session = useSession() || {}
  const { data, status } = session

  const loading = status === 'loading'

  if (loading) {
    return (
      <div className='h-14'>
        <Spinner className='w-12 h-12' />
        <div className='mt-2 text-sm text-zinc-600'>Loading</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center h-14'>
      {!data && (
        <>
          <button
            onClick={() => signIn('arena')}
            className='flex items-center px-4 py-2 border-2 rounded-lg border-zinc-600 text-zinc-300 gap-x-2 bg-zinc-900 hover:bg-secondary/20 hover:text-secondary hover:border-secondary'
          >
            <ArenaMark className='w-8' />
            Sign in with Are.na
          </button>
        </>
      )}
    </div>
  )
}
