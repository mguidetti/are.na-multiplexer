import { Analytics } from '@vercel/analytics/react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { DndProvider } from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import 'react-mosaic-component/react-mosaic-component.css'
import '../styles/globals.css'

export default function App ({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session}>
        {/*
        DndProvider included to fix https://github.com/nomcopter/react-mosaic/issues/162
        Fix from https://github.com/nomcopter/react-mosaic/issues/162#issuecomment-1194558777 *
      */}
        <DndProvider options={HTML5toTouch}>
          <Component {...pageProps} />
        </DndProvider>
      </SessionProvider>
      <Analytics />
    </>
  )
}
