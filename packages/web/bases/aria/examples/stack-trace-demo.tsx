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

const FRAME = /^at (.+) \((.+):(\d+):(\d+)\)$/

const STACK = `TypeError: Cannot read properties of undefined (reading 'email')
    at seedUsers (prisma/seed.ts:27:34)
    at main (prisma/seed.ts:51:9)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object.transformer (node_modules/tsx/dist/register.cjs:3:1104)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)`

const RESET_OUTPUT = `Database reset successful

The following migrations have been applied:

migrations/
  └─ 20260912_init/
  └─ 20260920_add_profiles/`

function parseFrame(line: string) {
  const match = line.match(FRAME)

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes("node_modules") || line.includes("node:"),
  }
}

const [error, ...lines] = STACK.split("\n").map((line) => line.trim())
const frames = lines.map(parseFrame)
const appFrames = frames.filter((frame) => !frame.internal)
const internalFrames = frames.filter((frame) => frame.internal)

export default function StackTraceDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Reset the database and seed it.</BubbleContent>
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
                      lucide="TerminalIcon"
                      tabler="IconTerminal"
                      hugeicons="ComputerTerminal01Icon"
                      phosphor="TerminalIcon"
                      remixicon="RiTerminalLine"
                    />
                  </TraceIcon>
                  <TraceTitle>
                    Ran pnpm prisma migrate reset --skip-seed
                  </TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <CodeBlock size="sm">
                  <CodeBlockContent wrap className="max-h-64">
                    {RESET_OUTPUT}
                  </CodeBlockContent>
                </CodeBlock>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultExpanded>
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
                  <TraceTitle>Failed: {error}</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent className="flex flex-col gap-2">
                <p className="font-mono text-xs text-destructive">{error}</p>
                <Trace>
                  {appFrames.map((frame) => (
                    <a
                      key={frame.line}
                      href={`#${frame.file}:${frame.lineNumber}`}
                    >
                      <TraceLine>
                        <TraceIcon>
                          <IconPlaceholder
                            lucide="FileCodeIcon"
                            tabler="IconFileCode"
                            hugeicons="FileScriptIcon"
                            phosphor="FileCodeIcon"
                            remixicon="RiFileCodeLine"
                          />
                        </TraceIcon>
                        <TraceTitle>
                          {frame.name} in {frame.file}:{frame.lineNumber}
                        </TraceTitle>
                      </TraceLine>
                    </a>
                  ))}
                  <TraceCollapsible>
                    <TraceCollapsibleTrigger>
                      <TraceLine>
                        <TraceIcon>
                          <IconPlaceholder
                            lucide="LayersIcon"
                            tabler="IconStack2"
                            hugeicons="Layers01Icon"
                            phosphor="StackIcon"
                            remixicon="RiStackLine"
                          />
                        </TraceIcon>
                        <TraceTitle>
                          {internalFrames.length} framework frames
                        </TraceTitle>
                      </TraceLine>
                    </TraceCollapsibleTrigger>
                    <TraceCollapsibleContent>
                      <ol className="flex flex-col gap-1 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">
                        {internalFrames.map((frame) => (
                          <li key={frame.line} className="whitespace-nowrap">
                            {frame.line}
                          </li>
                        ))}
                      </ol>
                    </TraceCollapsibleContent>
                  </TraceCollapsible>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <p>
            The migrations ran, but the seed failed in seedUsers. One fixture
            has no profile, so profile.email is undefined.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
