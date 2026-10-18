import { View } from "react-native"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

export default function CodeBlockLanguages() {
  return (
    <View className="gap-4">
      <CodeBlock size="sm">
        <CodeBlockContent language="bash">
          {"# Add the component\npnpm dlx @esuiss/ui add code-block"}
        </CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockContent language="json">
          {'{ "name": "acme", "private": true, "version": "1.0.0" }'}
        </CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockContent language="swift">
          {
            'struct Greeting: View {\n  let name: String\n  var body: some View { Text("Hello, \\(name)") }\n}'
          }
        </CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockContent language="kotlin">
          {
            '@Composable\nfun Greeting(name: String) {\n  Text("Hello, $name")\n}'
          }
        </CodeBlockContent>
      </CodeBlock>
    </View>
  )
}
