import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ui/code-block"

const output = `$ pnpm build
Compiled in 4.2s
Generated 12 static pages`

export default function CodeBlockFooterExample() {
  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>Logs</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={output} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{output}</CodeBlockContent>
        <CodeBlockFooter className="text-sm">
          Exited with code 0
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}
