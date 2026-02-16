import {
  ArenaBlock,
  ArenaChannelContents,
  ArenaChannelWithDetails,
  ArenaImage,
  ArenaUserWithDetails,
  ConnectionData,
  PaginationMeta
} from '@/types/arena'

const BASE_URL = 'https://api.are.na/v3'

// ── Normalizers (v3 → v2-compatible shapes) ─────────────────────────────

function normalizeUser (raw: Record<string, unknown>): ArenaUserWithDetails {
  return {
    id: raw.id as number,
    slug: raw.slug as string,
    username: raw.name as string,
    first_name: (raw.name as string)?.split(' ')[0] ?? '',
    last_name: (raw.name as string)?.split(' ').slice(1).join(' ') ?? '',
    avatar: raw.avatar as string | null,
    avatar_image: raw.avatar ? { display: raw.avatar as string, thumb: raw.avatar as string } : null,
    channel_count: (raw.counts as Record<string, number>)?.channels ?? 0,
    following_count: (raw.counts as Record<string, number>)?.following ?? 0,
    profile_id: 0,
    follower_count: (raw.counts as Record<string, number>)?.followers ?? 0,
    class: 'User',
    initials: raw.initials as string,
    can_index: true,
    badge: null,
    created_at: raw.created_at as string ?? '',
    is_confirmed: true,
    is_lifetime_premium: false,
    is_pending_confirmation: false,
    is_pending_reconfirmation: false,
    is_premium: false,
    is_supporter: false,
    metadata: { description: null }
  }
}

function normalizeEmbeddedUser (raw: Record<string, unknown>): ArenaUserWithDetails {
  return normalizeUser(raw)
}

function normalizeImage (raw: Record<string, unknown>): ArenaImage {
  const small = raw.small as Record<string, unknown> | undefined
  const medium = raw.medium as Record<string, unknown> | undefined
  const large = raw.large as Record<string, unknown> | undefined
  const square = raw.square as Record<string, unknown> | undefined

  return {
    filename: raw.filename as string ?? '',
    content_type: raw.content_type as string ?? '',
    updated_at: raw.updated_at as string ?? '',
    thumb: { url: small?.src as string ?? '' },
    display: { url: medium?.src as string ?? '' },
    large: { url: large?.src as string ?? '' },
    square: { url: square?.src as string ?? '' },
    original: {
      file_size: raw.file_size as number ?? 0,
      file_size_display: '',
      url: large?.src as string ?? ''
    }
  }
}

function normalizeConnectionData (raw: Record<string, unknown> | null | undefined): Partial<ConnectionData> {
  if (!raw) return {}

  const connectedBy = raw.connected_by as Record<string, unknown> | null

  return {
    position: raw.position as number ?? 0,
    selected: raw.pinned as boolean ?? false,
    connected_at: raw.connected_at as string ?? '',
    connected_by_user_id: connectedBy?.id as number ?? 0,
    connection_id: raw.id as number,
    connected_by_username: connectedBy?.name as string,
    connected_by_user_slug: connectedBy?.slug as string
  }
}

