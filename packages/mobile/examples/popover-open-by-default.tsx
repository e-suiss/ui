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
              <View className="flex-row items-center gap-4">
                <Label nativeID="popover-width" className="w-24">
                  Width
                </Label>
                <Input
                  accessibilityLabelledBy="popover-width"
                  defaultValue="100%"
                  className="h-8 flex-1"
                />
              </View>
              <View className="flex-row items-center gap-4">
                <Label nativeID="popover-max-width" className="w-24">
                  Max. width
                </Label>
                <Input
                  accessibilityLabelledBy="popover-max-width"
                  defaultValue="300px"
                  className="h-8 flex-1"
                />
              </View>
              <View className="flex-row items-center gap-4">
                <Label nativeID="popover-height" className="w-24">
                  Height
                </Label>
                <Input
                  accessibilityLabelledBy="popover-height"
                  defaultValue="25px"
                  className="h-8 flex-1"
                />
              </View>
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  )
}
