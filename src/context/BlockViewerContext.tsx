import { ArenaBlock, ConnectionData } from 'arena-ts'
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

export type BlockViewerState = ArenaBlock & ConnectionData | null

export const BlockViewerContext = createContext<BlockViewerState>({} as BlockViewerState)
export const BlockViewerActionsContext = createContext({} as Dispatch<SetStateAction<BlockViewerState>>)

export const useBlockViewerContext = () => useContext(BlockViewerContext)
export const useBlockViewerActionsContext = () => useContext(BlockViewerActionsContext)

export const BlockViewerContextProvider = ({ children }: {children: ReactNode}) => {
  const [blockViewerData, setBlockViewerData] = useState<BlockViewerState>(null)

  return (
    <BlockViewerContext.Provider value={blockViewerData}>
      <BlockViewerActionsContext.Provider value={setBlockViewerData}>
        {children}
      </BlockViewerActionsContext.Provider>
    </BlockViewerContext.Provider>
  )
}
