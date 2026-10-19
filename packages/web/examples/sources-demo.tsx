import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
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

export default function SourcesDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              How do I start an Astro project with pnpm?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <p>
            Run pnpm create astro@latest and follow the prompts. It scaffolds
            the project and installs the dependencies.
          </p>
          <Trace>
            <TraceCollapsible defaultOpen>
              <TraceCollapsibleTrigger>
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
                  <TraceTitle>Used 3 sources</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <a
                    href="https://docs.astro.build/en/install-and-setup/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TraceLine>
                      <TraceTitle>
                        Install Astro | docs.astro.build
                        <span className="sr-only"> (opens in a new tab)</span>
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
                    href="https://www.npmjs.com/package/create-astro"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TraceLine>
                      <TraceTitle>
                        create-astro | npmjs.com
                        <span className="sr-only"> (opens in a new tab)</span>
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
                    href="https://pnpm.io/cli/create"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TraceLine>
                      <TraceTitle>
                        pnpm create | pnpm.io
                        <span className="sr-only"> (opens in a new tab)</span>
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
          </Trace>
        </MessageContent>
      </Message>
    </div>
  )
}
