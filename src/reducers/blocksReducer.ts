import { ChannelContents } from '@/types/arena'

export type BlocksReducerAction =
  | { type: 'append', blocks: ChannelContents[] }
  | { type: 'prepend', blocks: ChannelContents[] }
  | { type: 'update', block: ChannelContents }
  | { type: 'remove', id: number }

function blocksReducer (blocks: ChannelContents[], action: BlocksReducerAction): ChannelContents[] {
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
      return blocks.filter(b => b.id !== action.id)
    }
  }
}

export default blocksReducer
