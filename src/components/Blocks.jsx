import React, { useContext } from 'react'
import GridBlock from './GridBlock'
import ListBlock from './ListBlock'
import Spinner from './Spinner'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import { WindowContext } from '@/context/WindowContext'

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
        Scroller: VirtuosoScroller,
        Footer
      }}
      itemContent={(index, block) => (
        <GridBlock key={block.id} data={block} disconnectBlock={disconnectBlock} className='w-1/3' />
      )}
    />
  )
}

function BlocksList ({ blocks, disconnectBlock, loadMore }) {
  const ListContainer = React.forwardRef(function ListContainer (props, ref) {
    return <ul {...props} ref={ref} className='divide-y divide divide-primary/70 text-primary' />
  })

  return (
    <Virtuoso
      data={blocks}
      endReached={loadMore}
      overscan={400}
      components={{
        List: ListContainer,
        Scroller: VirtuosoScroller,
        Footer
      }}
      itemContent={(index, block) => (
        <li key={block.id}>
          <ListBlock data={block} disconnectBlock={disconnectBlock} />
        </li>
      )}
    />
  )
}

const VirtuosoScroller = React.forwardRef(function VirtuosoScroller ({ style, ...props }, ref) {
  return (
    <div
      style={{ ...style }}
      className='scrollbar-thin scrollbar-thumb-inherit scrollbar-track-inherit hover:scrollbar-thumb-inherit'
      ref={ref}
      {...props}
    />
  )
})

const Footer = () => {
  const windowContext = useContext(WindowContext)

  return (
    <div className='w-full flex justify-center h-24 items-center'>
      {windowContext.loadingStatus === 'active' && <Spinner />}
    </div>
  )
}

function Blocks ({ blocks, disconnectBlock, loadMore, view }) {
  if (view === 'grid') {
    return <BlocksGrid blocks={blocks} disconnectBlock={disconnectBlock} loadMore={loadMore} />
  } else {
    return <BlocksList blocks={blocks} disconnectBlock={disconnectBlock} loadMore={loadMore} />
  }
}

export default React.memo(Blocks)
