import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function TraceTurn() {
  return (
    <TraceCollapsible className="w-full max-w-sm" defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="error">
          <TraceTitle>Worked for 2m 4s, 1 command failed</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent keepMounted className="flex flex-col gap-2">
        <Trace>
          <TraceCollapsible>
            <TraceCollapsibleTrigger>
              <TraceLine>
                <TraceIcon>
                  <IconPlaceholder
                    lucide="BrainIcon"
                    tabler="IconBrain"
                    hugeicons="AiBrain01Icon"
                    phosphor="BrainIcon"
                    remixicon="RiBrainLine"
                  />
                </TraceIcon>
                <TraceTitle>Thought</TraceTitle>
                <TraceDescription>12s</TraceDescription>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent className="whitespace-pre-wrap">
              I should check which package managers are installed before I
              scaffold anything.
            </TraceCollapsibleContent>
          </TraceCollapsible>
          <TraceCollapsible defaultOpen>
            <TraceCollapsibleTrigger>
              <TraceLine status="error">
                <TraceIcon>
                  <IconPlaceholder
                    lucide="TerminalIcon"
                    tabler="IconTerminal"
                    hugeicons="ComputerTerminal01Icon"
                    phosphor="TerminalIcon"
                    remixicon="RiTerminalLine"
                  />
                </TraceIcon>
                <TraceTitle>Ran 2 commands, 1 failed</TraceTitle>
              </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent keepMounted>
              <Trace>
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
                  <TraceTitle>Ran node --version</TraceTitle>
                </TraceLine>
                <TraceCollapsible>
                  <TraceCollapsibleTrigger>
                    <TraceLine status="error">
                      <TraceIcon>
                        <IconPlaceholder
                          lucide="TerminalIcon"
                          tabler="IconTerminal"
                          hugeicons="ComputerTerminal01Icon"
                          phosphor="TerminalIcon"
                          remixicon="RiTerminalLine"
                        />
                      </TraceIcon>
                      <TraceTitle>Failed to run pnpm --version</TraceTitle>
                    </TraceLine>
                  </TraceCollapsibleTrigger>
                  <TraceCollapsibleContent>
                    <CodeBlock size="sm" variant="destructive">
                      <CodeBlockContent wrap className="max-h-64">
                        command not found: pnpm
                      </CodeBlockContent>
                    </CodeBlock>
                  </TraceCollapsibleContent>
                </TraceCollapsible>
              </Trace>
            </TraceCollapsibleContent>
          </TraceCollapsible>
        </Trace>
        <p>Node is installed and pnpm is not. Reading the docs config.</p>
        <Trace>
          <a href="#turn">
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="FileTextIcon"
                  tabler="IconFileText"
                  hugeicons="File01Icon"
                  phosphor="FileTextIcon"
                  remixicon="RiFileTextLine"
                />
              </TraceIcon>
              <TraceTitle>Read apps/web/lib/docs.ts</TraceTitle>
              <TraceIcon>
                <IconPlaceholder
                  lucide="ChevronRightIcon"
                  tabler="IconChevronRight"
                  hugeicons="ArrowRight01Icon"
                  phosphor="CaretRightIcon"
                  remixicon="RiArrowRightSLine"
                />
              </TraceIcon>
            </TraceLine>
          </a>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}
