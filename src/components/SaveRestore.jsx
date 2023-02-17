import { DesktopContext } from '@/context/DesktopContext'
import FolderArrowDown from '@/icons/folder-arrow-down.svg'
import FolderUp from '@/icons/folder-up.svg'
import SaveIcon from '@/icons/save.svg'
import * as Popover from '@radix-ui/react-popover'
import { useContext, useState } from 'react'

function SaveRestore () {
  const [open, setOpen] = useState(false)
  const [newSaveName, setNewSaveName] = useState('')
  const [selectedLayout, setSelectedLayout] = useState()
  const desktopCtx = useContext(DesktopContext)

  const handleRestore = () => {
    desktopCtx.setDialog({
      isOpen: true,
      message: `Are you sure you want to restore this layout?`,
      onConfirm: () => {
        desktopCtx.restoreLayout(selectedLayout)
        setOpen(false)
        setSelectedLayout(null)
      }
    })
  }

  const handleSave = () => {
    desktopCtx.saveLayout(newSaveName)
    setOpen(false)
    setNewSaveName('')
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex items-center justify-center px-1 py-1 font-bold border-2 rounded-md select-none border-primary/70 aspect-square bg-background hover:bg-secondary/10 hover:border-secondary hover:text-secondary'>
        <SaveIcon className='w-6 h-6' />
      </Popover.Trigger>
      <Popover.Content
        align={'center'}
        sideOffset={4}
        className='z-20 p-4 mx-4 text-left border-2 rounded gap-y-4 bg-zinc-900 text-primary/70 border-primary/70 w-72'
      >
        <h2>Save / Restore Layout</h2>

        <div className='grid grid-cols-[1fr_min-content] gap-x-1 gap-y-4 mt-4'>
          <input
            className='p-2 border-2 rounded-md bg-background border-primary/70'
            value={newSaveName}
            onChange={event => {
              setNewSaveName(event.target.value)
            }}
          />

          <button className='p-2 hover:text-secondary' onClick={handleSave} title='Save Layout'>
            <FolderArrowDown className='w-7 h-7' />
          </button>

          <select
            name='layout'
            className='px-2 py-1 border-2 rounded-md bg-background border-primary/70'
            value={selectedLayout}
            onChange={event => {
              setSelectedLayout(event.target.value)
            }}
          >
            {Object.entries(desktopCtx.savedLayouts).map(([key, value]) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </select>

          <button className='p-2 hover:text-secondary' onClick={handleRestore} title='Restore Layout'>
            <FolderUp className='w-7 h-7' />
          </button>
        </div>
        <Popover.Arrow className='text-primary/70' fill='currentColor' />
      </Popover.Content>
    </Popover.Root>
  )
}

export default SaveRestore
