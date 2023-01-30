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
import { MosaicContext } from './MosaicContext'

export default function Desktop () {
  const initialNode = {
    direction: 'row',
    first: 1,
    second: 2
  }

  const [currentNode, setCurrentNode] = useState(initialNode)
  const [totalWindowCount, setTotalWindowCount] = useState(
    getLeaves(currentNode).length
  )

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

  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <MosaicContext.Provider value={{addToTopRight}}>
        <header>
          <Header />
        </header>
        <main>
          <Mosaic
            blueprintNamespace='bp4'
            renderTile={(count, path) => (
              <Window
                count={count}
                path={path}
                totalWindowCount={totalWindowCount}
              />
            )}
            zeroStateView={
              <MosaicZeroState createNode={() => totalWindowCount + 1} />
            }
            value={currentNode}
            onChange={onChange}
            onRelease={onRelease}
          />
        </main>
      </MosaicContext.Provider>
    </div>
  )
}
