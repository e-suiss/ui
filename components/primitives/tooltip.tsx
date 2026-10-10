import { createFloating } from "./floating"

const { Close, Content, Overlay, Portal, Root, Trigger, useRootContext } =
  createFloating({
    name: "Tooltip",
    role: "tooltip",
    modal: false,
    accessibleContent: true,
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
