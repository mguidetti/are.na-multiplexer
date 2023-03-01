import { Corner, getNodeAtPath, getOtherDirection, getPathToCorner, MosaicNode, MosaicParent, updateTree } from 'react-mosaic-component'
import { MosaicKey } from 'react-mosaic-component/lib/types'

export const addWindow = (layout: MosaicNode<MosaicKey> | null, id: MosaicNode<number>): MosaicNode<MosaicKey> => {
  if (layout) {
    const path = getPathToCorner(layout, Corner.TOP_RIGHT)
    const parent = getNodeAtPath(layout, path.slice(0, -1)) as MosaicParent<number>
    const destination = getNodeAtPath(layout, path) as MosaicNode<number>
    const direction = parent ? getOtherDirection(parent.direction) : 'row'
    let first: MosaicNode<number>
    let second: MosaicNode<number>

    if (direction === 'row') {
      first = destination
      second = id
    } else {
      first = id
      second = destination
    }
    const update = [
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
    ]

    return updateTree(layout, update)
  } else {
    return id
  }
}
