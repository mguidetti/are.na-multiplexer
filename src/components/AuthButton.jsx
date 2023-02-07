import { useSession, signIn } from 'next-auth/react'
import ArenaMark from '@/icons/arena-mark.svg'

export default function AuthButton () {
  const session = useSession() || {}
  const { data, status } = session

  const loading = status === 'loading'

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {!data && (
        <>
          <button
            onClick={() => signIn('arena')}
            className='border-2 rounded-lg border-primary text-primary py-2 px-4 flex items-center gap-x-2 bg-primary/10 hover:bg-secondary/20 hover:text-secondary hover:border-secondary'
          >
            <ArenaMark className='w-8' />
            Sign in with Are.na
          </button>
        </>
      )}
    </div>
  )
}
