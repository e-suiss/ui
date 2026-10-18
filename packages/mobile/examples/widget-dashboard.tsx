import {
  CashRegisterIcon,
  CookingPotIcon,
  SunIcon,
} from "phosphor-react-native"
import { ScrollView, View } from "react-native"
import { Icon } from "@/components/ui/icon"
import {
  Widget,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

export default function WidgetDashboard() {
  return (
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
          <WidgetValue>₺18,240</WidgetValue>
          <WidgetFooter>Today's revenue · 42 orders</WidgetFooter>
        </Widget>
      </View>
    </ScrollView>
  )
}
