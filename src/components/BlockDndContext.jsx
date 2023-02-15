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

function BlockDndContext ({ children }) {
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
      view: current.view,
      scale: current.scale
    })
  }

  function handleDragEnd () {
    setDraggingBlock(null)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={collisionDetection}
    >
      {children}
      <DragOverlay className='relative bg-background drop-shadow-panel' dropAnimation={null}>
        {draggingBlock && (
          <BlockDragOverlay data={draggingBlock.block} view={draggingBlock.view} scale={draggingBlock.scale} />
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default BlockDndContext
