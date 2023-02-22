import * as Popover from '@radix-ui/react-popover'
import { InformationCircleIcon } from '@heroicons/react/24/solid'

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
              className='underline'
              target='_blank'
              rel='noreferrer'
            >
              Are.na
            </a>{' '}
            channels and blocks.
          </p>

          <ul className='ml-4 list-disc'>
            <li>Load or create channels into the workspace</li>
            <li>Resize and move channels</li>
            <li>
              Click and drag blocks into other channels to connect them. While
              dragging, hold ALT to copy a block instead of moving it
            </li>
            <li>View blocks in channels as lists or grids</li>
            <li>Double click blocks to open them in a fullscreen viewer</li>
            <li>Double click channel blocks to open them in the workspace</li>
          </ul>

          <p>
            By{' '}
            <a
              href='https://www.michaelguidetti.info'
              target='_blank'
              rel='noreferrer'
              className='underline'
            >
              Michael Guidetti
            </a>
            . Source available at{' '}
            <a
              href='https://www.github.com/mguidetti/are.na-multiplexer'
              className='underline'
              target='_blank'
              rel='noreferrer'
            >
              GitHub
            </a>
            .
          </p>
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
