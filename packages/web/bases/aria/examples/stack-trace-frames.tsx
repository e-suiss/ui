import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

const STACK = `TypeError: Cannot read properties of undefined (reading 'total')
    at formatInvoice (app/lib/billing.ts:42:31)
    at InvoiceRow (app/components/invoice-row.tsx:18:12)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at beginWork (node_modules/react-dom/cjs/react-dom.development.js:19049:16)
    at performUnitOfWork (node_modules/react-dom/cjs/react-dom.development.js:22776:12)
    at workLoopSync (node_modules/react-dom/cjs/react-dom.development.js:22707:5)`

function parseFrame(line: string) {
  const match = line.match(FRAME)

  return {
    line,
    name: match?.[1],
    file: match?.[2],
    lineNumber: match?.[3],
    internal: line.includes("node_modules"),
  }
}

const [error, ...lines] = STACK.split("\n").map((line) => line.trim())
const frames = lines.map(parseFrame)
const appFrames = frames.filter((frame) => !frame.internal)
const internalFrames = frames.filter((frame) => frame.internal)

export default function StackTraceFrames() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <IconPlaceholder
                lucide="CircleXIcon"
                tabler="IconCircleX"
                hugeicons="CancelCircleIcon"
                phosphor="XCircleIcon"
                remixicon="RiCloseCircleLine"
              />
            </TraceIcon>
            <TraceTitle>Failed: {error}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-2">
          <p className="font-mono text-xs text-destructive">{error}</p>
          <Trace>
            {appFrames.map((frame) => (
              <a key={frame.line} href={`#${frame.file}:${frame.lineNumber}`}>
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
  )
}
