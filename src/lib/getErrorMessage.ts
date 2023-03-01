// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

export default function getErrorMessage (error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
