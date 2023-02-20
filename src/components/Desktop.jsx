import { useArena } from '@/hooks/useArena'
import { addWindow } from '@/lib/mosaic'
import channelsReducer from '@/reducers/channelsReducer'
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Mosaic } from 'react-mosaic-component'
import { v4 as uuidv4 } from 'uuid'
import { DesktopContext } from '../context/DesktopContext'
import BlockViewer from './BlockViewer'
import Dialog from './Dialog'
import Header from './Header'
import Window from './Window'
import ZeroState from './ZeroState'

export default function Desktop () {
  const [channels, dispatchChannels] = useReducer(channelsReducer, {})
  const [layout, setLayout] = useState(null)
  const [blockViewerData, setBlockViewerData] = useState(null)
  const [dialog, setDialog] = useState({ isOpen: false })
  const saveStateKey = 'save-state'
  const [savedLayouts, setSavedLayouts] = useState(JSON.parse(localStorage.getItem(saveStateKey)))
  const [isLoadingLayout, setIsLoadingLayout] = useState(false)

  const arena = useArena()

  useEffect(() => {
    localStorage.setItem(saveStateKey, JSON.stringify(savedLayouts))
  }, [savedLayouts])

  const addChannelWindow = useCallback(
    channel => {
      if (channel.id in channels) {
        console.warn('Attempted to add duplicate channel', action.channel.id)
        return false
      }

      dispatchChannels({ type: 'add', channel: channel })

      const newLayout = addWindow(layout, channel.id)
      setLayout(newLayout)
    },
    [channels]
  )

  const saveLayout = useCallback(
    name => {
      setSavedLayouts({
        ...savedLayouts,
        [uuidv4()]: {
          channels: channels,
          name: name,
          layout: layout,
          version: '1.0.0'
        }
      })
    },
    [channels, layout, savedLayouts]
  )

  const restoreLayout = useCallback(
    async layoutId => {
      setLayout(null)
      setIsLoadingLayout(true)

      const save = savedLayouts[layoutId]

      // Channels are fetched to update any changes made since layout was saved
      // Would be better to do this in a single request.
      const updatedChannels = Object.fromEntries(
        await Promise.all(
          Object.values(save.channels).map(async channel => {
            const result = await arena.channel(channel.data.id).get({ forceRefresh: true })

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
    id => {
      const { [id]: tmp, ...rest } = savedLayouts
      setSavedLayouts(rest)
    },
    [savedLayouts]
  )

  const handleChange = newLayout => {
    setLayout(newLayout)
  }

  const tileRenderer = (id, path) => {
    const channel = channels[id]

    return <Window path={path} channel={channel.data} scale={channel.scale} view={channel.view} />
  }

  const contextValues = useMemo(
    () => ({
      addChannelWindow,
      channels,
      dispatchChannels,
      setBlockViewerData,
      setDialog,
      savedLayouts,
      restoreLayout,
      removeSavedLayout,
      saveLayout
    }),
    [addChannelWindow, channels, dispatchChannels, savedLayouts, restoreLayout, saveLayout, removeSavedLayout]
  )

  return (
    <div id='app' className='flex flex-col w-full h-full overflow-hidden antialiased'>
      <DesktopContext.Provider value={contextValues}>
        <header>
          <Header />
        </header>
        <main className='h-full'>
          <Mosaic
            renderTile={tileRenderer}
            value={layout}
            onChange={handleChange}
            className='arena-multiplexer'
            zeroStateView={<ZeroState isLoadingLayout={isLoadingLayout} />}
          />
        </main>
        <BlockViewer blockData={blockViewerData} />
        <Dialog data={dialog} setDialog={setDialog} />
      </DesktopContext.Provider>
    </div>
  )
}
