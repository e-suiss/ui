import { CashRegisterIcon } from "phosphor-react-native"
import type * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
  useWidget,
  Widget,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

const hourly = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14].map(
  (value, hour) => ({ hour: hour + 10, value })
)

const topItems = [
  { name: "Grilled meatballs", count: 38 },
  { name: "Lahmacun", count: 31 },
  { name: "Adana kebab", count: 24 },
]

function Hint({ children }: { children: React.ReactNode }) {
  return <Text className="mt-6 text-xs text-muted-foreground">{children}</Text>
}

function SalesBody() {
  const { size } = useWidget()
  return (
    <>
      <WidgetHeader className="gap-1.5">
        <WidgetIcon
          size="sm"
          iconClassName="text-amber-600 dark:text-amber-400"
        >
          <Icon as={CashRegisterIcon} weight="fill" />
        </WidgetIcon>
        <WidgetTitle className="text-amber-600 dark:text-amber-400">
          Hestia
        </WidgetTitle>
      </WidgetHeader>
      <View
        className={
          size === "medium"
            ? "min-h-0 grow flex-row items-end gap-3"
            : "min-h-0 gap-3"
        }
      >
        <WidgetContent className="grow-0">
          <WidgetValue>₺18,240</WidgetValue>
          <WidgetDescription>Today's revenue</WidgetDescription>
        </WidgetContent>
        {size === "small" ? null : (
          <View
            className={
              size === "medium"
                ? "h-full flex-1 flex-row items-end gap-1"
                : "h-14 flex-row items-end gap-1"
            }
          >
            {hourly.map(({ hour, value }) => (
              <View
                key={hour}
                className={
                  value === 100
                    ? "flex-1 rounded-sm bg-amber-500"
                    : "flex-1 rounded-sm bg-amber-500/40"
                }
                style={{ height: `${value}%` }}
              />
            ))}
          </View>
        )}
      </View>
      {size === "large" || size === "extra-large" ? (
        <View className="min-h-0 shrink overflow-hidden">
          {topItems.map((item) => (
            <View
              key={item.name}
              className="flex-row items-center justify-between border-b border-border py-1.5"
            >
              <Text className="text-sm">{item.name}</Text>
              <Text className="text-sm text-muted-foreground">
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <WidgetFooter>42 orders · 18:42</WidgetFooter>
    </>
  )
}

export default function WidgetInsideHandle() {
  return (
    <View className="w-full">
      <Widget resizable handle="inside" defaultSize="medium">
        <SalesBody />
      </Widget>
      <Hint>The handle sits inside the corner.</Hint>
    </View>
  )
}
