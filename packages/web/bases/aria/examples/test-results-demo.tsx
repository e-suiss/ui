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

type Test = {
  name: string
  status: "passed" | "failed" | "skipped"
  error?: string
}

type Suite = { name: string; tests: Test[] }

const suites: Suite[] = [
  {
    name: "cart.test.ts",
    tests: [
      { name: "adds an item", status: "passed" },
      { name: "removes an item", status: "passed" },
      { name: "applies a discount code", status: "passed" },
    ],
  },
  {
    name: "payment.test.ts",
    tests: [
      { name: "charges the saved card", status: "passed" },
      {
        name: "retries a declined card",
        status: "failed",
        error: `Expected 2 charge attempts, received 1

  at Object.<anonymous> (src/payment.test.ts:58:22)`,
      },
    ],
  },
]

function countTests(tests: Test[]) {
  return {
    total: tests.length,
    failed: tests.filter((test) => test.status === "failed").length,
    skipped: tests.filter((test) => test.status === "skipped").length,
  }
}

function formatCounts({
  total,
  failed,
  skipped,
}: ReturnType<typeof countTests>) {
  return [
    `${total} tests`,
    failed > 0 && `${failed} failed`,
    skipped > 0 && `${skipped} skipped`,
  ]
    .filter(Boolean)
    .join(", ")
}

function TestRow({ test }: { test: Test }) {
  if (test.status === "failed") {
    return (
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine status="error">
            <TraceIcon>
              <IconPlaceholder
                lucide="XIcon"
                tabler="IconX"
                hugeicons="Cancel01Icon"
                phosphor="XIcon"
                remixicon="RiCloseLine"
              />
            </TraceIcon>
            <TraceTitle>{test.name}</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {test.error}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  return (
    <TraceLine>
      <TraceIcon>
        {test.status === "skipped" ? (
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
            phosphor="CircleDashedIcon"
            remixicon="RiLoaderLine"
          />
        ) : (
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        )}
      </TraceIcon>
      <TraceTitle>
        {test.status === "skipped" ? `Skipped ${test.name}` : test.name}
      </TraceTitle>
    </TraceLine>
  )
}

function TestResults({ suites }: { suites: Suite[] }) {
  const summary = countTests(suites.flatMap((suite) => suite.tests))

  return (
    <TraceCollapsible defaultExpanded={summary.failed > 0}>
      <TraceCollapsibleTrigger>
        <TraceLine status={summary.failed > 0 ? "error" : undefined}>
          <TraceIcon>
            <IconPlaceholder
              lucide="FlaskConicalIcon"
              tabler="IconFlask"
              hugeicons="FlaskConicalIcon"
              phosphor="FlaskIcon"
              remixicon="RiFlaskLine"
            />
          </TraceIcon>
          <TraceTitle>Ran {formatCounts(summary)}</TraceTitle>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          {suites.map((suite) => {
            const counts = countTests(suite.tests)

            return (
              <TraceCollapsible
                key={suite.name}
                defaultExpanded={counts.failed > 0}
              >
                <TraceCollapsibleTrigger>
                  <TraceLine status={counts.failed > 0 ? "error" : undefined}>
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
                      {suite.name}, {formatCounts(counts)}
                    </TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {suite.tests.map((test) => (
                      <TestRow key={test.name} test={test} />
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            )
          })}
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export default function TestResultsDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Run the checkout tests.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TestResults suites={suites} />
          </Trace>
          <p>
            One test failed. The payment client does not retry a declined card,
            so the second charge attempt never happens.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
