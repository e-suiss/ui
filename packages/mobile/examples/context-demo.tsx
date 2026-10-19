import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Text } from "@/components/ui/text"

export default function ContextDemo() {
  return (
    <View className="items-start">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" />}>
          <Text>8% context</Text>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72">
          <View className="gap-4">
            <PopoverHeader>
              <PopoverTitle>16,400 of 200,000 tokens</PopoverTitle>
              <PopoverDescription>Claude Opus 5.5</PopoverDescription>
            </PopoverHeader>
            <Progress value={8} />
            <View className="gap-1.5">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Input</Text>
                <Text className="text-sm tabular-nums">11,200</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Output</Text>
                <Text className="text-sm tabular-nums">3,900</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Reasoning</Text>
                <Text className="text-sm tabular-nums">1,300</Text>
              </View>
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  )
}
