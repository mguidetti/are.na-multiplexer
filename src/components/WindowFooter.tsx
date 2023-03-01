import { useWindowContext } from '@/context/WindowContext'
import Spinner from './Spinner'

const WindowFooter = () => {
  const { isLoading } = useWindowContext()

  return (
    <div className='flex h-24 w-full items-center justify-center'>
      {isLoading && <Spinner />}
    </div>
  )
}

export default WindowFooter
