import { useArena } from '@/hooks/useArena'
import PlusIcon from '@/icons/plus.svg'
import XMarkIcon from '@/icons/x-mark.svg'
import { useCallback, useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { DesktopContext } from './DesktopContext'

function Dialog ({close}) {
  const desktop = useContext(DesktopContext)
  const arena = useArena()

  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    privacy: ''
  })

  const handleChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const createChannel = useCallback(
    async event => {
      event.preventDefault()

      setIsCreating(true)

      const results = await arena.channel(formData.name).create(formData.privacy)

      if (results) {
        desktop.loadChannel(results)
      }

      setIsCreating(false)
      setFormData({})
      close()
    },
    [arena]
  )

  return (
    <div className='absolute top-10 left-0 z-50 border-2 border-secondary bg-zinc-900 p-8 rounded-md drop-shadow-panel'>
      <button className='p-1 hover:text-secondary absolute top-0 right-0' onClick={close}>
        <XMarkIcon className='h-6 w-6 ' strokeWidth='2' />
      </button>

      <form className='flex-col flex space-y-4' onSubmit={createChannel}>
        <input
          name='name'
          placeholder='Name'
          className='bg-background px-2 py-1 border-primary/70 border rounded-md'
          value={formData.name}
          onChange={handleChange}
        />

        <select
          name='privacy'
          className='bg-background px-2 py-1 border-primary/70 border rounded-md'
          onChange={handleChange}
        >
          <option value='open' className='text-public-channel'>
            Open
          </option>
          <option value='closed' className='text-primary'>
            Closed
          </option>
          <option value='private' className='text-private-channel'>
            Private
          </option>
        </select>

        <button className='px-2 py-1 border border-primary/70 rounded-md'>Create</button>
      </form>
    </div>
  )
}

function ChannelCreator () {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useHotkeys('esc', () => close(), { enabled: isDialogOpen })

  const open = () => {
    setIsDialogOpen(true)
  }

  const close = () => {
    setIsDialogOpen(false)
  }

  return (
    <div className='relative'>
      <button
        className='border-2 rounded-md border-primary/70 px-2 py-1 font-bold bg-background min-h-[38px] hover:bg-secondary/10 hover:border-secondary group whitespace-nowrap flex gap-x-2 items-center'
        onClick={open}
      >
        <PlusIcon className='w-5 h-5 text-primary/70 group-hover:text-secondary' strokeWidth='2' />
        Create Channel
      </button>

      {isDialogOpen && <Dialog close={close} />}
    </div>
  )
}

export default ChannelCreator
