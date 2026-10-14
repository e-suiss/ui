import type { HostInstance } from "react-native"
import type {
  BaseUIChangeEventDetails,
  BaseUIGenericEventDetails,
  ChangeEvent,
} from "./types"

const REASONS = {
  none: "none",
  triggerPress: "trigger-press",
  triggerLongPress: "trigger-long-press",
  outsidePress: "outside-press",
  itemPress: "item-press",
  closePress: "close-press",
  backPress: "back-press",
  accessibilityEscape: "accessibility-escape",
  swipe: "swipe",
  imperativeAction: "imperative-action",
} as const

type BaseUIEventReason = (typeof REASONS)[keyof typeof REASONS]

function createChangeEventDetails<
  Reason extends string,
  CustomProperties extends object = Record<never, never>,
>(
  reason: Reason,
  event?: ChangeEvent,
  trigger?: HostInstance | null,
  customProperties?: CustomProperties
): BaseUIChangeEventDetails<Reason, CustomProperties> {
  let canceled = false
  const details = {
    reason,
    event,
    trigger: trigger ?? undefined,
    cancel() {
      canceled = true
    },
    get isCanceled() {
      return canceled
    },
    ...customProperties,
  }
  return details as BaseUIChangeEventDetails<Reason, CustomProperties>
}

function createGenericEventDetails<
  Reason extends string,
  CustomProperties extends object = Record<never, never>,
>(
  reason: Reason,
  event?: ChangeEvent,
  customProperties?: CustomProperties
): BaseUIGenericEventDetails<Reason, CustomProperties> {
  return { reason, event, ...customProperties } as BaseUIGenericEventDetails<
    Reason,
    CustomProperties
  >
}

export type { BaseUIEventReason }
export { createChangeEventDetails, createGenericEventDetails, REASONS }
