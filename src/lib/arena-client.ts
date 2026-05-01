import { Arena, ArenaOptions, createArena } from '@aredotna/sdk'

export type ArenaClient = Arena

export function createArenaClient (options?: ArenaOptions): Arena {
  return createArena(options)
}
