import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useState } from 'react'
import BlockDragOverlay from './BlockDragOverlay'

function BlockDndWrapper ({ children }) {
  const [draggingBlock, setDraggingBlock] = useState(null)

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })

  const sensors = useSensors(pointerSensor)

  function collisionDetection (args) {
    const pointerCollisions = pointerWithin(args)

    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }

    return rectIntersection(args)
  }

  function handleDragStart (event) {
    const current = event.active.data.current

    setDraggingBlock({
      block: current.block,
      window: current.window
    })
  }

  function clearDraggingBlock () {
    setDraggingBlock(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={clearDraggingBlock}
      onDragCancel={clearDraggingBlock}
      sensors={sensors}
      collisionDetection={collisionDetection}
    >
      {children}
      <DragOverlay className='relative bg-background opacity-90 drop-shadow-panel' dropAnimation={null}>
        {draggingBlock && (
          <BlockDragOverlay data={draggingBlock.block} window={draggingBlock.window} />
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default BlockDndWrapper
