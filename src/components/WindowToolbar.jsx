import ArenaMarkIcon from '@/icons/arena-mark.svg'
import { ArrowsPointingOutIcon, ListBulletIcon, MinusIcon, PlusIcon, Squares2X2Icon, XMarkIcon } from '@heroicons/react/20/solid'
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
    desktopCtx.dispatchChannels({ type: 'remove', id: channel.id })
  }

  const expand = () => {
    mosaic.mosaicActions.expand(mosaicWindow.mosaicWindowActions.getPath(), 80)
  }

  const incrementScale = () => {
    const value = scale * scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    desktopCtx.dispatchChannels({ type: 'update', id: channel.id, payload: { scale: clampedValue } })
  }

  const decrementScale = () => {
    const value = scale / scaleDefaults.multiplier
    const clampedValue = Math.min(Math.max(value, scaleDefaults.min), scaleDefaults.max)

    desktopCtx.dispatchChannels({ type: 'update', id: channel.id, payload: { scale: clampedValue } })
  }

  const toggleView = () => {
    desktopCtx.dispatchChannels({
      type: 'update',
      id: channel.id,
      payload: { view: view === 'grid' ? 'list' : 'grid' }
    })
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
        {view === 'list' && <Squares2X2Icon className='w-5 h-5' />}
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
