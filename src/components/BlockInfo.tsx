import { ArrowTopRightOnSquareIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { Block } from '@aredotna/sdk/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Dispatch, SetStateAction } from 'react'
import BlockConnections from './BlockConnnections'

dayjs.extend(relativeTime)

interface BlockInfoProps {
  blockData: Block,
  setInfoVisible: Dispatch<SetStateAction<boolean>>
}

function BlockInfo ({ blockData, setInfoVisible }: BlockInfoProps) {
  const description = blockData.description
    ? (typeof blockData.description === 'object' ? blockData.description.plain : blockData.description)
    : null

  return (
    <div className='relative flex h-full flex-col text-zinc-400'>
      <button onClick={() => setInfoVisible(false)} title="Close Info" className='absolute top-0 left-0 flex items-center pt-2 pl-2 text-secondary hover:text-primary'>
        <ChevronRightIcon className='h-6 w-6'/>
      </button>

      <div className='mt-8 p-4'>
        <h1 className='truncate font-bold'>{blockData.title ?? 'Untitled'}</h1>
        <div className='mt-2 text-sm'>
          {description && <p className='mb-2'>{description}</p>}
          <p className='truncate'>
            Created {dayjs(blockData.created_at).fromNow()} by{' '}
            <a href={`https://www.are.na/${blockData.user.slug}`} target="_blank" rel="noreferrer" className='underline'>
              {blockData.user.name}<ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
            </a>
          </p>
          {blockData.source && (
            <span className='block truncate'>
              Source:{' '}
              <a href={blockData.source.url} className='underline' target='_blank' rel='noreferrer'>
                {blockData.source.title}<ArrowTopRightOnSquareIcon className='ml-1 inline h-3 w-3 align-text-top' />
              </a>
            </span>
          )}
        </div>
      </div>

      <div className='mx-4 border border-secondary/30'></div>

      <h2 className='px-4 pt-4 pb-2 font-bold text-secondary'>Connections</h2>

      <div className='h-full flex-1 overflow-y-auto pl-4 pr-2 pb-4 scrollbar-thin scrollbar-track-secondary/30 scrollbar-thumb-secondary/70'>
        <BlockConnections blockData={blockData}/>
      </div>
    </div>
  )
}

export default BlockInfo
