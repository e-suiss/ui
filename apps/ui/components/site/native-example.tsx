import type * as React from "react"

import { Code } from "@/components/site/component-source"
import { NativeExampleView } from "@/components/site/native-example-view"
import { nativeCode, nativePreview } from "@/lib/native"

const LABELS = { swift: "SwiftUI", kotlin: "Compose" } as const

export function NativeExample({
  id,
  live,
  platforms,
  children,
}: {
  id: string
  live?: string
  platforms?: string[]
  children?: React.ReactNode
}) {
  const preview = nativePreview(id)
  const view = {
    id: preview ? id : undefined,
    width: preview?.width,
    height: preview?.height,
    video: Boolean(preview?.video && !live),
    live: preview ? live : undefined,
  }
  if (children)
    return (
      <NativeExampleView {...view} platforms={platforms}>
        {children}
      </NativeExampleView>
    )

  const code = nativeCode(id)
  const others = (["swift", "kotlin"] as const).filter(
    (platform) => code[platform]
  )
  return (
    <NativeExampleView
      {...view}
      platforms={
        others.length
          ? ["React Native", ...others.map((platform) => LABELS[platform])]
          : undefined
      }
    >
      <Code code={code.rn ?? ""} />
      {others.map((platform) => (
        <Code key={platform} code={code[platform] ?? ""} lang={platform} />
      ))}
    </NativeExampleView>
  )
}
