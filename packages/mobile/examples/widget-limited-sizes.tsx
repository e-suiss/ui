import { CalendarBlankIcon } from "phosphor-react-native"
import type * as React from "react"
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

const reservations = [
  { time: "18:00", place: "Table 4" },
  { time: "19:00", place: "Garden 3" },
  { time: "20:00", place: "Table 12" },
  { time: "21:00", place: "Table 7" },
]

function Hint({ children }: { children: React.ReactNode }) {
  return <Text className="mt-6 text-xs text-muted-foreground">{children}</Text>
}

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
            {reservations.slice(0, 3).map((item) => (
              <View key={item.time} className="flex-row gap-3">
                <Text className="w-11 text-sm text-muted-foreground">
                  {item.time}
                </Text>
                <Text className="flex-1 text-sm" numberOfLines={1}>
                  {item.place}
                </Text>
              </View>
            ))}
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
      <Hint>Only small and medium are offered.</Hint>
    </View>
  )
}
