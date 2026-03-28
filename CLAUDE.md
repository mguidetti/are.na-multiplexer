# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
corepack enable          # required before first yarn usage
yarn dev                 # starts Next.js + local-ssl-proxy (https://localhost:3001)
yarn build               # production build
yarn lint                # ESLint
yarn test                # Playwright E2E tests (needs dev server running)
yarn test:ui             # Playwright interactive UI mode
yarn generate-types      # regenerate OpenAPI types from Are.na v3 API
```

To run a single Playwright test: `npx playwright test tests/foo.spec.ts`

## Architecture

A tiling window manager for [Are.na](https://www.are.na) built with Next.js 14, React 18, and TypeScript. Users authenticate via Are.na OAuth, then browse multiple channels simultaneously in a mosaic layout.

### Key layers

- **Pages** (`src/pages/`): Next.js pages. `index.tsx` renders `Welcome` (unauthed) or `Desktop` (authed). Auth via NextAuth with a custom Are.na OAuth provider in `api/auth/[...nextauth].ts`.
- **Desktop** (`src/components/Desktop.tsx`): Top-level authenticated UI. Manages the mosaic layout tree and provides `DesktopContext` / `DesktopActionsContext`.
- **Window** (`src/components/Window.tsx`): Each mosaic tile. Fetches channel blocks, handles pagination, provides `WindowContext` per-tile.
- **State management**: React Context + `useReducer`. No external state library. Reducers in `src/reducers/` for channels and blocks.
- **Drag & drop**: `@dnd-kit/core` for moving blocks between windows. Alt+drag disconnects a block.
- **Mosaic**: `react-mosaic-component` for the tiling layout. Saved layouts persist to `localStorage`.

### API / Types

- Are.na API v3. Client in `src/lib/arena-client.ts`.
- Types auto-generated from OpenAPI spec into `src/types/arena.generated.ts` (never edit by hand).
- `src/types/arena.ts` re-exports generated types with app-friendly aliases (e.g., `ArenaBlock`, `ArenaChannel`).

### Auth & session

NextAuth JWT strategy. Session is enriched with `accessToken`, `id`, `initials`, and `tier` fields. Premium features (search) are gated on `session.user.tier`.

### Testing

Playwright E2E tests in `tests/`. Fixtures mock NextAuth sessions and Are.na API responses. Tests cover free-tier and premium-tier scenarios.

## Conventions

- Path alias: `@/*` maps to `./src/*`
- ESLint fails the build on unused imports
- SVGs are imported as React components via `@svgr/webpack`
- Dev requires SSL proxy because Are.na OAuth callback needs HTTPS (`https://localhost:3001`)
- Virtualized lists via `react-virtuoso` for block rendering
