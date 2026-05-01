import type { ConnectableList } from '@aredotna/sdk/api'

// Members of /channels/:id/contents — blocks (excluding PendingBlock) and
// nested channels. Defined here because the SDK doesn't ship a single named
// type for the union (only the wrapper `ConnectableList`).
export type ChannelContents = ConnectableList['data'][number]
