import type * as React from "react"

import { NativeCode } from "@/components/site/component-source"
import { NativeExampleView } from "@/components/site/native-example-view"
import { OnlyStyling } from "@/components/site/only-styling"
import {
  NATIVE_LANGUAGES,
  nativeCode,
  nativePreview,
  webPreviewFor,
} from "@/lib/native"
import { strings } from "@/lib/strings"

const LABELS = { swift: "SwiftUI", kotlin: "Compose" } as const

export function NativeExample({
  name: id,
  platforms,
  children,
}: {
  name: string
  platforms?: string[]
  children?: React.ReactNode
}) {
  const web = webPreviewFor(id)
  const preview = web ? undefined : nativePreview(id)
  const view = {
    id: preview || web ? id : undefined,
    web,
    width: preview?.width,
    height: preview?.height,
    video: Boolean(preview?.video),
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
      {code.stylesheet === code.rn ? (
        <NativeCode
          id={id}
          platform="rn"
          code={code.rn ?? ""}
          lang={NATIVE_LANGUAGES.rn}
        />
      ) : (
        <div className="contents">
          <OnlyStyling styling="uniwind nativewind">
            <NativeCode
              id={id}
              platform="rn"
              code={code.rn ?? ""}
              lang={NATIVE_LANGUAGES.rn}
            />
          </OnlyStyling>
          <OnlyStyling styling="stylesheet">
            {code.stylesheet ? (
              <NativeCode
                id={id}
                platform="stylesheet"
                code={code.stylesheet}
                lang={NATIVE_LANGUAGES.stylesheet}
              />
            ) : (
              <p className="p-5 text-sm text-muted-foreground">
                {strings.stylingNote}
              </p>
            )}
          </OnlyStyling>
        </div>
      )}
      {others.map((platform) => (
        <NativeCode
          key={platform}
          id={id}
          platform={platform}
          code={code[platform] ?? ""}
          lang={NATIVE_LANGUAGES[platform]}
        />
      ))}
    </NativeExampleView>
  )
}
