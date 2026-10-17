import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArrowUpRightIcon,
  BrainIcon,
  CheckCircleIcon,
  CircleIcon,
  CircleNotchIcon,
  FilePlusIcon,
  FileTextIcon,
  FolderOpenIcon,
  GitBranchIcon,
  GitCommitIcon,
  GlobeIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  TerminalIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Linking, Pressable, View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const meta = {
  title: "Components/Trace",
  component: Trace,
} satisfies Meta<typeof Trace>

export default meta

type Story = StoryObj<typeof meta>

function Output({ children, error }: { children: string; error?: boolean }) {
  return (
    <CodeBlock size="sm" variant={error ? "destructive" : "default"}>
      <CodeBlockContent wrap>{children}</CodeBlockContent>
    </CodeBlock>
  )
}

const sources = [
  { title: "pnpm install | pnpm.io", url: "https://pnpm.io/cli/install" },
  {
    title: "Continuous Integration | pnpm.io",
    url: "https://pnpm.io/continuous-integration",
  },
]

function SourceRow({ title, url }: { title: string; url: string }) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityHint="Opens in the browser"
      onPress={() => Linking.openURL(url)}
      className="self-start active:opacity-70"
    >
      <TraceLine>
        <TraceIcon>
          <Icon as={GlobeIcon} />
        </TraceIcon>
        <TraceTitle>{title}</TraceTitle>
        <TraceIcon>
          <Icon as={ArrowUpRightIcon} />
        </TraceIcon>
      </TraceLine>
    </Pressable>
  )
}

