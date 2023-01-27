function Block ({ blockData }) {
  return (
    <div className='border border-red-700 p-4 aspect-square max-w-xs'>
      <img src={blockData.image.thumb.url} />
      {blockData.title}
    </div>
  )
}

export default Block
