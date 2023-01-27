import { Suspense } from 'react'
import { getBlocks } from '../data/contents'
import wrapPromise from '../data/wrapPromise'
import Block from './Block'

export const fetchBlocks = () => {
  return wrapPromise(getBlocks())
}

function BlocksListContainer ({ resource }) {
  const blocks = resource.read()

  return (
    <div className='grid auto-cols-auto	 gap-4'>
      {blocks.map(block => (
        <Block key={block.id} blockData={block} />
      ))}
    </div>
  )
}

function BlocksList () {
  return (
    <Suspense fallback={<div>Loading!</div>}>
      <BlocksListContainer resource={fetchBlocks()} />
    </Suspense>
  )
}

export default BlocksList
