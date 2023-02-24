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
      <Popover.Trigger className='flex select-none items-center justify-center rounded-md p-1 font-bold data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary hover:bg-secondary/10 hover:text-secondary'>
        <InformationCircleIcon className='h-6' />
      </Popover.Trigger>
      <Popover.Content
        align='center'
        sideOffset={4}
        className='z-20 mx-4 w-[90vw] max-w-[600px] rounded-md border-2 border-zinc-600 bg-zinc-900 text-zinc-400 drop-shadow-panel'
      >
        <div className='space-y-4 p-4 text-left text-sm leading-snug'>
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
              <ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
            </a>{' '}
          </p>

          <ul className='ml-4 list-disc'>
            <li>Load channels into the workspace</li>
            <li>Resize and move channels</li>
            <li>
              Click and drag blocks into other channels to connect them
              <br />
              <InformationCircleIconMini className='mr-1 inline h-4 w-4 align-text-bottom text-zinc-500' />
              Hold{' '}
              <span className='rounded border border-zinc-600 bg-zinc-800 px-1 font-mono text-xs'>
                Alt
              </span>{' '}
              while dragging to move a block instead of copying it
            </li>
            <li>View blocks in channels as lists or grids</li>
            <li>Double click blocks to open them in a fullscreen viewer</li>
            <li>Double click channel blocks to load them into the workspace</li>
            <li>Save layouts and restore them</li>
          </ul>

          <ul>
            <li>
              <UserIcon className='mr-1 inline h-4 w-4 align-text-top' />
              By{' '}
              <a
                href='https://www.michaelguidetti.info'
                target='_blank'
                rel='noreferrer'
                className='underline hover:text-secondary'
              >
                Michael Guidetti
                <ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
              </a>
            </li>
            <li>
              <GithubIcon className='mr-1 inline h-4 w-4 align-text-top' />
              Source available at{' '}
              <a
                href='https://www.github.com/mguidetti/are.na-multiplexer'
                className='underline hover:text-secondary'
                target='_blank'
                rel='noreferrer'
              >
                GitHub
                <ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
              </a>
            </li>
            <li>
              <HeartIcon className='mr-1 inline h-4 w-4 align-text-top' />
              <a
                href='https://github.com/sponsors/mguidetti?o=esb'
                className='underline hover:text-secondary'
                target='_blank'
                rel='noreferrer'
              >
                Sponsor
                <ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
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
