function Block ({ blockData }) {
  return (
    <div className='border border-red-700 p-2 aspect-square w-32'>
      <img src={blockData.image.thumb.url} />
      <p className='truncate'>{blockData.title}</p>
    </div>
  )
}

export default Block
