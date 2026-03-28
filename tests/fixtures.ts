import { test as base, Page } from '@playwright/test'

// Mock session returned by NextAuth
const mockSession = {
  user: {
    id: 12345,
    name: 'Test User',
    image: null,
    initials: 'TU',
    accessToken: 'fake-token',
    tier: 'premium'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

// Mock Are.na API data
export const mockChannel = {
  id: 100,
  type: 'Channel',
  slug: 'test-channel-abc123',
  title: 'Test Channel',
  description: null,
  state: 'available',
  visibility: 'public',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
  owner: {
    id: 12345,
    type: 'User',
    name: 'Test User',
    slug: 'test-user',
    avatar: null,
    initials: 'TU'
  },
  counts: { blocks: 3, channels: 0, contents: 3, collaborators: 0 },
  _links: { self: { href: 'https://api.are.na/v3/channels/100' } },
  connection: null,
  can: { add_to: true, update: true, destroy: true, manage_collaborators: true }
}

export const mockBlocks = [
  {
    id: 201,
    base_type: 'Block',
    type: 'Image',
    title: 'Test Image Block',
    description: null,
    state: 'available',
    visibility: 'public',
    comment_count: 0,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
    user: { id: 12345, type: 'User', name: 'Test User', slug: 'test-user', avatar: null, initials: 'TU' },
    source: null,
    _links: { self: { href: 'https://api.are.na/v3/blocks/201' } },
    connection: { id: 5001, position: 1, pinned: false, connected_at: '2024-02-01T00:00:00Z', connected_by: null },
    can: null,
    image: {
      alt_text: null,
      blurhash: null,
      width: 800,
      height: 600,
      src: 'https://d2w9rnfcy7mm78.cloudfront.net/test/original.jpg',
      aspect_ratio: 1.333,
      content_type: 'image/jpeg',
      filename: 'test.jpg',
      file_size: 50000,
      updated_at: '2024-02-01T00:00:00Z',
      small: { src: 'https://d2w9rnfcy7mm78.cloudfront.net/test/small.jpg', src_2x: 'https://d2w9rnfcy7mm78.cloudfront.net/test/small@2x.jpg', width: 100, height: 75 },
      medium: { src: 'https://d2w9rnfcy7mm78.cloudfront.net/test/medium.jpg', src_2x: 'https://d2w9rnfcy7mm78.cloudfront.net/test/medium@2x.jpg', width: 400, height: 300 },
      large: { src: 'https://d2w9rnfcy7mm78.cloudfront.net/test/large.jpg', src_2x: 'https://d2w9rnfcy7mm78.cloudfront.net/test/large@2x.jpg', width: 800, height: 600 },
      square: { src: 'https://d2w9rnfcy7mm78.cloudfront.net/test/square.jpg', src_2x: 'https://d2w9rnfcy7mm78.cloudfront.net/test/square@2x.jpg', width: 100, height: 100 }
    }
  },
  {
    id: 202,
    base_type: 'Block',
    type: 'Text',
    title: 'Test Text Block',
    description: null,
    state: 'available',
    visibility: 'public',
    comment_count: 0,
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-03-01T00:00:00Z',
    user: { id: 12345, type: 'User', name: 'Test User', slug: 'test-user', avatar: null, initials: 'TU' },
    source: null,
    _links: { self: { href: 'https://api.are.na/v3/blocks/202' } },
    connection: { id: 5002, position: 2, pinned: false, connected_at: '2024-03-01T00:00:00Z', connected_by: null },
    can: null,
    content: {
      markdown: 'Hello **world**',
      html: '<p>Hello <strong>world</strong></p>',
      plain: 'Hello world'
    }
  },
  {
    id: 203,
    base_type: 'Block',
    type: 'Link',
    title: 'Test Link Block',
    description: null,
    state: 'available',
    visibility: 'public',
    comment_count: 0,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-04-01T00:00:00Z',
    user: { id: 12345, type: 'User', name: 'Test User', slug: 'test-user', avatar: null, initials: 'TU' },
    source: { url: 'https://example.com', title: 'Example', provider: { name: 'Example', url: 'https://example.com' } },
    _links: { self: { href: 'https://api.are.na/v3/blocks/203' } },
    connection: { id: 5003, position: 3, pinned: false, connected_at: '2024-04-01T00:00:00Z', connected_by: null },
    can: null,
    image: null,
    content: null
  }
]

const mockPaginationMeta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  per_page: 50,
  total_pages: 1,
  total_count: 3,
  has_more_pages: false
}

async function setupAuthMock (page: Page) {
  await page.route('**/api/auth/session', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    })
  )

  await page.route('**/api/auth/providers', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        arena: {
          id: 'arena',
          name: 'Are.na',
          type: 'oauth',
          signinUrl: '/api/auth/signin/arena',
          callbackUrl: '/api/auth/callback/arena'
        }
      })
    })
  )

  // Also intercept the CSRF token endpoint
  await page.route('**/api/auth/csrf', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ csrfToken: 'fake-csrf-token' })
    })
  )
}

async function setupApiMocks (page: Page) {
  // Search channels
  await page.route('**/v3/search?*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [mockChannel],
        meta: { ...mockPaginationMeta, total_count: 1 }
      })
    })
  )

  // Channel contents endpoint (must be registered before the single channel route)
  await page.route('**/v3/channels/*/contents**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: mockBlocks,
        meta: mockPaginationMeta
      })
    })
  )

  // Get channel by id or slug
  await page.route('**/v3/channels/*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockChannel)
    })
  )

  // User channels
  await page.route('**/v3/users/*/contents?*', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [mockChannel],
        meta: { ...mockPaginationMeta, total_count: 1 }
      })
    })
  )

  // Block connections
  await page.route('**/v3/blocks/*/connections', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: [mockChannel]
      })
    })
  )

  // Connections (create/delete)
  await page.route('**/v3/connections*', route => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [{ id: 9999 }] })
      })
    }
    if (route.request().method() === 'DELETE') {
      return route.fulfill({ status: 204 })
    }
    return route.continue()
  })

  // Catch-all for cloudfront image URLs — return a tiny transparent PNG
  await page.route('https://d2w9rnfcy7mm78.cloudfront.net/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
    })
  )
}

// Extend Playwright test with an authenticated page fixture
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    await setupAuthMock(page)
    await setupApiMocks(page)
    await use(page)
  }
})

export { expect } from '@playwright/test'
