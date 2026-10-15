import type { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"

import { PreviewCanvas } from "@/components/site/example-preview"
import { framedPreviews } from "@/lib/previews"

const scrollbars = `
html, body { overflow: hidden; }
@layer base {
* { scrollbar-width: thin; scrollbar-color: color-mix(in oklab, var(--color-label) 22%, transparent) transparent; }
*::-webkit-scrollbar { width: 9px; height: 9px; }
*::-webkit-scrollbar-track, *::-webkit-scrollbar-corner { background: transparent; }
*::-webkit-scrollbar-thumb { border: 2px solid transparent; border-radius: 9999px; background: color-mix(in oklab, var(--color-label) 22%, transparent) padding-box; }
*::-webkit-scrollbar-thumb:hover { background-color: color-mix(in oklab, var(--color-label) 35%, transparent); }
}
`

export const metadata: Metadata = { robots: { index: false } }

export async function generateStaticParams() {
  return (await framedPreviews()).map(({ name }) => ({ name }))
}

async function Canvas({
  params,
}: {
  params: PageProps<"/preview/[name]">["params"]
}) {
  const { name } = await params
  const preview = (await framedPreviews()).find((item) => item.name === name)
  if (!preview) notFound()
  return (
    <PreviewCanvas
      type={preview.type}
      name={preview.name}
      layout={preview.layout}
    />
  )
}

export default function Preview(props: PageProps<"/preview/[name]">) {
  return (
    <>
      <style>{scrollbars}</style>
      <React.Suspense>
        <Canvas params={props.params} />
      </React.Suspense>
    </>
  )
}
