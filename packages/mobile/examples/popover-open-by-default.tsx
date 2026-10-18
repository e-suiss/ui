import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

const dimensions = [
  { id: "width", label: "Width", value: "100%" },
  { id: "max-width", label: "Max. width", value: "300px" },
  { id: "height", label: "Height", value: "25px" },
]

export default function PopoverOpenByDefault() {
  return (
    <View className="items-start">
      <Popover defaultOpen>
        <PopoverTrigger render={<Button variant="outline" />}>
          <Text>Open popover</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80">
          <View className="gap-4">
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>
                Set the dimensions for the layer.
              </PopoverDescription>
            </PopoverHeader>
            <View className="gap-2">
              {dimensions.map((dimension) => (
                <View
                  key={dimension.id}
                  className="flex-row items-center gap-4"
                >
                  <Label nativeID={`popover-${dimension.id}`} className="w-24">
                    {dimension.label}
                  </Label>
                  <Input
                    accessibilityLabelledBy={`popover-${dimension.id}`}
                    defaultValue={dimension.value}
                    className="h-8 flex-1"
                  />
                </View>
              ))}
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  )
}
