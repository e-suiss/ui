import { SunIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  Widget,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

export default function WidgetDemo() {
  return (
    <Widget size="small" align="start">
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
    </Widget>
  )
}
