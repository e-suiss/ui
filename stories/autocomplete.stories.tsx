import type { Meta, StoryObj } from "@storybook/react-native"
import { cn } from "cn"
import { MagnifyingGlassIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, View } from "react-native"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as Autocomplete from "@/components/primitives/autocomplete"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const tags = [
  "feature",
  "fix",
  "bug",
  "docs",
  "internal",
  "mobile",
  "accessibility",
  "performance",
  "design",
  "release",
]

function AutocompleteDemo({
  defaultOpen,
  mode,
}: {
  defaultOpen?: boolean
  mode?: Autocomplete.RootProps<string>["mode"]
}) {
  const [value, setValue] = React.useState(defaultOpen ? "a" : "")
  return (
    <View className="w-64 gap-2">
      <Autocomplete.Root
        items={tags}
        value={value}
        onValueChange={setValue}
        defaultOpen={defaultOpen}
        mode={mode}
      >
        <Autocomplete.InputGroup className="h-11 w-full flex-row items-center gap-2 rounded-lg bg-control px-3">
          <Icon
            as={MagnifyingGlassIcon}
            className="size-4 text-label-secondary"
          />
          <Autocomplete.Input
            placeholder="Search tags"
            className="h-full flex-1 text-base text-label"
            placeholderTextColorClassName="accent-label-secondary"
          />
          <Autocomplete.Clear
            accessibilityLabel="Clear"
            className="size-6 items-center justify-center rounded-full active:bg-item-pressed"
          >
            <Icon as={XIcon} className="size-4 text-label-secondary" />
          </Autocomplete.Clear>
        </Autocomplete.InputGroup>
        <Autocomplete.Portal>
          <FullWindowOverlay>
            <Autocomplete.Positioner sideOffset={6}>
              <Autocomplete.Popup className="w-64 overflow-hidden rounded-2xl border border-label/5 bg-surface-raised shadow-lg dark:border-label/10">
                <Autocomplete.Empty className="items-center py-2">
                  <Text className="text-sm text-label-secondary">
                    No tags found.
                  </Text>
                </Autocomplete.Empty>
                <Autocomplete.List
                  className="max-h-72"
                  contentContainerClassName="p-1.5"
                >
                  {(tag: string) => (
                    <Autocomplete.Item
                      key={tag}
                      value={tag}
                      className={(state) =>
                        cn(
                          "rounded-lg px-3 py-2",
                          state.highlighted && "bg-item-pressed"
                        )
                      }
                    >
                      <Text className="text-sm font-medium">{tag}</Text>
                    </Autocomplete.Item>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </FullWindowOverlay>
        </Autocomplete.Portal>
      </Autocomplete.Root>
      <Text variant="muted">Value: {value || "(empty)"}</Text>
    </View>
  )
}

const meta = {
  title: "Components/Autocomplete",
  component: AutocompleteDemo,
} satisfies Meta<typeof AutocompleteDemo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <AutocompleteDemo />,
}

export const NoFiltering: Story = {
  render: () => <AutocompleteDemo mode="none" />,
}

export const OpenByDefault: Story = {
  render: () => <AutocompleteDemo defaultOpen />,
}
