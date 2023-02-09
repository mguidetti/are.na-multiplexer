import classNames from 'classnames'
import { useState } from 'react'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import HelpIcon from '@/icons/help.svg'

function Info () {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useOutsideClick(() => setIsOpen(false))

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(true)}
        className={classNames(
          'flex justify-center items-center h-9 w-9 opacity-80 marker:p-2 select-none hover:text-secondary',
          { 'text-secondary': isOpen }
        )}
      >
        <HelpIcon className='h-6' />
      </button>

      <div
        ref={ref}
        hidden={!isOpen}
        className='absolute top-12 right-0 z-40 text-left max-w-md min-w-[36rem] bg-zinc-900 text-primary/70 border-2 border-primary/70 rounded p-4 space-y-4 leading-tight text-sm drop-shadow-panel '
      >
        <p>
          <strong>Are.na Multiplexer</strong> is a tiling window manager for{' '}
          <a href='https://are.na' className='underline' target='_blank' rel='noreferrer'>
            Are.na
          </a>{' '}
          channels and blocks.
        </p>

        <ul className='list-disc ml-4'>
          <li>Load or create channels into the workspace</li>
          <li>Resize and move channels</li>
          <li>
            Click and drag blocks to rearrange their order. Or drag them into other channels to connect them. When
            dragging into other channels, hold ALT to copy a block instead of moving it
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
      </div>
    </div>
  )
}

export default Info
