import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const generated = path.join(root, ".generated");
const contentRoot = path.join(root, "content/docs");
const MARKER = "generated: true";
const ORDER = ["web", "rn", "swift", "kotlin"];

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const sections = [
  { folder: "components", title: "Components", eyebrow: "Component" },
  { folder: "patterns", title: "Patterns", eyebrow: "Pattern" },
  { folder: "interactions", title: "Interactions", eyebrow: "Interaction" },
  { folder: "charts", title: "Charts", eyebrow: "Chart", group: (name) => capitalize(name.replace(/-chart-.*/, "")) },
  { folder: "blocks", title: "Blocks", eyebrow: "Block", group: (name) => capitalize(name.split("-")[0]) },
];

const webItems = JSON.parse(readFileSync(path.join(root, "demos/items.json"), "utf8"));
const mobileItems = JSON.parse(readFileSync(path.join(generated, "mobile/items.json"), "utf8"));

function fragment(platform, folder, name) {
  const file = path.join(generated, platform, folder, `${name}.mdx`);
  if (!existsSync(file)) return undefined;
  const text = readFileSync(file, "utf8");
  const end = text.indexOf("\n---", 4);
  const head = text.slice(4, end).split("\n");
  const field = (key) => head.find((line) => line.startsWith(`${key}:`));
  return { title: field("title"), description: field("description"), body: text.slice(end + 4).trim() };
}

const index = {};
let pages = 0;

for (const section of sections) {
  const folder = path.join(contentRoot, section.folder);
  mkdirSync(folder, { recursive: true });
  const web = new Map((webItems[section.folder] ?? []).map((item) => [item.name, item]));
  const mobile = new Map((mobileItems[section.folder] ?? []).map((item) => [item.name, item]));
  const names = [...new Set([...web.keys(), ...mobile.keys()])].sort();

  for (const entry of readdirSync(folder)) {
    const name = entry.replace(/\.mdx$/, "");
    if (!entry.endsWith(".mdx") || name === "index" || names.includes(name)) continue;
    const stale = path.join(folder, entry);
    if (/^generated: true$/m.test(readFileSync(stale, "utf8"))) rmSync(stale);
  }

  index[section.folder] = [];
  for (const name of names) {
    const webPage = web.has(name) ? fragment("web", section.folder, name) : undefined;
    const mobilePage = mobile.has(name) ? fragment("mobile", section.folder, name) : undefined;
    const mobilePlatforms = mobilePage ? mobile.get(name).platforms : [];
    const platforms = [...(webPage ? ["web"] : []), ...mobilePlatforms].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    const lead = webPage ?? mobilePage;
    if (!lead) continue;

    const file = path.join(folder, `${name}.mdx`);
    if (existsSync(file) && !/^generated: true$/m.test(readFileSync(file, "utf8"))) continue;

    const blocks = [];
    if (webPage) blocks.push('<Only platform="web">', "", webPage.body, "", "</Only>", "");
    if (mobilePage) blocks.push(`<Only platform="${mobilePlatforms.join(" ")}">`, "", mobilePage.body, "", "</Only>", "");
    writeFileSync(
      file,
      [
        "---",
        lead.title,
        ...(lead.description ? [lead.description] : []),
        `eyebrow: ${section.eyebrow}`,
        `platforms: [${platforms.join(", ")}]`,
        MARKER,
        "---",
        "",
        ...blocks,
      ].join("\n"),
    );
    pages++;

    const item = web.get(name) ?? mobile.get(name);
    index[section.folder].push({ name, title: item.title, group: section.group?.(name) ?? null, platforms });
  }

  writeFileSync(
    path.join(folder, "index.mdx"),
    [
      "---",
      `title: ${section.title}`,
      `description: ${names.length} ${section.title.toLowerCase()} for React, React Native, SwiftUI and Jetpack Compose, each copied into your project with the CLI.`,
      "eyebrow: suiss/ui",
      MARKER,
      "---",
      "",
      `<RegistryIndex category="${section.folder}" />`,
      "",
    ].join("\n"),
  );

  const order = ["index"];
  let group;
  for (const name of names) {
    const next = section.group?.(name);
    if (next && next !== group) order.push(`---${next}---`);
    group = next;
    order.push(name);
  }
  writeFileSync(path.join(folder, "meta.json"), `${JSON.stringify({ title: section.title, pages: order }, null, 2)}\n`);
}

writeFileSync(path.join(root, "content/items.json"), `${JSON.stringify(index, null, 2)}\n`);
console.log(`Composed ${pages} pages.`);
