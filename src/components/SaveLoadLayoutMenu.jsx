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
      message: `This will replace your current layout`,
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
      message: `This is not undoable`,
      onConfirm: () => {
        desktopCtx.removeSavedLayout(layoutId)
      }
    })
  }

  const renderSavedLayouts = () => {
    if (desktopCtx.savedLayouts && Object.keys(desktopCtx.savedLayouts).length) {
      return (
        <div className='overflow-y-auto border-2 rounded border-zinc-600'>
          <ul className='divide-y bg-background divide-zinc-600 max-h-72 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-700 hover:scrollbar-thumb-zinc-400'>
            {Object.entries(desktopCtx.savedLayouts)
              .reverse()
              .map(([key, value]) => (
                <li key={key} className='grid grid-cols-[1fr_min-content] px-2 py-1 hover:bg-secondary/50 group'>
                  <div className='truncate'>{value.name}</div>
                  <div className='hidden gap-x-2 group-hover:flex'>
                    <button
                      type='button'
                      onClick={() => handleRestore(key)}
                      title='Load Saved Layout'
                      className='hover:text-secondary'
                    >
                      <FolderOpenIcon className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(key)}
                      title='Delete Saved Layout'
                      className='hover:text-secondary'
                    >
                      <TrashIcon className='w-5 h-5' />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )
    } else {
      return <div className='mt-4 text-sm text-center opacity-50'>No saved layouts</div>
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex items-center justify-center px-1 py-1 font-bold rounded-md select-none aspect-square hover:bg-secondary/10 hover:text-secondary data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary'>
        <SaveIcon className='w-6 h-6' />
      </Popover.Trigger>
      <Popover.Content
        align={'center'}
        sideOffset={3}
        className='z-20 p-4 mx-4 text-left border-2 rounded-md bg-zinc-900 text-zinc-400 border-zinc-600 w-72 drop-shadow-panel'
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
              className='px-2 py-1 border-2 rounded-md bg-background border-zinc-600 placeholder:text-zinc-600 '
              placeholder='Layout name'
              value={newSaveName}
              onChange={event => {
                setNewSaveName(event.target.value)
              }}
              disabled={!Object.keys(desktopCtx.channels).length}
              required={true}
            />

            <button type='submit' className='hover:text-secondary' title='Save Layout'>
              <FolderArrowDownIcon className='w-6 h-6' />
            </button>
          </form>

          {!Object.keys(desktopCtx.channels).length && (
            <p className='mt-2 text-sm opacity-50'>
              <InformationCircleIcon className='inline w-4 h-4 mr-2 align-text-bottom' />
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
          <ExclamationTriangleIcon className='w-4 h-4 top-[2px] relative' />
          <p className='text-sm'>Saved layouts are currently saved in local browser storage</p>
        </div>
        <Popover.Arrow className='text-zinc-600' fill='currentColor' height="7" width="14" />
      </Popover.Content>
    </Popover.Root>
  )
}

export default SaveLoadLayout
