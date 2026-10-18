import { CashRegisterIcon } from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
import {
  Widget,
  WidgetDescription,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
} from "@/components/ui/widget"

export default function WidgetCentered() {
  return (
    <Widget size="small" align="center">
      <WidgetHeader>
        <WidgetIcon size="lg">
          <Icon as={CashRegisterIcon} />
        </WidgetIcon>
        <WidgetTitle>Point of sale</WidgetTitle>
      </WidgetHeader>
      <WidgetDescription>3 open orders</WidgetDescription>
    </Widget>
  )
}
