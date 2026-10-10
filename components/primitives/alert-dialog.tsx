import {
  Backdrop,
  type BackdropProps,
  type BackdropState,
  type ChangeEventDetails,
  Close,
  type CloseProps,
  type CloseState,
  createHandle,
  Description,
  type DescriptionProps,
  type DescriptionState,
  DialogRootContext,
  type RootProps as DialogRootProps,
  Handle,
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
  Viewport,
  type ViewportProps,
  type ViewportState,
} from "./dialog"
import { resolvePayloadChildren } from "./floating-root"

type RootProps<Payload = unknown> = Omit<
  DialogRootProps<Payload>,
  "modal" | "disablePointerDismissal"
>

function Root<Payload = unknown>({
  children,
  ...parameters
}: RootProps<Payload>) {
  const context = useDialogRoot<Payload>({
    ...parameters,
    role: "alertdialog",
    modal: true,
    disablePointerDismissal: true,
  })
  return (
    <DialogRootContext.Provider value={context}>
      {resolvePayloadChildren(children, context.root.payload)}
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
  ViewportProps,
  ViewportState,
}
export {
  Backdrop,
  Close,
  createHandle,
  Description,
  Handle,
  Popup,
  Portal,
  Root,
  Title,
  Trigger,
  Viewport,
}
