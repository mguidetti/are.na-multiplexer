import { BlockViewerState, ChannelsState, SavedLayoutsState } from '@/components/Desktop'
import { ChannelsReducerAction } from '@/reducers/channelsReducer'
import { ArenaChannelWithDetails } from 'arena-ts'
import { createContext, Dispatch, SetStateAction, useContext } from 'react'

export interface DesktopContextType {
  addChannelWindow: (channel: ArenaChannelWithDetails) => void,
  channels: ChannelsState,
  dispatchChannels: Dispatch<ChannelsReducerAction>,
  setBlockViewerData: Dispatch<SetStateAction<BlockViewerState>>,
  savedLayouts: SavedLayoutsState,
  restoreLayout: (layoutId: string) => Promise<void>,
  removeSavedLayout: (id: string) => void,
  saveLayout: (name: string) => void
}

export const DesktopContext = createContext<DesktopContextType>({} as DesktopContextType)

export const useDesktopContext = () => {
  const desktopContext = useContext(DesktopContext)

  return desktopContext
}
