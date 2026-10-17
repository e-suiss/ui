import type { Meta, StoryObj } from "@storybook/react-native"
import { FileTsIcon, TerminalIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Code Block",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>

export default meta

type Story = StoryObj<typeof meta>

const greeting = `export function Greeting({ name }: { name: string }) {
  // Say hello to the person signing in
  return <Text>Hello, {name}!</Text>
}`

const config = `export default {
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    remotePatterns: [{ hostname: "avatars.githubusercontent.com" }],
  },
}`

export const Default: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <Icon as={FileTsIcon} />
        <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={greeting} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="tsx">{greeting}</CodeBlockContent>
    </CodeBlock>
  ),
}

export const Basic: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent>npx @esuiss/ui@latest add code-block</CodeBlockContent>
    </CodeBlock>
  ),
}

export const LineNumbers: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent language="ts" lineNumbers>
        {config}
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const StartLine: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>next.config.ts</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers startLine={12}>
        <CodeBlockLine>{"  images: {"}</CodeBlockLine>
        <CodeBlockLine>{"    unoptimized: true,"}</CodeBlockLine>
        <CodeBlockLine>{"  },"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const Wrap: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent wrap>
        ERR_PNPM_OUTDATED_LOCKFILE Cannot install with
        &quot;frozen-lockfile&quot; because pnpm-lock.yaml is not up to date
        with package.json
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const HighlightedLines: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent lineNumbers>
        <CodeBlockLine>{"export default {"}</CodeBlockLine>
        <CodeBlockLine>{"  experimental: {"}</CodeBlockLine>
        <CodeBlockLine variant="highlighted">
          {"    reactCompiler: true,"}
        </CodeBlockLine>
        <CodeBlockLine variant="highlighted">
          {"    viewTransition: true,"}
        </CodeBlockLine>
        <CodeBlockLine>{"  },"}</CodeBlockLine>
        <CodeBlockLine>{"}"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const Diff: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent>
        <CodeBlockLine>
          {"export function Greeting({ name }: { name: string }) {"}
        </CodeBlockLine>
        <CodeBlockLine variant="removed">
          {"  return <Text>Hello, {name}</Text>"}
        </CodeBlockLine>
        <CodeBlockLine variant="added">
          {'  return <Text variant="muted">'}
        </CodeBlockLine>
        <CodeBlockLine variant="added">{"    Hello, {name}!"}</CodeBlockLine>
        <CodeBlockLine variant="added">{"  </Text>"}</CodeBlockLine>
        <CodeBlockLine>{"}"}</CodeBlockLine>
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const Size: Story = {
  render: () => (
    <View className="gap-4">
      <CodeBlock>
        <CodeBlockContent>pnpm install</CodeBlockContent>
      </CodeBlock>
      <CodeBlock size="sm">
        <CodeBlockContent>pnpm install</CodeBlockContent>
      </CodeBlock>
    </View>
  ),
}

export const Destructive: Story = {
  render: () => (
    <CodeBlock variant="destructive" size="sm">
      <CodeBlockHeader>
        <Icon as={TerminalIcon} />
        <CodeBlockTitle>Failed to run pnpm lint</CodeBlockTitle>
      </CodeBlockHeader>
      <CodeBlockContent wrap>
        {"app/page.tsx:12:7 Unexpected any. Specify a different type."}
      </CodeBlockContent>
    </CodeBlock>
  ),
}

export const Languages: Story = {
  render: () => (
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
  ),
}

export const Footer: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>Logs</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value="Compiled in 4.2s" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="bash">
        {"$ pnpm build\nCompiled in 4.2s\nGenerated 12 static pages"}
      </CodeBlockContent>
      <CodeBlockFooter>
        <Text>Exited with code 0</Text>
      </CodeBlockFooter>
    </CodeBlock>
  ),
}
