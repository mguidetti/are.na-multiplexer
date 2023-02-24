import { BlockContext } from '@/context/BlockContext'
import { WindowContext } from '@/context/WindowContext'
import { EyeIcon, LinkIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useContext } from 'react'

function BlockActions () {
  const blockCtx = useContext(BlockContext)
  const windowCtx = useContext(WindowContext)

  return (
    <>
      {blockCtx.data.class === 'Link' && (
        <a
          className='h-5 w-5 hover:text-secondary'
          title='Visit source'
          href={blockCtx.data.source.url}
          target='_blank'
          rel='noreferrer'
        >
          <LinkIcon strokeWidth='2' />
        </a>
      )}
      <button className='h-5 w-5 hover:text-secondary' title='View' onClick={blockCtx.handleView}>
        <EyeIcon />
      </button>
      {windowCtx.canDelete && (
        <button className='h-5 w-5 hover:text-secondary' title='Disconnect' onClick={blockCtx.handleDelete}>
          <TrashIcon />
        </button>
      )}
    </>
  )
}

export default BlockActions
