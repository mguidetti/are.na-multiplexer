import dropRight from 'lodash/dropRight'
import { Corner, getNodeAtPath, getOtherDirection, getPathToCorner, updateTree } from 'react-mosaic-component'

export const addWindow = (layout, id) => {
  if (layout) {
    const path = getPathToCorner(layout, Corner.TOP_RIGHT)
    const parent = getNodeAtPath(layout, dropRight(path))
    const destination = getNodeAtPath(layout, path)
    const direction = parent ? getOtherDirection(parent.direction) : 'row'
    let first
    let second

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
