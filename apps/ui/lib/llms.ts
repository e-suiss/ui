import path from "node:path"
import type * as PageTree from "fumadocs-core/page-tree"

import { exampleSource, readSource, sourcePath } from "@/lib/highlight"
import { nativeCode, nativePreview } from "@/lib/native"
import { absolute, site } from "@/lib/site"
import { source } from "@/lib/source"
import { pageSummary } from "@/lib/summary"

const ONLY_OPEN = /^<Only platform="([^"]*)">$/
const ONLY_BASE_OPEN = /^<OnlyBase base="([^"]*)">$/
const TABS_OPEN = /^<Tabs\b(.*)>$/
const BLOCK_OPEN = /^<(NativeExample|ApiPart|Callout|Anatomy)\b([^>]*)>$/
const FIRST_CHAR = /^./
const BLOCK_CLOSE = /^<\/(NativeExample|ApiPart|Callout|Anatomy)>$/
const HEADING_ANCHOR = /^(#{1,6} .*?) \[#[^\]]+\]$/
const RELATIVE_LINK = /\]\((\/[^)\s]*)\)/g

type Page = NonNullable<ReturnType<typeof source.getPage>>

const fence = (code: string, lang: string, title?: string) =>
  `\`\`\`${lang}${title ? ` title="${title}"` : ""}\n${code.trimEnd()}\n\`\`\``

const decode = (text: string) =>
  text.replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) =>
    String.fromCodePoint(Number.parseInt(hex, 16))
  )

const COMPONENT_SOURCE = /<ComponentSource path="([^"]+)"[^>]*\/>/g
const COMPONENT_PREVIEW = /^<ComponentPreview\b([^>]*?)\/>$/gm
const NATIVE_EXAMPLE = /^<NativeExample id="([^"]+)"[^>]*\/>$/gm
const NATIVE_OPEN = /^<NativeExample id="([^"]+)"/
const ANATOMY_ITEM = /^(\s*)[-*] (?:\[([^\]]+)\]\([^)]*\)|(.+))$/

const repositoryRoot = path.join(process.cwd(), "../..")

const sourceKey = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "")

const fileKey = (file: string) =>
  sourceKey(path.basename(file, path.extname(file)))

function ownerPage(file: string) {
  const key = fileKey(file)
  return source
    .getPages()
    .find(
      (page) =>
        page.slugs.length === 2 && sourceKey(page.slugs[1] ?? "") === key
    )
}

function repositoryUrl(file: string) {
  const resolved = sourcePath(file)
  return resolved
    ? `${site.repository}/blob/main/${path.relative(repositoryRoot, resolved).split(path.sep).join("/")}`
    : undefined
}

export type MarkdownContext = {
  page: Page
  seen: Set<string>
  shared?: Map<string, string>
}

async function sourceBlock(file: string, context: MarkdownContext) {
  const own = fileKey(file) === sourceKey(context.page.slugs.at(-1) ?? "")
  if (context.seen.has(file)) return `- \`${file}\`: shown above`
  if (own) {
    context.seen.add(file)
    return fence(
      await fileText(file),
      path.extname(file).slice(1) || "tsx",
      file
    )
  }
  const owner = ownerPage(file)
  if (owner && owner.url !== context.page.url)
    return `- \`${file}\`: see [${owner.data.title}](${absolute(context.shared ? owner.url : `${owner.url}.md`)})`
  if (context.shared) {
    if (!context.shared.has(file))
      context.shared.set(file, await fileText(file))
    return `- \`${file}\`: see Shared source files`
  }
  const url = repositoryUrl(file)
  return `- \`${file}\`${url ? `: [source](${url})` : ""}`
}

export function sharedSources(shared: Map<string, string>) {
  return [
    "# Shared source files",
    "Files that several items build on, included once.",
    ...[...shared].map(([file, code]) =>
      fence(code, path.extname(file).slice(1) || "tsx", file)
    ),
  ].join("\n\n")
}

async function fileText(file: string) {
  return (await readSource(file).catch(() => undefined)) ?? ""
}

