import Head from 'next/head'
import Desktop from '../components/Desktop'
import Welcome from '../components/Welcome'
import { useSession } from 'next-auth/react'


export default function Home() {
  const session = useSession() || {}
  const { data } = session

  return (
    <>
      <Head>
        <title>Are.na Shelf OS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="root">
        { data ? <Desktop /> : <Welcome />} 
      </div>
    </>
  )
}
