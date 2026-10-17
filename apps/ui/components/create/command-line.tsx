"use client"

import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import * as React from "react"
import { copyText } from "@/lib/clipboard"
import { strings } from "@/lib/strings"

const RESET_AFTER = 1500

export function CommandLine({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-foreground/5 py-2 ps-4 pe-2">
      <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap">
        <span className="text-muted-foreground select-none">$ </span>
        {command}
      </code>
      <button
        type="button"
        aria-label={copied ? strings.copied : strings.copy}
        onClick={() =>
          copyText(command).then(
            () => setCopied(true),
            () => undefined
          )
        }
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground/70 outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {copied ? (
          <CheckIcon className="size-4" />
        ) : (
          <CopyIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
