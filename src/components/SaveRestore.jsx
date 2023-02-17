import { DesktopContext } from '@/context/DesktopContext'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import FolderArrowDown from '@/icons/folder-arrow-down.svg'
import FolderUp from '@/icons/folder-up.svg'
import SaveIcon from '@/icons/save.svg'
import { useContext, useRef, useState } from 'react'

function SaveRestore () {
  const [isOpen, setIsOpen] = useState(false)
  const desktopCtx = useContext(DesktopContext)
  const clickRef = useOutsideClick(() => setIsOpen(false))
  const inputRef = useRef(null)
  const selectRef = useRef(null)

  const handleRestore = () => {
    desktopCtx.setDialog({
      isOpen: true,
      message: `Are you sure you want to restore this layout?`,
      onConfirm: () => {
        desktopCtx.restoreLayout(selectRef.current.value)
        setIsOpen(false)
      }
    })
  }

  const handleSave = () => {
    desktopCtx.saveLayout(inputRef.current.value)

    setIsOpen(false)
    inputRef.current.value = ''
  }

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(true)}
        className='flex items-center justify-center select-none border-2 rounded-md border-primary/70 px-1 py-1 aspect-square font-bold bg-background min-h-[38px] hover:bg-secondary/10 hover:border-secondary hover:text-secondary group whitespace-nowrap gap-x-2'
      >
        <SaveIcon className='w-6 h-6' />
      </button>

      <div hidden={!isOpen} className='absolute z-40 w-24 right-36 top-12' ref={clickRef}>
        <div className='p-4 text-left border-2 rounded gap-y-4 bg-zinc-900 text-primary/70 border-primary/70 drop-shadow-panel w-72'>
          <h2>Save / Restore Layout</h2>

          <div className='grid grid-cols-[1fr_min-content] gap-x-1 gap-y-4 mt-4'>
            <input ref={inputRef} className='p-2 border-2 rounded-md bg-background border-primary/70' />

            <button className='p-2 hover:text-secondary' onClick={handleSave} title='Save Layout'>
              <FolderArrowDown className='w-7 h-7' />
            </button>

            <select ref={selectRef} className='px-2 py-1 border-2 rounded-md bg-background border-primary/70'>
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
        </div>
      </div>
    </div>
  )
}

export default SaveRestore
