import { createArena } from '@aredotna/sdk'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'

export const useArena = () => {
  const { data, status } = useSession()
  const loading = status === 'loading'

  return useMemo(() => {
    if (loading) return undefined
    return createArena(data ? { token: data.user.accessToken } : undefined)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])
}
