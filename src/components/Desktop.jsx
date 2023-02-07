import dropRight from 'lodash/dropRight'
import { useCallback, useMemo, useState } from 'react'
import {
  Corner,
  getLeaves,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  Mosaic,
  updateTree
} from 'react-mosaic-component'
import BlockQuickLook from './BlockQuickLook'
import { DesktopContext } from './DesktopContext'
import Header from './Header'
import Window from './Window'
import ZeroState from './ZeroState'

export default function Desktop () {
  const [currentNode, setCurrentNode] = useState(null)
  const [newTileChannel, setNewTileChannel] = useState(null)
  const [quickLookBlockData, setQuickLookBlockData] = useState(null)

  const onChange = currentNode => {
    setCurrentNode(currentNode)
  }

  const onRelease = currentNode => {
    console.log('Mosaic.onRelease():', currentNode)
  }

  const loadChannel = channel => {
    // TODO: Need to check if channel is already loaded in window on desktop first.

    setNewTileChannel(channel)
    addToTopRight()
  }

  const addToTopRight = useCallback(() => {
    const totalWindowCount = getLeaves(currentNode).length
    let newNode

    if (currentNode) {
      const path = getPathToCorner(currentNode, Corner.TOP_RIGHT)
      const parent = getNodeAtPath(currentNode, dropRight(path))
      const destination = getNodeAtPath(currentNode, path)
      const direction = parent ? getOtherDirection(parent.direction) : 'row'
      let first
      let second

      if (direction === 'row') {
        first = destination
        second = totalWindowCount + 1
      } else {
        first = totalWindowCount + 1
        second = destination
      }

      newNode = updateTree(currentNode, [
        {
          path,
          spec: {
            $set: {
              direction,
              first,
              second
            }
          }
        }
      ])
    } else {
      newNode = totalWindowCount + 1
    }

    setCurrentNode(newNode)
  }, [currentNode])

  const renderTile = (_count, path) => {
    return <Window path={path} channelData={newTileChannel} />
  }

  const contextValues = useMemo(
    () => ({
      loadChannel,
      setQuickLookBlockData
    }),
    [newTileChannel, quickLookBlockData]
  )

  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <DesktopContext.Provider value={contextValues}>
        <header>
          <Header />
        </header>
        <main>
          <Mosaic
            className='arena-multiplexer'
            renderTile={renderTile}
            zeroStateView={<ZeroState />}
            value={currentNode}
            onChange={onChange}
            onRelease={onRelease}
          />
          {quickLookBlockData && <BlockQuickLook blockData={quickLookBlockData} />}
        </main>
      </DesktopContext.Provider>
    </div>
  )
}
