import { useState } from 'react'
import { Mosaic, MosaicZeroState, getLeaves } from 'react-mosaic-component'
import Window from './Window'

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

  return (
    <Mosaic
      blueprintNamespace='bp4'
      renderTile={(count, path) => (
        <Window count={count} path={path} totalWindowCount={totalWindowCount} />
      )}
      zeroStateView={
        <MosaicZeroState createNode={() => totalWindowCount + 1} />
      }
      value={currentNode}
      onChange={onChange}
      onRelease={onRelease}
    />
  )
}
