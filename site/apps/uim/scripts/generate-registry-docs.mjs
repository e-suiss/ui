#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { componentApi, storyExamples } from "./lib/extract.mjs";
import { nativeStories } from "./lib/native.mjs";

const root = path.resolve(import.meta.dirname, "..");
const uimRepo = path.resolve(root, process.argv[2] ?? "../../../mobile");
const only = process.argv[3] ? new Set(process.argv[3].split(",")) : null;
const registry = JSON.parse(readFileSync(path.join(uimRepo, "registry.json"), "utf8"));
const previews = JSON.parse(readFileSync(path.join(root, "content/previews.json"), "utf8"));

const MARKER = "generated: true";
const native = nativeStories(uimRepo);

const categories = {
  ui: { folder: "components", title: "Components", eyebrow: "React Native Component", story: "components" },
  pattern: { folder: "patterns", title: "Patterns", eyebrow: "Pattern", story: "patterns" },
  interaction: { folder: "interactions", title: "Interactions", eyebrow: "Interaction", story: "interactions" },
  chart: { folder: "charts", title: "Charts", eyebrow: "Chart", story: "charts" },
  block: { folder: "blocks", title: "Blocks", eyebrow: "Block", story: "blocks" },
};

const hidden = new Set(["theme", "haptics-expo", "animated-view"]);
const items = registry.items.filter((item) => item.type in categories && !hidden.has(item.name));
const byName = new Map(items.map((item) => [item.name, item]));

const platforms = {
  swift: { label: "SwiftUI", directory: registry.platforms.swift.directory, lang: "swift" },
  kotlin: { label: "Jetpack Compose", directory: registry.platforms.kotlin.directory, lang: "kotlin" },
};
const stylings = { uniwind: "Uniwind", nativewind: "NativeWind", stylesheet: "StyleSheet" };

const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, letter) => letter.toUpperCase());
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
const kebab = (key) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

function groupOf(item) {
  if (item.type === "chart") return capitalize(item.name.replace(/-chart-.*/, ""));
  if (item.type === "block") return capitalize(item.name.split("-")[0]);
  return undefined;
}

const sources = path.join(root, "registry");
rmSync(sources, { recursive: true, force: true });

function copySource(from, to) {
  const source = path.join(uimRepo, from);
  if (!existsSync(source)) return undefined;
  mkdirSync(path.dirname(path.join(sources, to)), { recursive: true });
  cpSync(source, path.join(sources, to));
  return to;
}

function stylingFile(item, styling, file) {
  const from = item.overrides.includes(styling) ? path.join(styling, file) : file;
  return copySource(from, path.join(styling, file));
}

function platformFile(platform, file) {
  return copySource(path.join(platforms[platform].directory, file), path.join(platform, file));
}

const contentRoot = path.join(root, "content/docs");

function requiresLinks(item) {
  return item.requires
    .filter((name) => !name.startsWith("primitives/") && !hidden.has(name))
    .map((name) => {
      const required = byName.get(name);
      if (!required) return `\`${name}\``;
      return `[${required.title}](/docs/${categories[required.type].folder}/${name})`;
    })
    .join(", ");
}

function mdx(text = "") {
  return text
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith("`") ? part : part.replace(/[{}<>]/g, (char) => `\\${char}`)))
    .join("");
}

const fence = (code, lang = "tsx", title) =>
  `<Code lang="${lang}"${title ? ` title="${title}"` : ""} code={${JSON.stringify(code.trimEnd())}} />`;

