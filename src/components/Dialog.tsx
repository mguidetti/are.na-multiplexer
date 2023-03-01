import { useDialogActionsContext, useDialogContext } from '@/context/DialogContext'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

function Dialog () {
  const { isOpen, message, onConfirm, title } = useDialogContext()
  const setDialog = useDialogActionsContext()

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={open => setDialog({ isOpen: open })}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className='fixed inset-0 z-50 backdrop-brightness-50 backdrop-contrast-75' />
        <AlertDialog.Content className='fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-primary/70 bg-zinc-900 px-8 py-6 text-primary drop-shadow-panel'>
          {title && <AlertDialog.Title className='py-2 text-xl'>{title}</AlertDialog.Title>}
          {message && <AlertDialog.Description className='py-2 text-base'>{message}</AlertDialog.Description>}
          <div className='mt-4 flex justify-end space-x-4'>
            <AlertDialog.Cancel asChild>
              <button className='rounded-md border-2 border-primary/70 px-4 py-1 hover:bg-primary/20'>Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                className='rounded-md border-2 border-secondary/20 bg-secondary/20 px-4 py-1 text-secondary hover:bg-secondary/50'
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
