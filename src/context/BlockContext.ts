import { ArenaChannelContents } from 'arena-ts'
import { createContext, useContext } from 'react'

export interface BlockContextType {
  data: ArenaChannelContents,
  handleDelete: () => void,
  handleView: () => void,
  isDragging: boolean,
  isHovering: boolean
  isPending: boolean
}

export const BlockContext = createContext<BlockContextType>({} as BlockContextType)

export const useBlockContext = () => {
  const blockContext = useContext(BlockContext)

  return blockContext
}
