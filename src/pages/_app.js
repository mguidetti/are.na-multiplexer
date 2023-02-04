import { SessionProvider } from 'next-auth/react'
import '@/styles/globals.css'
import 'react-mosaic-component/react-mosaic-component.css'

export default function App ({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
