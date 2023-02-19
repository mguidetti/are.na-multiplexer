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

function WindowToolbar ({ channel, scale, view }) {
  const mosaic = useContext(MosaicContext)
  const mosaicWindow = useContext(MosaicWindowContext)
  const desktopCtx = useContext(DesktopContext)

  const scaleDefaults = {
    multiplier: 1.25,
    min: 0.75,
    max: 3
  }

  const remove = () => {
    mosaic.mosaicActions.remove(mosaicWindow.mosaicWindowActions.getPath())
    desktopCtx.removeChannel(channel.id)
  }

  const expand = () => {
    mosaic.mosaicActions.expand(mosaicWindow.mosaicWindowActions.getPath(), 80)
  }

  const incrementScale = () => {
    const value = scale * scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    desktopCtx.updateChannel(channel.id, {scale: clampedValue})
  }

  const decrementScale = () => {
    const value = scale / scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    desktopCtx.updateChannel(channel.id, {scale: clampedValue})
  }

  const toggleView = () => {
    desktopCtx.updateChannel(channel.id, {view: view === 'grid' ? 'list' : 'grid'})
  }

  return (
    <div className='flex items-center justify-end'>
      <a
        href={`https://www.are.na/${channel.owner_slug}/${channel.slug}`}
        className='px-2 hover:text-secondary'
        target='_blank'
        rel='noreferrer'
        title='View at Are.na'
      >
        <ArenaMarkIcon className='w-6' />
      </a>

      <button onClick={toggleView} title='Change view' className='px-1 hover:text-secondary'>
        {view === 'list' && <Squares2x2Icon className='w-5 h-5' />}
        {view === 'grid' && <ListBulletIcon className='w-5 h-5' />}
      </button>

      <button onClick={incrementScale} title='Increase scale' className='px-1 hover:text-secondary'>
        <PlusIcon className='w-5 h-5' strokeWidth='2' />
      </button>

      <button onClick={decrementScale} title='Decrease scale' className='px-1 hover:text-secondary'>
        <MinusIcon className='w-5 h-5' strokeWidth='2' />
      </button>

      <button onClick={expand} title='Expand' className='px-1 hover:text-secondary'>
        <ArrowsPointingOutIcon className='w-5 h-5' />
      </button>

      <button onClick={remove} title='Remove' className='px-1 hover:text-secondary'>
        <XMarkIcon className='w-5 h-5' strokeWidth='2' />
      </button>
    </div>
  )
}

export default WindowToolbar
