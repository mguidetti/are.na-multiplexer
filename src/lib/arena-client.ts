import type {
  ArenaChannel,
  ArenaChannelContents,
  PaginationMeta
} from '@/types/arena'

const BASE_URL = 'https://api.are.na/v3'

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

  async getChannel (idOrSlug: string | number): Promise<ArenaChannel> {
    return this.request<ArenaChannel>(`/channels/${idOrSlug}`)
  }

  async getChannelContents (
    idOrSlug: string | number,
    opts: { page?: number; per?: number; sort?: string } = {}
  ): Promise<{ contents: ArenaChannelContents[]; meta: PaginationMeta }> {
    const params = new URLSearchParams()
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))
    if (opts.sort) params.set('sort', opts.sort)
    const qs = params.toString() ? `?${params}` : ''

    const raw = await this.request<{ data: ArenaChannelContents[]; meta: PaginationMeta }>(
      `/channels/${idOrSlug}/contents${qs}`
    )

    return { contents: raw.data, meta: raw.meta }
  }

  async createChannel (
    title: string,
    visibility: string
  ): Promise<ArenaChannel> {
    return this.request<ArenaChannel>('/channels', {
      method: 'POST',
      body: JSON.stringify({ title, visibility })
    })
  }

  // ── Search ──────────────────────────────────────────────────────────

  async searchChannels (
    query: string,
    opts: { page?: number; per?: number; sort?: string; scope?: string } = {}
  ): Promise<{ channels: ArenaChannel[]; meta: PaginationMeta }> {
    const params = new URLSearchParams({ query, type: 'Channel' })
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))
    if (opts.sort) params.set('sort', opts.sort)
    if (opts.scope) params.set('scope', opts.scope)

    const raw = await this.request<{ data: ArenaChannel[]; meta: PaginationMeta }>(
      `/search?${params}`
    )

    return { channels: raw.data, meta: raw.meta }
  }

  // ── User endpoints ─────────────────────────────────────────────────

  async getUserChannels (
    userId: string | number,
    opts: { page?: number; per?: number; sort?: string } = {}
  ): Promise<{ channels: ArenaChannel[]; total_pages: number }> {
    const params = new URLSearchParams({ type: 'Channel' })
    if (opts.page) params.set('page', String(opts.page))
    if (opts.per) params.set('per', String(opts.per))
    if (opts.sort) params.set('sort', opts.sort)

    const raw = await this.request<{ data: ArenaChannel[]; meta: PaginationMeta }>(
      `/users/${userId}/contents?${params}`
    )

    return { channels: raw.data, total_pages: raw.meta.total_pages }
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
  ): Promise<{ channels: ArenaChannel[] }> {
    const raw = await this.request<{ data: ArenaChannel[] }>(
      `/blocks/${blockId}/connections`
    )

    return { channels: raw.data }
  }
}
