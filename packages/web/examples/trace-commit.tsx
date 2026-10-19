import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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

const LOGIN_PAGE_DIFF = `@@ -14,7 +14,7 @@ export default async function LoginPage({
   searchParams,
 }) {
   const { next } = await searchParams
-  const redirectTo =
-    next && next.startsWith("/") ? next : "/"
+  const redirectTo = safeRedirect(next)
+
   return <LoginForm redirectTo={redirectTo} />
 }`

const REDIRECT_DIFF = `@@ -0,0 +1,7 @@
+export function safeRedirect(next: string | undefined) {
+  if (!next || !next.startsWith("/") || next.startsWith("//")) {
+    return "/"
+  }
+
+  return next
+}`

function lineVariant(line: string) {
  if (line.startsWith("+")) return "added"
  if (line.startsWith("-")) return "removed"
  return "default"
}

function DiffLines({ diff }: { diff: string }) {
  return diff.split("\n").map((line, index) => {
    if (line.startsWith("@@")) {
      return (
        <CodeBlockLine key={index} className="text-muted-foreground">
          {line}
        </CodeBlockLine>
      )
    }

    return (
      <CodeBlockLine key={index} variant={lineVariant(line)}>
        {line.slice(1)}
      </CodeBlockLine>
    )
  })
}

export default function TraceCommit() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="GitCommitHorizontalIcon"
                tabler="IconGitCommit"
                hugeicons="GitCommitIcon"
                phosphor="GitCommitIcon"
                remixicon="RiGitCommitLine"
              />
            </TraceIcon>
            <TraceTitle>Committed a1b2c3: Fix the login redirect</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            <Sheet>
              <SheetTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="FilePenIcon"
                      tabler="IconFilePencil"
                      hugeicons="FileEditIcon"
                      phosphor="NotePencilIcon"
                      remixicon="RiFileEditLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Edited app/login/page.tsx</TraceTitle>
                  <TraceDescription className="font-mono">
                    +2 −2
                  </TraceDescription>
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
                  <SheetTitle className="font-mono">
                    app/login/page.tsx
                  </SheetTitle>
                  <SheetDescription>2 additions, 2 deletions</SheetDescription>
                </SheetHeader>
                <CodeBlock className="mx-6 mb-6 w-auto">
                  <CodeBlockContent>
                    <DiffLines diff={LOGIN_PAGE_DIFF} />
                  </CodeBlockContent>
                </CodeBlock>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="FilePlusIcon"
                      tabler="IconFilePlus"
                      hugeicons="FileAddIcon"
                      phosphor="FilePlusIcon"
                      remixicon="RiFileAddLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Added lib/auth/redirect.ts</TraceTitle>
                  <TraceDescription className="font-mono">
                    +7 −0
                  </TraceDescription>
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
                  <SheetTitle className="font-mono">
                    lib/auth/redirect.ts
                  </SheetTitle>
                  <SheetDescription>7 additions, 0 deletions</SheetDescription>
                </SheetHeader>
                <CodeBlock className="mx-6 mb-6 w-auto">
                  <CodeBlockContent>
                    <DiffLines diff={REDIRECT_DIFF} />
                  </CodeBlockContent>
                </CodeBlock>
              </SheetContent>
            </Sheet>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
