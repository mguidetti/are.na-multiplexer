import { ChannelContents } from '@/types/arena'
import { createContext, useContext } from 'react'

export interface BlockContextType {
  data: ChannelContents,
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
