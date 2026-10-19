"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Message, MessageContent } from "@/components/ui/message"

const replies: Record<string, string> = {
  "Add a dark mode toggle":
    "Added a ModeToggle to the site header. It calls setTheme from next-themes.",
  "Fix the failing build":
    "The build failed on a missing import in app/page.tsx. I added it and the build passes.",
  "Write tests for the form":
    "Added four tests in signup-form.test.tsx. They cover the empty, invalid and valid states.",
  "Upgrade to Next.js 16":
    "Ran the codemod and bumped next to 16. Two routes needed async params, so I updated them.",
  "Add a loading state":
    "Added a loading.tsx to the dashboard route. It shows skeletons while the data loads.",
  "Find unused dependencies":
    "Three packages are not imported anywhere: lodash, moment and classnames. Should I remove them?",
}

export default function SuggestionDemo() {
  const [text, setText] = React.useState("")
  const [turn, setTurn] = React.useState<{
    prompt: string
    reply: string
  } | null>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const canSend = text.trim().length > 0

  function send(prompt: string) {
    setTurn({
      prompt,
      reply:
        replies[prompt] ?? "This demo only knows the suggestions. Pick one.",
    })
    setText("")
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    send(text.trim())
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6 py-6 text-sm">
      {turn && (
        <div className="flex flex-col gap-4">
          <Message align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{turn.prompt}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Message>
            <MessageContent className="text-sm">
              <p>{turn.reply}</p>
            </MessageContent>
          </Message>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none]">
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Add a dark mode toggle")}
          >
            Add a dark mode toggle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Fix the failing build")}
          >
            Fix the failing build
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Write tests for the form")}
          >
            Write tests for the form
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Upgrade to Next.js 16")}
          >
            Upgrade to Next.js 16
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Add a loading state")}
          >
            Add a loading state
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onPress={() => send("Find unused dependencies")}
          >
            Find unused dependencies
          </Button>
        </div>
        <form ref={formRef} onSubmit={onSubmit}>
          <InputGroup>
            <InputGroupTextarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Ask the agent to change your code..."
              aria-label="Message"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  formRef.current?.requestSubmit()
                }
              }}
              className="p-3"
            />
            <InputGroupAddon align="block-end">
              <InputGroupButton
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Attach files"
              >
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                />
              </InputGroupButton>
              <InputGroupButton
                type="submit"
                size="icon-sm"
                variant="default"
                className="ms-auto rounded-full"
                disabled={!canSend}
                aria-label="Send"
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
    </div>
  )
}
