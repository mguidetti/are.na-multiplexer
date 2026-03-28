import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number
      accessToken: string,
      initials: string,
      tier: string
    } & DefaultSession['user']
  }

  interface Profile {
    id: number,
    username: string,
    avatar: string,
    initials: string,
    tier: string
  }
}
