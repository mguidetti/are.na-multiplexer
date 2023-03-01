import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react'

export interface DialogState {
  isOpen: boolean,
  title?: string,
  message?: string,
  onConfirm?: () => void
}

export const DialogContext = createContext<DialogState>({} as DialogState)
export const DialogActionsContext = createContext({} as Dispatch<SetStateAction<DialogState>>)

export const useDialogContext = () => useContext(DialogContext)
export const useDialogActionsContext = () => useContext(DialogActionsContext)

export const DialogContextProvider = ({ children }: {children: ReactNode}) => {
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false })

  return (
    <DialogContext.Provider value={dialog}>
      <DialogActionsContext.Provider value={setDialog}>
        {children}
      </DialogActionsContext.Provider>
    </DialogContext.Provider>
  )
}
