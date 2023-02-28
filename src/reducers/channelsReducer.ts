import { ChannelsState, ChannelWindowState } from '@/components/Desktop'
import { ArenaChannelWithDetails } from 'arena-ts'

export type ChannelsReducerAction =
  | { type: 'add', channel: ArenaChannelWithDetails }
  | { type: 'update', id: number, payload: Partial<ChannelWindowState>}
  | { type: 'replace', channels: ChannelsState }
  | { type: 'remove', id: number }

function channelsReducer (channels: ChannelsState, action: ChannelsReducerAction): ChannelsState {
  switch (action.type) {
    case 'add': {
      return { ...channels, [action.channel.id]: { data: action.channel, scale: 1, view: 'grid' } }
    }
    case 'update': {
      return { ...channels, [action.id]: { ...channels[action.id], ...action.payload } }
    }
    case 'replace': {
      return action.channels
    }
    case 'remove': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.id]: tmp, ...rest } = channels

      return rest
    }
  }
}

export default channelsReducer
