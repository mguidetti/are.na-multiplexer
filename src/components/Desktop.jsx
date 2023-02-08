import { addWindow } from '@/lib/mosaic'
import { useCallback, useMemo, useState } from 'react'
import { Mosaic } from 'react-mosaic-component'
import BlockQuickLook from './BlockQuickLook'
import { DesktopContext } from './DesktopContext'
import Header from './Header'
import Window from './Window'
import ZeroState from './ZeroState'

export default function Desktop () {
  const [channels, setChannels] = useState({})
  const [layout, setLayout] = useState(null)
  const [quickLookBlockData, setQuickLookBlockData] = useState(null)

  const addChannel = useCallback(
    channel => {
      if (channel.id in channels) {
        console.warn('Duplicate channel added', channel.id)
        return
      }

      setChannels(channels => ({ ...channels, [channel.id]: channel }))

      const newLayout = addWindow(layout, channel.id)
      setLayout(newLayout)
    },
    [layout]
  )

  const removeChannel = useCallback(
    id => {
      const { [id]: tmp, ...rest } = channels
      setChannels(rest)
    },
    [channels]
  )

  const handleChange = newLayout => {
    setLayout(newLayout)
  }

  const tileRenderer = (id, path) => {
    return <Window path={path} channel={channels[id]} />
  }

  const contextValues = useMemo(
    () => ({
      addChannel,
      removeChannel,
      setQuickLookBlockData
    }),
    [addChannel, removeChannel]
  )

  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <DesktopContext.Provider value={contextValues}>
        <header>
          <Header />
        </header>
        <main>
          <Mosaic
            renderTile={tileRenderer}
            initialValue={layout}
            onChange={handleChange}
            className='arena-multiplexer'
            zeroStateView={<ZeroState />}
          />
          {quickLookBlockData && <BlockQuickLook blockData={quickLookBlockData} />}
        </main>
      </DesktopContext.Provider>
    </div>
  )
}
