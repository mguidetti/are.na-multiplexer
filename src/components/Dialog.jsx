import * as AlertDialog from '@radix-ui/react-alert-dialog'

function Dialog ({ data: { isOpen, title, message, onConfirm }, setDialog }) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={open => setDialog({ isOpen: open })}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='fixed inset-0 z-50 backdrop-contrast-75 backdrop-brightness-50' />
        <AlertDialog.Content className='fixed px-8 py-6 w-[90vw] max-w-[500px] max-h-[85vh] border-2 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 drop-shadow-panel border-primary/70 z-50 text-primary'>
          {title && <AlertDialog.Title className='py-2 text-xl'>{title}</AlertDialog.Title>}
          {message && <AlertDialog.Description className='py-2 text-base'>{message}</AlertDialog.Description>}
          <div className='flex justify-end mt-4 space-x-4'>
            <AlertDialog.Cancel asChild>
              <button className='px-4 py-1 border-2 rounded-md border-primary/70 hover:bg-primary/20'>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className='px-4 py-1 border-2 rounded-md border-secondary/20 bg-secondary/20 text-secondary hover:bg-secondary/50'
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default Dialog
