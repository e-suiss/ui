import type * as React from "react"
import { View } from "react-native"
import {
  Close,
  type CloseProps,
  type CloseRef,
  type ContentProps,
  type ContentRef,
  Description,
  type DescriptionProps,
  type DescriptionRef,
  Content as DialogContent,
  Portal,
  type PortalProps,
  Root,
  type RootContextValue,
  type RootProps,
  type RootRef,
  Title,
  type TitleProps,
  type TitleRef,
  Trigger,
  type TriggerProps,
  type TriggerRef,
  useRootContext,
} from "./dialog"
import { Slot } from "./slot"
import type { ForceMountable, SlottableViewProps, ViewRef } from "./types"

type OverlayProps = ForceMountable & SlottableViewProps
type OverlayRef = ViewRef
type ActionProps = CloseProps
type CancelProps = CloseProps
type ActionRef = CloseRef
type CancelRef = CloseRef

function Overlay({
  asChild,
  forceMount,
  ref,
  ...props
}: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { open } = useRootContext()
  if (!forceMount && !open) return null
  const Component = asChild ? Slot : View
  return <Component ref={ref} accessible={false} {...props} />
}

Overlay.displayName = "AlertDialogOverlay"

function Content(props: ContentProps & React.RefAttributes<ContentRef>) {
  return <DialogContent role="alertdialog" {...props} />
}

Content.displayName = "AlertDialogContent"

function Action(props: ActionProps & React.RefAttributes<ActionRef>) {
  return <Close {...props} />
}

Action.displayName = "AlertDialogAction"

function Cancel(props: CancelProps & React.RefAttributes<CancelRef>) {
  return <Close {...props} />
}

Cancel.displayName = "AlertDialogCancel"

export type {
  ActionProps,
  ActionRef,
  CancelProps,
  CancelRef,
  ContentProps,
  ContentRef,
  DescriptionProps,
  DescriptionRef,
  OverlayProps,
  OverlayRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TitleProps,
  TitleRef,
  TriggerProps,
  TriggerRef,
}
export {
  Action,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
  useRootContext,
}
