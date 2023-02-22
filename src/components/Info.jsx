import GithubIcon from '@/icons/github.svg'
import {
  ArrowTopRightOnSquareIcon, HeartIcon,
  InformationCircleIcon as InformationCircleIconMini,
  UserIcon
} from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'

function Info () {
  return (
    <Popover.Root>
      <Popover.Trigger className='flex items-center justify-center px-1 py-1 font-bold rounded-md select-none aspect-square hover:bg-secondary/10 hover:text-secondary data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary'>
        <InformationCircleIcon className='h-6' />
      </Popover.Trigger>
      <Popover.Content
        align='center'
        sideOffset={4}
        className='z-20 mx-4 border-2 rounded-md bg-zinc-900 text-zinc-400 border-zinc-600 drop-shadow-panel w-[90vw] max-w-[600px]'
      >
        <div className='p-4 space-y-4 text-sm leading-snug text-left'>
          <p>
            <span className='font-semibold'>Are.na Multiplexer</span> is a
            tiling window manager for{' '}
            <a
              href='https://are.na'
              className='underline hover:text-secondary'
              target='_blank'
              rel='noreferrer'
            >
              Are.na
              <ArrowTopRightOnSquareIcon className='inline w-3 h-3 ml-1 align-text-top' />
            </a>{' '}
          </p>

          <ul className='ml-4 list-disc'>
            <li>Load channels into the workspace</li>
            <li>Resize and move channels</li>
            <li>
              Click and drag blocks into other channels to connect them
              <br />
              <InformationCircleIconMini className='inline w-4 h-4 mr-1 align-text-bottom text-zinc-500' />
              Hold{' '}
              <span className='px-1 font-mono text-xs border rounded border-zinc-600 bg-zinc-800'>
                Alt
              </span>{' '}
              whilte dragging to move a block instead of copying it
            </li>
            <li>View blocks in channels as lists or grids</li>
            <li>Double click blocks to open them in a fullscreen viewer</li>
            <li>Double click channel blocks to load them into the workspace</li>
            <li>Save layouts and restore them</li>
          </ul>

          <ul>
            <li>
              <UserIcon className='inline w-4 h-4 mr-1 align-text-top' />
              By{' '}
              <a
                href='https://www.michaelguidetti.info'
                target='_blank'
                rel='noreferrer'
                className='underline hover:text-secondary'
              >
                Michael Guidetti
                <ArrowTopRightOnSquareIcon className='inline w-3 h-3 ml-1 align-text-top' />
              </a>
            </li>
            <li>
              <GithubIcon className='inline w-4 h-4 mr-1 align-text-top' />
              Source available at{' '}
              <a
                href='https://www.github.com/mguidetti/are.na-multiplexer'
                className='underline hover:text-secondary'
                target='_blank'
                rel='noreferrer'
              >
                GitHub
                <ArrowTopRightOnSquareIcon className='inline w-3 h-3 ml-1 align-text-top' />
              </a>
            </li>
            <li>
              <HeartIcon className='inline w-4 h-4 mr-1 align-text-top' />
              <a
                href='https://github.com/sponsors/mguidetti?o=esb'
                className='underline hover:text-secondary'
                target='_blank'
                rel='noreferrer'
              >
                Sponsor
                <ArrowTopRightOnSquareIcon className='inline w-3 h-3 ml-1 align-text-top' />
              </a>
            </li>
          </ul>
        </div>
        <Popover.Arrow
          className='text-zinc-600'
          fill='currentColor'
          height='7'
          width='14'
        />
      </Popover.Content>
    </Popover.Root>
  )
}

export default Info
