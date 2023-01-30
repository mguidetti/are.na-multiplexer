import Block from './Block'

function BlocksList ({ blocks }) {
  return (
    <div className='grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'>
      {blocks.map(block => (
        <Block key={block.id} blockData={block} />
      ))}
    </div>
  )
}

export default BlocksList
