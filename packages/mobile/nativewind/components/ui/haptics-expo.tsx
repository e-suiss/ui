import {
  ImpactFeedbackStyle,
  impactAsync,
  NotificationFeedbackType,
  notificationAsync,
  selectionAsync,
} from "expo-haptics"
import type {
  HapticsAdapter,
  HapticsImpactStyle,
  HapticsNotificationType,
} from "@/components/ui/haptics"

const IMPACT_STYLES: Record<HapticsImpactStyle, ImpactFeedbackStyle> = {
  light: ImpactFeedbackStyle.Light,
  medium: ImpactFeedbackStyle.Medium,
  heavy: ImpactFeedbackStyle.Heavy,
  soft: ImpactFeedbackStyle.Soft,
  rigid: ImpactFeedbackStyle.Rigid,
}

const NOTIFICATION_TYPES: Record<
  HapticsNotificationType,
  NotificationFeedbackType
> = {
  success: NotificationFeedbackType.Success,
  warning: NotificationFeedbackType.Warning,
  error: NotificationFeedbackType.Error,
}

function ignore() {}

const expoHapticsAdapter: HapticsAdapter = {
  impact: (style) => {
    impactAsync(IMPACT_STYLES[style]).catch(ignore)
  },
  selection: () => {
    selectionAsync().catch(ignore)
  },
  notification: (type) => {
    notificationAsync(NOTIFICATION_TYPES[type]).catch(ignore)
  },
}

export { expoHapticsAdapter }
