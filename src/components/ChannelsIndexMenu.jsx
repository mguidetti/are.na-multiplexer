import { DesktopContext } from '@/context/DesktopContext'
import { useArena } from '@/hooks/useArena'
import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/react/20/solid'
import { Bars4Icon } from '@heroicons/react/24/solid'
import * as Popover from '@radix-ui/react-popover'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import { forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import Spinner from './Spinner'
import WindowScroller from './WindowScroller'

const ListContainer = forwardRef(function ListContainer (props, ref) {
  return <ul {...props} ref={ref} />
})

function ItemContainer (props) {
  return <li {...props} className='w-full' />
}

function Footer ({ loadingStatus }) {
  return (
    <div className='flex w-full items-center justify-center'>
      {loadingStatus === 'active' && (
        <div className='px-2 py-4'>
          <Spinner className='h-8 w-8' />
        </div>
      )}
    </div>
  )
}

function ChannelsIndexMenu () {
  const arena = useArena()
  const desktopCtx = useContext(DesktopContext)
  const session = useSession() || {}
  const { data } = session

  const [initialized, setInitialized] = useState(false)
  const [open, setOpen] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('inactive')
  const [sort, setSort] = useState('updated_at')
  const [direction, setDirection] = useState('asc')
  const [page, setPage] = useState(1)
  const [channels, setChannels] = useState([])
  const [error, setError] = useState(null)
  const [visibleRange, setVisibleRange] = useState({
    startIndex: 0,
    endIndex: 0
  })

  const handleInitialize = () => {
    if (initialized) return

    setInitialized(true)
    fetchChannels()
  }

  const fetchChannels = useCallback(async () => {
    if (!arena) return
    if (loadingStatus === 'complete') return

    setLoadingStatus('active')

    const results = await arena
      .user(data.user.id)
      .channels({ page, per: 30, sort, direction })

    try {
      setChannels([...channels, ...results.channels])
    } catch (error) {
      setError(error)
      console.error(error)
    } finally {
      const nextPage = page + 1

      if (nextPage > results.total_pages) {
        setLoadingStatus('complete')
      } else {
        setPage(nextPage)
        setLoadingStatus('waiting')
      }
    }
  }, [arena, channels, data, loadingStatus, page, direction, sort])

  const handleSelect = channel => {
    desktopCtx.addChannelWindow(channel)
    setOpen(false)
  }

  const reset = () => {
    setChannels([])
    setPage(1)
    setLoadingStatus('inactive')
  }

  const handleSortChange = event => {
    reset()
    setSort(event.target.value)
  }

  const handleToggleDirection = () => {
    reset()
    setDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'))
  }

  useEffect(() => {
    fetchChannels()
  }, [sort, direction])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className='flex min-h-[38px] items-center gap-x-2 whitespace-nowrap rounded-md border-2 border-zinc-600 bg-background px-2 py-1 font-bold data-[state=open]:border-secondary/70 data-[state=open]:bg-secondary/10 data-[state=open]:text-secondary hover:border-secondary/70 hover:bg-secondary/10 hover:text-secondary'
        onClick={handleInitialize}
      >
        <Bars4Icon
          className='h-5 w-5 text-inherit'
          strokeWidth='2'
          strokeLinecap='square'
        />
      </Popover.Trigger>
      <Popover.Content
        sideOffset={1}
        align='end'
        className='z-20 w-[90vw] max-w-[431px] rounded-md border-2 border-zinc-600  bg-zinc-900 drop-shadow-panel'
      >
        <div className='flex items-center rounded-t-md p-2'>
          <h2 className='flex-1 font-bold'>Your Channels</h2>
          <div className='flex items-stretch gap-x-2'>
            <select
              name='channel-index-sort'
              className='rounded border-2 border-zinc-600 bg-background p-1 focus:bg-secondary/20 focus:outline-none'
              onChange={handleSortChange}
              value={sort}
            >
              <option value='string' className='bg-background'>
                Alphabetical
              </option>
              <option value='created_at' className='bg-background'>
                Created at
              </option>
              <option value='updated_at' className='bg-background'>
                Updated at
              </option>
            </select>

            <button
              onClick={handleToggleDirection}
              className='rounded border-2 border-zinc-600 bg-background p-1 focus:bg-secondary/20 focus:outline-none'
            >
              {direction === 'asc' && <BarsArrowUpIcon className='h-5 w-5' />}
              {direction === 'desc' && (
                <BarsArrowDownIcon className='h-5 w-5' />
              )}
            </button>
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div className='h-96 border-t-2 border-zinc-600 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-500'>
          <Virtuoso
            data={channels}
            endReached={fetchChannels}
            rangeChanged={setVisibleRange}
            initialTopMostItemIndex={visibleRange.startIndex}
            components={{
              List: ListContainer,
              Item: ItemContainer,
              Scroller: WindowScroller,
              Footer: () => <Footer loadingStatus={loadingStatus} />
            }}
            itemContent={(index, channel) => (
              <button
                key={channel.id}
                disabled={Object.keys(desktopCtx.channels).includes(
                  channel.id.toString()
                )}
                onClick={() => handleSelect(channel)}
                className={classNames(
                  'py-1 px-2 text-primary font-bold truncate hover:bg-secondary/50 w-full text-left grid grid-cols-[1fr_min-content] items-center disabled:opacity-25 disabled:pointer-events-none',
                  {
                    '!text-public-channel': channel.status === 'public',
                    '!text-private-channel': channel.status === 'private'
                  }
                )}
              >
                <div>{channel.title}</div>
                <div className='text-xs font-normal'>
                  {channel.length} blocks
                </div>
              </button>
            )}
          />
        </div>

        <Popover.Arrow
          className='text-zinc-600'
          fill='currentColor'
          height='7'
          width='14'
        />
      </Popover.Content>
    </Popover.Root>
  )
}

export default ChannelsIndexMenu
