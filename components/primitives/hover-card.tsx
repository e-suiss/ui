import { createFloating } from "./floating"

const { Close, Content, Overlay, Portal, Root, Trigger, useRootContext } =
  createFloating({
    name: "HoverCard",
    role: "dialog",
    modal: false,
    accessibleContent: false,
  })

export type {
  CloseProps,
  CloseRef,
  ContentProps,
  ContentRef,
  OverlayProps,
  OverlayRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
} from "./floating"
export { Close, Content, Overlay, Portal, Root, Trigger, useRootContext }
