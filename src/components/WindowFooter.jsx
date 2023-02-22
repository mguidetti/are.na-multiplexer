import { WindowContext } from '@/context/WindowContext'
import React, { useContext } from 'react'
import Spinner from './Spinner'

const WindowFooter = () => {
  const windowContext = useContext(WindowContext)

  return (
    <div className='w-full flex justify-center h-24 items-center'>
      {windowContext.isLoading && <Spinner />}
    </div>
  )
}

export default WindowFooter
