# Arena API Integration

This document describes the Arena API integration in this project and the migration path to Arena API v3.

## Current Implementation

**API Version:** v2  
**Library:** arena-ts@1.0.2  
**Base URL:** https://api.are.na/v2/

## Architecture

### Core Components

1. **Authentication** (`src/pages/api/auth/[...nextauth].ts`)
   - Uses NextAuth with OAuth2 flow
   - Authorization endpoint: `https://dev.are.na/oauth/authorize`
   - Token endpoint: `https://dev.are.na/oauth/token`
   - User info endpoint: `https://api.are.na/{version}/me`

2. **API Client Hook** (`src/hooks/useArena.ts`)
   - React hook that provides authenticated ArenaClient instance
   - Automatically configures client with user's access token
   - Used by all components that interact with Arena API

3. **API Service Abstraction** (`src/services/arenaApiService.ts`)
   - Optional abstraction layer for easier v3 migration
   - Provides typed methods for common API operations
   - Can be used as a drop-in replacement for direct ArenaClient usage

## API Endpoints Used

| Endpoint | Method | Purpose | Component(s) |
|----------|--------|---------|--------------|
| `/search/channels` | GET | Search for channels by query | ChannelLoader |
| `/users/:id/channels` | GET | List user's channels | ChannelsIndexMenu |
| `/channels/:slug` | GET | Get channel details | Desktop |
| `/channels/:slug/contents` | GET | Get channel contents (blocks) | Window |
| `/blocks/:id/channels` | GET | Get block connections | BlockConnections |
| `/channels` | POST | Create new channel | ChannelCreator |
| `/me` | GET | Get current user info | NextAuth |

## Data Flow

```
User Authentication
    ↓
NextAuth OAuth Flow
    ↓
Access Token stored in session
    ↓
useArena hook creates ArenaClient with token
    ↓
Components use ArenaClient to fetch data
    ↓
Data stored in React state/reducers
```

## Migration to Arena API v3

### Prerequisites

Before migrating to v3, ensure:

1. ✅ Arena API v3 is publicly available and documented
2. ✅ OpenAPI specification is accessible at the official URL
3. ✅ arena-ts library has been updated to support v3, or an alternative client library is available
4. ✅ Breaking changes between v2 and v3 have been documented

### Migration Steps

#### Step 1: Update Environment Configuration

Add to `.env.local`:
```bash
ARENA_API_VERSION=v3
```

#### Step 2: Update arena-ts Library

Check for a v3-compatible version:
```bash
yarn upgrade arena-ts@latest
```

Or if arena-ts doesn't support v3, evaluate alternatives.

#### Step 3: Review Breaking Changes

Compare v2 and v3 API documentation:
- Endpoint changes (URL structure, parameters)
- Response format changes
- Authentication changes
- Rate limiting differences
- New features or deprecated endpoints

#### Step 4: Update Type Definitions

If response structures change, update type imports or create custom type definitions:

```typescript
// Before (v2)
import { ArenaChannelWithDetails } from 'arena-ts'

// After (v3) - if types change
import { Channel } from 'arena-ts' // or custom types
```

#### Step 5: Test Authentication Flow

Verify OAuth flow still works:
1. Start dev server: `yarn dev`
2. Navigate to https://localhost:3001
3. Sign in with Are.na account
4. Verify user info is retrieved correctly

#### Step 6: Test API Operations

Test each operation systematically:

- [ ] Search channels
- [ ] List user channels
- [ ] View channel details
- [ ] View channel contents
- [ ] View block connections
- [ ] Create new channel

#### Step 7: Update Documentation

Update:
- This file (API_INTEGRATION.md)
- README.md
- Code comments
- Environment variable documentation

### Using the Abstraction Layer

To make v3 migration easier, consider migrating components to use `ArenaApiService`:

```typescript
// Before - Direct arena-ts usage
import { useArena } from '@/hooks/useArena'

const arena = useArena()
const channels = await arena.search.channels(query)

// After - Using abstraction
import { createArenaApiService } from '@/services/arenaApiService'
import { useSession } from 'next-auth/react'

const { data } = useSession()
const arenaApi = createArenaApiService({ token: data?.user.accessToken })
const channels = await arenaApi.searchChannels(query)
```

Benefits:
- Single point of update when migrating to v3
- Consistent API across the application
- Easier to mock for testing
- API version can be detected and logged

## API Version Detection

The application can detect which API version is in use:

```typescript
import { createArenaApiService } from '@/services/arenaApiService'

const service = createArenaApiService()
console.log('Current API version:', service.getApiVersion())
```

## Troubleshooting

### Common v2 Issues

1. **401 Unauthorized**: Check that access token is being passed correctly
2. **404 Not Found**: Verify channel slug or block ID exists
3. **Rate Limiting**: Implement exponential backoff for retries

### Expected v3 Changes

Based on common API evolution patterns, v3 might include:

- Improved pagination (cursor-based instead of page-based)
- Consistent response envelopes
- Better error messages
- GraphQL endpoint option
- Webhooks support
- Batch operations
- Enhanced filtering and sorting options

## Resources

- [Arena API Documentation](https://github.com/aredotna/api-docs)
- [arena-ts Library](https://github.com/e-e-e/arena-ts)
- [Are.na Developer Portal](https://dev.are.na)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Support

If you encounter issues during v3 migration:

1. Check the [Arena API documentation](https://github.com/aredotna/api-docs)
2. Review arena-ts library changelog
3. Search for similar issues in the arena-ts repository
4. Consult the Are.na developer community
