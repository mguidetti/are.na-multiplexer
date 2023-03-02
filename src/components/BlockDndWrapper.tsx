import {
  CollisionDetection,
  DndContext,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { ArenaChannelContents } from 'arena-ts'
import { ReactNode, useState } from 'react'
import BlockDragOverlay from './BlockDragOverlay'
import { ChannelWindowState } from './Desktop'

interface DraggingBlockState {
  block: ArenaChannelContents,
  window: ChannelWindowState
}

function BlockDndWrapper ({ children }: { children: ReactNode }) {
  const [draggingBlock, setDraggingBlock] = useState<DraggingBlockState | null>()

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })

  const sensors = useSensors(pointerSensor)

  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args)

    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }

    return rectIntersection(args)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const current = event.active.data.current

    setDraggingBlock({
      block: current?.block,
      window: current?.window
    })
  }

  const clearDraggingBlock = () => {
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
