import React from 'react'
import GridBlock from './GridBlock'
import ListBlock from './ListBlock'
import Spinner from './Spinner'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'

function BlocksGrid ({ blocks, disconnectBlock, loadMore, isLoading }) {
  const ListContainer = React.forwardRef(function ListContainer (props, ref) {
    return <div {...props} ref={ref} className='p-2 grid gap-2 grid-cols-[repeat(auto-fill,minmax(10em,1fr))]' />
  })

  const ItemContainer = props => {
    return <div {...props} className='w-full' />
  }

  const Footer = () => {
    if (isLoading) {
      return (
        <div className='w-full flex justify-center py-8'>
          <Spinner />
        </div>
      )
    }
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

function BlocksList ({ blocks, disconnectBlock, loadMore, isLoading }) {
  const ListContainer = React.forwardRef(function ListContainer (props, ref) {
    return <ul {...props} ref={ref} className='divide-y divide divide-primary/70 text-primary' />
  })

  const Footer = () => {
    if (isLoading) {
      return (
        <div className='w-full flex justify-center py-8'>
          <Spinner />
        </div>
      )
    }
  }

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
        <li key={block.id} className='px-2'>
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

function Blocks ({ blocks, disconnectBlock, loadMore, isLoading, view }) {
  if (view === 'grid') {
    return <BlocksGrid blocks={blocks} disconnectBlock={disconnectBlock} loadMore={loadMore} isLoading={isLoading} />
  } else {
    return <BlocksList blocks={blocks} disconnectBlock={disconnectBlock} loadMore={loadMore} isLoading={isLoading} />
  }
}

export default React.memo(Blocks)