async function replaceAsync(
  text: string,
  pattern: RegExp,
  replace: (...groups: string[]) => Promise<string>
) {
  const parts = await Promise.all(
    [...text.matchAll(pattern)].map((match) => replace(...match))
  )
  let index = 0
  return text.replace(pattern, () => parts[index++] ?? "")
}

function previewImage(id: string) {
  return nativePreview(id)
    ? `![Preview](${absolute(`/previews/${id}.light.webp`)})`
    : ""
}

async function toMarkdown(body: string, context: MarkdownContext) {
  let text = await replaceAsync(body, COMPONENT_SOURCE, (_match, file = "") =>
    sourceBlock(file, context)
  )
  text = await replaceAsync(
    text,
    COMPONENT_PREVIEW,
    async (_match, tag = "") => {
      const name = attr(tag, "name") ?? ""
      const type = attr(tag, "type")
      if (type) {
        const file = `components/${type}s/${name}.tsx`
        return `**Example**\n\n${fence(await fileText(file), "tsx", file)}`
      }
      return `**Example**\n\n${fence(await exampleSource(name), "tsx")}`
    }
  )
  text = text.replace(NATIVE_EXAMPLE, (_match, id: string) => {
    const code = nativeCode(id)
    return [
      previewImage(id),
      fence(code.rn ?? "", "tsx"),
      ...(code.swift ? [fence(code.swift, "swift")] : []),
      ...(code.kotlin ? [fence(code.kotlin, "kotlin")] : []),
    ]
      .filter(Boolean)
      .join("\n\n")
  })
  return text
}

const platformNames: Record<string, string> = {
  web: "React",
  rn: "React Native",
  swift: "SwiftUI",
  kotlin: "Jetpack Compose",
}

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`))
  return match ? decode(match[1]) : undefined
}

function registryIndex(tag: string) {
  const category = attr(tag, "category") ?? ""
  return source
    .getPages()
    .filter((page) => page.slugs[0] === category && page.slugs.length > 1)
    .map(
      (page) =>
        `- [${page.data.title}](${absolute(page.url)})${page.data.description ? `: ${page.data.description}` : ""}`
    )
    .join("\n")
}

function cleanMarkdown(body: string) {
  const output: string[] = []
  let fence = false
  let indent = 0
  let labels: string[] = []
  let anatomy = false
  let otherBase = false
  for (const raw of body.split("\n")) {
    const isFence = raw.trim().startsWith("```")
    if (otherBase) {
      if (isFence) fence = !fence
      else if (!fence && raw.trim() === "</OnlyBase>") otherBase = false
      continue
    }
    const line =
      (!fence || isFence) && indent > 0 && raw.startsWith(" ".repeat(indent))
        ? raw.slice(indent)
        : raw
    const trimmed = line.trim()
    if (isFence) fence = !fence
    if (fence || isFence) {
      output.push(line)
      continue
    }
    const onlyBase = trimmed.match(ONLY_BASE_OPEN)
    if (onlyBase) {
      otherBase = !onlyBase[1].split(" ").includes("base")
      continue
    }
    if (trimmed === "</OnlyBase>") continue
    const only = trimmed.match(ONLY_OPEN)
    if (only) {
      output.push(
        `**${only[1]
          .split(" ")
          .map((platform) => platformNames[platform] ?? platform)
          .join(", ")}**`,
        ""
      )
      continue
    }
    if (trimmed === "</Only>") continue
    const tabs = trimmed.match(TABS_OPEN)
    if (tabs) {
      labels = [...tabs[1].matchAll(/&quot;([^&]*)&quot;|"([^"]*)"/g)]
        .map((match) => decode(match[1] ?? match[2]))
        .filter((label) => label !== "items")
      continue
    }
    if (trimmed === "</Tabs>" || trimmed === "</div>") continue
    if (trimmed === "<div>") {
      if (labels.length) output.push(`**${labels.shift()}**`, "")
      continue
    }
    const open = trimmed.match(BLOCK_OPEN)
    if (open) {
      if (open[1] === "NativeExample")
        output.push(previewImage(trimmed.match(NATIVE_OPEN)?.[1] ?? ""), "")
      anatomy = open[1] === "Anatomy"
      if (open[1] === "Callout")
        output.push(
          `> **${(attr(open[2], "type") ?? "note").replace(FIRST_CHAR, (c) => c.toUpperCase())}:**`
        )
      indent += 2
      continue
    }
    if (BLOCK_CLOSE.test(trimmed)) {
      indent = Math.max(0, indent - 2)
      anatomy = false
      continue
    }
    const item = anatomy ? line.match(ANATOMY_ITEM) : null
    if (item)
      output.push(`${item[1]}- \`${(item[2] ?? item[3] ?? "").trim()}\``)
    else if (trimmed.startsWith("<RegistryIndex"))
      output.push(registryIndex(trimmed))
    else
      output.push(
        line
          .replace(HEADING_ANCHOR, "$1")
          .replace(
            RELATIVE_LINK,
            (_match, url: string) => `](${absolute(url)})`
          )
      )
  }
  return output.join("\n").replace(/\n{3,}/g, "\n\n")
}

