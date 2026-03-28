import NextAuth, { NextAuthOptions } from 'next-auth'

const options: NextAuthOptions = {
  providers: [
    {
      id: 'arena',
      name: 'Are.na',
      type: 'oauth',
      authorization: {
        url: 'https://www.are.na/oauth/authorize',
        params: {
          scope: ''
        }
      },
      token: 'https://api.are.na/v3/oauth/token',
      userinfo: 'https://api.are.na/v3/me',
      clientId: process.env.ARENA_APP_ID,
      clientSecret: process.env.ARENA_APP_SECRET,
      profile: (profile) => {
        const data = {
          id: profile.id,
          username: profile.name,
          avatar: profile.avatar,
          initials: profile.initials,
          tier: profile.tier
        }

        return data
      }
    }
  ],
  jwt: {
    secret: process.env.ARENA_APP_SECRET
  },
  callbacks: {
    async jwt ({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && profile) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.name = profile.name
        token.image = profile.avatar
        token.initials = profile.initials
        token.tier = profile.tier
      }

      return token
    },
    async session ({ session, token }) {
      session.user.id = token.id as number
      session.user.accessToken = token.accessToken as string
      session.user.name = token.name
      session.user.image = token.image as string
      session.user.initials = token.initials as string
      session.user.tier = token.tier as string

      return session
    }
  }
}

export default NextAuth(options)
