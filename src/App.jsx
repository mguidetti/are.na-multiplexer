import React, { useState } from 'react'
import { Mosaic, MosaicZeroState, getLeaves } from 'react-mosaic-component'
import Window from './components/Window'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import 'react-mosaic-component/react-mosaic-component.css'
import './index.css'
import ChannelLoader from './components/ChannelLoader'

function Desktop () {
  const initialNode = {
    direction: 'row',
    first: 1,
    second: 2
  }

  const [currentNode, setCurrentNode] = useState(initialNode)
  const [splitPercentage, setSplitPercentage] = useState(40)
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

function Header () {
  return (
    <div className='flex gap-x-4 p-2'>
      <div className='w-32'>Are.na Shelf</div>
      <div className='flex-1 flex justify-center'>
        <ChannelLoader />
      </div>
      <div className='w-32 text-right'>@</div>
    </div>
  )
}

function App () {
  return (
    <div id='app' className='flex w-full h-full flex-col'>
      <header>
        <Header />
      </header>
      <main>
        <Desktop />
      </main>
    </div>
  )
}

export default App
