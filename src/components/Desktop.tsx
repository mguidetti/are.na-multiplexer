import { useArena } from '@/hooks/useArena'
import { addWindow } from '@/lib/mosaic'
import channelsReducer from '@/reducers/channelsReducer'
import { ArenaChannelWithDetails } from 'arena-ts'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Mosaic, MosaicNode } from 'react-mosaic-component'
import { MosaicKey, MosaicPath } from 'react-mosaic-component/lib/types'
import { v4 as uuidv4 } from 'uuid'
import { DesktopActionsContextType, DesktopContextProvider, DesktopContextType } from '../context/DesktopContext'
import BlockDndWrapper from './BlockDndWrapper'
import Header from './Header'
import Window from './Window'
import ZeroState from './ZeroState'

export interface ChannelWindowState {
    data: ArenaChannelWithDetails,
    scale: number
    view: 'grid' | 'list'
}

export interface ChannelsState {
  [key: number]: ChannelWindowState
}

export type LayoutState = MosaicNode<MosaicKey> | null

export interface SavedLayoutsState {
  [key: string]: {
    channels: ChannelsState,
    name: string,
    layout: LayoutState,
    version: string
  }
}

export default function Desktop () {
  const [channels, dispatchChannels] = useReducer(channelsReducer, {})
  const [layout, setLayout] = useState<LayoutState>(null)
  const saveStateKey = 'save-state'
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutsState>(
    JSON.parse(localStorage.getItem(saveStateKey) || '{}')
  )
  const [isLoadingLayout, setIsLoadingLayout] = useState(false)

  const arena = useArena()

  useEffect(() => {
    localStorage.setItem(saveStateKey, JSON.stringify(savedLayouts))
  }, [savedLayouts])

  const addChannelWindow = useCallback(
    (channel: ArenaChannelWithDetails): void => {
      if (channel.id in channels) {
        console.warn('Attempted to add duplicate channel', channel.id)
        return
      }

      dispatchChannels({ type: 'add', channel })

      const newLayout = addWindow(layout, channel.id)
      setLayout(newLayout)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channels]
  )

  const saveLayout = useCallback(
    (name: string) => {
      setSavedLayouts({
        ...savedLayouts,
        [uuidv4()]: {
          channels,
          name,
          layout,
          version: '1.0.0'
        }
      })
    },
    [channels, layout, savedLayouts]
  )

  const restoreLayout = useCallback(
    async (layoutId: string) => {
      if (!arena) return

      setLayout(null)
      setIsLoadingLayout(true)

      const save = savedLayouts[layoutId]

      // Channels are fetched to update any changes made since layout was saved
      // Would be better to do this in a single request.
      const updatedChannels = Object.fromEntries(
        await Promise.all(
          Object.values(save.channels).map(async channel => {
            const result = await arena
              .channel(channel.data.id)
              .get({ forceRefresh: true })

            return [result.id, { ...channel, data: result }]
          })
        )
      )

      dispatchChannels({ type: 'replace', channels: updatedChannels })
      setLayout(save.layout)
      setIsLoadingLayout(false)
    },
    [arena, savedLayouts]
  )

  const removeSavedLayout = useCallback(
    (id: string): void => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: tmp, ...rest } = savedLayouts
      setSavedLayouts(rest)
    },
    [savedLayouts]
  )

  const handleChange = (newLayout: MosaicNode<MosaicKey> | null): void => {
    setLayout(newLayout)
  }

  const tileRenderer = (id: MosaicKey, path: MosaicPath) => {
    const windowData: ChannelWindowState = channels[id as number]

    return (
      <Window
        path={path}
        data={windowData}
      />
    )
  }

  const contextValues: DesktopContextType = useMemo(
    () => ({
      channels,
      savedLayouts
    }),
    [
      channels,
      savedLayouts
    ]
  )

  const actionContextValues: DesktopActionsContextType = useMemo(
    () => ({
      addChannelWindow,
      dispatchChannels,
      restoreLayout,
      removeSavedLayout,
      saveLayout
    }),
    [
      addChannelWindow,
      dispatchChannels,
      restoreLayout,
      saveLayout,
      removeSavedLayout
    ]
  )

  return (
    <DesktopContextProvider contextValue={contextValues} actionsContextValue={actionContextValues}>
      <header>
        <Header />
      </header>
      <main className='h-full'>
        <BlockDndWrapper>
          <Mosaic
            renderTile={tileRenderer}
            value={layout}
            onChange={handleChange}
            className={''}
            zeroStateView={<ZeroState isLoadingLayout={isLoadingLayout} />}
          />
        </BlockDndWrapper>
      </main>
    </DesktopContextProvider>
  )
}
