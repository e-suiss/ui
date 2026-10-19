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

export default function TraceControlled() {
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
          <CodeBlock size="sm">
            <CodeBlockContent wrap>
              {"$ pnpm --version\n10.33.4"}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <Button variant="outline" size="sm" onPress={() => setOpen(!open)}>
        {open ? "Hide the pnpm output" : "Show the pnpm output"}
      </Button>
    </View>
  )
}
