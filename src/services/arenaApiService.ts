/**
 * Arena API Service
 *
 * This service provides an abstraction layer over the arena-ts library,
 * making it easier to migrate to Arena API v3 when it becomes available.
 *
 * Current implementation uses Arena API v2 via arena-ts@1.0.2
 *
 * @see https://github.com/e-e-e/arena-ts
 * @see https://github.com/aredotna/api-docs
 */

import { ArenaClient } from 'arena-ts'
import type {
  PaginationAttributes,
  GetChannelsApiResponse,
  GetChannelContentsApiResponse,
  SearchApiResponse,
  GetUserChannelsApiResponse,
  GetBlockChannelsApiResponse,
  CreateChannelApiResponse,
  ChannelStatus
} from 'arena-ts'

/**
 * Arena API Service Configuration
 */
export interface ArenaApiConfig {
  token?: string | null
}

/**
 * Arena API Service
 *
 * Provides a unified interface for Arena API operations.
 * When migrating to v3, only this service needs to be updated.
 */
export class ArenaApiService {
  private readonly client: ArenaClient
  private readonly apiVersion = 'v2' // Will be updated to 'v3' when available

  constructor (config?: ArenaApiConfig) {
    this.client = new ArenaClient(config)
  }

  /**
   * Get the current API version being used
   */
  getApiVersion (): string {
    return this.apiVersion
  }

  /**
   * Search for channels
   */
  async searchChannels (
    query: string,
    options?: PaginationAttributes
  ): Promise<SearchApiResponse> {
    return this.client.search.channels(query, options)
  }

  /**
   * Get user's channels
   */
  async getUserChannels (
    userId: number | string,
    options?: PaginationAttributes
  ): Promise<GetUserChannelsApiResponse> {
    return this.client.user(userId).channels(options)
  }

  /**
   * Get channel details
   */
  async getChannel (
    slug: string,
    options?: PaginationAttributes
  ): Promise<GetChannelsApiResponse> {
    return this.client.channel(slug).get(options)
  }

  /**
   * Get channel contents (blocks)
   */
  async getChannelContents (
    slug: string,
    options?: PaginationAttributes
  ): Promise<GetChannelContentsApiResponse> {
    return this.client.channel(slug).contents(options)
  }

  /**
   * Get block's connected channels
   */
  async getBlockChannels (
    blockId: number,
    options?: PaginationAttributes
  ): Promise<GetBlockChannelsApiResponse> {
    return this.client.block(blockId).channels(options)
  }

  /**
   * Create a new channel
   */
  async createChannel (
    title: string,
    status?: ChannelStatus
  ): Promise<CreateChannelApiResponse> {
    return this.client.channel(title).create(status)
  }

  /**
   * Get authenticated user information
   */
  async getCurrentUser () {
    return this.client.me()
  }

  /**
   * Get the underlying client (for advanced usage)
   *
   * Note: Direct client access should be avoided when possible
   * to maintain compatibility with future API versions
   */
  getClient (): ArenaClient {
    return this.client
  }
}

/**
 * Create an Arena API service instance
 */
export function createArenaApiService (config?: ArenaApiConfig): ArenaApiService {
  return new ArenaApiService(config)
}
