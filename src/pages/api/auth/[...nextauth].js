import NextAuth from 'next-auth'

const options = {
  providers: [
    {
      id: 'arena',
      name: 'Are.na',
      type: 'oauth',
      authorization: {
        url: 'https://dev.are.na/oauth/authorize',
        params: {
          scope: null
        }
      },
      token: 'https://dev.are.na/oauth/token',
      userinfo: 'https://api.are.na/v2/me',
      clientId: process.env.ARENA_APP_ID,
      clientSecret: process.env.ARENA_APP_SECRET,

      profile: profile => {
        const data = {
          id: profile.id,
          email: profile.email,
          username: profile.username
        }
        return data
      }
    }
  ],
  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },
  callbacks: {
    async jwt ({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.username = profile.username
      }
      return token
    },
    session: async ({ session, user, token }) => {
      const data = {
        id: token.id,
        accessToken: token.accessToken,
        name: token.username
      }
      return Promise.resolve({
        ...session,
        user: data
      })
    }
  }
}

export default (req, res) => NextAuth(req, res, options)
