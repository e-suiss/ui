"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Message, MessageContent, MessageFooter } from "@/components/ui/message"
import { Tooltip, TooltipContent } from "@/components/ui/tooltip"

const command = "npx @esuiss/ui@latest add dialog"

const reply = `Install Dialog, then open it from the gear button in site-header.tsx.

${command}

Wrap the button in a DialogTrigger and put the settings form in DialogContent. Focus moves into the dialog when it opens, and Esc closes it.`

export default function MessagePattern() {
  const [copied, setCopied] = React.useState(false)
  const [feedback, setFeedback] = React.useState<"like" | "dislike" | null>(
    null
  )

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex w-full max-w-md flex-col gap-8 py-6 text-sm">
      <Message align="end">
        <MessageContent className="gap-2">
          <Bubble align="end" variant="muted">
            <BubbleContent>
              How do I add a settings dialog? It should open from the gear icon
              in the header.
            </BubbleContent>
          </Bubble>
          <MessageFooter>
            <Tooltip>
              <Button variant="ghost" size="icon-sm" aria-label="Copy">
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="Copy01Icon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                />
              </Button>
              <TooltipContent>Copy</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button variant="ghost" size="icon-sm" aria-label="Edit">
                <IconPlaceholder
                  lucide="PencilIcon"
                  tabler="IconPencil"
                  hugeicons="PencilEdit01Icon"
                  phosphor="PencilSimpleIcon"
                  remixicon="RiPencilLine"
                />
              </Button>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </MessageFooter>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3 text-sm [&_code]:font-mono [&_code]:text-[0.9em]">
          <p>
            Install Dialog, then open it from the gear button in{" "}
            <code>site-header.tsx</code>.
          </p>
          <CodeBlock size="sm">
            <CodeBlockContent>{command}</CodeBlockContent>
          </CodeBlock>
          <p>
            Wrap the button in a <code>DialogTrigger</code> and put the settings
            form in <code>DialogContent</code>. Focus moves into the dialog when
            it opens, and Esc closes it.
          </p>
          <MessageFooter className="px-0">
            <Tooltip>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={copied ? "Copied" : "Copy"}
                onPress={() => {
                  navigator.clipboard?.writeText(reply).catch(() => undefined)
                  setCopied(true)
                }}
              >
                {copied ? (
                  <IconPlaceholder
                    lucide="CheckIcon"
                    tabler="IconCheck"
                    hugeicons="Tick02Icon"
                    phosphor="CheckIcon"
                    remixicon="RiCheckLine"
                  />
                ) : (
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="Copy01Icon"
                    phosphor="CopyIcon"
                    remixicon="RiFileCopyLine"
                  />
                )}
              </Button>
              <TooltipContent>{copied ? "Copied" : "Copy"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Good response"
                aria-pressed={feedback === "like"}
                onPress={() => setFeedback(feedback === "like" ? null : "like")}
              >
                <IconPlaceholder
                  lucide="ThumbsUpIcon"
                  tabler="IconThumbUp"
                  hugeicons="ThumbsUpIcon"
                  phosphor="ThumbsUpIcon"
                  remixicon="RiThumbUpLine"
                  className={feedback === "like" ? "fill-current" : undefined}
                />
              </Button>
              <TooltipContent>Good response</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Bad response"
                aria-pressed={feedback === "dislike"}
                onPress={() =>
                  setFeedback(feedback === "dislike" ? null : "dislike")
                }
              >
                <IconPlaceholder
                  lucide="ThumbsDownIcon"
                  tabler="IconThumbDown"
                  hugeicons="ThumbsDownIcon"
                  phosphor="ThumbsDownIcon"
                  remixicon="RiThumbDownLine"
                  className={
                    feedback === "dislike" ? "fill-current" : undefined
                  }
                />
              </Button>
              <TooltipContent>Bad response</TooltipContent>
            </Tooltip>
            <Tooltip>
              <Button variant="ghost" size="icon-sm" aria-label="Retry">
                <IconPlaceholder
                  lucide="RefreshCcwIcon"
                  tabler="IconRefresh"
                  hugeicons="RefreshIcon"
                  phosphor="ArrowsClockwiseIcon"
                  remixicon="RiRefreshLine"
                />
              </Button>
              <TooltipContent>Retry</TooltipContent>
            </Tooltip>
          </MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
