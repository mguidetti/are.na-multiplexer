import arena from './arenaClient'

export async function getBlocks ({channelName}) {
  const contents = await arena
    .channel(channelName)
    .contents({ page: 1, per: 3 })

  return contents
}
