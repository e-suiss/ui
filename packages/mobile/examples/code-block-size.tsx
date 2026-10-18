import { View } from "react-native"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

export default function CodeBlockSize() {
  return (
    <View className="gap-4">
      <CodeBlock>
        <CodeBlockContent>pnpm install</CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockContent>pnpm install</CodeBlockContent>
      </CodeBlock>
    </View>
  )
}
