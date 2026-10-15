import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
          <IconPlaceholder
            lucide="SunIcon"
            tabler="IconSun"
            hugeicons="Sun03Icon"
            phosphor="SunIcon"
            remixicon="RiSunLine"
            className="fill-current"
          />
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
