import { BrowserView, MobileView } from 'react-device-detect'
import AuthButton from './AuthButton'
import AmuxIcon from '@/icons/amux.svg'
import GithubIcon from '@/icons/github.svg'

function Welcome () {
  return (
    <div className='bg-background h-full w-full flex flex-col gap-y-4 items-center justify-center text-center  text-primary/70'>
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

      <p className='mt-8 font-mono text-sm'>
        <a
          href='https://github.com/mguidetti/are.na-shelf'
          className='hover:text-secondary gap-x-2 inline-flex items-center mt-1'
          target='_blank'
          rel='noreferrer'
        >
          <GithubIcon className='inline h-8' />
        </a>
      </p>
    </div>
  )
}

export default Welcome