export const Default: Story = {
  render: () => (
    <View className="w-full gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>Why does pnpm install fail in CI?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon as={CheckCircleIcon} />
              </TraceIcon>
              <TraceTitle>Thought for 5s</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Text>
              CI installs with a frozen lockfile, so the install stops when
              package.json and pnpm-lock.yaml disagree.
            </Text>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <Icon as={CheckCircleIcon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm --version</TraceTitle>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <Icon as={WarningCircleIcon} />
              </TraceIcon>
              <TraceTitle>Failed to run pnpm install</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Output error>
              ERR_PNPM_OUTDATED_LOCKFILE Cannot install with
              &quot;frozen-lockfile&quot; because pnpm-lock.yaml is not up to
              date with package.json
            </Output>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      <Text>
        The last commit bumped a version in package.json without updating
        pnpm-lock.yaml. Run pnpm install locally and commit the lockfile.
      </Text>
    </View>
  ),
}

export const Static: Story = {
  render: () => (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={GitBranchIcon} />
        </TraceIcon>
        <TraceTitle>Created branch fix/frozen-lockfile</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Status: Story = {
  render: () => (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={CheckCircleIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
      <TraceLine status="error">
        <TraceIcon>
          <Icon as={WarningCircleIcon} />
        </TraceIcon>
        <TraceTitle>Failed to run pnpm lint</TraceTitle>
      </TraceLine>
      <TraceLine status="running">
        <TraceIcon>
          <Icon as={CircleNotchIcon} />
        </TraceIcon>
        <TraceTitle>Running pnpm build</TraceTitle>
      </TraceLine>
      <TraceLine status="pending">
        <TraceIcon>
          <Icon as={CircleIcon} />
        </TraceIcon>
        <TraceTitle>Run pnpm test</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Description: Story = {
  render: () => (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={NotePencilIcon} />
        </TraceIcon>
        <TraceTitle>Edited settings/notifications.tsx</TraceTitle>
        <TraceDescription>+48 −12</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={TerminalIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm test</TraceTitle>
        <TraceDescription>14s</TraceDescription>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={MagnifyingGlassIcon} />
        </TraceIcon>
        <TraceTitle>Searched for useChat</TraceTitle>
        <TraceDescription>8 results</TraceDescription>
      </TraceLine>
    </Trace>
  ),
}

export const Collapsible: Story = {
  render: () => (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Ran node --version</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Output>{"$ node --version\nv24.18.0"}</Output>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

function ControlledExample() {
  const [open, setOpen] = React.useState(false)
  return (
    <View className="items-start gap-4">
      <TraceCollapsible open={open} onOpenChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Ran pnpm --version</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Output>{"$ pnpm --version\n10.33.4"}</Output>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Button variant="outline" size="sm" onPress={() => setOpen(!open)}>
        {open ? "Hide the pnpm output" : "Show the pnpm output"}
      </Button>
    </View>
  )
}

export const Controlled: Story = {
  render: () => <ControlledExample />,
}

export const Link: Story = {
  render: () => (
    <Trace>
      <SourceRow
        title="Install Astro | docs.astro.build"
        url="https://docs.astro.build/en/install-and-setup/"
      />
    </Trace>
  ),
}

export const Group: Story = {
  render: () => (
    <Trace>
      <TraceLine>
        <TraceIcon>
          <Icon as={MagnifyingGlassIcon} />
        </TraceIcon>
        <TraceTitle>Searched for minimumReleaseAge</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={FileTextIcon} />
        </TraceIcon>
        <TraceTitle>Read pnpm-workspace.yaml</TraceTitle>
      </TraceLine>
      <TraceLine>
        <TraceIcon>
          <Icon as={TerminalIcon} />
        </TraceIcon>
        <TraceTitle>Ran pnpm install</TraceTitle>
      </TraceLine>
    </Trace>
  ),
}

export const Sources: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={GlobeIcon} />
          </TraceIcon>
          <TraceTitle>Used {sources.length} sources</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {sources.map((source) => (
            <SourceRow key={source.url} {...source} />
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

export const Steps: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="running">
          <TraceTitle>Looking into the slow deploy</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={MagnifyingGlassIcon} />
            </TraceIcon>
            <TraceTitle>Searched for the checkout build log</TraceTitle>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={FileTextIcon} />
            </TraceIcon>
            <TraceTitle>Read the last twelve deploys</TraceTitle>
          </TraceLine>
          <TraceLine status="running">
            <TraceIcon>
              <Icon as={MagnifyingGlassIcon} />
            </TraceIcon>
            <TraceTitle>Searching for the cache key</TraceTitle>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

const files = [
  { icon: NotePencilIcon, path: "app/login/page.tsx", stat: "+12 −4" },
  { icon: NotePencilIcon, path: "lib/auth/redirect.ts", stat: "+31 −9" },
  { icon: FilePlusIcon, path: "lib/auth/redirect.test.ts", stat: "+58" },
]

export const Commit: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={GitCommitIcon} />
          </TraceIcon>
          <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {files.map((file) => (
            <TraceLine key={file.path}>
              <TraceIcon>
                <Icon as={file.icon} />
              </TraceIcon>
              <TraceTitle>{file.path}</TraceTitle>
              <TraceDescription>{file.stat}</TraceDescription>
            </TraceLine>
          ))}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

export const Turn: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={BrainIcon} />
            </TraceIcon>
            <TraceTitle>Thought</TraceTitle>
            <TraceDescription>12s</TraceDescription>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Ran node --version</TraceTitle>
          </TraceLine>
          <TraceLine status="error">
            <TraceIcon>
              <Icon as={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Failed to run pnpm --version</TraceTitle>
          </TraceLine>
        </Trace>
        <Text className="my-2 text-foreground">
          Node is installed and pnpm is not. Reading the docs config.
        </Text>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={FolderOpenIcon} />
            </TraceIcon>
            <TraceTitle>Read apps/web/lib/docs.ts</TraceTitle>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

export const Reasoning: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine>
          <TraceIcon>
            <Icon as={BrainIcon} />
          </TraceIcon>
          <TraceTitle>Thought</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Text>
          The build log shows install and compile finish in under a minute.
          Image optimization takes almost four, and it reruns on every deploy
          because the cache key includes the commit hash.
        </Text>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}

const calls = [
  {
    title: "Read package.json",
    icon: FileTextIcon,
    output: '{ "name": "acme", "packageManager": "pnpm@10.18.0" }',
  },
  {
    title: "Failed to run pnpm install",
    icon: TerminalIcon,
    error: "ERR_PNPM_OUTDATED_LOCKFILE pnpm-lock.yaml is out of date",
  },
]

export const ToolCalls: Story = {
  render: () => (
    <Trace>
      {calls.map((call) => (
        <TraceCollapsible key={call.title}>
          <TraceCollapsibleTrigger>
            <TraceLine status={call.error ? "error" : undefined}>
              <TraceIcon>
                <Icon as={call.error ? WarningCircleIcon : call.icon} />
              </TraceIcon>
              <TraceTitle>{call.title}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Output error={Boolean(call.error)}>
              {call.error ?? call.output ?? ""}
            </Output>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      ))}
    </Trace>
  ),
}
