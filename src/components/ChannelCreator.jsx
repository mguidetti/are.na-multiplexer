import { useArena } from '@/hooks/useArena'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import PlusIcon from '@/icons/plus.svg'
import classNames from 'classnames'
import { useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import Select from 'react-select'
import { DesktopContext } from '../context/DesktopContext'
import Spinner from './Spinner'

function Dialog ({ close }) {
  const desktop = useContext(DesktopContext)
  const arena = useArena()

  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    privacy: ''
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
        desktop.addChannel(results)
        setFormData({})
        close()
      }
    } catch (error) {
      console.log(error)
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

  const outsideClickRef = useOutsideClick(close)

  return (
    <div
      className='absolute top-12 left-0 z-50 border-2 border-secondary bg-zinc-900 p-6 pt-4 rounded-md drop-shadow-panel'
      ref={outsideClickRef}
    >
      {isCreating && (
        <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center z-10'>
          <Spinner />
        </div>
      )}

      {error && <p className='text-red'>{error.message}</p>}

      <form
        className={classNames('flex-col flex space-y-3', { invisible: isCreating })}
        onSubmit={createChannel}
      >
        <h2>New Channel</h2>

        <input
          name='name'
          placeholder='Name'
          className='bg-background px-2 py-1 border-primary/70 border-2 rounded-md'
          value={formData.name}
          onChange={handleChange}
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

        <button className='px-2 py-1 border-2 border-primary/70 rounded-md hover:text-secondary hover:border-secondary hover:bg-secondary/10'>
          Create
        </button>
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
        className={classNames(
          'border-2 rounded-md border-primary/70 px-2 py-1 font-bold bg-background min-h-[38px] hover:bg-secondary/10 hover:border-secondary hover:text-secondary group whitespace-nowrap flex gap-x-2 items-center',
          { 'bg-secondary/10 !border-secondary text-secondary': isDialogOpen }
        )}
        onClick={open}
      >
        <PlusIcon className='w-5 h-5 text-inherit' strokeWidth='2' strokeLinecap='square' />
      </button>

      {isDialogOpen && <Dialog close={close} />}
    </div>
  )
}

export default ChannelCreator
