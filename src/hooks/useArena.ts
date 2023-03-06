import { S3UploadPolicy } from '@/lib/uploader'
import { ArenaClient } from 'arena-ts'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

class ArenaClientWithUpload extends ArenaClient {
  uploadPolicy (): Promise<S3UploadPolicy> {
    // @ts-expect-error: getJson is a private property instead of protected
    return this.getJson('uploads/policy')
  }
}

export const useArena = () => {
  const [client, setClient] = useState<ArenaClientWithUpload>()
  const { data, status } = useSession()
  const loading = status === 'loading'

  useEffect(() => {
    const accessToken = data?.user.accessToken
    const options = data ? { token: accessToken } : undefined
    const arena = new ArenaClientWithUpload(options)

    setClient(arena)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return client
}
