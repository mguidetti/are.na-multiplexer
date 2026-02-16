// Type definitions for normalized Are.na v3 API responses.
// The normalizer in arena-client.ts maps v3 fields back to these shapes,
// which preserve the field names used throughout the app (originally from v2).

/* eslint-disable no-use-before-define */

export type ChannelStatus = 'public' | 'closed' | 'private'

export type ArenaUser = {
  id: number
  slug: string
  /** Display name (v3 "name", mapped to v2 "username") */
  username: string
  first_name: string
  last_name: string
  avatar: string | null
  avatar_image: { display: string; thumb: string } | null
  channel_count: number
  following_count: number
  profile_id: number
  follower_count: number
  class: 'User'
  initials: string
}

export type ArenaUserWithDetails = ArenaUser & {
  can_index: boolean
  badge: null | string
  created_at: string
  is_confirmed: boolean
  is_lifetime_premium: boolean
  is_pending_confirmation: boolean
  is_pending_reconfirmation: boolean
  is_premium: boolean
  is_supporter: boolean
  metadata: { description: null | string }
}

export type ArenaImage = {
  filename: string
  content_type: string
  updated_at: string
  thumb: { url: string }
  display: { url: string }
  large: { url: string }
  square: { url: string }
  original: {
    file_size: number
    file_size_display: string
    url: string
  }
}

export type ArenaAttachment = {
  content_type: string | null
  extension: string | null
  file_name: string | null
  file_size: number | null
  file_size_display: string | null
  url: string
}

export type ArenaEmbed = {
  author_name: string | null
  author_url: string | null
  height: number | null
  html: string | null
  source_url: string | null
  thumbnail_url: string | null
  title: string | null
  type: string | null
  url: string | null
  width: number | null
}

export type ArenaBlock = {
  id: number
  title: string | null
  updated_at: string
  created_at: string
  state: string
  visibility?: string
  comment_count: number
  /** v2 compat: same as title (v3 removed generated_title) */
  generated_title: string
  /** v2 compat: mapped from v3 "type" (Embed→Media) */
  class: 'Image' | 'Text' | 'Link' | 'Media' | 'Attachment'
  base_class: 'Block'
  content: string | null
  content_html: string | null
  description: string | null
  description_html: string | null
  source: {
    title?: string
    url: string
    provider: { url: string; name: string } | null
  } | null
  image: ArenaImage | null
  user: ArenaUserWithDetails
  attachment?: ArenaAttachment | null
  embed?: ArenaEmbed | null
  connections?: ArenaChannel[]
}

export type ConnectionData = {
  position: number
  selected: boolean
  connected_at: string
  connected_by_user_id: number
  connection_id?: number
  connected_by_username?: string
  connected_by_user_slug?: string
}

export type ArenaChannel = {
  id: number
  title: string
  created_at: string
  updated_at: string
  added_to_at?: string
  published: boolean
  open: boolean
  collaboration: boolean
  slug: string
  length: number
  kind: 'default' | 'profile'
  status: ChannelStatus
  state: string
  'nsfw?': boolean
  metadata: { description: null | string } | null
  user_id: number
  class: 'Channel'
  base_class: 'Channel'
}

export type ArenaChannelWithDetails = ArenaChannel & {
  id: number
  user?: ArenaUserWithDetails
  follower_count: number
  can_index: boolean
  contents: ReadonlyArray<ArenaChannelContents> | null
  owner_type: string
  owner_id: string
  owner_slug?: string
}

export type ArenaChannelContents = (ArenaBlock | ArenaChannelWithDetails) & ConnectionData

export type PaginationMeta = {
  current_page: number
  next_page: number | null
  prev_page: number | null
  per_page: number
  total_pages: number
  total_count: number
  has_more_pages: boolean
}
