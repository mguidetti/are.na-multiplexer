import { useBlockContext } from '@/context/BlockContext'
import { useWindowContext } from '@/context/WindowContext'
import { EyeIcon, LinkIcon, TrashIcon } from '@heroicons/react/20/solid'

function BlockActions () {
  const { data, handleView, handleDelete } = useBlockContext()
  const windowCtx = useWindowContext()

  return (
    <>
      {data.class === 'Link' && (
        <a
          className='h-5 w-5 hover:text-secondary'
          title='Visit source'
          href={data.source?.url}
          target='_blank'
          rel='noreferrer'
        >
          <LinkIcon strokeWidth='2' />
        </a>
      )}
      <button className='h-5 w-5 hover:text-secondary' title='View' onClick={handleView}>
        <EyeIcon />
      </button>
      {windowCtx.canDelete && (
        <button className='h-5 w-5 hover:text-secondary' title='Disconnect' onClick={handleDelete}>
          <TrashIcon />
        </button>
      )}
    </>
  )
}

export default BlockActions
