import Spinner from './Spinner'

function ZeroState ({ isLoadingLayout }: {isLoadingLayout: boolean}) {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center text-primary/25'>
      {isLoadingLayout && <Spinner />}
      <p className='mt-8 text-center'>{isLoadingLayout ? 'Loading channels' : 'No channels loaded'}</p>
    </div>
  )
}

export default ZeroState
