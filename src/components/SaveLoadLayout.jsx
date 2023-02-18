import { DesktopContext } from '@/context/DesktopContext'
import FolderArrowDown from '@/icons/folder-arrow-down.svg'
import FolderOpen from '@/icons/folder-open.svg'
import SaveIcon from '@/icons/save.svg'
import * as Popover from '@radix-ui/react-popover'
import { useContext, useState } from 'react'
import TrashIcon from '@/icons/trash.svg'
import classNames from 'classnames'

function SaveLoadLayout () {
  const [open, setOpen] = useState(false)
  const [newSaveName, setNewSaveName] = useState('')
  const desktopCtx = useContext(DesktopContext)

  const handleSave = () => {
    desktopCtx.saveLayout(newSaveName)
    setOpen(false)
    setNewSaveName('')
  }

  const handleRestore = layoutId => {
    desktopCtx.setDialog({
      isOpen: true,
      message: `Are you sure you want to restore this layout?`,
      onConfirm: () => {
        desktopCtx.restoreLayout(layoutId)
        setOpen(false)
      }
    })
  }

  const handleDelete = layoutId => {
    desktopCtx.setDialog({
      isOpen: true,
      message: `Are you sure you want to delete this layout?`,
      onConfirm: () => {
        desktopCtx.removeSavedLayout(layoutId)
      }
    })
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex items-center justify-center px-1 py-1 font-bold border-2 rounded-md select-none border-primary/70 aspect-square bg-background hover:bg-secondary/10 hover:border-secondary hover:text-secondary'>
        <SaveIcon className='w-6 h-6' />
      </Popover.Trigger>
      <Popover.Content
        align={'center'}
        sideOffset={4}
        className='z-20 p-4 mx-4 text-left border-2 rounded-md bg-zinc-900 text-primary/70 border-primary/70 w-72'
      >
        <div>
          <h2>Save Layout</h2>
          
          <div className={classNames('flex mt-2 gap-x-2', { 'pointer-events-none opacity-25': !Object.keys(desktopCtx.channels).length })}>
            <input
              className='px-2 py-1 border-2 rounded-md bg-background border-primary/70'
              placeholder='Layout name'
              value={newSaveName}
              onChange={event => {
                setNewSaveName(event.target.value)
              }}
              disabled={!Object.keys(desktopCtx.channels).length}
            />

            <button className='hover:text-secondary' onClick={handleSave} title='Save Layout'>
              <FolderArrowDown className='w-7 h-7' />
            </button>
          </div>
        </div>

        <div className='mt-6'>
          <h2>Load Layout</h2>

          <ul className='mt-2 overflow-y-auto border-2 divide-y rounded-md bg-background border-primary/70 text-primary/70 divide-primary/70 max-h-72 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-zinc-700 hover:scrollbar-thumb-zinc-400'>
            {Object.entries(desktopCtx.savedLayouts)
              .reverse()
              .map(([key, value]) => (
                <li key={key} className='grid grid-cols-[1fr_min-content] px-2 py-1 hover:bg-secondary/50 group'>
                  <div className='truncate'>{value.name}</div>
                  <div className='hidden gap-x-2 group-hover:flex'>
                    <button
                      type='button'
                      onClick={() => handleRestore(key)}
                      title='Restore Layout'
                      className='hover:text-secondary'
                    >
                      <FolderOpen className='w-5 h-5' />
                    </button>
                    <button
                      type='button'
                      onClick={() => handleDelete(key)}
                      title='Restore Layout'
                      className='hover:text-secondary'
                    >
                      <TrashIcon className='w-5 h-5' />
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <p className="mt-6 text-sm">
          Saved layouts are saved in local browser storage
        </p>
        <Popover.Arrow fill='currentColor' />
      </Popover.Content>
    </Popover.Root>
  )
}

export default SaveLoadLayout
