import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Text",
  component: Text,
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Typography: Story = {
  render: () => (
    <View className="gap-4">
      <Text variant="h1">Taxing Laughter</Text>
      <Text variant="h2">The People of the Kingdom</Text>
      <Text variant="h3">The Joke Tax</Text>
      <Text variant="h4">People stopped telling jokes</Text>
      <Text variant="p">
        The king, seeing how much happier his subjects were, realized the error
        of his ways and repealed the joke tax.
      </Text>
      <Text variant="blockquote">
        &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so
        it&apos;s only fair that they should pay for the privilege.&quot;
      </Text>
      <View className="flex-row">
        <Text variant="code">npx @esuiss/ui add text</Text>
      </View>
      <Text variant="lead">
        A modal dialog that interrupts the user with important content.
      </Text>
      <Text variant="large">Are you absolutely sure?</Text>
      <Text variant="small">Email address</Text>
      <Text variant="muted">Enter your email address.</Text>
    </View>
  ),
}

export const Headings: Story = {
  render: () => (
    <View className="gap-4">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
    </View>
  ),
}
