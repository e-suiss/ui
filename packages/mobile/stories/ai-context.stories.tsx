import type { Meta, StoryObj } from "@storybook/react-native"
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

const meta = {
  title: "AI/Context",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const usage = [
  { label: "Input", value: "11,200" },
  { label: "Output", value: "3,900" },
  { label: "Reasoning", value: "1,300" },
]

export const Default: Story = {
  render: () => (
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
              {usage.map((row) => (
                <View key={row.label} className="flex-row justify-between">
                  <Text className="text-sm text-muted-foreground">
                    {row.label}
                  </Text>
                  <Text className="text-sm tabular-nums">{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </PopoverContent>
      </Popover>
    </View>
  ),
}
