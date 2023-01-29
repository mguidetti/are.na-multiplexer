import Block from './Block'

function BlocksList ({ blocks }) {
  return (
    <div className='grid auto-cols-auto gap-4'>
      {blocks.map(block => (
        <Block key={block.id} blockData={block} />
      ))}
    </div>
  )
}

export default BlocksList
