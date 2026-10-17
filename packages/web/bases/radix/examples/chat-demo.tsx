"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

type Step =
  | { kind: "reasoning"; text: string }
  | { kind: "command"; command: string; output: string }

type Turn = {
  id: string
  prompt: string
  steps: Step[]
  reply: React.ReactNode
}

const initialTurns: Turn[] = [
  {
    id: "1",
    prompt: "Add a dark mode toggle to the settings page.",
    steps: [
      {
        kind: "reasoning",
        text: "I need to know how themes are set up before I add a toggle. If next-themes is already in the layout, the toggle only has to call setTheme.",
      },
      {
        kind: "command",
        command: "rg -l ThemeProvider app",
        output: "app/layout.tsx",
      },
    ],
    reply: (
      <>
        <p>
          next-themes is already set up in <code>app/layout.tsx</code>, so the
          toggle only has to call <code>setTheme</code>.
        </p>
        <ul className="list-disc ps-5">
          <li>
            Added <code>components/mode-toggle.tsx</code> with a Light and Dark
            option.
          </li>
          <li>
            Put <code>{"<ModeToggle />"}</code> next to the Appearance heading
            in <code>app/settings/page.tsx</code>.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "2",
    prompt: "Make it follow the system setting by default.",
    steps: [
      {
        kind: "reasoning",
        text: "The default theme lives on the ThemeProvider. I should check what it is set to now.",
      },
      {
        kind: "command",
        command: "rg -n defaultTheme app/layout.tsx",
        output: '12:  <ThemeProvider attribute="class" defaultTheme="light">',
      },
    ],
    reply: (
      <>
        <p>
          It was set to <code>light</code>. I updated the{" "}
          <code>ThemeProvider</code> in <code>app/layout.tsx</code>:
        </p>
        <CodeBlock size="sm">
          <CodeBlockContent wrap>
            {
              '<ThemeProvider attribute="class" defaultTheme="system" enableSystem>'
            }
          </CodeBlockContent>
        </CodeBlock>
        <p>
          New visitors now get the theme from their system. The toggle also has
          a System option, so anyone who picked Light or Dark can switch back.
        </p>
      </>
    ),
  },
  {
    id: "3",
    prompt: "Run the build before I ship it.",
    steps: [
      {
        kind: "command",
        command: "pnpm build",
        output:
          "✓ Compiled successfully in 4.2s\n✓ Linting and checking validity of types\n✓ Generating static pages (12/12)",
      },
    ],
    reply: (
      <>
        <p>The build passes, so it is ready to ship.</p>
        <ul className="list-disc ps-5">
          <li>Compiled in 4.2s.</li>
          <li>No lint or type errors.</li>
          <li>Generated all 12 static pages.</li>
        </ul>
      </>
    ),
  },
]

function StepRow({ step }: { step: Step }) {
  if (step.kind === "reasoning") {
    return (
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
        <TraceCollapsibleContent>{step.text}</TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>
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
          <TraceTitle>Ran {step.command}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <CodeBlock size="sm">
          <CodeBlockContent wrap className="max-h-64">
            {step.output}
          </CodeBlockContent>
        </CodeBlock>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export default function ChatDemo() {
  const [turns, setTurns] = React.useState(initialTurns)
  const [text, setText] = React.useState("")
  const formRef = React.useRef<HTMLFormElement>(null)
  const canSend = text.trim().length > 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    setTurns((current) => [
      ...current,
      {
        id: String(current.length + 1),
        prompt: text.trim(),
        steps: [],
        reply: (
          <p>
            This demo only knows the scripted turns. Press reset to start over.
          </p>
        ),
      },
    ])
    setText("")
  }

  return (
    <MessageScrollerProvider>
      <div className="flex h-[36rem] w-full max-w-xl flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="font-medium">New thread</div>
            <div className="text-sm text-muted-foreground">
              Ask the agent to change your code.
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Reset conversation"
                onClick={() => {
                  setTurns(initialTurns)
                  setText("")
                }}
              >
                <IconPlaceholder
                  lucide="RotateCwIcon"
                  tabler="IconRotateClockwise"
                  hugeicons="RotateClockwiseIcon"
                  phosphor="ArrowClockwiseIcon"
                  remixicon="RiRestartLine"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset</TooltipContent>
          </Tooltip>
        </div>
        <div className="min-h-0 flex-1">
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-6 py-2 text-sm">
                {turns.map((turn) => (
                  <React.Fragment key={turn.id}>
                    <MessageScrollerItem
                      messageId={`${turn.id}-prompt`}
                      scrollAnchor
                    >
                      <Message align="end">
                        <MessageContent>
                          <Bubble align="end" variant="muted">
                            <BubbleContent>{turn.prompt}</BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                    <MessageScrollerItem messageId={`${turn.id}-reply`}>
                      <Message>
                        <MessageContent className="gap-3 text-sm [&_code]:font-mono [&_code]:text-[0.9em]">
                          {turn.steps.length > 0 && (
                            <Trace>
                              {turn.steps.map((step) => (
                                <StepRow
                                  key={
                                    step.kind === "command"
                                      ? step.command
                                      : step.text
                                  }
                                  step={step}
                                />
                              ))}
                            </Trace>
                          )}
                          {turn.reply}
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  </React.Fragment>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </div>
        <form ref={formRef} onSubmit={onSubmit} className="w-full">
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ask the agent..."
              aria-label="Message"
              className="min-h-14"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
            />
            <InputGroupAddon align="block-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton
                    aria-label="Add context"
                    size="icon-sm"
                    variant="outline"
                  >
                    <IconPlaceholder
                      lucide="PlusIcon"
                      tabler="IconPlus"
                      hugeicons="PlusSignIcon"
                      phosphor="PlusIcon"
                      remixicon="RiAddLine"
                    />
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-48">
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="PaperclipIcon"
                      tabler="IconPaperclip"
                      hugeicons="Attachment01Icon"
                      phosphor="PaperclipIcon"
                      remixicon="RiAttachment2"
                    />
                    Add photos and files
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="TelescopeIcon"
                      tabler="IconTelescope"
                      hugeicons="Telescope01Icon"
                      phosphor="BinocularsIcon"
                      remixicon="RiBinocularsLine"
                    />
                    Deep research
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="GlobeIcon"
                      tabler="IconWorld"
                      hugeicons="Globe02Icon"
                      phosphor="GlobeIcon"
                      remixicon="RiGlobalLine"
                    />
                    Web search
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <InputGroupButton
                type="submit"
                variant="default"
                size="icon-sm"
                disabled={!canSend}
                aria-label="Send"
                className="ms-auto"
              >
                <IconPlaceholder
                  lucide="ArrowUpIcon"
                  tabler="IconArrowUp"
                  hugeicons="ArrowUp01Icon"
                  phosphor="ArrowUpIcon"
                  remixicon="RiArrowUpLine"
                />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </form>
      </div>
    </MessageScrollerProvider>
  )
}
