import { BlockContext } from '@/context/BlockContext'
import { WindowContext } from '@/context/WindowContext'
import EyeIcon from '@/icons/eye.svg'
import LinkIcon from '@/icons/link.svg'
import TrashIcon from '@/icons/trash.svg'
import { useContext } from 'react'

function BlockActions () {
  const blockCtx = useContext(BlockContext)
  const windowCtx = useContext(WindowContext)

  return (
    <>
      {blockCtx.data.class === 'Link' && (
        <a
          className='w-5 h-5 hover:text-secondary'
          title='Visit source'
          href={blockCtx.data.source.url}
          target='_blank'
          rel='noreferrer'
        >
          <LinkIcon strokeWidth='2' />
        </a>
      )}
      <button className='w-5 h-5 hover:text-secondary' title='View' onClick={blockCtx.handleView}>
        <EyeIcon />
      </button>
      {windowCtx.canDelete && (
        <button className='w-5 h-5 hover:text-secondary' title='Disconnect' onClick={blockCtx.handleDelete}>
          <TrashIcon />
        </button>
      )}
    </>
  )
}

export default BlockActions
