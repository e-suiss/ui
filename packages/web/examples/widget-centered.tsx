import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
          <IconPlaceholder
            lucide="CalculatorIcon"
            tabler="IconCashRegister"
            hugeicons="CashierIcon"
            phosphor="CashRegisterIcon"
            remixicon="RiCalculatorLine"
          />
        </WidgetIcon>
        <WidgetTitle>Point of sale</WidgetTitle>
      </WidgetHeader>
      <WidgetDescription>3 open orders</WidgetDescription>
    </Widget>
  )
}
