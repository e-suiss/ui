#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { componentApi, storyExamples } from "./lib/extract.mjs";
import { capitalize, fence, groupOf, MARKER, mdx, pascal, propsTable } from "./lib/docs.mjs";

const root = path.resolve(import.meta.dirname, "..");
const webDir = path.resolve(root, "../../packages/web");
const registry = JSON.parse(readFileSync(path.join(webDir, "registry.json"), "utf8"));

const categories = {
  ui: { folder: "components", add: "", title: "Components" },
  pattern: { folder: "patterns", add: "patterns ", title: "Patterns" },
  interaction: { folder: "interactions", add: "interactions ", title: "Interactions" },
  chart: { folder: "charts", add: "charts ", title: "Charts" },
  block: { folder: "blocks", add: "blocks ", title: "Blocks" },
};

const items = registry.items.filter((item) => item.type in categories && item.name !== "theme");
const byName = new Map(items.map((item) => [item.name, item]));

const overlays = new Set([
  "action-menu", "alert-dialog", "alert-sheet", "combobox", "command-palette", "confirm",
  "context-menu", "dialog", "drawer", "dropdown-menu", "flyout", "fullscreen-menu",
  "hover-card", "menubar", "modal", "popover", "preview", "select", "sheet", "tooltip",
]);

const demos = path.join(root, "demos");
rmSync(path.join(demos, "stories"), { recursive: true, force: true });
mkdirSync(path.join(demos, "stories"), { recursive: true });

const storyFiles = new Set(
  readdirSync(path.join(webDir, "stories")).filter((file) => file.endsWith(".stories.tsx")),
);
for (const file of readdirSync(path.join(webDir, "stories"))) {
  if (file.endsWith(".ts") && !file.endsWith(".stories.ts")) {
    const source = readFileSync(path.join(webDir, "stories", file), "utf8");
    writeFileSync(path.join(demos, "stories", file), `// @ts-nocheck\n${source}`);
  }
}

const storyLoaders = [];
const componentLoaders = [];
for (const item of items) {
  if (item.type === "chart" || item.type === "block") {
    const file = item.files[0].replace(/\.tsx$/, "");
    componentLoaders.push(
      `  "${item.name}": () => import("@/${file}").then((module) => module.${pascal(item.name)}),`,
    );
    continue;
  }
  const story = `${item.name}.stories.tsx`;
  if (!storyFiles.has(story)) continue;
  let source = readFileSync(path.join(webDir, "stories", story), "utf8");
  if (overlays.has(item.name)) source = source.replace(/\sdefaultOpen(?:=\{true\})?(?=[\s>/])/g, "");
  writeFileSync(path.join(demos, "stories", story), `// @ts-nocheck\n${source}`);
  storyLoaders.push(`  "${item.name}": () => import("./stories/${item.name}.stories"),`);
}

writeFileSync(
  path.join(demos, "registry.ts"),
  `import type * as React from "react";

export const stories: Record<string, () => Promise<Record<string, unknown>>> = {
${storyLoaders.join("\n")}
};

export const components: Record<string, () => Promise<React.ComponentType>> = {
${componentLoaders.join("\n")}
};
`,
);

const index = Object.fromEntries(
  Object.entries(categories).map(([type, category]) => [
    category.folder,
    items
      .filter((item) => item.type === type)
      .map((item) => ({ name: item.name, title: item.title, group: groupOf(item) ?? null })),
  ]),
);

const contentRoot = path.join(root, ".generated/web");

function requiresLinks(item) {
  return item.requires
    .map((name) => {
      const required = byName.get(name);
      if (!required) return `\`${name}\``;
      return `[${required.title}](/docs/${categories[required.type].folder}/${name})`;
    })
    .join(", ");
}

function readSource(file) {
  return readFileSync(path.join(webDir, file), "utf8");
}

