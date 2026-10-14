import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CalendarBlankIcon,
  CoffeeIcon,
  ForkKnifeIcon,
  MapPinIcon,
  StarIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

const categories = [
  { value: "all", label: "All" },
  { value: "coffee", label: "Coffee" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "bakery", label: "Bakery" },
  { value: "bars", label: "Bars" },
  { value: "desserts", label: "Desserts" },
]

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <View className="gap-2">
      <Text variant="muted">{label}</Text>
      {children}
    </View>
  )
}

const meta = {
  title: "Components/Chip",
  component: Chip,
} satisfies Meta<typeof Chip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Chip>Open now</Chip>,
}

export const States: Story = {
  render: () => (
    <View className="gap-4">
      <Section label="Unselected">
        <Chip>Open now</Chip>
      </Section>
      <Section label="Selected">
        <Chip defaultSelected>Open now</Chip>
      </Section>
      <Section label="Disabled">
        <View className="flex-row gap-2">
          <Chip disabled>Open now</Chip>
          <Chip disabled defaultSelected>
            Open now
          </Chip>
        </View>
      </Section>
    </View>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="gap-4">
      <Section label="Default">
        <View className="flex-row gap-2">
          <Chip icon={StarIcon}>Top rated</Chip>
          <Chip icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip onRemove={() => {}}>Nearby</Chip>
        </View>
      </Section>
      <Section label="Small">
        <View className="flex-row gap-2">
          <Chip size="sm" icon={StarIcon}>
            Top rated
          </Chip>
          <Chip size="sm" icon={StarIcon} defaultSelected>
            Top rated
          </Chip>
          <Chip size="sm" onRemove={() => {}}>
            Nearby
          </Chip>
        </View>
      </Section>
    </View>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Chip icon={CoffeeIcon}>Coffee</Chip>
      <Chip icon={ForkKnifeIcon} defaultSelected>
        Restaurants
      </Chip>
      <Chip icon={MapPinIcon}>Nearby</Chip>
      <Chip icon={CalendarBlankIcon} disabled>
        Tonight
      </Chip>
    </View>
  ),
}

function RemovableDemo() {
  const [tags, setTags] = React.useState([
    "Design",
    "Mobile",
    "Accessibility",
    "Motion",
  ])
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip
            key={tag}
            onRemove={() =>
              setTags((current) => current.filter((item) => item !== tag))
            }
            removeLabel={`Remove ${tag}`}
          >
            {tag}
          </Chip>
        ))}
      </View>
      <Text variant="muted">{tags.length} tags</Text>
    </View>
  )
}

export const Removable: Story = {
  render: () => <RemovableDemo />,
}

function ControlledDemo() {
  const [selected, setSelected] = React.useState(true)
  return (
    <View className="gap-3">
      <Chip selected={selected} onSelectedChange={setSelected}>
        Free delivery
      </Chip>
      <Text variant="muted">{selected ? "Selected" : "Not selected"}</Text>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

function SingleGroupDemo() {
  const [value, setValue] = React.useState(["all"])
  return (
    <View className="gap-3">
      <ChipGroup value={value} onValueChange={setValue}>
        {categories.slice(0, 4).map((category) => (
          <Chip key={category.value} value={category.value}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
      <Text variant="muted">Selected: {value.join(", ") || "none"}</Text>
    </View>
  )
}

export const GroupSingle: Story = {
  render: () => <SingleGroupDemo />,
}

function MultipleGroupDemo() {
  const [value, setValue] = React.useState(["coffee", "bakery"])
  return (
    <View className="gap-3">
      <ChipGroup multiple value={value} onValueChange={setValue}>
        {categories.slice(1).map((category) => (
          <Chip key={category.value} value={category.value}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
      <Text variant="muted">Selected: {value.join(", ") || "none"}</Text>
    </View>
  )
}

export const GroupMultiple: Story = {
  render: () => <MultipleGroupDemo />,
}

export const GroupUncontrolled: Story = {
  render: () => (
    <ChipGroup multiple defaultValue={["lunch"]} size="sm">
      {categories.slice(1).map((category) => (
        <Chip key={category.value} value={category.value}>
          {category.label}
        </Chip>
      ))}
    </ChipGroup>
  ),
}

export const GroupScrollable: Story = {
  render: () => (
    <View className="-mx-4">
      <ChipGroup scrollable defaultValue={["all"]} className="px-4">
        {categories.map((category) => (
          <Chip key={category.value} value={category.value}>
            {category.label}
          </Chip>
        ))}
      </ChipGroup>
    </View>
  ),
}

export const GroupDisabled: Story = {
  render: () => (
    <ChipGroup disabled defaultValue={["coffee"]}>
      {categories.slice(1, 4).map((category) => (
        <Chip key={category.value} value={category.value}>
          {category.label}
        </Chip>
      ))}
    </ChipGroup>
  ),
}
