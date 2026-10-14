import type { Meta, StoryObj } from "@storybook/react-native"
import { ScrollView, View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Text } from "@/components/ui/text"

const ITEMS = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`)

function GoalContent() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Move goal</DrawerTitle>
        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
      </DrawerHeader>
      <View className="items-center gap-1 p-4">
        <Text className="text-5xl font-semibold tracking-tight">350</Text>
        <Text className="text-xs text-label-secondary uppercase">
          Calories/day
        </Text>
      </View>
      <DrawerFooter>
        <Button>
          <Text>Submit</Text>
        </Button>
        <DrawerClose render={<Button variant="secondary" />}>
          <Text>Cancel</Text>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}

const meta = {
  title: "Components/Drawer",
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <Drawer showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open drawer</Text>
        </DrawerTrigger>
        <GoalContent />
      </Drawer>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <Drawer defaultOpen showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open drawer</Text>
        </DrawerTrigger>
        <GoalContent />
      </Drawer>
    </View>
  ),
}

export const SnapPoints: Story = {
  render: () => (
    <View className="items-start">
      <Drawer snapPoints={[0.4, 1]} showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open with snap points</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton>
          <DrawerHeader>
            <DrawerTitle>Snap points</DrawerTitle>
            <DrawerDescription>
              Drag up to expand, drag down to collapse or dismiss.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollView contentContainerClassName="gap-3 p-4">
            {ITEMS.map((item) => (
              <View
                key={item}
                className="h-12 justify-center rounded-xl bg-surface-secondary px-4"
              >
                <Text>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </DrawerContent>
      </Drawer>
    </View>
  ),
}

export const Floating: Story = {
  render: () => (
    <View className="items-start">
      <Drawer floating showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open floating drawer</Text>
        </DrawerTrigger>
        <GoalContent />
      </Drawer>
    </View>
  ),
}

export const Sides: Story = {
  render: () => (
    <View className="items-start gap-3">
      {(["up", "right", "down", "left"] as const).map((direction) => (
        <Drawer key={direction} swipeDirection={direction} showSwipeHandle>
          <DrawerTrigger render={<Button variant="outline" />}>
            <Text>Swipe {direction}</Text>
          </DrawerTrigger>
          <DrawerContent showCloseButton closeLabel="Done">
            <DrawerHeader>
              <DrawerTitle>Swipe {direction} to close</DrawerTitle>
              <DrawerDescription>
                This drawer is dismissed by swiping {direction}.
              </DrawerDescription>
            </DrawerHeader>
            <View className="p-4">
              <Text className="text-sm text-label-secondary">
                Android back and the VoiceOver escape gesture also close it.
              </Text>
            </View>
          </DrawerContent>
        </Drawer>
      ))}
    </View>
  ),
}
