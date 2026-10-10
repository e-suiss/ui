import {
  Backdrop,
  type BackdropProps,
  type BackdropState,
  type ChangeEventDetails,
  Close,
  type CloseProps,
  type CloseState,
  Description,
  type DescriptionProps,
  type DescriptionState,
  DialogRootContext,
  type RootProps as DialogRootProps,
  type OpenChangeReason,
  Popup,
  type PopupProps,
  type PopupState,
  Portal,
  type PortalProps,
  type RootActions,
  Title,
  type TitleProps,
  type TitleState,
  Trigger,
  type TriggerProps,
  type TriggerState,
  useDialogRoot,
} from "./dialog"

type RootProps = Omit<DialogRootProps, "modal" | "disablePointerDismissal">

function Root({ children, ...parameters }: RootProps) {
  const context = useDialogRoot({
    ...parameters,
    role: "alertdialog",
    modal: true,
    disablePointerDismissal: true,
  })
  return (
    <DialogRootContext.Provider value={context}>
      {children}
    </DialogRootContext.Provider>
  )
}

Root.displayName = "AlertDialogRoot"

export type {
  BackdropProps,
  BackdropState,
  ChangeEventDetails,
  CloseProps,
  CloseState,
  DescriptionProps,
  DescriptionState,
  OpenChangeReason,
  PopupProps,
  PopupState,
  PortalProps,
  RootActions,
  RootProps,
  TitleProps,
  TitleState,
  TriggerProps,
  TriggerState,
}
export { Backdrop, Close, Description, Popup, Portal, Root, Title, Trigger }
