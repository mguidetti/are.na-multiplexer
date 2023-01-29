import { MosaicWindow } from 'react-mosaic-component'
import BlocksList from './BlocksList'
import { useEffect, useState } from 'react'
import { getBlocks } from '../data/contents'

function Window ({ count, path, totalWindowCount }) {
  const [isLoading, setIsLoading] = useState(true)
  const [blocks, setBlocks] = useState([])

  useEffect(() => {
    const fetchBlocks = async () => {
      const blocks = await getBlocks({ channelName: 'arena-influences' })

      setBlocks(blocks)
      setIsLoading(false)
    }

    fetchBlocks()
  }, [])

  return (
    <MosaicWindow
      title={`Window ${count}`}
      createNode={() => totalWindowCount + 1}
      path={path}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={type => console.log('MosaicWindow.onDragEnd', type)}
    >
      <div className='p-2'>
        <h1>{`Window ${count}`}</h1>
        {isLoading && <div>Loading...</div>}
        {blocks && <BlocksList blocks={blocks} />}
      </div>
    </MosaicWindow>
  )
}

export default Window
