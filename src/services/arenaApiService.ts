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
  private client: ArenaClient
  private readonly apiVersion: string

  constructor (config: ArenaApiConfig = {}) {
    // Currently using v2 via arena-ts
    // When v3 is available, this initialization will need to be updated
    this.apiVersion = config.apiVersion || 'v2'
    this.client = new ArenaClient(config.token ? { token: config.token } : undefined)
  }

  /**
   * Get the current API version being used
   */
  getApiVersion (): string {
    return this.apiVersion
  }

  /**
   * Get the underlying arena-ts client
   * This allows direct access for advanced use cases
   */
  getClient (): ArenaClient {
    return this.client
  }

  // Channel operations
  channel (slug: string) {
    return this.client.channel(slug)
  }

  channels (options?: Record<string, unknown>) {
    return this.client.channels(options)
  }

  // Block operations
  block (id: number) {
    return this.client.block(id)
  }

  // User operations
  user (id: string | number) {
    return this.client.user(id)
  }

  me () {
    return this.client.me()
  }

  // Search operations
  getSearch () {
    return this.client.search
  }

  // Group operations
  group (slug: string) {
    return this.client.group(slug)
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
