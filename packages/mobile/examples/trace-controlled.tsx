import { TerminalIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import {
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

function Output({ children, error }: { children: string; error?: boolean }) {
  return (
    <CodeBlock size="sm" variant={error ? "destructive" : "default"}>
      <CodeBlockContent wrap>{children}</CodeBlockContent>
    </CodeBlock>
  )
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

export default function TraceControlled() {
  return <ControlledExample />
}
