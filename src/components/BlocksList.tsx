import { useWindowContext } from '@/context/WindowContext'
import { ArenaChannelContents } from 'arena-ts'
import React from 'react'
import { Components, Virtuoso } from 'react-virtuoso'
import BlockContainer from './BlockContainer'
import BlocksListItem from './BlocksListItem'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'

const ListContainer: Components['List'] = React.forwardRef(function ListContainer (props, ref) {
  return <div {...props} ref={ref} className='divide-y divide-[var(--color)] border-b border-[var(--color)]' />
})

function BlocksList ({ blocks }: {blocks: ArenaChannelContents[]}) {
  const windowCtx = useWindowContext()

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
