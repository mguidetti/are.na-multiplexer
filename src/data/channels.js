import arena from './arenaClient'

export async function searchChannels (q) {
  const results = await arena.search.channels(q)

  return results
}
