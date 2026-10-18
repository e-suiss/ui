import { SunIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import {
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

function Hint({ children }: { children: React.ReactNode }) {
  return <Text className="mt-6 text-xs text-muted-foreground">{children}</Text>
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

export default function WidgetControlled() {
  return <ControlledEditing />
}
