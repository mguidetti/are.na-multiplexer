import { WindowContext } from '@/context/WindowContext'
import React, { useContext } from 'react'
import { Virtuoso } from 'react-virtuoso'
import BlockContainer from './BlockContainer'
import BlocksListItem from './BlocksListItem'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'

const ListContainer = React.forwardRef(function ListContainer (props, ref) {
  return <div {...props} ref={ref} className='divide-y divide-[var(--color)] border-b border-[var(--color)]' />
})

function BlocksList ({ blocks }) {
  const windowCtx = useContext(WindowContext)

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
        <BlockContainer data={block}>
          <BlocksListItem key={block.id} data={block} />
        </BlockContainer>
      )}
    />
  )
}

export default React.memo(BlocksList)
