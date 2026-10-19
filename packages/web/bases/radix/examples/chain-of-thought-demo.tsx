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
              <TraceCollapsibleContent>
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
                        <TraceTitle>Read the build log for dpl_8Kx2</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm">
                        <CodeBlockContent wrap className="max-h-64">
                          {"install    41s\ncompile    38s\nimages   3m 52s"}
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
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
                        <TraceTitle>
                          Searched the web for next.js image cache key
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <Trace>
                        <a
                          href="https://nextjs.org/docs/app/api-reference/components/image"
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
                              Image component | nextjs.org
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
                        <a
                          href="https://vercel.com/docs/deployments/troubleshoot-a-build"
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
                              Build cache | vercel.com
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
                      </Trace>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
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
                        <TraceTitle>Searched the code for cacheKey</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="font-mono">
                          next.config.ts
                        </Badge>
                        <Badge variant="secondary" className="font-mono">
                          scripts/optimize-images.ts
                        </Badge>
                      </div>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
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
