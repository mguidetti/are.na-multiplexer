import { ArenaClient } from 'arena-ts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

/**
 * React hook for accessing the Arena API client
 *
 * Current implementation uses arena-ts@1.0.2 which communicates with Arena API v2.
 *
 * Migration to v3:
 * When Arena API v3 becomes available:
 * 1. Update arena-ts library to a version that supports v3
 * 2. Update the ARENA_API_VERSION environment variable
 * 3. Test all API calls for compatibility
 *
 * Alternatively, consider using the ArenaApiService abstraction layer
 * in src/services/arenaApiService.ts for easier migration.
 *
 * @returns ArenaClient instance configured with the user's access token
 *
 * @see https://github.com/e-e-e/arena-ts
 * @see https://github.com/aredotna/api-docs
 */
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
