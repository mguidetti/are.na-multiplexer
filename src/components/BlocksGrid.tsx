import { useWindowContext } from '@/context/WindowContext'
import { ArenaChannelContents } from 'arena-ts'
import React from 'react'
import { Components, VirtuosoGrid } from 'react-virtuoso'
import BlockContainer from './BlockContainer'
import BlocksGridItem from './BlocksGridItem'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'

const ListContainer: Components['List'] = React.forwardRef(function ListContainer (props, ref) {
  return (
    <div className='py-2'>
      <div {...props} ref={ref} className='grid grid-cols-[repeat(auto-fill,minmax(10em,1fr))] gap-2 p-2' />
    </div>
  )
})

function BlocksGrid ({ blocks }: { blocks: ArenaChannelContents[] }) {
  const { loadMore } = useWindowContext()

  return (
    <VirtuosoGrid
      data={blocks}
      endReached={loadMore}
      overscan={800}
      components={{
        List: ListContainer,
        Scroller: WindowScroller,
        Footer: WindowFooter
      }}
      itemContent={(index, block) => (
        <BlockContainer data={block}>
          <BlocksGridItem key={block.id} data={block} />
        </BlockContainer>
      )}
    />
  )
}

export default React.memo(BlocksGrid)
