import ArenaMarkIcon from '@/icons/arena-mark.svg'
import ArrowsPointingOutIcon from '@/icons/arrows-pointing-out.svg'
import ListBulletIcon from '@/icons/list-bullet.svg'
import MinusIcon from '@/icons/minus.svg'
import PlusIcon from '@/icons/plus.svg'
import Squares2x2Icon from '@/icons/squares-2x2.svg'
import XMarkIcon from '@/icons/x-mark.svg'
import { useContext } from 'react'
import { MosaicContext, MosaicWindowContext } from 'react-mosaic-component'
import { DesktopContext } from '../context/DesktopContext'

function WindowToolbar ({ scale, setScale, scaleDefaults, setView, view, channel }) {
  const mosaic = useContext(MosaicContext)
  const mosaicWindow = useContext(MosaicWindowContext)
  const desktop = useContext(DesktopContext)

  const remove = () => {
    mosaic.mosaicActions.remove(mosaicWindow.mosaicWindowActions.getPath())
    desktop.removeChannel(channel.id)
  }

  const expand = () => {
    mosaic.mosaicActions.expand(mosaicWindow.mosaicWindowActions.getPath(), 80)
  }

  const incrementScale = () => {
    const value = scale * scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    setScale(clampedValue)
  }

  const decrementScale = () => {
    const value = scale / scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    setScale(clampedValue)
  }

  const toggleView = () => {
    setView(view === 'grid' ? 'list' : 'grid')
  }

  return (
    <div className='flex justify-end items-center'>
      <a
        href={`https://www.are.na/${channel.owner_slug}/${channel.slug}`}
        className='hover:text-secondary px-2'
        target='_blank'
        rel='noreferrer'
      >
        <ArenaMarkIcon className='w-6' />
      </a>

      <button onClick={toggleView} className='hover:text-secondary px-1'>
        {view === 'list' && <Squares2x2Icon className='w-5 h-5' />}
        {view === 'grid' && <ListBulletIcon className='w-5 h-5' />}
      </button>

      <button onClick={incrementScale} className='hover:text-secondary px-1'>
        <PlusIcon className='w-5 h-5' strokeWidth='2' />
      </button>

      <button onClick={decrementScale} className='hover:text-secondary px-1'>
        <MinusIcon className='w-5 h-5' strokeWidth='2' />
      </button>

      <button onClick={expand} className='hover:text-secondary px-1'>
        <ArrowsPointingOutIcon className='w-5 h-5' />
      </button>

      <button onClick={remove} className='hover:text-secondary px-1'>
        <XMarkIcon className='w-5 h-5' strokeWidth='2' />
      </button>
    </div>
  )
}

export default WindowToolbar
