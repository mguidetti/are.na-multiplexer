import dropRight from 'lodash/dropRight'
import { useState } from 'react'
import {
  Corner,
  getLeaves,
  getNodeAtPath,
  getOtherDirection,
  getPathToCorner,
  Mosaic,
  MosaicZeroState,
  updateTree
} from 'react-mosaic-component'
import Header from './Header'
import Window from './Window'
import { DesktopContext } from './DesktopContext'
import BlockQuickLook from './BlockQuickLook'

export default function Desktop () {
  const [currentNode, setCurrentNode] = useState(null)
  const [newTileChannelId, setNewTileChannelId] = useState(null)
  const [quickLookBlockData, setQuickLookBlockData] = useState(null)

  const onChange = currentNode => {
    setCurrentNode(currentNode)
  }

  const onRelease = currentNode => {
    console.log('Mosaic.onRelease():', currentNode)
  }

  const addToTopRight = () => {
    const totalWindowCount = getLeaves(currentNode).length
    var newNode

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
  }

  const renderTile = (count, path) => {
    return <Window path={path} channelId={newTileChannelId} />
  }

  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <DesktopContext.Provider value={{ addToTopRight, setNewTileChannelId, setQuickLookBlockData }}>
        <header>
          <Header />
        </header>
        <main>
          <Mosaic
            className='arena-shelf'
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

function ZeroState () {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center text-primary/25'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        strokeWidth='1'
        stroke='currentColor'
        className='w-24 h-24'
      >
        <path d='M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z' />
      </svg>
      <p className='text-center mt-8 text-'>
        No Channels Loaded
      </p>
    </div>
  )
}
