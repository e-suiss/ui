import * as React from "react"
import { View } from "react-native"
import * as CheckboxGroupPrimitive from "@/components/primitives/checkbox-group"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field"
import { Text } from "@/components/ui/text"

const TOPPINGS = ["cheese", "olives", "peppers"]

function ToppingsDemo() {
  const [value, setValue] = React.useState<string[]>(["cheese"])
  return (
    <FieldSet>
      <FieldLegend>Toppings</FieldLegend>
      <FieldDescription>Choose what goes on your pizza.</FieldDescription>
      <CheckboxGroupPrimitive.Root
        value={value}
        onValueChange={setValue}
        allValues={TOPPINGS}
        className="gap-3"
      >
        <View className="flex-row items-center gap-3">
          <Checkbox parent />
          <Text>All toppings</Text>
        </View>
        {TOPPINGS.map((topping) => (
          <View key={topping} className="flex-row items-center gap-3 ps-6">
            <Checkbox value={topping} />
            <Text className="capitalize">{topping}</Text>
          </View>
        ))}
      </CheckboxGroupPrimitive.Root>
    </FieldSet>
  )
}

export default function FieldCheckboxGroup() {
  return <ToppingsDemo />
}