function normalizeBlock (raw: Record<string, unknown>): ArenaBlock & Partial<ConnectionData> {
  const rawType = raw.type as string
  // v3 uses "Embed" where v2 used "Media"
  const blockClass = rawType === 'Embed' ? 'Media' : rawType

  const rawImage = raw.image as Record<string, unknown> | null
  const rawUser = raw.user as Record<string, unknown>
  const rawSource = raw.source as Record<string, unknown> | null
  const rawEmbed = raw.embed as Record<string, unknown> | null
  const rawAttachment = raw.attachment as Record<string, unknown> | null
  const rawConnection = raw.connection as Record<string, unknown> | null

  // v3 content is a MarkdownContent object for text blocks
  const rawContent = raw.content as Record<string, unknown> | string | null
  let contentStr: string | null = null
  let contentHtml: string | null = null
  if (rawContent && typeof rawContent === 'object') {
    contentStr = rawContent.markdown as string | null ?? null
    contentHtml = rawContent.html as string | null ?? null
  } else if (typeof rawContent === 'string') {
    contentStr = rawContent
  }

  // v3 description is a MarkdownContent object
  const rawDesc = raw.description as Record<string, unknown> | string | null
  let descStr: string | null = null
  let descHtml: string | null = null
  if (rawDesc && typeof rawDesc === 'object') {
    descStr = rawDesc.plain as string | null ?? rawDesc.markdown as string | null ?? null
    descHtml = rawDesc.html as string | null ?? null
  } else if (typeof rawDesc === 'string') {
    descStr = rawDesc
  }

  const block: ArenaBlock & Partial<ConnectionData> = {
    id: raw.id as number,
    title: raw.title as string | null,
    updated_at: raw.updated_at as string,
    created_at: raw.created_at as string,
    state: raw.state as string,
    visibility: raw.visibility as string | undefined,
    comment_count: raw.comment_count as number ?? 0,
    generated_title: (raw.title as string) || 'Untitled',
    class: blockClass as ArenaBlock['class'],
    base_class: 'Block',
    content: contentStr,
    content_html: contentHtml,
    description: descStr,
    description_html: descHtml,
    source: rawSource
      ? {
          url: rawSource.url as string,
          title: rawSource.title as string | undefined,
          provider: rawSource.provider as { url: string; name: string } | null ?? null
        }
      : null,
    image: rawImage ? normalizeImage(rawImage) : null,
    user: normalizeEmbeddedUser(rawUser),
    attachment: rawAttachment
      ? {
          content_type: rawAttachment.content_type as string | null,
          extension: rawAttachment.file_extension as string | null,
          file_name: rawAttachment.filename as string | null,
          file_size: rawAttachment.file_size as number | null,
          file_size_display: null,
          url: rawAttachment.url as string
        }
      : null,
    embed: rawEmbed
      ? {
          author_name: rawEmbed.author_name as string | null,
          author_url: rawEmbed.author_url as string | null,
          height: rawEmbed.height as number | null,
          html: rawEmbed.html as string | null,
          source_url: rawEmbed.source_url as string | null,
          thumbnail_url: rawEmbed.thumbnail_url as string | null,
          title: rawEmbed.title as string | null,
          type: rawEmbed.type as string | null,
          url: rawEmbed.url as string | null,
          width: rawEmbed.width as number | null
        }
      : null,
    ...normalizeConnectionData(rawConnection)
  }

  return block
}

function normalizeChannel (raw: Record<string, unknown>): ArenaChannelWithDetails & Partial<ConnectionData> {
  const rawOwner = raw.owner as Record<string, unknown>
  const rawCounts = raw.counts as Record<string, number> | undefined
  const rawCan = raw.can as Record<string, boolean> | null | undefined
  const rawConnection = raw.connection as Record<string, unknown> | null
  const rawDesc = raw.description as Record<string, unknown> | string | null

  let descriptionStr: string | null = null
  if (rawDesc && typeof rawDesc === 'object') {
    descriptionStr = rawDesc.plain as string | null ?? rawDesc.markdown as string | null ?? null
  } else if (typeof rawDesc === 'string') {
    descriptionStr = rawDesc
  }

  const visibility = raw.visibility as string
  const ownerUser = normalizeEmbeddedUser(rawOwner)

  const channel: ArenaChannelWithDetails & Partial<ConnectionData> = {
    id: raw.id as number,
    title: raw.title as string,
    created_at: raw.created_at as string,
    updated_at: raw.updated_at as string,
    published: visibility !== 'private',
    open: rawCan?.add_to ?? false,
    collaboration: (rawCounts?.collaborators ?? 0) > 0,
    slug: raw.slug as string,
    length: rawCounts?.contents ?? 0,
    kind: 'default',
    status: visibility as ArenaChannelWithDetails['status'],
    state: raw.state as string ?? 'available',
    'nsfw?': false,
    metadata: descriptionStr ? { description: descriptionStr } : null,
    user_id: rawOwner.id as number,
    class: 'Channel',
    base_class: 'Channel',
    user: ownerUser,
    follower_count: 0,
    can_index: true,
    contents: null,
    owner_type: rawOwner.type as string ?? 'User',
    owner_id: String(rawOwner.id),
    owner_slug: rawOwner.slug as string,
    ...normalizeConnectionData(rawConnection)
  }

  return channel
}

