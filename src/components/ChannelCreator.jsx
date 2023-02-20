import { useArena } from '@/hooks/useArena'
import PlusIcon from '@/icons/plus.svg'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import Select from 'react-select'
import { DesktopContext } from '../context/DesktopContext'
import Spinner from './Spinner'

function ChannelCreator () {
  const desktop = useContext(DesktopContext)
  const arena = useArena()

  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    privacy: {}
  })
  const [error, setError] = useState(null)

  const handleChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSelectChange = value => {
    setFormData({ ...formData, privacy: value })
  }

  const createChannel = async event => {
    event.preventDefault()
    setIsCreating(true)

    try {
      const results = await arena.channel(formData.name).create(formData.privacy.value)

      if (results) {
        desktop.addChannelWindow(results)
        setFormData({name: '', privacy: {}})
        setOpen(false)
      }
    } catch (error) {
      console.warn(error)
      setError(error)
    } finally {
      setIsCreating(false)
    }
  }

  const privacyOptions = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'private', label: 'Private' }
  ]

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='border-2 rounded-md border-primary/70 px-2 py-1 font-bold bg-background min-h-[38px] hover:bg-secondary/10 hover:border-secondary hover:text-secondary whitespace-nowrap flex gap-x-2 items-center data-[state=open]:text-secondary data-[state=open]:border-secondary data-[state=open]:bg-secondary/10'>
        <PlusIcon className='w-5 h-5 text-inherit' strokeWidth='2' strokeLinecap='square' />
      </Popover.Trigger>
      <Popover.Content
        sideOffset={6}
        align={'end'}
        className='z-20 p-6 pt-4 border-2 rounded-md top-12 border-secondary bg-zinc-900 drop-shadow-panel'
      >
        {isCreating && (
          <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full'>
            <Spinner />
          </div>
        )}

        {error && <p className='text-red'>{error.message}</p>}

        <form className={classNames('flex-col flex space-y-3', { invisible: isCreating })} onSubmit={createChannel}>
          <h2>New Channel</h2>

          <input
            name='name'
            placeholder='Name'
            className='px-2 py-1 border-2 rounded-md bg-background border-primary/70'
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <Select
            unstyled
            options={privacyOptions}
            value={formData.privacy}
            onChange={handleSelectChange}
            classNames={{
              control: () => classNames('bg-background border-2 rounded-md border-primary/70 px-2', {}),
              menu: () => '-mt-1 bg-zinc-900 border-2 border-t-0 border-secondary rounded-b-md drop-shadow-panel',
              menuList: () => 'scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-secondary/30 rounded-b-md',
              option: ({ value, isFocused }) =>
                classNames('py-1 px-2 text-primary truncate', {
                  'bg-secondary/50': isFocused,
                  '!text-public-channel': value === 'open',
                  '!text-private-channel': value === 'private'
                })
            }}
          />

          <button className='px-2 py-1 border-2 rounded-md border-primary/70 hover:text-secondary hover:border-secondary hover:bg-secondary/10'>
            Create
          </button>
        </form>
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChannelCreator
