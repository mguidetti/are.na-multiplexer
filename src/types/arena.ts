import type { components } from '@/types/arena.generated'

// Core domain types aliased from generated OpenAPI schemas
export type ArenaUser = components['schemas']['User']
export type ArenaEmbeddedUser = components['schemas']['EmbeddedUser']
export type ArenaChannel = components['schemas']['Channel']
export type ArenaBlock = components['schemas']['Block']
export type ArenaBlockImage = components['schemas']['BlockImage']
export type ArenaImageVersion = components['schemas']['ImageVersion']
export type ArenaMarkdownContent = components['schemas']['MarkdownContent']
export type ArenaEmbeddedConnection = components['schemas']['EmbeddedConnection']
export type ArenaChannelOwner = components['schemas']['ChannelOwner']
export type PaginationMeta = components['schemas']['PaginationMeta']

// Enum types
export type UserTier = components['schemas']['UserTier']
export type UserBadge = components['schemas']['UserBadge']
export type ChannelVisibility = components['schemas']['ChannelVisibility']

// App-specific union: contents of a channel are blocks or nested channels
export type ArenaChannelContents = ArenaBlock | ArenaChannel
