import * as React from "react"
import { View } from "react-native"
import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { Text } from "@/components/ui/text"

export default function StepperPrint() {
  const [copies, setCopies] = React.useState(1)
  const [scale, setScale] = React.useState(100)

  return (
    <View className="w-full gap-3">
      <View className="overflow-hidden rounded-2xl border border-border">
        <View className="min-h-11 flex-row items-center justify-between gap-4 px-4 py-1.5">
          <Text nativeID="copies-label" className="text-base">
            Copies
          </Text>
          <Stepper value={copies} onValueChange={setCopies} min={1} max={999}>
            <StepperInput accessibilityLabelledBy="copies-label" />
            <StepperGroup>
              <StepperDecrement />
              <StepperSeparator />
              <StepperIncrement />
            </StepperGroup>
          </Stepper>
        </View>
        <View className="h-px bg-border" />
        <View className="min-h-11 flex-row items-center justify-between gap-4 px-4 py-1.5">
          <Text nativeID="scale-label" className="text-base">
            Scale
          </Text>
          <Stepper
            value={scale}
            onValueChange={setScale}
            min={25}
            max={400}
            step={5}
            format={{ style: "unit", unit: "percent" }}
          >
            <StepperInput accessibilityLabelledBy="scale-label" />
            <StepperGroup>
              <StepperDecrement />
              <StepperSeparator />
              <StepperIncrement />
            </StepperGroup>
          </Stepper>
        </View>
        <View className="h-px bg-border" />
        <View className="min-h-11 flex-row items-center justify-between gap-4 px-4 py-1.5">
          <Text nativeID="pages-label" className="text-base">
            Pages per sheet
          </Text>
          <Stepper defaultValue={1} disabled>
            <StepperInput accessibilityLabelledBy="pages-label" />
            <StepperGroup>
              <StepperDecrement />
              <StepperSeparator />
              <StepperIncrement />
            </StepperGroup>
          </Stepper>
        </View>
      </View>
      <Text
        accessibilityLiveRegion="polite"
        className="text-sm text-muted-foreground"
      >
        {copies} {copies === 1 ? "copy" : "copies"} at {scale}%
      </Text>
    </View>
  )
}
