import { SessionProvider } from 'next-auth/react'
import 'react-mosaic-component/react-mosaic-component.css'
import '../styles/globals.css'

export default function App ({ Component, pageProps: {session, ...pageProps} }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
