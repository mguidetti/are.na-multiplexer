<img src="./public/favicon.svg" alt="Are.na Multiplexer logo" width="75">

# Are.na Multiplexer

Are.na Multiplexer is a tiling window manager for [Are.na](https://are.na)

Hosted at https://arena-mux.michaelguidetti.info

<img src="./public/screenshot.png" alt="Screenshot of Are.na Multiplexer" width="500">

## Development

### Setup
- Fork and clone this repo
- Register an application with Are.na at https://dev.are.na/oauth/applications 
- Add `https://localhost:30001/api/auth/callback/arena` as a callbacak URL in your registered application's settings.
- Set the following variables in `.env.local`
  | KEY | VALUE |
  | --- | --- |
  | `ARENA_APP_ID` | `UID` from your registered app at dev.are.na |
  | `ARENA_APP_SECRET` | `Secret` from your registered app at dev.are.na |
  | `NEXT_AUTH_SECRET` | Generate local secret by running `openssl rand -base64 32` |
  | `NEXT_AUTH_URL` | `https://localhost:3001` |
- Run `yarn install`
- Run `yarn dev` 
- Visit https://localhost:3001 (bypass unsigned certificate warning)
