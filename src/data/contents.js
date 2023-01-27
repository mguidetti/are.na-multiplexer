import arena from './arenaClient'

export async function getBlocks () {

  const contents = await arena
    .channel('arena-influences')
    .contents({ page: 1, per: 3 })

  return contents
}