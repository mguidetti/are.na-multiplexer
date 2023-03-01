import { ArenaChannelContents } from 'arena-ts'
import { CSSProperties } from 'react'
import BlocksGridItem from './BlocksGridItem'
import BlocksListItem from './BlocksListItem'
import { ChannelWindowState } from './Desktop'

function BlockDragOverlay ({ data, window }: {data: ArenaChannelContents, window: ChannelWindowState }) {
  const renderItem = () => {
    switch (window.view) {
      case 'grid':
        return <BlocksGridItem data={data} />
      case 'list':
        return <BlocksListItem data={data} />
    }
  }

  return (
    <div style={{ '--scale': window.scale } as CSSProperties} className='text-[calc(1rem*var(--scale))]'>
      {renderItem()}
      <div className='bg-dot-grid-secondary absolute inset-0'></div>
    </div>
  )
}

export default BlockDragOverlay
