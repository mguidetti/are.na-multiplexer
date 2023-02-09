import React from 'react'
import { VirtuosoGrid } from 'react-virtuoso'
import GridBlock from './GridBlock'
import WindowFooter from './WindowFooter'
import WindowScroller from './WindowScroller'

function BlocksGrid ({ blocks, disconnectBlock, loadMore }) {
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
      endReached={loadMore}
      overscan={800}
      components={{
        List: ListContainer,
        Item: ItemContainer,
        Scroller: WindowScroller,
        Footer: WindowFooter
      }}
      itemContent={(index, block) => <GridBlock key={block.id} data={block} disconnectBlock={disconnectBlock} />}
    />
  )
}

export default React.memo(BlocksGrid)
