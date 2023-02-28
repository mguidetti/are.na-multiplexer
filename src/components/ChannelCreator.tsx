import { useArena } from '@/hooks/useArena'
import getErrorMessage from '@/lib/getErrorMessage'
import { PlusIcon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'
import { ChannelStatus } from 'arena-ts'
import classNames from 'classnames'
import { ChangeEvent, FormEvent, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { useDesktopContext } from '../context/DesktopContext'
import Spinner from './Spinner'

interface FormDataType {
  name: string,
  privacy: SingleValue<{ value: ChannelStatus; label: ChannelStatus; }>
}

function ChannelCreator () {
  const desktop = useDesktopContext()
  const arena = useArena()

  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    privacy: { value: 'closed', label: 'closed' }
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSelectChange = (value: FormDataType['privacy']) => {
    setFormData({ ...formData, privacy: value })
  }

  const createChannel = async (event: FormEvent<SubmitEvent>) => {
    event.preventDefault()

    if (!arena) return

    setIsCreating(true)

    try {
      const results = await arena
        .channel(formData.name)
        .create(formData.privacy.value)

      if (results) {
        desktop.addChannelWindow(results)
        setFormData({ name: '', privacy: { value: 'closed', label: 'closed' } })
        setOpen(false)
      }
    } catch (error) {
      console.warn(error)
      setError(getErrorMessage(error))
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
          className={classNames('flex-col flex space-y-3', {
            invisible: isCreating
          })}
          onSubmit={createChannel}
        >
          <h2 className='font-bold'>Create New Channel</h2>

          <input
            name='name'
            placeholder='Name'
            className='rounded-md border-2 border-zinc-600 bg-background px-2 py-1 placeholder:text-zinc-600 focus:border-secondary/70 focus:bg-secondary/20 focus:outline-none'
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
              control: ({ menuIsOpen }) =>
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
              singleValue: (value) =>
                classNames({
                  '!text-public-channel': value === 'public',
                  '!text-private-channel': value === 'private'
                })
            }}
          />

          <button className='rounded-md border-2 border-zinc-600 bg-zinc-700 px-2 py-1 hover:border-secondary/70 hover:bg-secondary/30 hover:text-secondary'>
            Create
          </button>
        </form>
        <Popover.Arrow className='text-zinc-600' fill='currentColor' height="7" width="14" />
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChannelCreator
