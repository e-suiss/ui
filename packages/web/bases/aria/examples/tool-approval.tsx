"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type Decision = "approved" | "denied" | null

export default function ToolApproval() {
  const [decision, setDecision] = React.useState<Decision>(null)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Clean up the build folder.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="CircleCheckIcon"
                      tabler="IconCircleCheck"
                      hugeicons="CheckmarkCircle02Icon"
                      phosphor="CheckCircleIcon"
                      remixicon="RiCheckboxCircleLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Thought</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                The build output lives in dist. Deleting it cannot be undone, so
                I should ask before I run the command.
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          {decision === null ? (
            <Item variant="outline" size="sm">
              <ItemMedia variant="icon">
                <IconPlaceholder
                  lucide="TerminalIcon"
                  tabler="IconTerminal"
                  hugeicons="ComputerTerminal01Icon"
                  phosphor="TerminalIcon"
                  remixicon="RiTerminalLine"
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>Run rm -rf dist?</ItemTitle>
                <ItemDescription>
                  The command runs in this project.
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => setDecision("denied")}
                >
                  Deny
                </Button>
                <Button size="sm" onPress={() => setDecision("approved")}>
                  Approve
                </Button>
              </ItemActions>
            </Item>
          ) : (
            <>
              <Trace>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>
                    {decision === "approved" ? "Ran" : "Denied"} rm -rf dist
                  </TraceTitle>
                </TraceLine>
              </Trace>
              <p>
                {decision === "approved"
                  ? "Removed the dist folder."
                  : "Okay, I left the dist folder in place."}
              </p>
            </>
          )}
        </MessageContent>
      </Message>
      {decision !== null && (
        <Button
          variant="outline"
          size="sm"
          className="self-start"
          onPress={() => setDecision(null)}
        >
          Reset
        </Button>
      )}
    </div>
  )
}
