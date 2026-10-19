"use client"

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

export default function TraceDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Why does pnpm install fail in CI?</BubbleContent>
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
                  <TraceTitle>Thought for 5s</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                CI installs with a frozen lockfile, so the install stops when
                package.json and pnpm-lock.yaml disagree. I should check what
                the last commit changed, then reproduce the install.
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
                  <TraceTitle>Ran pnpm --version</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm" variant="default">
                  <CodeBlockContent wrap className="max-h-64">
                    10.18.0
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
                    Ran git diff --stat HEAD~1 -- package.json pnpm-lock.yaml
                  </TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm" variant="default">
                  <CodeBlockContent wrap className="max-h-64">
                    {
                      " package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)"
                    }
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultExpanded>
              <TraceCollapsibleTrigger>
                <TraceLine status="error">
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="CircleAlertIcon"
                      tabler="IconAlertCircle"
                      hugeicons="AlertCircleIcon"
                      phosphor="WarningCircleIcon"
                      remixicon="RiErrorWarningLine"
                    />
                  </TraceIcon>
                  <TraceTitle>
                    Failed to run pnpm install --frozen-lockfile
                  </TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm" variant="destructive">
                  <CodeBlockContent wrap className="max-h-64">
                    {
                      'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json'
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
                      lucide="GlobeIcon"
                      tabler="IconWorld"
                      hugeicons="Globe02Icon"
                      phosphor="GlobeIcon"
                      remixicon="RiGlobalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Used 2 sources</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <a
                    href="https://pnpm.io/cli/install#--frozen-lockfile"
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
                        pnpm install | pnpm.io
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
                    href="https://pnpm.io/continuous-integration"
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
                        Continuous Integration | pnpm.io
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
          <p>
            The last commit bumped a version in package.json without updating
            pnpm-lock.yaml, so the frozen install fails. Run pnpm install
            locally and commit the lockfile.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
