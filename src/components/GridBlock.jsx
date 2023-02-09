import Block from './Block'

function AttachmentBlock ({ data }) {
  if (data.image) {
    return <ImageBlock data={data} />
  } else {
    return (
      <div className='bg-zinc-800 p-2 h-full w-full overflow-hidden flex items-center justify-center'>
        <p className='text-md-relative font-bold'>{data.generated_title}</p>
      </div>
    )
  }
}

function ChannelBlock ({ data }) {
  return (
    <div
      className={`h-full w-full flex items-center justify-center border-2 channel-status-${data.status} channel-block p-2`}
    >
      <p className='text-center text-sm-relative text-inherit'>{data.title}</p>
    </div>
  )
}

function ImageBlock ({ data }) {
  return (
    <>
      <img src={data.image?.thumb?.url} alt='' className='aspect-square object-contain w-full h-full p-0' />
    </>
  )
}

function TextBlock ({ data }) {
  return (
    <div className='border border-primary/25 p-2 h-full w-full overflow-hidden'>
      <p className='text-xs-relative'>{data.content}</p>
    </div>
  )
}

function GridBlock ({ data, disconnectBlock }) {
  const renderBlock = () => {
    switch (data.class) {
      case 'Attachment':
        return <AttachmentBlock data={data} />
      case 'Channel':
        return <ChannelBlock data={data} />
      case 'Image':
        return <ImageBlock data={data} />
      case 'Media':
        return <ImageBlock data={data} />
      case 'Link':
        return <ImageBlock data={data} />
      case 'Text':
        return <TextBlock data={data} />
    }
  }

  return (
    <Block data={data} disconnectBlock={disconnectBlock}>
      <div className='group relative text-primary aspect-square w-full h-full flex flex-col justify-center items-center cursor-pointer hover:outline hover:outline-2 hover:outline-secondary'>
        {renderBlock()}
        <div className='absolute h-full w-full group-hover:bg-secondary z-10 opacity-10' />
      </div>
    </Block>
  )
}

export default GridBlock
