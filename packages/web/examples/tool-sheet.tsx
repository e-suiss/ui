import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Trace, TraceIcon, TraceLine, TraceTitle } from "@/components/ui/trace"

const PACKAGE_JSON = `{
  "name": "acme-chat",
  "private": true,
  "dependencies": {
    "@ai-sdk/react": "^4.0.0",
    "ai": "^7.0.0",
    "next": "^16.3.0"
  }
}`

export default function ToolSheet() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Which AI SDK version does this app use?
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <Sheet>
              <SheetTrigger>
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
                  <TraceTitle>Read package.json</TraceTitle>
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
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-mono">package.json</SheetTitle>
                  <SheetDescription>
                    {PACKAGE_JSON.split("\n").length} lines
                  </SheetDescription>
                </SheetHeader>
                <CodeBlock className="mx-6 mb-6 w-auto">
                  <CodeBlockContent lineNumbers>
                    {PACKAGE_JSON}
                  </CodeBlockContent>
                </CodeBlock>
              </SheetContent>
            </Sheet>
          </Trace>
          <p>It uses ai 7 with @ai-sdk/react 4.</p>
        </MessageContent>
      </Message>
    </div>
  )
}
