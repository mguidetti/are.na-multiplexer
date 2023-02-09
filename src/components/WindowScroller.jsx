import React from 'react'

const WindowScroller = React.forwardRef(function VirtuosoScroller ({ style, ...props }, ref) {
  return (
    <div
      style={{ ...style }}
      className='scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit'
      ref={ref}
      {...props}
    />
  )
})

export default WindowScroller
