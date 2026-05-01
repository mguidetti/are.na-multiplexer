import { Arena, createArena } from '@aredotna/sdk'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useArena = () => {
  const [client, setClient] = useState<Arena>()
  const { data, status } = useSession()
  const loading = status === 'loading'

  useEffect(() => {
    const accessToken = data?.user.accessToken
    const options = data ? { token: accessToken } : undefined
    const arena = createArena(options)

    setClient(arena)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return client
}
