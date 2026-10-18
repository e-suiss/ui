import { View } from "react-native"
import { Text } from "@/components/ui/text"

export default function TextTypography() {
  return (
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
  )
}
