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
      const results = await arena
        .channel(formData.name)
        .create(formData.privacy.value)

      if (results) {
        desktop.addChannelWindow(results)
        setFormData({ name: '', privacy: {} })
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
    { value: 'public', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'private', label: 'Private' }
  ]

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className='border-2 rounded-md border-zinc-600 px-2 py-1 font-bold bg-background min-h-[38px] hover:bg-secondary/10 hover:border-secondary/70 hover:text-secondary whitespace-nowrap flex gap-x-2 items-center data-[state=open]:text-secondary data-[state=open]:border-secondary/70 data-[state=open]:bg-secondary/10'>
        <PlusIcon
          className='w-5 h-5 text-inherit'
          strokeWidth='2'
          strokeLinecap='square'
        />
      </Popover.Trigger>
      <Popover.Content
        sideOffset={6}
        align={'end'}
        className='z-20 p-6 pt-4 border-2 rounded-md top-12 border-zinc-600 bg-zinc-900 drop-shadow-panel'
      >
        {isCreating && (
          <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full'>
            <Spinner />
          </div>
        )}

        {error && <p className='text-red'>{error.message}</p>}

        <form
          className={classNames('flex-col flex space-y-3', {
            invisible: isCreating
          })}
          onSubmit={createChannel}
        >
          <h2 className='font-bold'>Create New Channel</h2>

          <input
            name='name'
            placeholder='Name'
            className='px-2 py-1 border-2 rounded-md bg-background border-zinc-600 placeholder:text-zinc-600'
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <Select
            unstyled
            options={privacyOptions}
            onChange={handleSelectChange}
            isSearchable={false}
            placeholder='Privacy'
            required={true}
            classNames={{
              control: ({menuIsOpen}) =>
                classNames(
                  'bg-background border-2 rounded-md border-zinc-600 px-2',
                  { '!rounded-b-none !border-b-0 !transition-none': menuIsOpen }
                ),
              placeholder: () => 'text-zinc-600',
              dropdownIndicator: () => 'text-zinc-600',
              menu: () =>
                'bg-background border-2 border-t-0 border-zinc-600 rounded-b-md drop-shadow-panel',
              menuList: () => 'rounded-b-md',
              option: ({ value, isFocused }) =>
                classNames('py-1 px-2 text-primary truncate', {
                  'bg-secondary/50': isFocused,
                  '!text-public-channel': value === 'public',
                  '!text-private-channel': value === 'private'
                }),
              singleValue: () =>
                classNames({
                  '!text-public-channel': formData.privacy.value === 'public',
                  '!text-private-channel': formData.privacy.value === 'private'
                })
            }}
          />

          <button className='px-2 py-1 border-2 rounded-md border-zinc-600 bg-zinc-700 hover:text-secondary hover:border-secondary/70 hover:bg-secondary/30'>
            Create
          </button>
        </form>
        <Popover.Arrow className='text-zinc-600' fill='currentColor' />
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChannelCreator
