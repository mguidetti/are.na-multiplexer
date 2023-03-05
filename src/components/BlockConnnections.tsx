import { useBlockViewerActionsContext } from '@/context/BlockViewerContext'
import { useDesktopActionsContext } from '@/context/DesktopContext'
import { useArena } from '@/hooks/useArena'
import { ArenaBlock, ArenaChannelWithDetails, ConnectionData } from 'arena-ts'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import Spinner from './Spinner'

function BlockConnections ({ blockData }: {blockData: ArenaBlock & ConnectionData}) {
  const [connections, setConnections] = useState<ArenaChannelWithDetails[]>([])
  const arena = useArena()
  const { addChannelWindow } = useDesktopActionsContext()
  const setBlockViewerData = useBlockViewerActionsContext()

  const fetchChannels = useCallback(async () => {
    if (!arena) return

    const results = await arena.block(blockData.id).channels()

    setConnections(results.channels)
  }, [arena, blockData])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  const handleChannelClick = (channel: ArenaChannelWithDetails) => {
    addChannelWindow(channel)
    setBlockViewerData(null)
  }

  if (connections.length) {
    return (
      <ul className='space-y-2'>
        {connections.map(channel => (
          <li key={channel.id}>
            <button
              onClick={() => handleChannelClick(channel)}
              title={`Open ${channel.title}`}
              className={classNames('w-full rounded-sm border-2 p-2 text-left flex items-center channel-block hover:bg-dot-grid-secondary', {
                'channel-status-private': channel.status === 'private',
                'channel-status-public': channel.status === 'public',
                'channel-status-closed': channel.status === 'closed'
              })}
            >
              <span className='flex-1 truncate font-bold'>{channel.title}</span>
              <span className='truncate text-sm'>by {channel.user?.username}</span></button>
          </li>
        ))}
      </ul>
    )
  } else {
    return <div className='flex items-center text-secondary'><Spinner className='mr-2 inline h-6 w-6'/>Loading connections</div>
  }
}

export default BlockConnections
