import { WindowContext } from '@/context/WindowContext'
import React, { useContext } from 'react'
import Spinner from './Spinner'

const WindowFooter = () => {
  const windowContext = useContext(WindowContext)

  return (
    <div className='flex h-24 w-full items-center justify-center'>
      {windowContext.isLoading && <Spinner />}
    </div>
  )
}

export default WindowFooter
