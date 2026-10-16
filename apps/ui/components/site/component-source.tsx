import path from "node:path"

import { CodeBlock } from "@/components/site/code-block"
import { LazySource } from "@/components/site/lazy-source"
import { sourceUrl } from "@/lib/code-options"
import {
  exampleFile,
  exampleSource,
  highlightCode,
  readSource,
  sourceVariants,
} from "@/lib/highlight"

const PREVIEW_LINES = 16

const languageOf = (file: string) => path.extname(file).slice(1) || "tsx"

async function highlighted(
  code: string,
  lang: string,
  title?: string,
  src?: string
) {
  const { className, style, html } = await highlightCode(code.trimEnd(), lang)
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

export function Code({
  code,
  lang = "tsx",
  title,
}: {
  code: string
  lang?: string
  title?: string
}) {
  return highlighted(code, lang, title)
}

async function preview(file: string) {
  const code = ((await readSource(file)) ?? "").trimEnd()
  const lines = code.split("\n")
  const long = lines.length > PREVIEW_LINES
  const block = await highlighted(
    long ? lines.slice(0, PREVIEW_LINES).join("\n") : code,
    languageOf(file),
    file,
    long ? sourceUrl(file) : undefined
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
}: {
  path: string
  fold?: boolean
}) {
  const { block, long, lines, variants } = await preview(file)
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

async function example(name: string) {
  const file = exampleFile(name)
  return {
    file,
    block: await highlighted(await exampleSource(name), "tsx"),
    variants: await sourceVariants(file),
  }
}

export async function ExampleSource({ name }: { name: string }) {
  const { file, block, variants } = await example(name)
  return (
    <LazySource file={file} variants={variants} fold={false}>
      {block}
    </LazySource>
  )
}
