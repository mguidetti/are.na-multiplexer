import React, { useContext } from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import BlocksGridItem from './BlocksGridItem'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'
import { WindowContext } from '@/context/WindowContext'

function BlocksGrid ({ blocks }) {
  const windowCtx = useContext(WindowContext)

  const ListContainer = React.forwardRef(function ListContainer (props, ref) {
    return (
      <div className='py-2'>
        <div {...props} ref={ref} className='p-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(10em,1fr))]' />
      </div>
    )
  })

  const ItemContainer = props => {
    return <div {...props} className='w-full' />
  }

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
      itemContent={(index, block) => <BlocksGridItem key={block.id} data={block} />}
    />
  )
}

export default React.memo(BlocksGrid)
