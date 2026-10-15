import { Code, ComponentSource } from "@/components/site/component-source"
import { Example } from "@/components/site/example"
import { exampleSource } from "@/lib/highlight"
import { type PreviewLayout, type PreviewType, previewOf } from "@/lib/previews"

export async function ComponentPreview(props: {
  name: string
  type?: PreviewType
  layout?: PreviewLayout
  responsive?: boolean
}) {
  const preview = previewOf(props)
  return (
    <Example preview={preview}>
      {preview.type === "example" ? (
        <Code code={await exampleSource(preview.name)} />
      ) : (
        <ComponentSource
          path={`components/${preview.type}s/${preview.name}.tsx`}
          fold={false}
        />
      )}
    </Example>
  )
}
