import { ArenaChannelContents, CreateBlockApiResponse } from 'arena-ts'

export type BlocksReducerAction =
  | { type: 'append', blocks: ArenaChannelContents[] }
  | { type: 'prepend', blocks: ArenaChannelContents[] }
  | { type: 'update', id: number, payload: ArenaChannelContents | CreateBlockApiResponse }
  | { type: 'remove', id: number }

function blocksReducer (blocks: ArenaChannelContents[], action: BlocksReducerAction): ArenaChannelContents[] {
  switch (action.type) {
    case 'append': {
      return [...action.blocks, ...blocks]
    }
    case 'prepend': {
      return [...blocks, ...action.blocks]
    }
    case 'update': {
      return blocks.map(b => (b.id === action.id ? action.payload : b))
    }
    case 'remove': {
      return blocks.filter(b => b.id !== action.id)
    }
  }
}

export default blocksReducer
