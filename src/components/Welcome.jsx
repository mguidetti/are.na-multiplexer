import { BrowserView, MobileView } from 'react-device-detect'
import AuthButton from './AuthButton'
import AmuxIcon from '@/icons/amux.svg'
import GithubIcon from '@/icons/github.svg'

function Welcome () {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center gap-y-4 bg-background text-center text-zinc-400'>
      <AmuxIcon className='w-16' fill='currentColor' />
      <p className='font-mono text-lg'>Are.na Multiplexer</p>

      <div className='mt-8'>
        <BrowserView>
          <AuthButton />
        </BrowserView>

        <MobileView>
          <p>
            This app is not designed for mobile devices.
            <br />
            Please visit on a desktop computer.
          </p>
        </MobileView>
      </div>

      <p className='mt-12 font-mono text-sm'>
        <a
          href='https://github.com/mguidetti/are.na-multiplexer'
          className='mt-1 inline-flex items-center gap-x-2 hover:text-secondary'
          target='_blank'
          rel='noreferrer'
        >
          <GithubIcon className='inline h-8 text-zinc-600 hover:text-zinc-400' />
        </a>
      </p>
    </div>
  )
}

export default Welcome
