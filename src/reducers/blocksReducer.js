function blocksReducer (blocks, action) {
  switch (action.type) {
    case 'append': {
      return [...action.blocks, ...blocks]
    }
    case 'prepend': {
      return [...blocks, ...action.blocks]
    }
    case 'update': {
      return blocks.map(b => (b.id === action.block.id ? action.block : b))
    }
    case 'remove': {
      return blocks.filter(b => b.id !== action.block.id)
    }
  }
}

export default blocksReducer
