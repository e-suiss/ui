import type * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
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

const results = [
  {
    title: "Image component | nextjs.org",
    url: "https://nextjs.org/docs/app/api-reference/components/image",
  },
  {
    title: "Build cache | vercel.com",
    url: "https://vercel.com/docs/deployments/troubleshoot-a-build",
  },
]

const files = ["next.config.ts", "scripts/optimize-images.ts"]

function Step({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  return (
    <TraceCollapsible defaultOpen={defaultOpen}>
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
          <TraceTitle>{title}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{children}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export default function ChainOfThoughtDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Why is the checkout deploy so slow?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible defaultOpen>
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
                  <TraceTitle>Researched in 3 steps</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent keepMounted>
                <Trace>
                  <Step title="Read the build log for dpl_8Kx2" defaultOpen>
                    <CodeBlock size="sm">
                      <CodeBlockContent wrap className="max-h-64">
                        {"install    41s\ncompile    38s\nimages   3m 52s"}
                      </CodeBlockContent>
                    </CodeBlock>
                  </Step>
                  <Step title="Searched the web for next.js image cache key">
                    <Trace>
                      {results.map((result) => (
                        <a
                          key={result.url}
                          href={result.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <TraceLine>
                            <TraceIcon>
                              <IconPlaceholder
                                lucide="GlobeIcon"
                                tabler="IconWorld"
                                hugeicons="Globe02Icon"
                                phosphor="GlobeIcon"
                                remixicon="RiGlobalLine"
                              />
                            </TraceIcon>
                            <TraceTitle>
                              {result.title}
                              <span className="sr-only">
                                {" "}
                                (opens in a new tab)
                              </span>
                            </TraceTitle>
                            <TraceIcon>
                              <IconPlaceholder
                                lucide="ArrowUpRightIcon"
                                tabler="IconArrowUpRight"
                                hugeicons="ArrowUpRight01Icon"
                                phosphor="ArrowUpRightIcon"
                                remixicon="RiArrowRightUpLine"
                              />
                            </TraceIcon>
                          </TraceLine>
                        </a>
                      ))}
                    </Trace>
                  </Step>
                  <Step title="Searched the code for cacheKey">
                    <div className="flex flex-wrap gap-1.5">
                      {files.map((file) => (
                        <Badge
                          key={file}
                          variant="secondary"
                          className="font-mono"
                        >
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </Step>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>
            Image optimization takes almost four minutes because its cache key
            includes the commit hash. Key it on the image directory instead.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
