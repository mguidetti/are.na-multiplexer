import axios from 'axios'

export interface S3UploadPolicy {
  key: string
  AWSAccessKeyId: string
  acl: string
  success_action_status: string
  policy: string
  signature: string
  bucket: string
}

const buildFormDataFromFile = ({
  file,
  policy
}: {
  file: File
  policy: S3UploadPolicy
}): FormData => {
  const formData = new FormData()

  formData.append('Content-Type', file.type)
  formData.append('key', policy.key)
  formData.append('AWSAccessKeyId', policy.AWSAccessKeyId)
  formData.append('acl', policy.acl)
  formData.append('success_action_status', policy.success_action_status)
  formData.append('policy', policy.policy)
  formData.append('signature', policy.signature)
  formData.append('file', file)

  return formData
}

const parseLocationFromS3Response = (data: string) => {
  const parser = new DOMParser()
  const parsed = parser.parseFromString(data, 'text/xml')
  return parsed.getElementsByTagName('Location')[0].childNodes[0].nodeValue
}

export const uploadFile = async ({
  file,
  policy,
  onFileProgress = null,
  onDone = null
}: {
  file: File
  policy: S3UploadPolicy
  onFileProgress?: ((progress: number) => any) | null
  onDone?: ((url: string) => any) | null
}): Promise<{
  file: File
  url: string | null
}> => {
  const formData = buildFormDataFromFile({ file, policy })
  const { data } = await axios.post(policy.bucket, formData, {
    responseType: 'text',
    onUploadProgress: progressEvent => {
      if (onFileProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onFileProgress(progress)
      }
    }
  })
  const url = parseLocationFromS3Response(data)

  if (url && onDone) onDone(url)

  return { file, url }
}
