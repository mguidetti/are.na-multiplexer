import { ArenaClient } from 'arena-ts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useArena = () => {
  const [client, setClient] = useState<ArenaClient>()
  const { data, status } = useSession()
  const loading = status === 'loading'

  useEffect(() => {
    const accessToken = data?.user.accessToken
    const options = data ? { token: accessToken } : undefined
    const arena = new ArenaClient(options)

    setClient(arena)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return client
}