export const markdownUrl = (url: string) => `/llms.mdx${url}`

export async function pageMarkdown(page: Page, shared?: Map<string, string>) {
  const body = cleanMarkdown(
    await toMarkdown(await page.data.getText("processed"), {
      page,
      seen: new Set(),
      shared,
    })
  )
  return [
    `# ${page.data.title}`,
    page.data.description ?? "",
    pageSummary(page.data.title, page.data.eyebrow, page.data.platforms) ?? "",
    `Source: ${absolute(page.url)}`,
    body,
  ]
    .filter(Boolean)
    .join("\n\n")
}

const groupTitles: Record<string, string> = {
  components: "Components",
  patterns: "Patterns",
  interactions: "Interactions",
  charts: "Charts",
  blocks: "Blocks",
}

function treeOrder() {
  const urls: string[] = []
  const walk = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type === "page") urls.push(node.url)
      if (node.type === "folder") {
        if (node.index) urls.push(node.index.url)
        walk(node.children)
      }
    }
  }
  walk(source.getPageTree().children)
  return urls
}

export function pageGroups() {
  const order = treeOrder()
  const rank = (page: Page) => order.indexOf(page.url) + 1 || order.length + 1
  const groups = new Map<string, Page[]>(
    ["Get started", ...Object.values(groupTitles)].map((title) => [title, []])
  )
  for (const page of [...source.getPages()].sort((a, b) => rank(a) - rank(b))) {
    const title = groupTitles[page.slugs[0] ?? ""] ?? "Get started"
    groups.set(title, [...(groups.get(title) ?? []), page])
  }
  return groups
}

export function llmsIndex() {
  const lines = [
    `# ${site.name}`,
    `> ${site.description}`,
    site.summary,
    [
      "Key facts:",
      `- Package: \`${site.packageName}\` (CLI, run with npx; components are copied into your project, not installed as a dependency)`,
      `- Start: \`${site.install}\``,
      `- Stack: ${site.topics.join(", ")}`,
      `- License: ${site.license}`,
      `- Source: ${site.repository}`,
      `- Full documentation in one file: ${absolute("/llms-full.txt")}`,
      "- Every page is also available as Markdown by appending `.md` to its URL or sending `Accept: text/markdown`.",
    ].join("\n"),
  ]
  for (const [title, pages] of pageGroups()) {
    if (pages.length === 0) continue
    lines.push(
      `## ${title}\n\n${pages
        .map(
          (page) =>
            `- [${page.data.title}](${absolute(`${page.url}.md`)})${page.data.description ? `: ${page.data.description}` : ""}`
        )
        .join("\n")}`
    )
  }
  lines.push(
    `## Optional\n\n- [GitHub repository](${site.repository})\n- [npm package](${site.npm})`
  )
  return lines.join("\n\n")
}
