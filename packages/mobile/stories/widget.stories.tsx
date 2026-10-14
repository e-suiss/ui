import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CalendarBlankIcon,
  CashRegisterIcon,
  CookingPotIcon,
  SunIcon,
} from "phosphor-react-native"
import * as React from "react"
import { ScrollView, View } from "react-native"
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
  type WidgetSize,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

const meta = {
  title: "Components/Widget",
  component: Widget,
  args: {
    size: "small",
    align: "start",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["auto", "small", "medium", "large", "extra-large"],
    },
    align: {
      control: "select",
      options: ["start", "center"],
    },
  },
} satisfies Meta<typeof Widget>

export default meta

type Story = StoryObj<typeof meta>

const hourly = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14].map(
  (value, hour) => ({ hour: hour + 10, value })
)

const topItems = [
  { name: "Grilled meatballs", count: 38 },
  { name: "Lahmacun", count: 31 },
  { name: "Adana kebab", count: 24 },
]

const reservations = [
  { time: "18:00", place: "Table 4" },
  { time: "19:00", place: "Garden 3" },
  { time: "20:00", place: "Table 12" },
  { time: "21:00", place: "Table 7" },
]

const gridSpans: Record<WidgetSize, string> = {
  small: "1 × 1",
  medium: "2 × 1",
  large: "2 × 2",
  "extra-large": "4 × 2",
}

function Hint({ children }: { children: React.ReactNode }) {
  return <Text className="mt-6 text-xs text-label-secondary">{children}</Text>
}

function Weather() {
  return (
    <>
      <WidgetHeader>
        <WidgetIcon>
          <Icon as={SunIcon} weight="fill" />
        </WidgetIcon>
        <WidgetTitle>Istanbul</WidgetTitle>
      </WidgetHeader>
      <WidgetContent>
        <WidgetValue>24°</WidgetValue>
        <WidgetDescription>Partly cloudy</WidgetDescription>
      </WidgetContent>
      <WidgetFooter>H 27° · L 18°</WidgetFooter>
    </>
  )
}

function SalesBody() {
  const { size } = useWidget()
  return (
    <>
      <WidgetHeader className="gap-1.5">
        <WidgetIcon size="sm" iconClassName="text-warning">
          <Icon as={CashRegisterIcon} weight="fill" />
        </WidgetIcon>
        <WidgetTitle className="text-warning">Hestia</WidgetTitle>
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
                    ? "flex-1 rounded-sm bg-warning"
                    : "flex-1 rounded-sm bg-warning/40"
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
              className="flex-row items-center justify-between border-b border-separator py-1.5"
            >
              <Text className="text-sm">{item.name}</Text>
              <Text className="text-sm text-label-secondary">{item.count}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <WidgetFooter>42 orders · 18:42</WidgetFooter>
    </>
  )
}

function ReservationsBody() {
  const { size } = useWidget()
  return (
    <>
      <WidgetHeader className="gap-1.5">
        <WidgetIcon size="sm" iconClassName="text-link">
          <Icon as={CalendarBlankIcon} weight="fill" />
        </WidgetIcon>
        <WidgetTitle className="text-link">Reservations</WidgetTitle>
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
                <Text className="w-11 text-sm text-label-secondary">
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

export const Default: Story = {
  render: (args) => (
    <Widget {...args}>
      <Weather />
    </Widget>
  ),
}

export const Sizes: Story = {
  render: () => (
    <ScrollView
      horizontal
      contentContainerClassName="items-start gap-4"
      showsHorizontalScrollIndicator={false}
    >
      {(["small", "medium", "large", "extra-large"] as const).map((size) => (
        <Widget key={size} size={size}>
          <WidgetHeader>
            <WidgetTitle className="capitalize">
              {size.replace("-", " ")}
            </WidgetTitle>
          </WidgetHeader>
          <WidgetFooter>{gridSpans[size]}</WidgetFooter>
        </Widget>
      ))}
    </ScrollView>
  ),
}

export const Editing: Story = {
  render: () => (
    <View className="w-full">
      <Widget resizable defaultSize="large">
        <SalesBody />
      </Widget>
      <Hint>
        Drag the corner handle to snap between sizes. Double tap it to reset.
      </Hint>
    </View>
  ),
}

export const InsideHandle: Story = {
  render: () => (
    <View className="w-full">
      <Widget resizable handle="inside" defaultSize="medium">
        <SalesBody />
      </Widget>
      <Hint>The handle sits inside the corner.</Hint>
    </View>
  ),
}

export const LimitedSizes: Story = {
  render: () => (
    <View className="w-full">
      <Widget resizable defaultSize="medium" sizes={["small", "medium"]}>
        <ReservationsBody />
      </Widget>
      <Hint>Only small and medium are offered.</Hint>
    </View>
  ),
}

function ControlledEditing() {
  const [size, setSize] = React.useState<WidgetSize | "auto">("small")
  return (
    <View className="w-full">
      <Widget resizable size={size} onSizeChange={setSize}>
        <Weather />
      </Widget>
      <Hint>{`Size: ${size}`}</Hint>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledEditing />,
}

export const Centered: Story = {
  args: { align: "center" },
  render: (args) => (
    <Widget {...args}>
      <WidgetHeader>
        <WidgetIcon size="lg">
          <Icon as={CashRegisterIcon} />
        </WidgetIcon>
        <WidgetTitle>Point of sale</WidgetTitle>
      </WidgetHeader>
      <WidgetDescription>3 open orders</WidgetDescription>
    </Widget>
  ),
}

export const Auto: Story = {
  render: () => (
    <View className="h-48 w-full">
      <Widget>
        <Weather />
      </Widget>
    </View>
  ),
}

export const Dashboard: Story = {
  render: () => (
    <ScrollView contentContainerClassName="gap-4">
      <View className="h-42 flex-row gap-4">
        <View className="flex-1">
          <Widget>
            <WidgetHeader>
              <WidgetIcon>
                <Icon as={SunIcon} weight="fill" />
              </WidgetIcon>
              <WidgetTitle>Istanbul</WidgetTitle>
            </WidgetHeader>
            <WidgetValue>24°</WidgetValue>
            <WidgetFooter>Partly cloudy</WidgetFooter>
          </Widget>
        </View>
        <View className="flex-1">
          <Widget align="center">
            <WidgetHeader>
              <WidgetIcon size="lg">
                <Icon as={CookingPotIcon} />
              </WidgetIcon>
              <WidgetTitle>Kitchen display</WidgetTitle>
            </WidgetHeader>
            <WidgetDescription>5 tickets</WidgetDescription>
          </Widget>
        </View>
      </View>
      <View className="h-42">
        <Widget>
          <WidgetHeader className="gap-1.5">
            <WidgetIcon size="sm" iconClassName="text-warning">
              <Icon as={CashRegisterIcon} weight="fill" />
            </WidgetIcon>
            <WidgetTitle className="text-warning">Hestia</WidgetTitle>
          </WidgetHeader>
          <WidgetValue>₺18,240</WidgetValue>
          <WidgetFooter>Today's revenue · 42 orders</WidgetFooter>
        </Widget>
      </View>
    </ScrollView>
  ),
}
