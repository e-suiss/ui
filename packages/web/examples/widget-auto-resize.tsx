import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Widget,
  WidgetDescription,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
} from "@/components/ui/widget"

export default function WidgetAutoResize() {
  return (
    <div className="h-60 w-full max-w-180">
      <Widget resizable defaultSize="auto">
        <WidgetHeader>
          <WidgetIcon>
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
        <WidgetDescription>
          Fills its parent. Drag to snap to a size, double-click to fill again.
        </WidgetDescription>
      </Widget>
    </div>
  )
}
