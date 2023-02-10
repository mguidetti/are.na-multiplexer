import { addWindow } from '@/lib/mosaic'
import { useCallback, useMemo, useState } from 'react'
import { Mosaic } from 'react-mosaic-component'
import BlockViewer from './BlockViewer'
import { DesktopContext } from '../context/DesktopContext'
import Header from './Header'
import Window from './Window'
import ZeroState from './ZeroState'

export default function Desktop () {
  const [channels, setChannels] = useState({})
  const [layout, setLayout] = useState(null)
  const [blockViewerData, setBlockViewerData] = useState(null)

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
    [channels]
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
      setBlockViewerData
    }),
    [addChannel, removeChannel]
  )

  return (
    <div id='app' className='flex w-full h-full flex-col overflow-hidden antialiased'>
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
            zeroStateView={<ZeroState />}
          />
          <BlockViewer blockData={blockViewerData} />
        </main>
      </DesktopContext.Provider>
    </div>
  )
}
