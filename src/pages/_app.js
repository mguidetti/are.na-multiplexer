import { SessionProvider } from 'next-auth/react'
import 'react-mosaic-component/react-mosaic-component.css'
import '../styles/globals.css'
import { DndProvider } from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'

export default function App ({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {/* 
        DndProvider included to fix https://github.com/nomcopter/react-mosaic/issues/162    
        Fix from https://github.com/nomcopter/react-mosaic/issues/162#issuecomment-1194558777 *
      */}
      <DndProvider options={HTML5toTouch}>
        <Component {...pageProps} />
      </DndProvider>
    </SessionProvider>
  )
}
