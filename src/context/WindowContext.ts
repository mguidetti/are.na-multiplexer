import { ChannelWindowState } from '@/components/Desktop'
import { ChannelContents } from '@/types/arena'
import { Channel } from '@aredotna/sdk/api'
import { createContext, useContext } from 'react'

export interface WindowContextType {
    blocks: ChannelContents[],
    canDelete: boolean,
    channel: Channel,
    connectBlock: (block: ChannelContents) => void,
    disconnectBlock: (block: ChannelContents) => void,
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
