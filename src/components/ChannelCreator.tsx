import { useArena } from '@/hooks/useArena'
import getErrorMessage from '@/lib/getErrorMessage'
import { PlusIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'
import { ArenaChannelWithDetails, ChannelStatus } from 'arena-ts'
import classNames from 'classnames'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useDesktopActionsContext } from '../context/DesktopContext'
import Spinner from './Spinner'

interface FormDataType {
  name: '',
  privacy: ChannelStatus | ''
}

function ChannelCreator () {
  const { addChannelWindow } = useDesktopActionsContext()
  const arena = useArena()

  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    privacy: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const createChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!arena || formData.name === '' || formData.privacy === '') return

    setIsCreating(true)

    try {
      const results = await arena
        .channel(formData.name)
        .create(formData.privacy)

      if (results) {
        addChannelWindow(results as ArenaChannelWithDetails)
        setFormData({ name: '', privacy: '' })
        setOpen(false)
      }
    } catch (error) {
      console.warn(error)
      setError(getErrorMessage(error))
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='flex min-h-[38px] items-center gap-x-2 whitespace-nowrap rounded-md border-2 border-zinc-600 bg-background px-2 py-1 font-bold data-[state=open]:border-secondary/70 data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary hover:border-secondary/70 hover:bg-secondary/10 hover:text-secondary'>
        <PlusIcon
          className='h-5 w-5 text-inherit'
          strokeWidth='2'
          strokeLinecap='square'
        />
      </Popover.Trigger>
      <Popover.Content
        sideOffset={1}
        align={'end'}
        className='z-20 rounded-md border-2 border-zinc-600 bg-zinc-900 p-4 drop-shadow-panel'
      >
        {isCreating && (
          <div className='absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center'>
            <Spinner />
          </div>
        )}

        {error && <p className='text-red-500'>{error}</p>}

        <form
          className={classNames('flex-col flex space-y-4', { invisible: isCreating })}
          onSubmit={createChannel}
        >
          <h2 className='font-bold'>Create New Channel</h2>

          <input
            name='name'
            placeholder='Name'
            className='h-9 rounded-md border-2 border-zinc-600 bg-background px-2 placeholder:text-zinc-600 focus:border-secondary/70 focus:bg-secondary/20 focus:outline-none'
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <select
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            required={true}
            className={classNames('rounded-md border-2 border-zinc-600 bg-background h-9 px-1 text-zinc-600', {
              'text-public-channel': formData.privacy === 'public',
              'text-primary': formData.privacy === 'closed',
              'text-private-channel': formData.privacy === 'private'
            })}
          >
            <option value="" disabled={true} className="text-zinc-600">Privacy</option>
            <option value="public" className='text-public-channel'>Open</option>
            <option value="closed" className='text-primary'>Closed</option>
            <option value="private"className='text-private-channel'>Private</option>
          </select>

          <button className='h-9 rounded-md border-2 border-zinc-600 bg-zinc-700 px-2 hover:border-secondary/70 hover:bg-secondary/30 hover:text-secondary'>
            Create
          </button>
        </form>
        <Popover.Arrow className='text-zinc-600' fill='currentColor' height="7" width="14" />
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChannelCreator
