import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"

export default function CodeBlockWrap() {
  return (
    <CodeBlock>
      <CodeBlockContent wrap>
        ERR_PNPM_OUTDATED_LOCKFILE Cannot install with
        &quot;frozen-lockfile&quot; because pnpm-lock.yaml is not up to date
        with package.json
      </CodeBlockContent>
    </CodeBlock>
  )
}
