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
import { Text } from "@/components/ui/text"

const meta = {
  title: "AI/Inline Citation",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="w-full gap-2">
      <Text>
        Suspense shows a fallback until its children finish loading, so the page
        can stream the rest of the content first.
      </Text>
      <View className="items-start">
        <Popover>
          <PopoverTrigger render={<Button variant="secondary" size="xs" />}>
            <Text>react.dev</Text>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72">
            <PopoverHeader>
              <PopoverTitle>&lt;Suspense&gt; – React</PopoverTitle>
              <PopoverDescription>
                Lets you display a fallback until its children have finished
                loading.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </View>
    </View>
  ),
}
