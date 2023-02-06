import AuthButton from './AuthButton'

function Welcome () {
  return (
    <div className='bg-background h-full w-full flex flex-col gap-y-4 items-center justify-center'>
      <p className='font-mono text-lg text-primary/70'>Are.na Multiplexer</p>

      <AuthButton />
    </div>
  )
}

export default Welcome
