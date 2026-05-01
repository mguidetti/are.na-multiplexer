import { ChannelsState, SavedLayoutsState } from '@/components/Desktop'
import { ChannelsReducerAction } from '@/reducers/channelsReducer'
import { Channel } from '@aredotna/sdk/api'
import { createContext, Dispatch, ReactNode, useContext } from 'react'

export interface DesktopContextType {
  channels: ChannelsState,
  savedLayouts: SavedLayoutsState,
}

export interface DesktopActionsContextType {
  addChannelWindow: (channel: Channel) => void,
  dispatchChannels: Dispatch<ChannelsReducerAction>,
  restoreLayout: (layoutId: string) => Promise<void>,
  removeSavedLayout: (id: string) => void,
  saveLayout: (name: string) => void
}

export const DesktopContext = createContext<DesktopContextType>({} as DesktopContextType)
export const DesktopActionsContext = createContext<DesktopActionsContextType>({} as DesktopActionsContextType)

export const useDesktopContext = () => useContext(DesktopContext)
export const useDesktopActionsContext = () => useContext(DesktopActionsContext)

export const DesktopContextProvider = (
  { children, contextValue, actionsContextValue }: {children: ReactNode, contextValue: DesktopContextType, actionsContextValue: DesktopActionsContextType}
) => {
  return (
    <DesktopContext.Provider value={contextValue}>
      <DesktopActionsContext.Provider value={actionsContextValue}>
        {children}
      </DesktopActionsContext.Provider>
    </DesktopContext.Provider>
  )
}
