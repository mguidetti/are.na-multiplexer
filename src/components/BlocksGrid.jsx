import React, { useContext } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import BlocksGridItem from './BlocksGridItem'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'
import { WindowContext } from '@/context/WindowContext'
import BlockContainer from './BlockContainer'

const ListContainer = React.forwardRef(function ListContainer (props, ref) {
  return (
    <div className='py-2'>
      <div {...props} ref={ref} className='grid grid-cols-[repeat(auto-fill,minmax(10em,1fr))] gap-2 p-2' />
    </div>
  )
})

function ItemContainer (props) {
  return <div {...props} className='w-full' />
}

function BlocksGrid ({ blocks }) {
  const windowCtx = useContext(WindowContext)

  return (
    <VirtuosoGrid
      data={blocks}
      endReached={windowCtx.loadMore}
      overscan={800}
      components={{
        List: ListContainer,
        Item: ItemContainer,
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
