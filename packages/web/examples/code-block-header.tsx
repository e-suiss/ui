import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const command = "pnpm add ai @ai-sdk/react zod"

const output = `$ ${command}
Packages: +14
Progress: resolved 412, reused 398, downloaded 14, added 14, done
Done in 2.8s using pnpm v10.18.0`

export default function CodeBlockHeaderExample() {
  return (
    <CodeBlock className="w-full max-w-md">
      <CodeBlockHeader>
        <CodeBlockTitle>
          <IconPlaceholder
            lucide="TerminalIcon"
            tabler="IconTerminal2"
            hugeicons="ComputerTerminal01Icon"
            phosphor="TerminalWindowIcon"
            remixicon="RiTerminalBoxLine"
          />
          Terminal
        </CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={command} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>{output}</CodeBlockContent>
    </CodeBlock>
  )
}
