import { DesktopContext } from '@/context/DesktopContext'
import SaveIcon from '@/icons/save.svg'
import { ExclamationTriangleIcon, FolderOpenIcon, InformationCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { FolderArrowDownIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import { useContext, useState } from 'react'

function SaveLoadLayout () {
  const [open, setOpen] = useState(false)
  const [newSaveName, setNewSaveName] = useState('')
  const desktopCtx = useContext(DesktopContext)

  const handleSave = (event) => {
    event.preventDefault()

    desktopCtx.saveLayout(newSaveName)
    setOpen(false)
    setNewSaveName('')
  }

  const handleRestore = layoutId => {
    desktopCtx.setDialog({
      isOpen: true,
      title: `Are you sure you want to load ${desktopCtx.savedLayouts[layoutId].name}?`,
      message: 'This will replace your current layout',
      onConfirm: () => {
        desktopCtx.restoreLayout(layoutId)
        setOpen(false)
      }
    })
  }

  const handleDelete = layoutId => {
    desktopCtx.setDialog({
      isOpen: true,
      title: `Are you sure you want to delete ${desktopCtx.savedLayouts[layoutId].name}?`,
      message: 'This is not undoable',
      onConfirm: () => {
        desktopCtx.removeSavedLayout(layoutId)
      }
    })
  }

  const renderSavedLayouts = () => {
    if (desktopCtx.savedLayouts && Object.keys(desktopCtx.savedLayouts).length) {
      return (
        <div className='overflow-y-auto rounded border-2 border-zinc-600 hover:border-secondary/40'>
          <ul className='max-h-72 divide-y divide-zinc-600 bg-background scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-500 hover:scrollbar-thumb-zinc-400'>
            {Object.entries(desktopCtx.savedLayouts)
              .reverse()
              .map(([key, value]) => (
                <li key={key} className='group grid grid-cols-[1fr_min-content] px-2 py-1 hover:bg-secondary/30 hover:text-secondary'>
                  <div className='truncate'>{value.name}</div>
                  <div className='hidden gap-x-2 group-hover:flex'>
                    <button
                      type='button'
                      onClick={() => handleRestore(key)}
                      title='Load Saved Layout'
                      className='text-secondary/70 hover:text-secondary'
                    >
                      <FolderOpenIcon className='h-5 w-5' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(key)}
                      title='Delete Saved Layout'
                      className='text-secondary/70 hover:text-secondary'
                    >
                      <TrashIcon className='h-5 w-5' />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )
    } else {
      return <div className='mt-4 text-center text-sm opacity-50'>No saved layouts</div>
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex select-none items-center justify-center rounded-md p-1 font-bold data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary hover:bg-secondary/10 hover:text-secondary'>
        <SaveIcon className='h-6 w-6' />
      </Popover.Trigger>
      <Popover.Content
        align={'center'}
        sideOffset={3}
        className='z-20 mx-4 w-72 rounded-md border-2 border-zinc-600 bg-zinc-900 p-4 text-left text-zinc-400 drop-shadow-panel'
      >
        <div>
          <h2 className='font-semibold'>Save Layout</h2>

          <form
            onSubmit={handleSave}
            className={classNames('flex mt-2 gap-x-3 items-center', {
              'pointer-events-none opacity-25': !Object.keys(desktopCtx.channels).length
            })}
          >
            <input
              className='rounded-md border-2 border-zinc-600 bg-background px-2 py-1 placeholder:text-zinc-600 focus:border-secondary/70 focus:bg-secondary/20 focus:outline-none'
              placeholder='Layout name'
              value={newSaveName}
              onChange={event => {
                setNewSaveName(event.target.value)
              }}
              disabled={!Object.keys(desktopCtx.channels).length}
              required={true}
            />

            <button type='submit' className='hover:text-secondary' title='Save Layout'>
              <FolderArrowDownIcon className='h-6 w-6' />
            </button>
          </form>

          {!Object.keys(desktopCtx.channels).length && (
            <p className='mt-2 text-sm opacity-50'>
              <InformationCircleIcon className='mr-2 inline h-4 w-4 align-text-bottom' />
              Load channels to enable saving
            </p>
          )}
        </div>

        <div className='my-5 border border-zinc-600'></div>

        <div>
          <h2 className='font-semibold'>Load Layout</h2>
          <div className='mt-2'>{renderSavedLayouts()}</div>
        </div>

        <div className='my-5 border border-zinc-600'></div>

        <div className='grid grid-cols-[min-content_1fr] gap-x-2'>
          <ExclamationTriangleIcon className='relative top-[2px] h-4 w-4' />
          <p className='text-sm'>Saved layouts are currently saved in local browser storage</p>
        </div>
        <Popover.Arrow className='text-zinc-600' fill='currentColor' height="7" width="14" />
      </Popover.Content>
    </Popover.Root>
  )
}

export default SaveLoadLayout
