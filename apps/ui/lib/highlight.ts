import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { highlightHast } from "fumadocs-core/highlight";

const palettes: Record<string, { prefix: string; base: string; colors: string[] }> = {
  "--shiki-light": {
    prefix: "l",
    base: "24292e",
    colors: ["005cc5", "6f42c1", "22863a", "d73a49", "032f62", "e36209", "b31d28", "6a737d", "586069"],
  },
  "--shiki-dark": {
    prefix: "d",
    base: "e1e4e8",
    colors: ["79b8ff", "b392f0", "85e89d", "f97583", "9ecbff", "ffab70", "fdaeb7", "6a737d", "dbedff"],
  },
};

type Span = { properties: Record<string, unknown> };

const tokenClasses = {
  name: "token-classes",
  span(node: Span) {
    const style = node.properties.style;
    if (typeof style !== "string") return;
    const classes: string[] = [];
    const rest: string[] = [];
    for (const declaration of style.split(";")) {
      const [property = "", raw = ""] = declaration.split(":");
      const palette = palettes[property.trim()];
      const value = raw.trim().toLowerCase().replace("#", "");
      const index = palette ? palette.colors.indexOf(value) : -1;
      if (palette && value === palette.base) continue;
      if (palette && index >= 0) classes.push(`${palette.prefix}${index}`);
      else if (declaration.trim()) rest.push(declaration);
    }
    if (rest.length > 0) node.properties.style = rest.join(";");
    else delete node.properties.style;
    if (classes.length > 0) node.properties.class = classes.join(" ");
  },
};

const packages = path.join(process.cwd(), "../../packages");
const webRoot = path.join(packages, "web");
const mobileRoot = path.join(packages, "mobile");
const nativeRoots: Record<string, string> = {
  swift: path.join(mobileRoot, "swiftui/Sources/EsuissUI"),
  kotlin: path.join(mobileRoot, "kotlin/ui/src/main/kotlin/com/esuiss/ui"),
};
const stylings = new Set(["uniwind", "nativewind", "stylesheet"]);

function resolveSource(file: string) {
  const [head = "", ...rest] = file.split("/");
  const tail = rest.join("/");
  if (head === "components" || head === "hooks") return { root: webRoot, resolved: path.join(webRoot, file) };
  if (nativeRoots[head]) return { root: nativeRoots[head], resolved: path.join(nativeRoots[head], tail) };
  if (stylings.has(head)) {
    const own = path.join(mobileRoot, file);
    return { root: mobileRoot, resolved: existsSync(own) ? own : path.join(mobileRoot, tail) };
  }
  return undefined;
}

export function sourcePath(file: string) {
  const source = resolveSource(file);
  return source?.resolved.startsWith(`${source.root}${path.sep}`) ? source.resolved : undefined;
}

export async function readSource(file: string) {
  const resolved = sourcePath(file);
  return resolved ? readFile(resolved, "utf8") : undefined;
}

export const sourceUrl = (file: string) => `/source/${file}`;

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name);
      return entry.isDirectory() ? files(full) : [full];
    }),
  );
  return nested.flat();
}

export async function sourceFiles() {
  "use cache";
  const found = new Set<string>();
  for (const file of await files(path.join(process.cwd(), "content"))) {
    if (!file.endsWith(".mdx")) continue;
    for (const [, source] of (await readFile(file, "utf8")).matchAll(/<SourceFile path="([^"]+)"/g)) found.add(source);
  }
  return [...found];
}

type Node =
  | { type: "text"; value: string }
  | { type: "element"; tagName: string; properties?: Record<string, unknown>; children?: Node[] }
  | { type: string; children?: Node[] };

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function attribute(name: string, value: unknown) {
  const text = Array.isArray(value) ? value.join(" ") : String(value);
  return ` ${name === "className" ? "class" : name}="${escape(text)}"`;
}

function toHtml(node: Node): string {
  if (node.type === "text" && "value" in node) return escape(node.value);
  const children = ("children" in node ? (node.children ?? []) : []).map(toHtml).join("");
  if (node.type !== "element" || !("tagName" in node)) return children;
  const attributes = Object.entries(node.properties ?? {})
    .map(([name, value]) => attribute(name, value))
    .join("");
  return `<${node.tagName}${attributes}>${children}</${node.tagName}>`;
}

function styleObject(style: unknown) {
  if (typeof style !== "string") return undefined;
  return Object.fromEntries(
    style
      .split(";")
      .map((declaration) => declaration.split(":").map((part) => part.trim()))
      .filter(([property, value]) => property && value),
  ) as Record<string, string>;
}

export type Highlighted = { className: string; style?: Record<string, string>; html: string };

export async function highlightCode(code: string, lang: string): Promise<Highlighted> {
  const root = await highlightHast(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [tokenClasses],
  });
  const pre = root.children.find((node) => node.type === "element" && node.tagName === "pre");
  if (!pre || pre.type !== "element") return { className: "", html: escape(code) };
  const className = pre.properties.className ?? pre.properties.class;
  return {
    className: Array.isArray(className) ? className.join(" ") : String(className ?? ""),
    style: styleObject(pre.properties.style),
    html: pre.children.map((child) => toHtml(child as Node)).join(""),
  };
}
