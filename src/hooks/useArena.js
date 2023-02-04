import { ArenaClient } from 'arena-ts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useArena = () => {
  const [client, setClient] = useState(null)
  const { data, status } = useSession()
  const loading = status === 'loading'

  useEffect(() => {
    const accessToken = data?.user.accessToken
    const options = data ? { token: accessToken } : undefined
    const arena = new ArenaClient(options)

    setClient(arena)
  }, [loading])

  return client
}
