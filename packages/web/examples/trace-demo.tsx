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

const commands = [
  { command: "pnpm --version", output: "10.18.0" },
  {
    command: "git diff --stat HEAD~1 -- package.json pnpm-lock.yaml",
    output:
      " package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)",
  },
  {
    command: "pnpm install --frozen-lockfile",
    error:
      'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json',
  },
]

const sources = [
  {
    url: "https://pnpm.io/cli/install#--frozen-lockfile",
    title: "pnpm install | pnpm.io",
  },
  {
    url: "https://pnpm.io/continuous-integration",
    title: "Continuous Integration | pnpm.io",
  },
]

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
            {commands.map((item) => (
              <TraceCollapsible
                key={item.command}
                defaultOpen={Boolean(item.error)}
              >
                <TraceCollapsibleTrigger>
                  <TraceLine status={item.error ? "error" : undefined}>
                    <TraceIcon>
                      {item.error ? (
                        <IconPlaceholder
                          lucide="CircleAlertIcon"
                          tabler="IconAlertCircle"
                          hugeicons="AlertCircleIcon"
                          phosphor="WarningCircleIcon"
                          remixicon="RiErrorWarningLine"
                        />
                      ) : (
                        <IconPlaceholder
                          lucide="CircleCheckIcon"
                          tabler="IconCircleCheck"
                          hugeicons="CheckmarkCircle02Icon"
                          phosphor="CheckCircleIcon"
                          remixicon="RiCheckboxCircleLine"
                        />
                      )}
                    </TraceIcon>
                    <TraceTitle>
                      {item.error ? "Failed to run" : "Ran"} {item.command}
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <CodeBlock
                    size="sm"
                    variant={item.error ? "destructive" : "default"}
                  >
                    <CodeBlockContent wrap className="max-h-64">
                      {item.error ?? item.output}
                    </CodeBlockContent>
                  </CodeBlock>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            ))}
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
                  <TraceTitle>Used {sources.length} sources</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {sources.map((source) => (
                    <a
                      key={source.url}
                      href={source.url}
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
                          {source.title}
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
                  ))}
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
