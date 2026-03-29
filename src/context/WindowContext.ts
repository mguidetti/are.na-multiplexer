import { ChannelWindowState } from '@/components/Desktop'
import { ArenaChannelContents, ArenaChannel } from '@/types/arena'
import { createContext, useContext } from 'react'

export interface WindowContextType {
    blocks: ArenaChannelContents[],
    canDelete: boolean,
    channel: ArenaChannel,
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
