import BlocksGridItem from './BlocksGridItem'
import BlocksListItem from './BlocksListItem'

function BlockDragOverlay ({ data, window }) {
  const renderItem = () => {
    switch (window.view) {
      case 'grid':
        return <BlocksGridItem data={data} />
      case 'list':
        return <BlocksListItem data={data} />
    }
  }

  return (
    <div style={{ '--scale': window.scale }} className='text-[calc(1rem*var(--scale))]'>
      {renderItem()}
      <div className='absolute inset-0 bg-dot-grid-secondary'></div>
    </div>
  )
}

export default BlockDragOverlay
