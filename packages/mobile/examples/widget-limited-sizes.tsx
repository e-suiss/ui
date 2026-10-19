import { CalendarBlankIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  useWidget,
  Widget,
  WidgetContent,
  WidgetDescription,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

function ReservationsBody() {
  const { size } = useWidget()
  return (
    <>
      <WidgetHeader className="gap-1.5">
        <WidgetIcon size="sm" iconClassName="text-primary">
          <Icon as={CalendarBlankIcon} weight="fill" />
        </WidgetIcon>
        <WidgetTitle className="text-primary">Reservations</WidgetTitle>
      </WidgetHeader>
      <View className="min-h-0 grow flex-row items-end gap-4">
        <WidgetContent className="grow-0">
          <WidgetValue>12</WidgetValue>
          <WidgetDescription>Tonight</WidgetDescription>
        </WidgetContent>
        {size === "medium" ? (
          <View className="flex-1 gap-1">
            <View className="flex-row gap-3">
              <Text className="w-11 text-sm text-muted-foreground">18:00</Text>
              <Text className="flex-1 text-sm" numberOfLines={1}>
                Table 4
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="w-11 text-sm text-muted-foreground">19:00</Text>
              <Text className="flex-1 text-sm" numberOfLines={1}>
                Garden 3
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Text className="w-11 text-sm text-muted-foreground">20:00</Text>
              <Text className="flex-1 text-sm" numberOfLines={1}>
                Table 12
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </>
  )
}

export default function WidgetLimitedSizes() {
  return (
    <View className="w-full">
      <Widget resizable defaultSize="medium" sizes={["small", "medium"]}>
        <ReservationsBody />
      </Widget>
      <Text className="mt-6 text-xs text-muted-foreground">
        Only small and medium are offered.
      </Text>
    </View>
  )
}