function prose(item) {
  const file = path.join(root, "content/registry", categories[item.type].folder, `${item.name}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

function examplesOf(item) {
  const story = path.join(webDir, "stories", `${item.name}.stories.tsx`);
  if (!existsSync(story)) return [];
  const all = storyExamples(story, readFileSync(story, "utf8"), { itemName: item.name, overlay: overlays.has(item.name) });
  const seen = new Set();
  return all.filter((example) => {
    if (seen.has(example.jsx)) return false;
    seen.add(example.jsx);
    return true;
  });
}

const labelOf = (key) => {
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/^open\s+/, "");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

function jsxTree(jsx, names) {
  const root = { children: [] };
  const stack = [root];
  let i = 0;
  while ((i = jsx.indexOf("<", i)) !== -1) {
    const match = /^<(\/?)([A-Z][\w.]*)/.exec(jsx.slice(i));
    if (!match) {
      i++;
      continue;
    }
    let j = i + match[0].length;
    let depth = 0;
    while (j < jsx.length && !(jsx[j] === ">" && depth === 0)) {
      if (jsx[j] === "{") depth++;
      if (jsx[j] === "}") depth--;
      j++;
    }
    const [, closing, name] = match;
    const selfClosing = jsx[j - 1] === "/";
    i = j + 1;
    if (!names.has(name)) continue;
    if (closing) {
      while (stack.length > 1 && stack.pop().name !== name);
      continue;
    }
    const node = { name, children: [] };
    stack.at(-1).children.push(node);
    if (!selfClosing) stack.push(node);
  }
  return root.children;
}

function mergeTrees(into, from, ancestors = []) {
  for (const node of from) {
    const ancestor = ancestors.find((other) => other.name === node.name);
    if (ancestor) {
      mergeTrees(ancestor.children, node.children, ancestors);
      continue;
    }
    let same = into.find((other) => other.name === node.name);
    if (!same) into.push((same = { name: node.name, children: [] }));
    mergeTrees(same.children, node.children, [...ancestors, same]);
  }
  return into;
}

function slug(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

function page(item) {
  const category = categories[item.type];
  const text = prose(item);
  const visual = item.type === "chart" || item.type === "block";
  const lines = [
    "---",
    `title: ${item.title}`,
    ...(text.description ? [`description: ${JSON.stringify(text.description)}`] : []),
    MARKER,
    "---",
    "",
  ];

  const examples = visual ? [] : examplesOf(item);
  const parts = visual ? [] : item.files.flatMap((file) => componentApi(file, readSource(file)));
  const main = visual ? pascal(item.name) : undefined;

  if (visual) {
    lines.push(`<Example kind="${item.type}" name="${item.name}">`, "", `<SourceFile path="${item.files[0]}" fold={false} />`, "", "</Example>", "");
  } else if (examples[0]) {
    lines.push(`<Example kind="${item.type}" name="${item.name}" story="${examples[0].key}">`, "", fence(examples[0].code), "", "</Example>", "");
  }
  if (text.overview) lines.push(mdx(text.overview), "");

  const files = item.files.map((file) => `\`${file}\``).join(", ");
  lines.push("## Installation", "", "### CLI", "", fence(`npx @esuiss/ui@latest add ${category.add}${item.name}`, "bash", "Terminal"), "");
  lines.push("### Manual", "");
  let step = 1;
  if (item.dependencies.length > 0) {
    lines.push(`${step++}. Install the dependencies:`, "", fence(`npm install ${item.dependencies.join(" ")}`, "bash", "Terminal"), "");
  }
  if (item.requires.length > 0) {
    lines.push(`${step++}. Add the pieces it builds on: ${requiresLinks(item)}.`, "");
  }
  lines.push(`${step++}. Copy the source into ${files}:`, "");
  for (const file of item.files) lines.push(`<SourceFile path="${file}" />`, "");
  lines.push(`${step}. Update the import paths to match your project.`, "");

  lines.push("## Usage", "");
  const importPath = `@/${item.files[0].replace(/\.tsx$/, "")}`;
  const names = visual ? [main] : parts.map((part) => part.name);
  if (names.length) lines.push(fence(`import { ${names.join(", ")} } from "${importPath}"`), "");
  if (visual) lines.push(fence(`<${main} />`), "");
  else if (examples[0]) lines.push(fence(examples[0].jsx), "");
  if (text.usage) lines.push(mdx(text.usage), "");

  if (examples.length > 1) {
    lines.push("## Examples", "");
    for (const example of examples.slice(1)) {
      lines.push(`### ${example.name ?? labelOf(example.key)}`, "");
      if (text.examples?.[example.key]) lines.push(mdx(text.examples[example.key]), "");
      lines.push(`<Example kind="${item.type}" name="${item.name}" story="${example.key}">`, "", fence(example.code), "", "</Example>", "");
    }
  }

  const documented = parts.filter((part) => part.props.length > 0 || part.extends.length > 0);
  if (documented.length) {
    lines.push("## API Reference", "");
    const known = new Set(parts.map((part) => part.name));
    const tree = examples.reduce((into, example) => mergeTrees(into, jsxTree(example.jsx, known)), []);
    const linked = new Set(documented.map((part) => part.name));
    const anchors = (nodes) =>
      nodes.map((node) => ({ name: node.name, ...(linked.has(node.name) ? { href: `#${slug(node.name)}` } : {}), children: anchors(node.children) }));
    if (tree.length > 1 || tree[0]?.children.length) lines.push(`<Anatomy tree={${JSON.stringify(anchors(tree))}} />`, "");
    documented.forEach((part, index) => {
      lines.push(`<ApiPart index={${index + 1}}>`, "", `### ${part.name}`, "");
      if (text.parts?.[part.name]) lines.push(mdx(text.parts[part.name]), "");
      lines.push(propsTable(part, text.props?.[part.name]), "", "</ApiPart>", "");
    });
  }

  if (text.accessibility) lines.push("## Accessibility", "", mdx(text.accessibility), "");
  if (text.notes) lines.push("## Notes", "", mdx(text.notes), "");

  const api = { name: item.name, type: item.type, files: item.files, requires: item.requires, dependencies: item.dependencies, examples: examples.map((e) => e.key), parts };
  mkdirSync(path.join(demos, "api", category.folder), { recursive: true });
  writeFileSync(path.join(demos, "api", category.folder, `${item.name}.json`), `${JSON.stringify(api, null, 2)}\n`);

  return lines.join("\n");
}

rmSync(contentRoot, { recursive: true, force: true });
for (const category of Object.values(categories)) mkdirSync(path.join(contentRoot, category.folder), { recursive: true });
for (const item of items) writeFileSync(path.join(contentRoot, categories[item.type].folder, `${item.name}.mdx`), page(item));
writeFileSync(path.join(contentRoot, "items.json"), `${JSON.stringify(index, null, 2)}\n`);

console.log(
  `Generated ${items.length} pages, ${storyLoaders.length} story previews and ${componentLoaders.length} component previews.`,
);
