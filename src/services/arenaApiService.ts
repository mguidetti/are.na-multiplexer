/**
 * Arena API Service
 *
 * This service provides an abstraction layer over the arena-ts client.
 * It centralizes all Arena API interactions, making it easier to:
 * - Update to new API versions (e.g., v2 to v3)
 * - Add error handling and retry logic
 * - Monitor API usage
 * - Mock API calls for testing
 *
 * When Arena API v3 becomes available, update this service to use the new endpoints
 * while maintaining the same interface for the rest of the application.
 */

import { ArenaClient } from 'arena-ts'
import { ArenaV3Client } from './arenaV3Client'

/**
 * Configuration for the Arena API service
 */
export interface ArenaApiConfig {
  token?: string
  apiVersion?: 'v2' | 'v3' // Future-proof for v3
}

/**
 * Arena API Service class
 * Provides a centralized interface for all Arena API operations
 */
export class ArenaApiService {
  private clientV2?: ArenaClient
  private clientV3?: ArenaV3Client
  private readonly apiVersion: string

  constructor (config: ArenaApiConfig = {}) {
    // Currently using v2 via arena-ts by default
    // When v3 is available and ready, change the default to 'v3'
    this.apiVersion = config.apiVersion || 'v2'

    if (this.apiVersion === 'v3') {
      // Use v3 client (stub for now, will be real when v3 is available)
      this.clientV3 = new ArenaV3Client({
        token: config.token
      })
    } else {
      // Use v2 client (current production)
      this.clientV2 = new ArenaClient(config.token ? { token: config.token } : undefined)
    }
  }

  /**
   * Get the current API version being used
   */
  getApiVersion (): string {
    return this.apiVersion
  }

  /**
   * Get the underlying arena-ts v2 client
   * This allows direct access for advanced use cases
   * @deprecated Use the service methods instead for better version compatibility
   */
  getClient (): ArenaClient {
    if (!this.clientV2) {
      throw new Error('v2 client not initialized. Current API version: ' + this.apiVersion)
    }
    return this.clientV2
  }

  // Channel operations
  channel (slug: string) {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.channel(slug)
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.channel(slug)
  }

  channels (options?: Record<string, unknown>) {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.channels(options)
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.channels(options)
  }

  // Block operations
  block (id: number) {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.block(id)
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.block(id)
  }

  // User operations
  user (id: string | number) {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.user(id)
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.user(id)
  }

  me () {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.me()
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.me()
  }

  // Search operations
  getSearch () {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.getSearch()
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.search
  }

  // Group operations
  group (slug: string) {
    if (this.apiVersion === 'v3' && this.clientV3) {
      return this.clientV3.group(slug)
    }
    if (!this.clientV2) {
      throw new Error('v2 client not initialized')
    }
    return this.clientV2.group(slug)
  }
}

/**
 * Create an Arena API service instance
 * @param config - Configuration options
 * @returns ArenaApiService instance
 */
export function createArenaApiService (config: ArenaApiConfig = {}): ArenaApiService {
  return new ArenaApiService(config)
}
