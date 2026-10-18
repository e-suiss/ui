import path from "node:path"

import { CodeBlock } from "@/components/site/code-block"
import { LazySource } from "@/components/site/lazy-source"
import { NativeSource } from "@/components/site/native-source"
import { withBase } from "@/lib/base-path"
import { sourceUrl } from "@/lib/code-options"
import {
  exampleFile,
  exampleSource,
  highlightCode,
  plainCode,
  readSource,
  sourceVariants,
} from "@/lib/highlight"

const PREVIEW_LINES = 16

const languageOf = (file: string) => path.extname(file).slice(1) || "tsx"

async function highlighted(
  code: string,
  lang: string,
  title?: string,
  src?: string,
  plain = false
) {
  const { className, style, html } = plain
    ? plainCode(code.trimEnd())
    : await highlightCode(code.trimEnd(), lang)
  return (
    <CodeBlock
      title={title}
      className={className}
      style={style}
      html={html}
      src={src}
      raw={title === "Terminal" ? code.trimEnd() : undefined}
    />
  )
}

export async function NativeCode({
  id,
  platform,
  code,
  lang,
}: {
  id: string
  platform: string
  code: string
  lang: string
}) {
  const lines = code.trimEnd().split("\n")
  const long = lines.length > PREVIEW_LINES
  const src = long ? withBase(`/native/${platform}/${id}`) : undefined
  return (
    <NativeSource src={src}>
      {
        await highlighted(
          long ? lines.slice(0, PREVIEW_LINES).join("\n") : code,
          lang,
          undefined,
          src
        )
      }
    </NativeSource>
  )
}

async function preview(file: string, plain = false) {
  const code = ((await readSource(file)) ?? "").trimEnd()
  const lines = code.split("\n")
  const long = lines.length > PREVIEW_LINES
  const block = await highlighted(
    long ? lines.slice(0, PREVIEW_LINES).join("\n") : code,
    languageOf(file),
    file,
    long ? sourceUrl(file) : undefined,
    plain
  )
  return {
    block,
    long,
    lines: Math.min(lines.length, PREVIEW_LINES),
    variants: await sourceVariants(file),
  }
}

export async function ComponentSource({
  path: file,
  fold = true,
  plain = false,
}: {
  path: string
  fold?: boolean
  plain?: boolean
}) {
  const { block, long, lines, variants } = await preview(file, plain)
  return (
    <LazySource
      file={file}
      variants={variants}
      title={file}
      long={long}
      lines={lines}
      fold={fold || long}
    >
      {block}
    </LazySource>
  )
}

export async function ExampleSource({ name }: { name: string }) {
  const file = exampleFile(name)
  const code = (await exampleSource(name)).trimEnd()
  const lines = code.split("\n")
  const long = lines.length > PREVIEW_LINES
  const block = await highlighted(
    long ? lines.slice(0, PREVIEW_LINES).join("\n") : code,
    "tsx",
    undefined,
    long ? sourceUrl(file) : undefined
  )
  return (
    <LazySource
      file={file}
      variants={await sourceVariants(file)}
      long={long}
      fold={false}
    >
      {block}
    </LazySource>
  )
}
