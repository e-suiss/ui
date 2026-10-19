import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

export default function SubagentDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Why does image optimization rerun on every deploy?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible defaultExpanded>
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
                  <TraceTitle>Ran the research subagent</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-col gap-3">
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
                        <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm">
                        <CodeBlockContent wrap className="max-h-64">
                          {
                            "scripts/optimize-images.ts:14:  const cacheKey = process.env.COMMIT_SHA"
                          }
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
                          Ran sed -n 13,15p scripts/optimize-images.ts
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm">
                        <CodeBlockContent wrap className="max-h-64">
                          {
                            'const cacheDir = ".next/cache/images"\nconst cacheKey = process.env.COMMIT_SHA\nconst cached = await restoreCache(cacheDir, cacheKey)'
                          }
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
                        <TraceTitle>Ran ls public/images | wc -l</TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <CodeBlock size="sm">
                        <CodeBlockContent wrap className="max-h-64">
                          1240
                        </CodeBlockContent>
                      </CodeBlock>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
                <p>
                  The cache is keyed on the commit SHA, so every deploy misses
                  it and optimizes all 1,240 images again.
                </p>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>
            Image optimization reruns because its cache is keyed on the commit
            SHA, which changes on every deploy. Key the cache on a hash of
            public/images instead, and unchanged images will be skipped.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
