import Spinner from './Spinner'

function ZeroState ({ isLoadingLayout }) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full text-primary/25'>
      {isLoadingLayout && <Spinner />}
      <p className='mt-8 text-center text-'>{isLoadingLayout ? 'Loading channels' : 'No channels loaded'}</p>
    </div>
  )
}

export default ZeroState
