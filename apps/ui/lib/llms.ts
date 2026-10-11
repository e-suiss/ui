import { readFile } from "node:fs/promises";
import path from "node:path";
import type * as PageTree from "fumadocs-core/page-tree";

import { absolute, site } from "@/lib/site";
import { source } from "@/lib/source";

type Page = NonNullable<ReturnType<typeof source.getPage>>;

const fence = (code: string, lang: string, title?: string) =>
  `\`\`\`${lang}${title ? ` title="${title}"` : ""}\n${code.trimEnd()}\n\`\`\``;

const decode = (text: string) =>
  text.replace(/&#x([0-9a-f]+);/gi, (_match, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)));

async function toMarkdown(body: string) {
  const files = new Map<string, string>();
  for (const [, file] of body.matchAll(/<SourceFile path="([^"]+)"[^>]*\/>/g)) {
    files.set(file, await readFile(path.join(process.cwd(), "components", path.relative("components", file)), "utf8").catch(() => ""));
  }
  return body
    .replace(/<Code lang="(\w+)"(?: title="([^"]*)")? code="([^"]*)" \/>/g, (_match, lang: string, title: string | undefined, code: string) =>
      fence(JSON.parse(decode(code)), lang, title),
    )
    .replace(/<SourceFile path="([^"]+)"[^>]*\/>/g, (_match, file: string) =>
      fence(files.get(file) ?? "", path.extname(file).slice(1) || "tsx", file),
    );
}

const attr = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}="([^"]*)"`));
  return match ? decode(match[1]) : undefined;
};

const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

type Prop = { name: string; type?: string; default?: string; description?: string };
type Part = { name: string; children: Part[] };

function propsTable(tag: string) {
  const props = JSON.parse(attr(tag, "props") ?? "[]") as Prop[];
  const extendsFrom = JSON.parse(attr(tag, "extends") ?? "[]") as string[];
  const lines: string[] = [];
  if (props.length > 0) {
    lines.push("| Prop | Type | Default | Description |", "| --- | --- | --- | --- |");
    for (const prop of props) {
      lines.push(
        `| \`${prop.name}\` | \`${cell(prop.type ?? "")}\` | ${prop.default ? `\`${cell(prop.default)}\`` : "-"} | ${cell(prop.description ?? "")} |`,
      );
    }
  }
  if (extendsFrom.length > 0) lines.push("", `Also accepts the props of ${extendsFrom.map((name) => `\`${name}\``).join(", ")}.`);
  return lines.join("\n");
}

function anatomy(tag: string) {
  const tree = JSON.parse(attr(tag, "tree") ?? "[]") as Part[];
  const walk = (parts: Part[], depth: number): string[] =>
    parts.flatMap((part) => [`${"  ".repeat(depth)}- \`${part.name}\``, ...walk(part.children, depth + 1)]);
  return walk(tree, 0).join("\n");
}

function registryIndex(tag: string) {
  const category = attr(tag, "category") ?? "";
  return source
    .getPages()
    .filter((page) => page.slugs[0] === category && page.slugs.length > 1)
    .map((page) => `- [${page.data.title}](${absolute(page.url)})${page.data.description ? `: ${page.data.description}` : ""}`)
    .join("\n");
}

function cleanMarkdown(body: string) {
  const output: string[] = [];
  let fence = false;
  let indent = 0;
  for (const raw of body.split("\n")) {
    const isFence = raw.trim().startsWith("```");
    const line = (!fence || isFence) && indent > 0 && raw.startsWith(" ".repeat(indent)) ? raw.slice(indent) : raw;
    const trimmed = line.trim();
    if (isFence) fence = !fence;
    if (fence || isFence) {
      output.push(line);
      continue;
    }
    const open = trimmed.match(/^<(Example|ApiPart|Callout)\b([^>]*)>$/);
    if (open) {
      if (open[1] === "Example") output.push(`**Example${attr(open[2], "story") ? `: ${attr(open[2], "story")}` : ""}**`, "");
      if (open[1] === "Callout") output.push(`> **${(attr(open[2], "type") ?? "note").replace(/^./, (c) => c.toUpperCase())}:**`);
      indent += 2;
      continue;
    }
    if (/^<\/(Example|ApiPart|Callout)>$/.test(trimmed)) {
      indent = Math.max(0, indent - 2);
      continue;
    }
    if (trimmed.startsWith("<PropsTable")) output.push(propsTable(trimmed));
    else if (trimmed.startsWith("<Anatomy")) output.push(anatomy(trimmed));
    else if (trimmed.startsWith("<RegistryIndex")) output.push(registryIndex(trimmed));
    else output.push(line.replace(/^(#{1,6} .*?) \[#[^\]]+\]$/, "$1"));
  }
  return output.join("\n").replace(/\n{3,}/g, "\n\n");
}

export const markdownUrl = (url: string) => `/llms.mdx${url}`;

export async function pageMarkdown(page: Page) {
  const body = cleanMarkdown(await toMarkdown(await page.data.getText("processed")));
  return [`# ${page.data.title}`, page.data.description ?? "", `Source: ${absolute(page.url)}`, body]
    .filter(Boolean)
    .join("\n\n");
}

const groupTitles: Record<string, string> = {
  components: "Components",
  patterns: "Patterns",
  interactions: "Interactions",
  charts: "Charts",
  blocks: "Blocks",
};

function treeOrder() {
  const urls: string[] = [];
  const walk = (nodes: PageTree.Node[]) => {
    for (const node of nodes) {
      if (node.type === "page") urls.push(node.url);
      if (node.type === "folder") {
        if (node.index) urls.push(node.index.url);
        walk(node.children);
      }
    }
  };
  walk(source.getPageTree().children);
  return urls;
}

export function pageGroups() {
  const order = treeOrder();
  const rank = (page: Page) => (order.indexOf(page.url) + 1 || order.length + 1);
  const groups = new Map<string, Page[]>(["Get started", ...Object.values(groupTitles)].map((title) => [title, []]));
  for (const page of [...source.getPages()].sort((a, b) => rank(a) - rank(b))) {
    const title = groupTitles[page.slugs[0] ?? ""] ?? "Get started";
    groups.set(title, [...(groups.get(title) ?? []), page]);
  }
  return groups;
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
      `- Every page is also available as Markdown by appending \`.md\` to its URL or sending \`Accept: text/markdown\`.`,
    ].join("\n"),
  ];
  for (const [title, pages] of pageGroups()) {
    if (pages.length === 0) continue;
    lines.push(
      `## ${title}\n\n${pages
        .map((page) => `- [${page.data.title}](${absolute(`${page.url}.md`)})${page.data.description ? `: ${page.data.description}` : ""}`)
        .join("\n")}`,
    );
  }
  lines.push(`## Optional\n\n- [GitHub repository](${site.repository})\n- [npm package](${site.npm})`);
  return lines.join("\n\n");
}
