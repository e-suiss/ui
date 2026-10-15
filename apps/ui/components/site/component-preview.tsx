import {
  ComponentSource,
  ExampleSource,
} from "@/components/site/component-source"
import { Example } from "@/components/site/example"
import { type PreviewLayout, type PreviewType, previewOf } from "@/lib/previews"

export function ComponentPreview(props: {
  name: string
  type?: PreviewType
  layout?: PreviewLayout
  responsive?: boolean
}) {
  const preview = previewOf(props)
  return (
    <Example preview={preview}>
      {preview.type === "example" ? (
        <ExampleSource name={preview.name} />
      ) : (
        <ComponentSource
          path={`components/${preview.type}s/${preview.name}.tsx`}
          fold={false}
        />
      )}
    </Example>
  )
}
