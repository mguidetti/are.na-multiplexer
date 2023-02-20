function channelsReducer (channels, action) {
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
      const { [action.id]: tmp, ...rest } = channels

      return rest
    }
  }
}

export default channelsReducer
