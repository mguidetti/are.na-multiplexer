import React, { useContext } from 'react'
import { Virtuoso } from 'react-virtuoso'
import BlocksListItem from './BlocksListItem'
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
      itemContent={(index, block) => <BlocksListItem key={block.id} data={block} />}
    />
  )
}

export default React.memo(BlocksList)
