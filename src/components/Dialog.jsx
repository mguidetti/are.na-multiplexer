function Dialog ({ data: { isOpen, message, onConfirm }, setDialog }) {
  const handleConfirm = () => {
    onConfirm()
    close()
  }

  const close = () => {
    setDialog({ isOpen: false })
  }

  return (
    <div hidden={!isOpen}>
      <div className='fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-contrast-75 backdrop-brightness-50'>
        <div className='bg-zinc-900 drop-shadow-panel rounded border-2 border-primary/70 px-8 py-6'>
          {message && <p className='py-2 text-lg'>{message}</p>}

          <div className='mt-8 space-x-4 text-right'>
            <button
              onClick={close}
              className='px-4 py-1 border-2 border-primary/70 rounded-md hover:text-secondary hover:border-secondary hover:bg-secondary/20'
            >
              Cancel
            </button>
            {onConfirm && (
              <button
                onClick={handleConfirm}
                className='px-4 py-1 border-2 border-primary/70 rounded-md hover:text-secondary hover:border-secondary hover:bg-secondary/20'
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog
