import { DialogContextProvider } from '@/context/DialogContext'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Desktop from '../components/Desktop'
import Welcome from '../components/Welcome'

export default function Home () {
  const session = useSession() || {}
  const { data } = session

  return (
    <>
      <Head>
        <title>Are.na Multiplexer</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.svg' sizes='any' type='image/svg+xml' />
      </Head>
      <div id='root'>
        {data ? <DialogContextProvider><Desktop /></DialogContextProvider> : <Welcome />}
      </div>
    </>
  )
}
