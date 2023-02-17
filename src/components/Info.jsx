import HelpIcon from '@/icons/help.svg'
import * as Popover from '@radix-ui/react-popover'

function Info () {
  return (
    <Popover.Root>
      <Popover.Trigger className='flex justify-center items-center h-9 w-9 opacity-80 marker:p-2 select-none hover:text-secondary data-[state=open]:text-secondary'>
        <HelpIcon className='h-6' />
      </Popover.Trigger>
      <Popover.Content
        align='end'
        sideOffset={6}
        className='z-20 p-4 space-y-4 leading-tight text-sm text-left max-w-md min-w-[36rem] border-2 rounded bg-zinc-900 border-primary/70 drop-shadow-panel'
      >
        <p>
          <strong>Are.na Multiplexer</strong> is a tiling window manager for{' '}
          <a href='https://are.na' className='underline' target='_blank' rel='noreferrer'>
            Are.na
          </a>{' '}
          channels and blocks.
        </p>

        <ul className='ml-4 list-disc'>
          <li>Load or create channels into the workspace</li>
          <li>Resize and move channels</li>
          <li>
            Click and drag blocks into other channels to connect them. While dragging, hold ALT to copy a block instead
            of moving it
          </li>
          <li>View blocks in channels as lists or grids</li>
          <li>Double click blocks to open them in a fullscreen viewer</li>
          <li>Double click channel blocks to open them in the workspace</li>
        </ul>

        <p>
          By{' '}
          <a href='https://www.michaelguidetti.info' target='_blank' rel='noreferrer' className='underline'>
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
      </Popover.Content>
    </Popover.Root>
  )
}

export default Info
