import Head from 'next/head'
import Desktop from '../components/Desktop'

export default function Home() {
  return (
    <>
      <Head>
        <title>Are.na Shelf OS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="root">
        <Desktop />
      </div>
    </>
  )
}
