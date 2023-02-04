import AuthButton from './AuthButton'

function Welcome () {
  return (
    <div class='bg-background h-full w-full flex flex-col gap-y-4 items-center justify-center'>
      <p class='font-mono text-lg text-primary/70'>SHELF</p>

      <AuthButton />
    </div>
  )
}

export default Welcome
