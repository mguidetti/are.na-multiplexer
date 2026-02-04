# Arena API v3 Migration Guide

## Current Status

As of February 2026, this repository has been prepared for Arena API v3 migration, but **Arena API v3 does not appear to be publicly available yet**.

### What Has Been Done

1. **Updated arena-ts dependency** from `0.1.4` to `1.0.2`
   - Latest version with bug fixes and improvements
   - Still uses Arena API v2 as v3 is not yet available

2. **Created Arena API Service Layer** (`src/services/arenaApiService.ts`)
   - Abstraction layer over arena-ts client
   - Makes future API version updates easier
   - Centralizes all Arena API interactions
   - Allows for easy mocking and testing

### Current API Usage

The application currently uses Arena API v2 with the following endpoints:

#### Authentication
- **Endpoint**: `https://api.are.na/v2/me`
- **Location**: `src/pages/api/auth/[...nextauth].ts`
- **Purpose**: OAuth user profile retrieval

#### Channels
- `arena.channels()` - List all channels
- `arena.channel(slug).get()` - Get channel details
- `arena.channel(slug).contents()` - Get channel contents
- `arena.channel(slug).connections()` - Get channel connections
- `arena.channel(slug).create()` - Create new channel
- `arena.channel(slug).update()` - Update channel
- `arena.channel(slug).connect.block()` - Connect block to channel
- `arena.channel(slug).connect.channel()` - Connect channel to channel

#### Blocks
- `arena.block(id).channels()` - Get channels containing a block
- `arena.block(id).get()` - Get block details

#### Users
- `arena.user(id).channels()` - Get user's channels
- `arena.me()` - Get authenticated user details

#### Search
- `arena.search.channels(query)` - Search for channels

### Files That Use Arena API

1. `src/hooks/useArena.ts` - React hook for Arena client
2. `src/pages/api/auth/[...nextauth].ts` - Authentication config
3. `src/components/Window.tsx` - Channel operations
4. `src/components/ChannelLoader.tsx` - Channel search
5. `src/components/ChannelCreator.tsx` - Channel creation
6. `src/components/ChannelsIndexMenu.tsx` - User channels
7. `src/components/BlockConnections.tsx` - Block channels
8. `src/components/Desktop.tsx` - Channel operations

## When Arena API v3 Becomes Available

### Investigation Required

1. **Obtain OpenAPI Specification**
   - Check https://www.are.na/developers/explore/system/openapi (currently not accessible)
   - Review Arena's official documentation for v3 changes
   - Contact Arena support if needed

2. **Identify Breaking Changes**
   - Endpoint path changes (e.g., `/v2/` to `/v3/`)
   - Authentication mechanism changes
   - Request/response format changes
   - New required parameters
   - Deprecated endpoints
   - Rate limiting changes

### Migration Steps

#### 1. Update arena-ts Library
Check if arena-ts has been updated to support v3:
```bash
npm view arena-ts versions
yarn add arena-ts@latest
```

If arena-ts doesn't support v3, consider:
- Forking arena-ts and adding v3 support
- Creating a custom Arena API client
- Waiting for official v3 support

#### 2. Update ArenaApiService
Modify `src/services/arenaApiService.ts`:
- Update base URL from `v2` to `v3`
- Handle any endpoint path changes
- Adapt request/response transformations
- Add any new v3-specific features

Example:
```typescript
constructor(config: ArenaApiConfig = {}) {
  this.apiVersion = config.apiVersion || 'v3' // Change default to v3
  
  // If arena-ts supports v3:
  this.client = new ArenaClient({
    ...config.token ? { token: config.token } : undefined,
    apiVersion: 'v3' // If supported
  })
  
  // Or create custom client:
  // this.client = new CustomArenaV3Client(config)
}
```

#### 3. Update Authentication
In `src/pages/api/auth/[...nextauth].ts`:
```typescript
// Change from:
userinfo: 'https://api.are.na/v2/me',

// To:
userinfo: 'https://api.are.na/v3/me', // Or whatever v3 path is
```

Check if OAuth flow has changed in v3.

#### 4. Update Type Definitions
If response formats change:
- Update types in `src/types/`
- Check arena-ts type definitions
- Add new v3-specific types

#### 5. Test All Integrations
- Authentication flow
- Channel operations (CRUD)
- Block operations
- Search functionality
- User operations
- Error handling

#### 6. Update Documentation
- Update this file with actual v3 changes
- Update README.md if setup process changes
- Update inline code comments

### Testing Strategy

1. **Unit Tests** (if not already present)
   - Mock Arena API responses
   - Test each service method
   - Test error handling

2. **Integration Tests**
   - Test with v3 sandbox/test environment
   - Verify all CRUD operations
   - Test pagination
   - Test search

3. **Manual Testing**
   - Full user workflow testing
   - UI interactions
   - Error scenarios

### Rollback Plan

1. Keep v2 configuration as fallback
2. Use feature flags if deploying gradually:
```typescript
const apiVersion = process.env.USE_ARENA_V3 === 'true' ? 'v3' : 'v2'
```

3. Monitor error rates and API responses
4. Have v2 branch ready for quick rollback

## Resources

- Arena Developers: https://dev.are.na
- Arena API Docs: (need to verify current location)
- arena-ts GitHub: https://github.com/e-e-e/arena-ts
- arena-ts Documentation: https://e-e-e.github.io/arena-ts/

## Notes

- The ArenaApiService abstraction layer has been implemented to make future v3 migration straightforward
- All API interactions go through this service, providing a single point for updates
- The arena-ts dependency has been updated to the latest version (1.0.2)
- When v3 becomes available, most changes should be confined to the ArenaApiService class