function prose(item) {
  const file = path.join(root, "content/registry", categories[item.type].folder, `${item.name}.json`);
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

function storyFileOf(item) {
  if (item.type === "chart") return `${item.name.replace(/-chart-.*/, "")}-charts.stories.tsx`;
  return `${item.name}.stories.tsx`;
}

function examplesOf(item) {
  const file = path.join(uimRepo, "stories", storyFileOf(item));
  if (!existsSync(file)) return [];
  const source = readFileSync(file, "utf8");
  const title = source.slice(source.indexOf("const meta")).match(/title:\s*"([^"]+)"/)[1];
  const prefix = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const all = storyExamples(file, source, { itemName: item.name, overlay: false }).map((example) => ({
    ...example,
    id: `${prefix}--${kebab(example.key)}`,
  }));
  if (item.type === "chart") {
    const key = pascal(item.name.replace(/^.*?-chart-/, ""));
    return all.filter((example) => example.key === key);
  }
  const seen = new Set();
  const unique = all.filter((example) => {
    if (seen.has(example.jsx)) return false;
    seen.add(example.jsx);
    return true;
  });
  const open = unique.findIndex((example) => /^Open/.test(example.key));
  if (open > 0) unique.unshift(...unique.splice(open, 1));
  return unique;
}

const labelOf = (key) => {
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const switcher = { swift: "SwiftUI", kotlin: "Compose" };

const live = new Set(["attachment", "button", "carousel", "combobox", "dialog"]);

function liveOf(id) {
  const [group, story] = id.split("--");
  const file = group.replace(/^components-/, "");
  if (!group.startsWith("components-") || !live.has(file)) return undefined;
  return `${file}/${story.replace(/(^|-)([a-z0-9])/g, (_, __, char) => char.toUpperCase())}`;
}

function example(id, body, others = {}) {
  const size = previews[id];
  const web = size && liveOf(id);
  const extra = Object.entries(switcher).filter(([platform]) => others[platform]);
  const attrs = [
    size ? ` id="${id}" width={${size[0]}} height={${size[1]}}` : "",
    web ? ` live="${web}"` : "",
    size && !web && existsSync(path.join(root, "public/previews", `${id}.light.mp4`)) ? " video" : "",
    extra.length ? ` platforms={${JSON.stringify(["React Native", ...extra.map(([, label]) => label)])}}` : "",
  ].join("");
  return [`<Example${attrs}>`, "", body, "", ...extra.flatMap(([platform]) => [others[platform], ""]), "</Example>", ""];
}

function nativeExample(id) {
  const code = native.get(id) ?? {};
  return Object.fromEntries(Object.keys(switcher).filter((platform) => code[platform]).map((platform) => [platform, fence(code[platform], platforms[platform].lang)]));
}

function propsTable(part, text) {
  const props = part.props.map((prop) => ({
    name: prop.name,
    type: prop.type,
    ...(prop.default ? { default: prop.default } : {}),
    ...(prop.required ? { required: true } : {}),
    ...(text?.[prop.name] ? { description: text[prop.name] } : {}),
  }));
  const attrs = [
    part.extends.length ? ` extends={${JSON.stringify(part.extends)}}` : "",
    props.length ? ` props={${JSON.stringify(props)}}` : "",
  ].join("");
  return `<PropsTable${attrs} />`;
}

function nativeManual(item, platform) {
  const { requirements, base, directory } = registry.platforms[platform];
  const files = item[platform];
  const sources = files.map((name) => readFileSync(path.join(uimRepo, directory, name), "utf8")).join("\n");
  const lines = [];
  let step = 1;
  if (platform === "swift") {
    const packages = requirements.packages.filter((pkg) => pkg.products.some((product) => new RegExp(`^import ${product}$`, "m").test(sources)));
    lines.push(`${step++}. Target iOS ${requirements.ios} or later.`, "");
    if (packages.length) {
      lines.push(
        `${step++}. Add the Swift package${packages.length > 1 ? "s" : ""} to your app:`,
        "",
        fence(packages.map((pkg) => `.package(url: "${pkg.url}", from: "${pkg.from}")`).join("\n"), "swift", "Package.swift"),
        "",
      );
    }
  } else {
    const dependencies = requirements.dependencies.filter((name) => !name.startsWith("com.adamglin:") || /phosphoricons/.test(sources));
    lines.push(
      `${step++}. Set \`minSdk\` to ${requirements.minSdk} or higher and add the dependencies:`,
      "",
      fence(
        [`implementation(platform("${requirements.bom}"))`, ...dependencies.map((name) => `implementation("${name}")`)].join("\n"),
        "kotlin",
        "build.gradle.kts",
      ),
      "",
    );
  }
  lines.push(`${step++}. Copy the theme files every view uses:`, "");
  for (const name of base) lines.push(`<SourceFile path="${platformFile(platform, name)}" />`, "");
  lines.push(`${step++}. Copy the source${files.length > 1 ? " and every file it uses" : ""}:`, "");
  for (const name of files) lines.push(`<SourceFile path="${platformFile(platform, name)}" />`, "");
  lines.push(
    platform === "swift"
      ? `${step}. Add the files to your app target.`
      : `${step}. Update the \`com.esuiss.ui\` package names to match your project.`,
    "",
  );
  return lines;
}

function page(item) {
  const category = categories[item.type];
  const text = prose(item);
  const visual = item.type === "chart" || item.type === "block";
  const file = item.files[0];
  const lines = [
    "---",
    `title: ${item.title}`,
    ...(text.description ? [`description: ${JSON.stringify(text.description)}`] : []),
    `eyebrow: ${category.eyebrow}`,
    MARKER,
    "---",
    "",
  ];

  const examples = examplesOf(item);
  const uniwind = stylingFile(item, "uniwind", file);
  const parts = visual || !uniwind ? [] : componentApi(file, readFileSync(path.join(sources, uniwind), "utf8"));
  const main = pascal(item.name);

  const nativeFiles = Object.fromEntries(
    Object.keys(platforms)
      .map((platform) => [platform, item[platform]?.[0] && platformFile(platform, item[platform][0])])
      .filter(([, copied]) => copied),
  );

  if (visual) {
    const id = examples[0]?.id ?? `${category.story}-${item.name}--default`;
    const others = Object.fromEntries(Object.entries(nativeFiles).map(([platform, copied]) => [platform, `<SourceFile path="${copied}" fold={false} />`]));
    lines.push(...example(id, `<SourceFile path="${uniwind}" fold={false} />`, others));
  } else if (examples[0]) {
    lines.push(...example(examples[0].id, fence(examples[0].code), nativeExample(examples[0].id)));
  }
  if (text.overview) lines.push(mdx(text.overview), "");

  lines.push("## Installation", "");
  lines.push(
    `<Tabs items={${JSON.stringify(["React Native", ...Object.values(platforms).map((p) => p.label)])}}>`,
    "",
    fence(`npx @esuiss/ui@latest add ${item.name}`, "bash", "Terminal"),
    "",
    fence(`npx @esuiss/ui@latest add ${item.name} --platform swift`, "bash", "Terminal"),
    "",
    fence(`npx @esuiss/ui@latest add ${item.name} --platform kotlin`, "bash", "Terminal"),
    "",
    "</Tabs>",
    "",
  );
  const required = requiresLinks(item);
  if (required) lines.push(`The CLI also adds what it builds on: ${required}.`, "");
  const primitives = item.requires.filter((name) => name.startsWith("primitives/")).map((name) => `\`components/${name}.tsx\``);
  const pieces = [required, primitives.length ? `the primitives ${primitives.join(", ")}` : ""].filter(Boolean).join(", and ");

  lines.push("### Manual", "");
  const nativeTabs = Object.keys(platforms).filter((platform) => item[platform]?.length);
  lines.push(`<Tabs items={${JSON.stringify([...Object.values(stylings), ...nativeTabs.map((platform) => platforms[platform].label)])}}>`, "");
  for (const styling of Object.keys(stylings)) {
    const copied = stylingFile(item, styling, file);
    const dependencies = item.dependencies[styling] ?? [];
    lines.push("<div>", "");
    let step = 1;
    if (dependencies.length) lines.push(`${step++}. Install the dependencies:`, "", fence(`npx expo install ${dependencies.join(" ")}`, "bash", "Terminal"), "");
    if (pieces) lines.push(`${step++}. Add the pieces it builds on: ${pieces}.`, "");
    lines.push(`${step++}. Copy the source into \`${file}\`:`, "");
    if (copied) lines.push(`<SourceFile path="${copied}" />`, "");
    lines.push(`${step}. Update the import paths to match your project.`, "", "</div>", "");
  }
  for (const platform of nativeTabs) lines.push("<div>", "", ...nativeManual(item, platform), "</div>", "");
  lines.push("</Tabs>", "");

  lines.push("## Usage", "");
  const importPath = `@/${file.replace(/\.tsx$/, "")}`;
  const names = visual ? [main] : parts.map((part) => part.name);
  if (names.length) lines.push(fence(`import { ${names.join(", ")} } from "${importPath}"`), "");
  if (visual) lines.push(fence(`<${main} />`), "");
  else if (examples[0]) lines.push(fence(examples[0].jsx), "");
  if (text.usage) lines.push(mdx(text.usage), "");

  if (!visual && examples.length > 1) {
    lines.push("## Examples", "");
    for (const other of examples.slice(1)) {
      lines.push(`### ${other.name ?? labelOf(other.key)}`, "");
      if (text.examples?.[other.key]) lines.push(mdx(text.examples[other.key]), "");
      lines.push(...example(other.id, fence(other.code), nativeExample(other.id)));
    }
  }

  const documented = parts.filter((part) => part.props.length > 0 || part.extends.length > 0);
  if (documented.length) {
    lines.push("## API Reference", "");
    documented.forEach((part, index) => {
      lines.push(`<ApiPart index={${index + 1}}>`, "", `### ${part.name}`, "");
      if (text.parts?.[part.name]) lines.push(mdx(text.parts[part.name]), "");
      lines.push(propsTable(part, text.props?.[part.name]), "", "</ApiPart>", "");
    });
  }

  if (text.accessibility) lines.push("## Accessibility", "", mdx(text.accessibility), "");
  if (text.notes) lines.push("## Notes", "", mdx(text.notes), "");

  return lines.join("\n");
}

const index = {};
for (const [type, category] of Object.entries(categories)) {
  const folder = path.join(contentRoot, category.folder);
  mkdirSync(folder, { recursive: true });
  const members = items.filter((item) => item.type === type && (!only || only.has(item.name)));
  index[category.folder] = members.map((item) => ({ name: item.name, title: item.title, group: groupOf(item) ?? null }));

  if (!only) {
    const names = new Set(members.map((item) => item.name));
    for (const entry of readdirSync(folder)) {
      const name = entry.replace(/\.mdx$/, "");
      if (!entry.endsWith(".mdx") || name === "index" || names.has(name)) continue;
      const stale = path.join(folder, entry);
      if (/^generated: true$/m.test(readFileSync(stale, "utf8"))) rmSync(stale);
    }
  }

  for (const item of members) {
    const file = path.join(folder, `${item.name}.mdx`);
    if (existsSync(file) && !/^generated: true$/m.test(readFileSync(file, "utf8"))) continue;
    writeFileSync(file, page(item));
  }

  writeFileSync(
    path.join(folder, "index.mdx"),
    [
      "---",
      `title: ${category.title}`,
      `description: ${members.length} ${category.title.toLowerCase()}, each copied into your project with the CLI.`,
      "eyebrow: suiss/uim",
      MARKER,
      "---",
      "",
      `<RegistryIndex category="${category.folder}" />`,
      "",
    ].join("\n"),
  );

  const pages = ["index"];
  let group;
  for (const item of members) {
    const next = groupOf(item);
    if (next && next !== group) pages.push(`---${next}---`);
    group = next;
    pages.push(item.name);
  }
  writeFileSync(path.join(folder, "meta.json"), `${JSON.stringify({ title: category.title, pages }, null, 2)}\n`);
}
writeFileSync(path.join(root, "content/items.json"), `${JSON.stringify(index, null, 2)}\n`);

console.log(`Generated ${Object.values(index).flat().length} pages.`);
