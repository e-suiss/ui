import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
  "Expo",
]

interface Produce {
  value: string
  label: string
}

const produce: { value: string; items: Produce[] }[] = [
  {
    value: "Fruits",
    items: [
      { value: "mango", label: "Mango" },
      { value: "banana", label: "Banana" },
      { value: "blueberry", label: "Blueberry" },
    ],
  },
  {
    value: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]

function ComboboxDemo({
  defaultValue = null,
  defaultOpen,
  disabled,
  showClear,
  labelledBy,
  invalid,
}: {
  defaultValue?: string | null
  defaultOpen?: boolean
  disabled?: boolean
  showClear?: boolean
  labelledBy?: string
  invalid?: boolean
}) {
  const [value, setValue] = React.useState<string | null>(defaultValue)
  return (
    <Combobox
      items={frameworks}
      value={value}
      onValueChange={setValue}
      defaultOpen={defaultOpen}
      disabled={disabled}
    >
      <ComboboxInput
        className="w-64"
        placeholder="Select a framework"
        showClear={showClear}
        disabled={disabled}
        invalid={invalid}
        accessibilityLabelledBy={labelledBy}
      />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function GroupedDemo() {
  return (
    <Combobox items={produce} itemToStringLabel={(item: Produce) => item.label}>
      <ComboboxInput className="w-64" placeholder="Select produce" />
      <ComboboxContent>
        <ComboboxEmpty>No produce found.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof produce)[number], index: number) => (
            <React.Fragment key={group.value}>
              {index > 0 ? <ComboboxSeparator /> : null}
              <ComboboxGroup items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: Produce) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </React.Fragment>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

function MultipleDemo() {
  const anchor = useComboboxAnchor()
  const [value, setValue] = React.useState<string[]>(["Expo", "Astro"])
  return (
    <Combobox
      multiple
      items={frameworks}
      value={value}
      onValueChange={setValue}
    >
      <ComboboxChips ref={anchor} className="w-72">
        {value.map((item) => (
          <ComboboxChip key={item} value={item}>
            {item}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Add framework" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const meta = {
  title: "Components/Combobox",
  component: Combobox,
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ComboboxDemo />,
}

export const WithValue: Story = {
  render: () => <ComboboxDemo defaultValue="Expo" />,
}

export const WithClear: Story = {
  render: () => <ComboboxDemo defaultValue="Remix" showClear />,
}

export const Grouped: Story = {
  render: () => <GroupedDemo />,
}

export const Multiple: Story = {
  render: () => <MultipleDemo />,
}

export const WithLabel: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="combobox-framework">Framework</Label>
      <ComboboxDemo labelledBy="combobox-framework" />
      <Text className="text-sm text-label-secondary">
        Search and pick the framework you use.
      </Text>
    </View>
  ),
}

export const Disabled: Story = {
  render: () => <ComboboxDemo defaultValue="Astro" disabled />,
}

export const Invalid: Story = {
  render: () => (
    <View className="gap-2">
      <ComboboxDemo invalid />
      <Text className="text-sm text-danger">Please select a framework.</Text>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => <ComboboxDemo defaultValue="Expo" defaultOpen />,
}