function normalizeConnectable (raw: Record<string, unknown>): ArenaChannelContents {
  if (raw.type === 'Channel') {
    return normalizeChannel(raw) as unknown as ArenaChannelContents
  }
  return normalizeBlock(raw) as unknown as ArenaChannelContents
}

// ── API Client ──────────────────────────────────────────────────────────

export class ArenaClient {
  private token?: string

  constructor (options?: { token?: string }) {
    this.token = options?.token
  }

  private async request<T> (path: string, init?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { ...headers, ...init?.headers as Record<string, string> }
    })

    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Are.na API error ${res.status}: ${body}`)
    }

    if (res.status === 204) return undefined as T

    return res.json()
  }

  // ── Channel endpoints ───────────────────────────────────────────────

  async getChannel (idOrSlug: string | number): Promise<ArenaChannelWithDetails> {
    const raw = await this.request<Record<string, unknown>>(`/channels/${idOrSlug}`)
    return normalizeChannel(raw)
  }

  async getChannelContents (
    idOrSlug: string | number,
    opts: { page?: number; per?: number } = {}
  ): Promise<{ contents: ArenaChannelContents[]; meta: PaginationMeta }> {
    const params = new URLSearchParams()
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))
    const qs = params.toString() ? `?${params}` : ''

    const raw = await this.request<{ data: Record<string, unknown>[]; meta: PaginationMeta }>(
      `/channels/${idOrSlug}/contents${qs}`
    )

    return {
      contents: raw.data.map(normalizeConnectable),
      meta: raw.meta
    }
  }

  async createChannel (
    title: string,
    visibility: string
  ): Promise<ArenaChannelWithDetails> {
    const raw = await this.request<Record<string, unknown>>('/channels', {
      method: 'POST',
      body: JSON.stringify({ title, visibility })
    })
    return normalizeChannel(raw)
  }

  // ── Search ──────────────────────────────────────────────────────────

  async searchChannels (
    query: string,
    opts: { page?: number; per?: number } = {}
  ): Promise<{ channels: ArenaChannelWithDetails[] }> {
    const params = new URLSearchParams({ query, type: 'Channel' })
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))

    const raw = await this.request<{ data: Record<string, unknown>[]; meta: PaginationMeta }>(
      `/search?${params}`
    )

    return {
      channels: raw.data.map(ch => normalizeChannel(ch))
    }
  }

  // ── User endpoints ─────────────────────────────────────────────────

  async getUserChannels (
    userId: string | number,
    opts: { page?: number; per?: number; sort?: string } = {}
  ): Promise<{ channels: ArenaChannelWithDetails[]; total_pages: number }> {
    const params = new URLSearchParams({ type: 'Channel' })
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))
    if (opts.sort) params.set('sort', opts.sort)

    const raw = await this.request<{ data: Record<string, unknown>[]; meta: PaginationMeta }>(
      `/users/${userId}/contents?${params}`
    )

    return {
      channels: raw.data.map(ch => normalizeChannel(ch)),
      total_pages: raw.meta.total_pages
    }
  }

  // ── Connection endpoints ───────────────────────────────────────────

  async createConnection (
    connectableId: number,
    connectableType: 'Block' | 'Channel',
    channelIds: number[]
  ): Promise<{ data: Array<{ id: number }> }> {
    return this.request('/connections', {
      method: 'POST',
      body: JSON.stringify({
        connectable_id: connectableId,
        connectable_type: connectableType,
        channel_ids: channelIds
      })
    })
  }

  async deleteConnection (connectionId: number): Promise<void> {
    await this.request(`/connections/${connectionId}`, { method: 'DELETE' })
  }

  // ── Block endpoints ────────────────────────────────────────────────

  async getBlockConnections (
    blockId: number
  ): Promise<{ channels: ArenaChannelWithDetails[] }> {
    const raw = await this.request<{ data: Record<string, unknown>[] }>(
      `/blocks/${blockId}/connections`
    )

    return {
      channels: raw.data.map(ch => normalizeChannel(ch))
    }
  }
}
