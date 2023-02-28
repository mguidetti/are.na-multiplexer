import { ChannelWindowState } from '@/components/Desktop'
import { ArenaChannelContents, ArenaChannelWithDetails } from 'arena-ts'
import { createContext, useContext } from 'react'

export interface WindowContextType {
    canDelete: boolean,
    channel: ArenaChannelWithDetails,
    connectBlock: (block: ArenaChannelContents) => void,
    disconnectBlock: (block: ArenaChannelContents) => void,
    isLoading: boolean,
    loadMore: () => void,
    scale: ChannelWindowState['scale'],
    view: ChannelWindowState['view'],
}

export const WindowContext = createContext<WindowContextType>({} as WindowContextType)

export const useWindowContext = () => {
  const windowContext = useContext(WindowContext)

  return windowContext
}
