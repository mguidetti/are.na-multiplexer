import ChannelLoader from './ChannelLoader'

function Header () {
  return (
    <div className='flex gap-x-4 p-2'>
      <div className='w-32'>Are.na Shelf</div>
      <div className='flex-1 flex justify-center'>
        <ChannelLoader />
      </div>
      <div className='w-32 text-right'>@</div>
    </div>
  )
}

export default Header