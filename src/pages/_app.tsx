import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import 'react-mosaic-component/react-mosaic-component.css'
import '../styles/globals.css'

export default function App ({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <Analytics />
    </>
  )
}
