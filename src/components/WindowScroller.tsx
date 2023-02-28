import React from 'react'
import { Components } from 'react-virtuoso'

const WindowScroller: Components['Scroller'] = React.forwardRef(function VirtuosoScroller ({ style, ...props }, ref) {
  return (
    <div
      style={{ ...style }}
      className='scrollbar-thin scrollbar-track-inherit scrollbar-thumb-inherit hover:scrollbar-thumb-inherit'
      ref={ref}
      {...props}
    />
  )
})

export default WindowScroller
