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
            className='border rounded-lg border-primary text-primary py-2 px-4 flex items-center gap-x-2 hover:bg-secondary/50'
          >
            <ArenaMark className='w-8' />
            Sign in
          </button>
        </>
      )}
    </div>
  )
}
