import React, { useContext } from 'react'
import { Virtuoso } from 'react-virtuoso'
import ListBlock from './ListBlock'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'
import { WindowContext } from '@/context/WindowContext'

function BlocksList ({ blocks }) {
  const windowCtx = useContext(WindowContext)

  const ListContainer = React.forwardRef(function ListContainer (props, ref) {
    return <ul {...props} ref={ref} />
  })

  return (
    <Virtuoso
      data={blocks}
      endReached={windowCtx.loadMore}
      overscan={400}
      components={{
        List: ListContainer,
        Scroller: WindowScroller,
        Footer: WindowFooter
      }}
      itemContent={(index, block) => (
        <li key={block.id}>
          <ListBlock data={block} />
        </li>
      )}
    />
  )
}

export default React.memo(BlocksList)
