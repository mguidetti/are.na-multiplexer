import { ChannelContents } from '@/types/arena'
import { Block } from '@aredotna/sdk/api'
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'

export interface BlockViewerState {
  block: Block
  blocks: ChannelContents[]
}

interface BlockViewerActions {
  open: (block: Block, blocks: ChannelContents[]) => void
  close: () => void
  next: () => void
  prev: () => void
}

const BlockViewerContext = createContext<BlockViewerState | null>(null)
const BlockViewerActionsContext = createContext<BlockViewerActions>({} as BlockViewerActions)

export const useBlockViewerContext = () => useContext(BlockViewerContext)
export const useBlockViewerActionsContext = () => useContext(BlockViewerActionsContext)

export const BlockViewerContextProvider = ({ children }: {children: ReactNode}) => {
  const [state, setState] = useState<BlockViewerState | null>(null)

  const open = useCallback((block: Block, blocks: ChannelContents[]) => {
    setState({ block, blocks })
  }, [])

  const close = useCallback(() => setState(null), [])

  const next = useCallback(() => {
    setState(prev => {
      if (!prev) return null
      const blockItems = prev.blocks.filter(b => b.type !== 'Channel') as Block[]
      const idx = blockItems.findIndex(b => b.id === prev.block.id)
      if (idx < 0 || idx >= blockItems.length - 1) return prev
      return { ...prev, block: blockItems[idx + 1] }
    })
  }, [])

  const prev = useCallback(() => {
    setState(prevState => {
      if (!prevState) return null
      const blockItems = prevState.blocks.filter(b => b.type !== 'Channel') as Block[]
      const idx = blockItems.findIndex(b => b.id === prevState.block.id)
      if (idx <= 0) return prevState
      return { ...prevState, block: blockItems[idx - 1] }
    })
  }, [])

  const actions = useMemo(() => ({ open, close, next, prev }), [open, close, next, prev])

  return (
    <BlockViewerContext.Provider value={state}>
      <BlockViewerActionsContext.Provider value={actions}>
        {children}
      </BlockViewerActionsContext.Provider>
    </BlockViewerContext.Provider>
  )
}
