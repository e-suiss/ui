import { spawn } from "node:child_process"
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:http"
import { createRequire, syncBuiltinESMExports } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"

import { PACKAGE_MANAGERS } from "../packages/cli/lib/create.mjs"
import { toIcons } from "../packages/cli/lib/icons.mjs"
import { BASES } from "../packages/cli/lib/registry.mjs"
import { PRESET_VALUES, STYLES } from "../packages/cli/lib/shared/style.mjs"
import worker, { resolveStyle } from "../worker.js"

const NEXT_APP = "create-next-app@16.4.0"
const VITE_APP = "create-vite@9.2.1"
const REGISTRY_CLI = "shadcn@4.21.4"
const ROOT = path.resolve(import.meta.dirname, "..")
const WEB = path.join(ROOT, "packages/web")
const CLI = path.join(ROOT, "packages/cli/index.mjs")
const REGISTRY_BIN = path.join(WEB, "node_modules/shadcn/dist/index.js")
const requireFromWeb = createRequire(path.join(WEB, "package.json"))
const { encodePreset } = await import(
  pathToFileURL(requireFromWeb.resolve("shadcn/preset")).href
)
const { chromium } = requireFromWeb("playwright")
const ts = requireFromWeb("typescript")

const OWN = "suiss"
const REGISTRY_PREFIX = "/ui/r/"
const PRIMITIVES = {
  base: "@base-ui/react",
  radix: "radix-ui",
  aria: "react-aria-components",
}
const ICON_PACKAGES = {
  lucide: "lucide-react",
  tabler: "@tabler/icons-react",
  hugeicons: "@hugeicons/react",
  phosphor: "@phosphor-icons/react",
  remixicon: "@remixicon/react",
}
const CUSTOM_ALIASES = {
  components: "@/kit",
  ui: "@/kit/elements",
  lib: "@/support",
  utils: "@/support/cn",
  hooks: "@/support/hooks",
}
const RUNNERS = {
  npm: ["npx", ["--yes"]],
  pnpm: ["pnpm", ["dlx"]],
  yarn: ["yarn", ["dlx"]],
  bun: ["bunx", []],
}
const INSTALL = {
  npm: ["install"],
  pnpm: ["add"],
  yarn: ["add"],
  bun: ["add"],
}
const BOOLEAN = ["true", "false"]
const ARGUMENT = /^--([\w-]+)(?:=(.*))?$/
const SOURCE_FILE = /\.[jt]sx?$/
const JSX_FILE = /x$/
const WHITESPACE = /\s+/
const JSX_EXTENSION = /\.jsx$/
const JS_EXTENSION = /\.js$/
const TS_EXTENSION = /\.tsx?$/
const PLACEHOLDER = /icon-placeholder|IconPlaceholder/
const DIRECTION_VARIANT = /^(rtl|ltr)(:|$)/
const PHYSICAL_SIDE = /data-\[side=(left|right)\]/
const POSITION = /^-?(left|right)-/
const OKLCH_CLASS = /^[\w:-]+-oklch\(/
const TYPESCRIPT_FILE = /\.tsx?$/
const MENU_MARKER = /cn-menu-(target|translucent)/g
const CLASS_NAME_PROP = /.ClassName$/
const APPLY = /@apply\s+([^;]+);/g
const DEFAULT_ALIAS_IMPORT = /from "(@\/(components|lib|hooks)\b[^"]*)"/g
const QUOTES = /^["']|["']$/g
const IMPORT_FROM = /from "([^"]+)"/g
const EXPORTED_FUNCTION = /^export (?:default )?function (\w+)/m
const BARE_PACKAGE = /^(@[^/]+\/[^/]+|[^@./][^/]*)/
const PASCAL_PARTS = /(^|-)([a-z0-9])/g
const LEADING_DIGIT = /^[0-9]/

const OPTIONS = {
  base: BASES,
  framework: ["next", "vite"],
  style: STYLES,
  icons: Object.keys(ICON_PACKAGES),
  cli: ["esuiss", "shadcn"],
  "package-manager": PACKAGE_MANAGERS,
  rtl: BOOLEAN,
  prefix: /^[a-z]*$/,
  "css-variables": BOOLEAN,
  tsx: BOOLEAN,
  rsc: BOOLEAN,
  aliases: ["default", "custom"],
  "base-color": [OWN, ...PRESET_VALUES.baseColor],
  theme: [OWN, ...PRESET_VALUES.theme],
  font: [OWN, ...PRESET_VALUES.font],
  radius: PRESET_VALUES.radius,
  "menu-accent": PRESET_VALUES.menuAccent,
  "menu-color": PRESET_VALUES.menuColor,
  cache: /./,
  keep: BOOLEAN,
}
const DEFAULTS = {
  base: "base",
  framework: "next",
  style: OWN,
  icons: "phosphor",
  cli: "esuiss",
  "package-manager": "npm",
  rtl: "false",
  prefix: "",
  "css-variables": "true",
  tsx: "true",
  rsc: "true",
  aliases: "default",
  "base-color": OWN,
  theme: OWN,
  font: OWN,
  radius: "default",
  "menu-accent": "subtle",
  "menu-color": "default",
  keep: "false",
}
const RUN_OPTIONS = new Set(["cache", "keep"])

function parseOptions(args) {
  const options = { ...DEFAULTS }
  for (const arg of args) {
    const match = arg.match(ARGUMENT)
    if (!match || !(match[1] in OPTIONS)) {
      throw new Error(`Unknown option ${arg}`)
    }
    const [, name, value = "true"] = match
    const allowed = OPTIONS[name]
    if (
      Array.isArray(allowed) ? !allowed.includes(value) : !allowed.test(value)
    ) {
      throw new Error(
        name === "prefix"
          ? "--prefix takes letters only: Tailwind CSS v4 writes the prefix as prefix(tw) and tw:flex"
          : `--${name} takes ${Array.isArray(allowed) ? allowed.join(", ") : "a value"}`
      )
    }
    options[name] = value
  }
  return options
}

const OPTION = parseOptions(process.argv.slice(2))

const SETTINGS = {
  base: OPTION.base,
  framework: OPTION.framework,
  cli: OPTION.cli,
  packageManager: OPTION["package-manager"],
  iconLibrary: OPTION.icons,
  rtl: OPTION.rtl === "true",
  prefix: OPTION.prefix,
  cssVariables: OPTION["css-variables"] === "true",
  tsx: OPTION.tsx === "true",
  rsc: OPTION.framework === "next" && OPTION.rsc === "true",
  aliases: OPTION.aliases === "custom" ? CUSTOM_ALIASES : null,
  menuColor: OPTION["menu-color"],
}
const STATE = {
  style: OPTION.style,
  baseColor: OPTION["base-color"],
  theme: OPTION.theme,
  iconLibrary: OPTION.icons,
  font: OPTION.font,
  radius: OPTION.radius,
  menuAccent: OPTION["menu-accent"],
  menuColor: OPTION["menu-color"],
}
const DEFAULT_STATE = {
  style: OWN,
  baseColor: OWN,
  theme: OWN,
  iconLibrary: "phosphor",
  font: OWN,
  radius: "default",
  menuAccent: "subtle",
  menuColor: "default",
}

if (!SETTINGS.tsx && SETTINGS.framework !== "next") {
  throw new Error("--tsx=false runs on the JavaScript Next.js app")
}
if (SETTINGS.cli === "esuiss") {
  const unsupported = [
    ["prefix", SETTINGS.prefix],
    ["css-variables", !SETTINGS.cssVariables],
    ["tsx", !SETTINGS.tsx],
    ["rsc", SETTINGS.framework === "next" && !SETTINGS.rsc],
    ["aliases", SETTINGS.aliases],
  ]
    .filter(([, changed]) => changed)
    .map(([name]) => `--${name}`)
  if (unsupported.length) {
    throw new Error(
      `${unsupported.join(", ")} run with --cli=shadcn: the suiss/ui CLI writes TypeScript with the default aliases, no prefix and theme variables`
    )
  }
}

const LABEL = Object.keys(DEFAULTS)
  .filter((name) => !RUN_OPTIONS.has(name) && OPTION[name] !== DEFAULTS[name])
  .map((name) => `--${name}=${OPTION[name]}`)
  .join(" ")

const isDefaultState = () =>
  Object.keys(DEFAULT_STATE).every((key) => STATE[key] === DEFAULT_STATE[key])

function presetCode() {
  const theme = STATE.theme === OWN ? "neutral" : STATE.theme
  return encodePreset({
    style: STATE.style === OWN ? "nova" : STATE.style,
    baseColor: STATE.baseColor === OWN ? "neutral" : STATE.baseColor,
    theme,
    chartColor: theme,
    iconLibrary: STATE.iconLibrary,
    font: STATE.font === OWN ? "inter" : STATE.font,
    fontHeading: STATE.font === "inter" ? "inter" : "inherit",
    radius: STATE.radius,
    menuAccent: STATE.menuAccent,
    menuColor: STATE.menuColor,
  })
}

function presetFlags() {
  const flags = ["--preset", presetCode()]
  if (STATE.style === OWN) flags.push("--style", OWN)
  if (STATE.baseColor === OWN || STATE.theme === OWN) {
    flags.push("--theme", OWN)
  }
  return flags
}

const ownColors = () => STATE.baseColor === OWN || STATE.theme === OWN

const LOCALE = "en-US"
const TIME_ZONE = "UTC"
const APP_ENV = {
  LANG: "en_US.UTF-8",
  LC_ALL: "en_US.UTF-8",
  TZ: TIME_ZONE,
  YARN_ENABLE_IMMUTABLE_INSTALLS: "false",
  ...(SETTINGS.framework === "next" && { YARN_NODE_LINKER: "node-modules" }),
}

function run(label, command, args, options = {}) {
  console.log(`\n> ${label}`)
  const { capture, ...rest } = options
  const child = spawn(command, args, {
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    ...rest,
    env: {
      ...process.env,
      ...APP_ENV,
      CI: "1",
      NEXT_TELEMETRY_DISABLED: "1",
      ...rest.env,
    },
  })
  let output = ""
  for (const stream of capture ? [child.stdout, child.stderr] : []) {
    stream.on("data", (chunk) => {
      output += chunk
      process.stdout.write(chunk)
    })
  }
  return new Promise((resolve, reject) => {
    child.on("error", reject)
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve(output)
        return
      }
      const error = new Error(
        `${label} failed with exit code ${code ?? signal}`
      )
      error.output = output
      reject(error)
    })
  })
}

function runner(args) {
  const [command, prefix] = RUNNERS[SETTINGS.packageManager]
  return [command, [...prefix, ...args]]
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"))
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}

function edit(file, change) {
  writeFileSync(file, change(readFileSync(file, "utf8")))
}

function copy(from, to) {
  cpSync(from, to, { recursive: true, verbatimSymlinks: true })
}

function fail(message) {
  throw new Error(`Compatibility check failed: ${message}`)
}

function configOf(app) {
  return readJson(path.join(app, "components.json"))
}

function aliasPath(app, alias) {
  if (!alias.startsWith("@/")) fail(`unexpected alias ${alias}`)
  const root = SETTINGS.framework === "vite" ? path.join(app, "src") : app
  return path.join(root, alias.slice(2))
}

function sourceFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE_FILE.test(entry.name))
    .map((entry) => path.join(entry.parentPath, entry.name))
}

function installedFiles(app) {
  const { aliases } = configOf(app)
  return [
    ...new Set(
      [aliases.components, aliases.ui, aliases.hooks, aliases.lib].flatMap(
        (alias) => sourceFiles(aliasPath(app, alias))
      )
    ),
  ].filter((file) => !file.includes(`${path.sep}showcase${path.sep}`))
}

function withExtension(file) {
  if (SETTINGS.tsx) return file
  return file.replace(TS_EXTENSION, (extension) =>
    extension === ".tsx" ? ".jsx" : ".js"
  )
}

function itemFile(app, alias, name) {
  return path.join(
    aliasPath(app, configOf(app).aliases[alias]),
    withExtension(`${name}.tsx`)
  )
}

const BASE_FOLDER = /^bases\/[^/]+\//

function installedPath(app, source) {
  const { aliases } = configOf(app)
  const file = source.replace(BASE_FOLDER, "")
  const [folder, ...rest] = file.split("/")
  const name = rest.join("/")
  if (file === "lib/utils.ts") {
    return `${aliasPath(app, aliases.utils)}${SETTINGS.tsx ? ".ts" : ".js"}`
  }
  if (folder === "hooks") return path.join(aliasPath(app, aliases.hooks), name)
  if (folder === "lib") return path.join(aliasPath(app, aliases.lib), name)
  if (name.startsWith("ui/")) {
    return path.join(aliasPath(app, aliases.ui), name.slice(3))
  }
  return path.join(aliasPath(app, aliases.components), name)
}

function read(app, file) {
  if (!existsSync(file)) fail(`${path.relative(app, file)} was not written`)
  return readFileSync(file, "utf8")
}

function stylesheet(app) {
  return path.join(app, configOf(app).tailwind.css)
}

const REGISTRY_FILES = {
  base: "registry/registry.json",
  radix: "registry/radix/registry.json",
  aria: "registry/aria/registry.json",
}

function registryIndex() {
  return readJson(path.join(WEB, REGISTRY_FILES[SETTINGS.base]))
}

const isTheme = (item) => item.type === "registry:theme"

function expectItems(app) {
  const missing = registryIndex()
    .items.filter((item) => !isTheme(item))
    .flatMap((item) =>
      (item.files ?? [])
        .map((entry) => withExtension(installedPath(app, entry.path)))
        .filter((file) => !existsSync(file))
        .map((file) => `${item.name}: ${path.relative(app, file)}`)
    )
  if (missing.length) {
    fail(
      `${missing.length} files were not written\n  ${missing.slice(0, 30).join("\n  ")}`
    )
  }
}

const FIXED_STYLE = /\/r\/([^/{}]+)\/\{name\}\.json$/

function expectStyle(app) {
  const config = configOf(app)
  const url = config.registries?.["@esuiss"] ?? ""
  const style = url.match(FIXED_STYLE)?.[1] ?? config.style
  const resolved = resolveStyle(style ?? "")
  if (resolved.base !== SETTINGS.base) {
    fail(`components.json style ${style} serves the ${resolved.base} base`)
  }
  if (resolved.style !== STATE.style) {
    fail(
      `components.json style ${style} serves the ${resolved.style} style, not ${STATE.style}`
    )
  }
}

function expectPrimitives(app) {
  const file = itemFile(app, "ui", "dialog")
  if (!read(app, file).includes(PRIMITIVES[SETTINGS.base])) {
    fail(
      `${path.relative(app, file)} does not import ${PRIMITIVES[SETTINGS.base]}`
    )
  }
}

const CLASS_CALLS = new Set(["cn", "cva"])
const COMPARISONS = new Set([
  ts.SyntaxKind.EqualsEqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsToken,
])

function keyOf(source, node) {
  return node.name.getText(source).replace(QUOTES, "")
}

function parse(file) {
  return ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    JSX_FILE.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
}

function descendants(node) {
  const nodes = []
  const visit = (child) => {
    nodes.push(child)
    ts.forEachChild(child, visit)
  }
  ts.forEachChild(node, visit)
  return nodes
}

function classLiterals(source) {
  const found = []
  function collect(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      found.push(node)
    } else if (ts.isPropertyAssignment(node)) {
      const key = keyOf(source, node)
      if (key === "defaultVariants") return
      if (key === "compoundVariants") {
        for (const property of descendants(node.initializer)) {
          if (
            ts.isPropertyAssignment(property) &&
            ["className", "class"].includes(keyOf(source, property))
          ) {
            collect(property.initializer)
          }
        }
        return
      }
      collect(node.initializer)
    } else if (ts.isBinaryExpression(node)) {
      if (!COMPARISONS.has(node.operatorToken.kind)) {
        collect(node.left)
        collect(node.right)
      }
    } else if (ts.isConditionalExpression(node)) {
      collect(node.whenTrue)
      collect(node.whenFalse)
    } else if (ts.isCallExpression(node)) {
      if (CLASS_CALLS.has(node.expression.getText(source))) {
        for (const argument of node.arguments) collect(argument)
      }
    } else if (
      ts.isObjectLiteralExpression(node) ||
      ts.isArrayLiteralExpression(node) ||
      ts.isParenthesizedExpression(node) ||
      ts.isJsxExpression(node)
    ) {
      ts.forEachChild(node, collect)
    }
  }
  for (const node of descendants(source)) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(source) === "className" &&
      node.initializer
    ) {
      collect(node.initializer)
    } else if (
      ts.isCallExpression(node) &&
      CLASS_CALLS.has(node.expression.getText(source))
    ) {
      collect(node)
    } else if (
      ts.isPropertyAssignment(node) &&
      keyOf(source, node) === "className"
    ) {
      collect(node.initializer)
    }
  }
  return found
}

function classStrings(file) {
  return classLiterals(parse(file)).map((node) => node.text)
}

function classNames(file) {
  return [
    ...new Set(
      classStrings(file).flatMap((value) =>
        value.split(WHITESPACE).filter(Boolean)
      )
    ),
  ]
}

function prefixedLiterals(source) {
  const reached = new Set()
  const callee = (node) => node.expression.getText(source)
  const properties = (node) =>
    [
      ...(ts.isObjectLiteralExpression(node) ? [node] : []),
      ...descendants(node).filter(ts.isObjectLiteralExpression),
    ].flatMap((object) => object.properties.filter(ts.isPropertyAssignment))
  const parts = (node, binary) => {
    if (ts.isConditionalExpression(node)) {
      return [node.condition, node.whenTrue, node.whenFalse].filter(
        ts.isStringLiteral
      )
    }
    if (binary && ts.isBinaryExpression(node)) {
      return [node.left, node.right].filter(ts.isStringLiteral)
    }
    return [node].filter(ts.isStringLiteral)
  }
  for (const node of descendants(source)) {
    if (ts.isCallExpression(node) && callee(node) === "cva") {
      const [base, config] = node.arguments
      if (base && ts.isStringLiteral(base)) reached.add(base)
      if (!config || !ts.isObjectLiteralExpression(config)) continue
      const variants = properties(config).find(
        (property) => keyOf(source, property) === "variants"
      )
      for (const variant of variants ? properties(variants) : []) {
        for (const option of properties(variant)) {
          if (ts.isStringLiteral(option.initializer)) {
            reached.add(option.initializer)
          }
        }
      }
    }
    if (!ts.isJsxAttribute(node) || !node.initializer) continue
    const name = node.name.getText(source)
    if (name === "className") {
      if (ts.isStringLiteral(node.initializer)) reached.add(node.initializer)
      const call = descendants(node.initializer).find(
        (child) => ts.isCallExpression(child) && callee(child) === "cn"
      )
      for (const argument of call?.arguments ?? []) {
        for (const part of parts(argument, true)) reached.add(part)
      }
    }
    if (name === "classNames" && ts.isJsxExpression(node.initializer)) {
      for (const property of properties(node)) {
        if (ts.isCallExpression(property.initializer)) {
          for (const argument of property.initializer.arguments) {
            for (const part of parts(argument, false)) reached.add(part)
          }
        }
        if (
          ts.isStringLiteral(property.initializer) &&
          keyOf(source, property) !== "variant"
        ) {
          reached.add(property.initializer)
        }
      }
    }
  }
  return reached
}

function outsidePrefixReach(source, node) {
  if (ts.isTaggedTemplateExpression(node.parent)) return true
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      ts.isPropertyAssignment(parent) &&
      keyOf(source, parent) === "className"
    ) {
      return true
    }
    if (ts.isJsxAttribute(parent)) {
      return CLASS_NAME_PROP.test(parent.name.getText(source))
    }
  }
  return false
}

function packageDir(app, name) {
  const pnp = path.join(app, ".pnp.cjs")
  if (!existsSync(pnp)) return path.join(app, "node_modules", name)
  const api = createRequire(import.meta.url)(pnp)
  api.setup()
  syncBuiltinESMExports()
  return api.resolveToUnqualified(name, `${realpathSync(app)}${path.sep}`)
}

async function utilityTest(app) {
  packageDir(app, "tailwindcss")
  const tailwind = createRequire(path.join(realpathSync(app), "package.json"))(
    "tailwindcss"
  )
  const resolve = (id, base) => {
    if (id.startsWith(".") || path.isAbsolute(id)) return path.resolve(base, id)
    const [name, ...rest] = id.split("/")
    const root = name.startsWith("@") ? `${name}/${rest.shift()}` : name
    const dir = packageDir(app, root)
    const manifest = readJson(path.join(dir, "package.json"))
    const subpath = rest.length > 0 ? `./${rest.join("/")}` : "."
    const target = manifest.exports?.[subpath]
    const file =
      typeof target === "string"
        ? target
        : (target?.style ??
          target?.default ??
          (subpath === "." ? (manifest.style ?? "index.css") : subpath))
    return path.join(dir, file)
  }
  const design = await tailwind.__unstable__loadDesignSystem(
    read(app, stylesheet(app)),
    {
      base: path.dirname(stylesheet(app)),
      loadStylesheet: (id, base) => {
        const file = resolve(id, base)
        return Promise.resolve({
          path: file,
          base: path.dirname(file),
          content: readFileSync(file, "utf8"),
        })
      },
      loadModule: () => Promise.resolve({ module: () => undefined, base: app }),
    }
  )
  const known = new Map()
  return (name) => {
    if (!known.has(name)) {
      known.set(
        name,
        design.candidatesToCss([`${SETTINGS.prefix}:${name}`])[0] != null
      )
    }
    return known.get(name)
  }
}

const AMBIGUOUS_CLASS = /^[a-z]+$/
const ANIMATION_OPTIONS = new Set(["easing", "fill", "direction", "composite"])

function isNonClassString(source, node) {
  const { parent } = node
  return (
    ts.isImportDeclaration(parent) ||
    ts.isExportDeclaration(parent) ||
    ts.isLiteralTypeNode(parent) ||
    ts.isCaseClause(parent) ||
    ts.isElementAccessExpression(parent) ||
    (ts.isPropertyAssignment(parent) &&
      (parent.name === node || ANIMATION_OPTIONS.has(keyOf(source, parent)))) ||
    (ts.isBinaryExpression(parent) &&
      COMPARISONS.has(parent.operatorToken.kind)) ||
    (ts.isJsxAttribute(parent) &&
      !CLASS_NAME_PROP.test(parent.name.getText(source)) &&
      parent.name.getText(source) !== "className")
  )
}

function inClassContext(source, node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (ts.isJsxAttribute(parent)) {
      return parent.name.getText(source).endsWith("lassName")
    }
    if (
      ts.isPropertyAssignment(parent) &&
      keyOf(source, parent) === "className"
    ) {
      return true
    }
    if (
      ts.isCallExpression(parent) &&
      CLASS_CALLS.has(parent.expression.getText(source))
    ) {
      return true
    }
  }
  return false
}

function unprefixedClasses(file, isUtility) {
  const source = parse(file)
  const reached = prefixedLiterals(source)
  const mark = `${SETTINGS.prefix}:`
  const found = { ours: new Set(), registryCli: new Set() }
  for (const node of descendants(source)) {
    if (
      !ts.isStringLiteral(node) &&
      !ts.isNoSubstitutionTemplateLiteral(node) &&
      !ts.isTemplateHead(node) &&
      !ts.isTemplateMiddleOrTemplateTail(node)
    ) {
      continue
    }
    if (isNonClassString(source, node)) continue
    if (!ts.isStringLiteral(node) && !inClassContext(source, node)) continue
    const names = node.text
      .split(WHITESPACE)
      .filter((name) => name && !name.startsWith(mark) && isUtility(name))
    if (names.every((name) => AMBIGUOUS_CLASS.test(name))) continue
    const known = reached.has(node) || outsidePrefixReach(source, node)
    for (const name of names) {
      ;(known ? found.registryCli : found.ours).add(name)
    }
  }
  return found
}

function utility(name) {
  let depth = 0
  for (let index = name.length - 1; index >= 0; index--) {
    if (name[index] === "]") depth++
    else if (name[index] === "[") depth--
    else if (name[index] === ":" && depth === 0) {
      return { variant: name.slice(0, index), value: name.slice(index + 1) }
    }
  }
  return { variant: "", value: name }
}

function reportRegistryCliGap(app, found, describe) {
  const missed = [...found].filter(
    ([, { registryCli }]) => registryCli.size > 0
  )
  if (missed.length === 0) return
  console.log(
    `\n${REGISTRY_CLI} ${describe} in ${missed.length} files:\n  ${missed
      .slice(0, 20)
      .map(
        ([file, { registryCli }]) =>
          `${path.relative(app, file)}: ${[...registryCli].slice(0, 4).join(" ")}`
      )
      .join("\n  ")}`
  )
}

function keptThemeColors(app, file) {
  const source = registrySource(app, file)
  const original = new Set(source ? classNames(source) : [])
  const mark = `${SETTINGS.prefix}:`
  const found = { ours: new Set(), registryCli: new Set() }
  for (const name of classNames(file)) {
    if (!THEME_COLOR.test(utility(name).value)) continue
    const bare =
      SETTINGS.prefix && name.startsWith(mark) ? name.slice(mark.length) : name
    ;(source && !original.has(bare) ? found.registryCli : found.ours).add(name)
  }
  return found
}

function viewBoxes(text) {
  return [...text.matchAll(VIEW_BOX)].map((match) => match[1])
}

function expectNone(app, files, find, describe) {
  const found = files.flatMap((file) =>
    find(file).map((value) => `${path.relative(app, file)}: ${value}`)
  )
  if (found.length > 0) {
    fail(`${describe}\n  ${found.slice(0, 20).join("\n  ")}`)
  }
}

function registrySource(app, file) {
  const { aliases } = configOf(app)
  const name = file.replace(JSX_EXTENSION, ".tsx").replace(JS_EXTENSION, ".ts")
  for (const [alias, dir] of [
    [aliases.ui, "components/ui"],
    [aliases.hooks, "hooks"],
    [aliases.components, "components"],
  ]) {
    const root = aliasPath(app, alias)
    if (!name.startsWith(root + path.sep)) continue
    const relative = path.join(dir, path.relative(root, name))
    return [
      path.join(WEB, "bases", SETTINGS.base, relative),
      path.join(WEB, relative),
    ].find((candidate) => existsSync(candidate))
  }
  return undefined
}

const USE_CLIENT = /^\s*["']use client["']/
const PHYSICAL =
  /^-?(ml|mr|pl|pr|left|right|inset-[lr]|rounded-[lr]|rounded-[tb][lr]|border-[lr]|scroll-m[lr]|scroll-p[lr])(-|$)|^(text|float|clear)-(left|right)$|^origin-(top-|bottom-)?(left|right)$/
const THEME_COLOR =
  /^(bg|text|border|ring|ring-offset)-(primary|secondary|muted|accent|destructive|background|foreground|popover|card|input)(-foreground)?(\/|$)/

const VIEW_BOX = /viewBox="([^"]*)"/g
const VIEW_BOX_ERROR = /attribute viewBox: .*"([^"]*)"\.?$/
const CORRUPTED_VIEW_BOXES = new Set()

const EXPECTATIONS = [
  {
    name: `icons from ${ICON_PACKAGES[SETTINGS.iconLibrary]}`,
    check(app, files) {
      const expected = ICON_PACKAGES[SETTINGS.iconLibrary]
      expectNone(
        app,
        files,
        (file) => {
          const source = readFileSync(file, "utf8")
          return [
            ...(PLACEHOLDER.test(source) ? ["IconPlaceholder"] : []),
            ...Object.values(ICON_PACKAGES).filter(
              (name) => name !== expected && source.includes(`"${name}`)
            ),
          ]
        },
        "files keep placeholders or import another icon library"
      )
      for (const name of ["dialog", "select", "dropdown-menu"]) {
        const file = itemFile(app, "ui", name)
        if (!read(app, file).includes(`"${expected}`)) {
          fail(`${path.relative(app, file)} does not import ${expected}`)
        }
      }
    },
  },
  {
    name: `the ${SETTINGS.menuColor} menu color`,
    check(app, files) {
      expectNone(
        app,
        files,
        (file) => readFileSync(file, "utf8").match(MENU_MARKER) ?? [],
        "files keep the menu markers"
      )
      const file = itemFile(app, "ui", "dropdown-menu")
      const source = read(app, file)
      const inverted = SETTINGS.menuColor.startsWith("inverted")
      const dark = `${SETTINGS.prefix ? `${SETTINGS.prefix}:` : ""}dark`
      if (inverted !== classNames(file).includes(dark)) {
        fail(`dropdown-menu ${inverted ? "lacks" : "has"} the dark class`)
      }
      const translucent = SETTINGS.menuColor.endsWith("translucent")
      if (translucent !== source.includes("backdrop-blur-2xl")) {
        fail(`dropdown-menu ${translucent ? "lacks" : "has"} the blur`)
      }
    },
  },
  {
    when: () => SETTINGS.rtl && SETTINGS.cli === "shadcn",
    name: "logical sides for right-to-left layouts",
    check(app, files) {
      if (configOf(app).rtl !== true) fail("components.json is not rtl")
      expectNone(
        app,
        files,
        (file) =>
          classNames(file).filter((name) => {
            const { variant, value } = utility(name)
            if (DIRECTION_VARIANT.test(variant)) return false
            if (PHYSICAL_SIDE.test(variant)) {
              if (POSITION.test(value)) return false
            }
            return PHYSICAL.test(value)
          }),
        "files keep physical classes"
      )
    },
  },
  {
    when: () => SETTINGS.prefix,
    name: `the ${SETTINGS.prefix}: prefix`,
    async check(app, files) {
      const css = read(app, stylesheet(app))
      if (!css.includes(`prefix(${SETTINGS.prefix})`)) {
        fail("the stylesheet does not import Tailwind CSS with the prefix")
      }
      const applied = [...css.matchAll(APPLY)]
        .flatMap((match) => match[1].split(WHITESPACE))
        .filter((name) => name && !name.startsWith(`${SETTINGS.prefix}:`))
      if (applied.length > 0) {
        fail(`the stylesheet applies unprefixed classes: ${applied.join(" ")}`)
      }
      const isUtility = await utilityTest(app)
      const found = new Map(
        files.map((file) => [file, unprefixedClasses(file, isUtility)])
      )
      reportRegistryCliGap(
        app,
        found,
        "leaves classes unprefixed, as it does in its own components"
      )
      expectNone(
        app,
        files,
        (file) => [...found.get(file).ours],
        "files have unprefixed classes"
      )
    },
  },
  {
    when: () => !SETTINGS.cssVariables,
    name: "inline colors instead of theme variables",
    check(app, files) {
      if (configOf(app).tailwind.cssVariables !== false) {
        fail("components.json still uses CSS variables")
      }
      const found = new Map(
        files.map((file) => [file, keptThemeColors(app, file)])
      )
      reportRegistryCliGap(
        app,
        found,
        "leaves theme colors in the classes its own transforms add"
      )
      expectNone(
        app,
        files,
        (file) => [...found.get(file).ours],
        "files keep theme colors"
      )
      for (const file of files) {
        const source = registrySource(app, file)
        if (!source) continue
        const original = new Set(viewBoxes(readFileSync(source, "utf8")))
        for (const value of viewBoxes(readFileSync(file, "utf8"))) {
          if (!original.has(value)) CORRUPTED_VIEW_BOXES.add(value)
        }
      }
      if (CORRUPTED_VIEW_BOXES.size > 0) {
        console.log(
          `\n${REGISTRY_CLI} drops repeated numbers from SVG viewBox values: ${[...CORRUPTED_VIEW_BOXES].join(", ")}`
        )
      }
      const names = classNames(itemFile(app, "ui", "button"))
      const dark = `${SETTINGS.prefix ? `${SETTINGS.prefix}:` : ""}dark:bg-`
      if (!names.some((name) => name.startsWith(dark))) {
        fail("button has no inline dark mode colors")
      }
      if (names.some((name) => OKLCH_CLASS.test(name))) {
        console.log(
          `\n${REGISTRY_CLI} inlines the base color as classes such as bg-oklch(0.205 0 0), which Tailwind CSS v4 does not generate`
        )
      }
    },
  },
  {
    when: () => !SETTINGS.tsx,
    name: "JavaScript files",
    check(app, files) {
      read(app, itemFile(app, "ui", "button"))
      expectNone(
        app,
        files,
        (file) => (TYPESCRIPT_FILE.test(file) ? ["TypeScript"] : []),
        "files are TypeScript"
      )
    },
  },
  {
    when: () => SETTINGS.cli === "shadcn",
    name: SETTINGS.rsc ? '"use client" directives' : 'no "use client"',
    check(app, files) {
      const directives = files.flatMap((file) => {
        const source = registrySource(app, file)
        if (!source || !USE_CLIENT.test(readFileSync(source, "utf8"))) {
          return []
        }
        return [{ file, kept: USE_CLIENT.test(readFileSync(file, "utf8")) }]
      })
      const lost = directives.filter(({ kept }) => kept !== SETTINGS.rsc)
      if (SETTINGS.rsc) {
        if (lost.length > 0) {
          fail(`${path.relative(app, lost[0].file)} lost "use client"`)
        }
        return
      }
      if (lost.length === 0) fail('every file keeps "use client"')
      const kept = directives.length - lost.length
      if (kept > 0) {
        console.log(
          `\n${REGISTRY_CLI} removed "use client" from ${lost.length} of ${directives.length} files: its rsc transform skips every other file`
        )
      }
    },
  },
  {
    when: () => SETTINGS.aliases,
    name: "imports through the custom aliases",
    check(app, files) {
      expectNone(
        app,
        files,
        (file) =>
          [...readFileSync(file, "utf8").matchAll(DEFAULT_ALIAS_IMPORT)].map(
            (match) => match[1]
          ),
        "files import the default aliases"
      )
      const file = itemFile(app, "ui", "dialog")
      const dialog = read(app, file)
      const usesHook = readFileSync(registrySource(app, file), "utf8").includes(
        '"@/hooks/use-scrollbar-gap"'
      )
      for (const target of [
        `"${CUSTOM_ALIASES.utils}"`,
        `"${CUSTOM_ALIASES.ui}/button"`,
        ...(usesHook ? [`"${CUSTOM_ALIASES.hooks}/use-scrollbar-gap"`] : []),
      ]) {
        if (!dialog.includes(target)) fail(`dialog does not import ${target}`)
      }
    },
  },
]

const pascal = (name) => {
  const text = name.replace(PASCAL_PARTS, (_, __, letter) =>
    letter.toUpperCase()
  )
  return LEADING_DIGIT.test(text) ? `Item${text}` : text
}

function exampleSources() {
  const sources = new Map()
  for (const dir of [
    path.join(WEB, "examples"),
    path.join(WEB, "bases", SETTINGS.base, "examples"),
  ]) {
    if (!existsSync(dir)) continue
    for (const file of readdirSync(dir)) {
      if (file.endsWith(".tsx")) sources.set(file, path.join(dir, file))
    }
  }
  return sources
}

function withAliases(app, code) {
  const { aliases } = configOf(app)
  return code
    .replaceAll('"@/lib/utils"', `"${aliases.utils}"`)
    .replaceAll('"@/components/ui/', `"${aliases.ui}/`)
    .replaceAll('"@/components/', `"${aliases.components}/`)
    .replaceAll('"@/hooks/', `"${aliases.hooks}/`)
}

function bareImports(code) {
  return [...code.matchAll(IMPORT_FROM)]
    .map((match) => match[1])
    .filter((specifier) => !specifier.startsWith("@/"))
    .map((specifier) => specifier.match(BARE_PACKAGE)?.[1])
    .filter(Boolean)
}

function dependenciesOf(app) {
  const pkg = readJson(path.join(app, "package.json"))
  return new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ])
}

function blockEntries(app) {
  return registryIndex()
    .items.filter((item) => item.type === "registry:block")
    .flatMap((item) =>
      (item.files ?? []).map((entry) => {
        const file = withExtension(installedPath(app, entry.path))
        const name = readFileSync(file, "utf8").match(EXPORTED_FUNCTION)?.[1]
        if (!name) fail(`${path.relative(app, file)} exports no component`)
        return { name: item.name, component: name, file }
      })
    )
}

function importPath(app, from, file) {
  const { aliases } = configOf(app)
  const root = aliasPath(app, aliases.components)
  if (file.startsWith(root + path.sep)) {
    return `${aliases.components}/${path
      .relative(root, file)
      .replace(SOURCE_FILE, "")
      .split(path.sep)
      .join("/")}`
  }
  return `./${path.relative(from, file).replace(SOURCE_FILE, "")}`
}

const examplesRun = () => SETTINGS.tsx && !SETTINGS.prefix

async function writeShowcase(app) {
  const { aliases } = configOf(app)
  const dir = path.join(aliasPath(app, aliases.components), "showcase")
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const entries = []
  const packages = new Set()
  if (examplesRun()) {
    for (const [file, source] of exampleSources()) {
      const name = file.replace(".tsx", "")
      const code = withAliases(
        app,
        toIcons(readFileSync(source, "utf8"), SETTINGS.iconLibrary)
      )
      for (const specifier of bareImports(code)) packages.add(specifier)
      writeFileSync(path.join(dir, file), code)
      entries.push({
        name,
        component: pascal(name),
        from: `${aliases.components}/showcase/${name}`,
        file: path.join(dir, file),
        default: true,
      })
    }
  } else {
    console.log(
      "\nThe examples are TypeScript without a prefix, so only the blocks and charts render"
    )
  }
  for (const block of blockEntries(app)) {
    entries.push({
      name: block.name,
      component: `${block.component}Block`,
      exported: block.component,
      from: importPath(app, dir, block.file),
      file: block.file,
    })
  }
  const installed = dependenciesOf(app)
  const missing = [...packages].filter(
    (name) => !installed.has(name) && name !== "react"
  )
  if (missing.length) {
    await run(
      `Install the example dependencies: ${missing.join(", ")}`,
      SETTINGS.packageManager,
      [...INSTALL[SETTINGS.packageManager], ...missing],
      { cwd: app }
    )
  }
  return { entries, dir, from: `${aliases.components}/showcase` }
}

function writeIndex(dir, entries, suspended) {
  const extension = SETTINGS.tsx ? "tsx" : "jsx"
  const typed = SETTINGS.tsx
  const prefix = SETTINGS.prefix ? `${SETTINGS.prefix}:` : ""
  const imports = entries
    .map((entry) =>
      entry.default
        ? `import ${entry.component} from "${entry.from}"`
        : `import { ${entry.exported} as ${entry.component} } from "${entry.from}"`
    )
    .join("\n")
  const rows = entries
    .map(
      (entry) =>
        `        <Boundary name="${entry.name}">\n          ${
          suspended.has(entry.name)
            ? `<Suspense>\n            <${entry.component} />\n          </Suspense>`
            : `<${entry.component} />`
        }\n        </Boundary>`
    )
    .join("\n")
  writeFileSync(
    path.join(dir, `index.${extension}`),
    `${SETTINGS.framework === "next" ? '"use client"\n\n' : ""}import { Component${suspended.size ? ", Suspense" : ""}${typed ? ", type ReactNode" : ""} } from "react"
${imports}

class Boundary extends Component${typed ? "<{ name: string; children: ReactNode }, { error: string | null }>" : ""} {
  state = { error: null }

  static getDerivedStateFromError(error${typed ? ": unknown" : ""}) {
    return { error: error instanceof Error ? error.message : String(error) }
  }

  render() {
    if (this.state.error) {
      return (
        <div data-showcase-error={this.props.name}>{this.state.error}</div>
      )
    }
    return (
      <section data-showcase={this.props.name} className="${prefix}relative">
        {this.props.children}
      </section>
    )
  }
}

export function Showcase() {
  return (
    <main${SETTINGS.rtl ? ' dir="rtl"' : ""}>
${rows}
    </main>
  )
}
`
  )
}

function pagePath(app) {
  if (SETTINGS.framework === "vite") return path.join(app, "src/App.tsx")
  return path.join(app, `app/page.${SETTINGS.tsx ? "tsx" : "jsx"}`)
}

function nextConfig(app) {
  const file = ["next.config.ts", "next.config.mjs", "next.config.js"]
    .map((name) => path.join(app, name))
    .find((name) => existsSync(name))
  return file ? readFileSync(file, "utf8") : ""
}

function freePort() {
  const server = createServer()
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (child.exitCode !== null) fail("the app server stopped")
    const response = await fetch(url).catch(() => null)
    if (response?.ok) return
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  fail(`the app did not start at ${url}`)
}

const HYDRATION = /hydrat|#418|#423|#425/i

const DIAGNOSIS_LINES = 60

function startApp(app, script, host) {
  return freePort().then((port) => {
    const flags =
      SETTINGS.framework === "vite"
        ? ["--port", String(port), "--host", host]
        : ["-p", String(port), "-H", host]
    const args = [
      "run",
      script,
      ...(SETTINGS.packageManager === "npm" ? ["--"] : []),
      ...flags,
    ]
    const child = spawn(SETTINGS.packageManager, args, {
      cwd: app,
      stdio: "ignore",
      env: { ...process.env, ...APP_ENV, NEXT_TELEMETRY_DISABLED: "1" },
    })
    return { url: `http://${host}:${port}/`, child }
  })
}

async function hydrationDiagnosis(browser, app, viewer) {
  if (SETTINGS.framework !== "next") return ""
  console.log(
    "\n> Open the app in development mode to read the hydration error"
  )
  const { url, child } = await startApp(app, "dev", "localhost")
  const context = await browser.newContext(viewer)
  try {
    await waitForServer(url, child)
    const page = await context.newPage()
    const messages = []
    page.on("pageerror", (error) => messages.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") messages.push(message.text())
    })
    await page.goto(url, { waitUntil: "networkidle", timeout: 300_000 })
    await page.waitForTimeout(3000)
    const found = messages.find((message) => HYDRATION.test(message))
    return found
      ? `\n  Development mode reports:\n    ${found
          .split("\n")
          .slice(0, DIAGNOSIS_LINES)
          .join("\n    ")}`
      : ""
  } finally {
    await context.close()
    child.kill()
  }
}

const SERVER_VIEWER = { locale: LOCALE, timezoneId: TIME_ZONE }
const FOREIGN_VIEWER = { locale: "tr-TR", timezoneId: "Europe/Istanbul" }

async function visit(browser, url, viewer) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    ...viewer,
  })
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 })
    await page.waitForTimeout(1000)
    const failed = await page.$$eval("[data-showcase-error]", (nodes) =>
      nodes.map(
        (node) =>
          `${node.getAttribute("data-showcase-error")}: ${node.textContent}`
      )
    )
    const rendered = await page.$$eval(
      "[data-showcase]",
      (nodes) => nodes.length
    )
    return { errors, failed, rendered }
  } finally {
    await page.close()
  }
}

async function expectClean(browser, app, url, expected, viewer, where) {
  const visited = await visit(browser, url, viewer)
  const { failed, rendered } = visited
  const known = visited.errors.filter((error) =>
    CORRUPTED_VIEW_BOXES.has(error.match(VIEW_BOX_ERROR)?.[1])
  )
  const errors = visited.errors.filter((error) => !known.includes(error))
  if (known.length > 0) {
    console.log(
      `\nthe page rejects the viewBox values ${REGISTRY_CLI} corrupted${where}:\n  ${[...new Set(known)].join("\n  ")}`
    )
  }
  if (failed.length) {
    fail(
      `${failed.length} items threw while rendering${where}\n  ${failed.join("\n  ")}`
    )
  }
  if (rendered !== expected) {
    fail(`${rendered} of ${expected} items rendered${where}`)
  }
  if (errors.length) {
    const diagnosis = errors.some((error) => HYDRATION.test(error))
      ? await hydrationDiagnosis(browser, app, viewer)
      : ""
    fail(
      `the page logged ${errors.length} errors${where}\n  ${[...new Set(errors)].slice(0, 20).join("\n  ")}${diagnosis}`
    )
  }
  return rendered
}

async function render(app, expected) {
  const { url, child } = await startApp(
    app,
    SETTINGS.framework === "vite" ? "preview" : "start",
    "127.0.0.1"
  )
  console.log(`\n> Start the app and open ${url}`)
  const browser = await chromium.launch({ channel: "chrome" })
  try {
    await waitForServer(url, child)
    const rendered = await expectClean(
      browser,
      app,
      url,
      expected,
      SERVER_VIEWER,
      ""
    )
    console.log(`\n✓ ${rendered} items render without errors`)
    if (SETTINGS.framework === "next") {
      await expectClean(
        browser,
        app,
        url,
        expected,
        FOREIGN_VIEWER,
        ` for a visitor whose browser uses ${FOREIGN_VIEWER.locale} and ${FOREIGN_VIEWER.timezoneId}`
      )
      console.log(
        `\n✓ the server render matches a ${FOREIGN_VIEWER.locale} browser in ${FOREIGN_VIEWER.timezoneId}`
      )
    }
  } finally {
    await browser.close()
    child.kill()
  }
}

const BLOCKING_PRERENDER =
  /encountered the unstable value[\s\S]*?\n\s+at [^\s(]+ \(([^:)]+):\d+:\d+\)/

function importers(app, entries, file) {
  const own = entries.filter((entry) => entry.file === path.join(app, file))
  if (own.length) return own
  const module = path.basename(file).replace(SOURCE_FILE, "")
  return entries.filter((entry) =>
    readFileSync(entry.file, "utf8").includes(`/${module}"`)
  )
}

const UNSTABLE_VALUE = /encountered the unstable value/

async function attempt(label, app, dir, entries, suspended) {
  writeIndex(dir, entries, suspended)
  try {
    await run(`Build (${label})`, SETTINGS.packageManager, ["run", "build"], {
      cwd: app,
      capture: true,
    })
    return null
  } catch (error) {
    if (!UNSTABLE_VALUE.test(error.output ?? "")) throw error
    return error
  }
}

async function eliminate(label, app, dir, entries, suspended) {
  let candidates = entries.filter((entry) => !suspended.has(entry.name))
  while (candidates.length > 1) {
    const half = candidates.slice(0, Math.ceil(candidates.length / 2))
    console.log(
      `\nThe build names no file, so wrap ${half.length} of ${candidates.length} items in <Suspense> to find the one that blocks it`
    )
    const passed = !(await attempt(
      label,
      app,
      dir,
      entries,
      new Set([...suspended, ...half.map((entry) => entry.name)])
    ))
    candidates = passed ? half : candidates.slice(half.length)
  }
  return candidates[0]
}

async function build(label, app, dir, entries) {
  const suspended = new Set()
  const blocking = []
  for (;;) {
    const error = await attempt(label, app, dir, entries, suspended)
    if (!error) return blocking
    const file = error.output.match(BLOCKING_PRERENDER)?.[1]
    const named = (file ? importers(app, entries, file) : []).filter(
      (entry) => !suspended.has(entry.name)
    )
    const found = named.length
      ? named
      : [await eliminate(label, app, dir, entries, suspended)]
    if (!found[0]) throw error
    blocking.push(
      named.length
        ? `${file} (${found.map((entry) => entry.name).join(", ")})`
        : `${found[0].name}, inside a dependency`
    )
    for (const entry of found) suspended.add(entry.name)
    console.log(
      `\nWrap ${found.map((entry) => entry.name).join(", ")} in <Suspense> and build again`
    )
  }
}

async function check(label, app) {
  for (const file of [
    "app/page.tsx",
    "app/page.jsx",
    "app/page.js",
    "src/App.tsx",
  ]) {
    rmSync(path.join(app, file), { force: true })
  }
  const { entries, dir, from } = await writeShowcase(app)
  writeIndex(dir, entries, new Set())
  writeFileSync(
    pagePath(app),
    `import { Showcase } from "${from}"\n\nexport default function Page() {\n  return <Showcase />\n}\n`
  )
  edit(path.join(app, "package.json"), (text) => {
    const pkg = JSON.parse(text)
    pkg.scripts = { ...pkg.scripts, typecheck: "tsc --noEmit" }
    return `${JSON.stringify(pkg, null, 2)}\n`
  })
  if (SETTINGS.framework === "next") {
    if (!nextConfig(app).includes("cacheComponents: true")) {
      fail("the new app does not enable cacheComponents")
    }
    if (SETTINGS.tsx) {
      await run(
        `Type-check (${label})`,
        SETTINGS.packageManager,
        ["run", "typecheck"],
        {
          cwd: app,
        }
      )
    }
  }
  const blocking = await build(label, app, dir, entries)
  await render(app, entries.length)
  if (blocking.length) {
    fail(
      `${blocking.length} files read the time or a random value while rendering, which breaks the build of a Next.js app with cacheComponents unless the item is wrapped in <Suspense>\n  ${blocking.join("\n  ")}`
    )
  }
}

const workspace = mkdtempSync(path.join(tmpdir(), "esuiss-compat-"))
const output = path.join(workspace, "public")
const cleanup = () => {
  if (OPTION.keep === "true") console.log(`\nKept ${workspace}`)
  else rmSync(workspace, { recursive: true, force: true })
}
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    cleanup()
    process.exit(1)
  })
}

const servers = []
function listen(handler) {
  const server = createServer(handler)
  servers.push(server)
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () =>
      resolve(`http://127.0.0.1:${server.address().port}`)
    )
  })
}

function serveFiles(dir) {
  return listen((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    )
    const file = path.join(dir, pathname)
    if (
      !file.startsWith(dir + path.sep) ||
      !existsSync(file) ||
      !statSync(file).isFile()
    ) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200).end(readFileSync(file))
  })
}

function serveRegistry(dir) {
  const assets = {
    fetch(request) {
      const pathname = new URL(request.url).pathname
      const file = path.join(dir, pathname.slice(REGISTRY_PREFIX.length))
      if (!file.startsWith(dir + path.sep) || !existsSync(file)) {
        return Promise.resolve(new Response(null, { status: 404 }))
      }
      return Promise.resolve(new Response(readFileSync(file), { status: 200 }))
    },
  }
  return listen(async (request, response) => {
    const result = await worker.fetch(
      new Request(new URL(request.url, "http://127.0.0.1"), {
        method: request.method,
      }),
      { ASSETS: assets }
    )
    response.writeHead(result.status, Object.fromEntries(result.headers))
    response.end(Buffer.from(await result.arrayBuffer()))
  })
}

const VITE_CONFIG = `import { fileURLToPath, URL } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
`

const FRAMEWORKS = {
  next: {
    key: `${NEXT_APP}-${SETTINGS.tsx ? "ts" : "js"}-${SETTINGS.packageManager}`,
    async create(dir) {
      await run("Create a Next.js app", "npx", [
        "--yes",
        NEXT_APP,
        dir,
        SETTINGS.tsx ? "--ts" : "--js",
        "--tailwind",
        "--app",
        "--no-src-dir",
        "--no-eslint",
        "--no-react-compiler",
        "--import-alias",
        "@/*",
        `--use-${SETTINGS.packageManager}`,
        "--disable-git",
        "--no-agents-md",
        "--no-agent-feedback",
        "--yes",
      ])
    },
  },
  vite: {
    key: `${VITE_APP}-${SETTINGS.packageManager}`,
    async create(dir) {
      await run(
        "Create a Vite app",
        "npx",
        [
          "--yes",
          VITE_APP,
          path.basename(dir),
          "--template",
          "react-ts",
          "--no-interactive",
        ],
        { cwd: path.dirname(dir) }
      )
      await run("Install the Vite app", SETTINGS.packageManager, ["install"], {
        cwd: dir,
      })
      await run(
        "Add Tailwind CSS to the Vite app",
        SETTINGS.packageManager,
        [
          ...INSTALL[SETTINGS.packageManager],
          "tailwindcss",
          "@tailwindcss/vite",
        ],
        { cwd: dir }
      )
      writeFileSync(path.join(dir, "src/index.css"), '@import "tailwindcss";\n')
      const tsconfig = path.join(dir, "tsconfig.json")
      writeJson(tsconfig, {
        ...readJson(tsconfig),
        compilerOptions: { paths: { "@/*": ["./src/*"] } },
      })
      edit(path.join(dir, "tsconfig.app.json"), (source) =>
        source.replace(
          '"compilerOptions": {',
          '"compilerOptions": {\n    "paths": { "@/*": ["./src/*"] },'
        )
      )
      writeFileSync(path.join(dir, "vite.config.ts"), VITE_CONFIG)
    },
  },
}

async function scaffold() {
  const framework = FRAMEWORKS[SETTINGS.framework]
  const app = path.join(workspace, "app")
  const cached =
    OPTION.cache && path.join(path.resolve(OPTION.cache), framework.key)
  if (cached && existsSync(cached)) {
    console.log(`\n> Copy the app from ${cached}`)
    copy(cached, app)
    return app
  }
  await framework.create(app)
  const installed = ["node_modules", ".pnp.cjs"].some((name) =>
    existsSync(path.join(app, name))
  )
  if (!installed) {
    fail(`${SETTINGS.packageManager} did not install the new app`)
  }
  if (cached) {
    mkdirSync(path.dirname(cached), { recursive: true })
    copy(app, cached)
  }
  return app
}

function moveUtils(app) {
  if (!SETTINGS.aliases) return
  const { aliases } = configOf(app)
  const extension = SETTINGS.tsx ? "ts" : "js"
  const written = path.join(aliasPath(app, aliases.lib), `utils.${extension}`)
  const expected = `${aliasPath(app, aliases.utils)}.${extension}`
  if (written === expected || !existsSync(written)) return
  console.log(
    `\nMove ${path.relative(app, written)} to ${path.relative(app, expected)}, where the utils alias points`
  )
  renameSync(written, expected)
}

async function runCli(app, env) {
  const flags = [
    "--platform",
    "web",
    "--base",
    SETTINGS.base,
    ...(isDefaultState() ? [] : presetFlags()),
    ...(SETTINGS.rtl ? ["--rtl"] : []),
  ]
  await run(
    `Set up with the suiss/ui CLI: init ${flags.join(" ")}`,
    "node",
    [CLI, "init", ...flags, "--yes", "--cwd", app],
    { env }
  )
  await run(
    "Add every component with the suiss/ui CLI",
    "node",
    [CLI, "add", "--all", "--yes", "--cwd", app],
    { env }
  )
  await run(
    "Add the theme component by name with the suiss/ui CLI",
    "node",
    [CLI, "add", "theme", "--yes", "--cwd", app],
    { env }
  )
  for (const scope of ["patterns", "interactions", "charts", "blocks"]) {
    await run(
      `Add every item in ${scope} with the suiss/ui CLI`,
      "node",
      [CLI, "add", scope, "--all", "--yes", "--cwd", app],
      { env }
    )
  }
}

async function runRegistry(app, origin) {
  await run(
    `Set up with the registry CLI: init --preset ${presetCode()} --base ${SETTINGS.base}`,
    ...runner([
      REGISTRY_CLI,
      "init",
      "--preset",
      presetCode(),
      "--base",
      SETTINGS.base,
      ...(SETTINGS.rtl ? ["--rtl"] : []),
      ...(SETTINGS.cssVariables ? [] : ["--no-css-variables"]),
      "--yes",
      "--no-monorepo",
    ]),
    { cwd: app }
  )
  const file = path.join(app, "components.json")
  const config = readJson(file)
  writeJson(file, {
    ...config,
    rsc: SETTINGS.rsc,
    tailwind: { ...config.tailwind, prefix: SETTINGS.prefix },
    aliases: SETTINGS.aliases ?? config.aliases,
    registries: {
      "@esuiss": `${origin}${REGISTRY_PREFIX}${
        STATE.style === OWN ? `${SETTINGS.base}-${OWN}` : "{style}"
      }/{name}.json`,
    },
  })
  if (SETTINGS.prefix) {
    edit(stylesheet(app), (css) =>
      css
        .replace(
          '@import "tailwindcss";',
          `@import "tailwindcss" prefix(${SETTINGS.prefix});`
        )
        .replace(
          APPLY,
          (_, names) =>
            `@apply ${names
              .split(WHITESPACE)
              .map((name) => `${SETTINGS.prefix}:${name}`)
              .join(" ")};`
        )
    )
  }
  const names = registryIndex()
    .items.filter((item) => ownColors() || !isTheme(item))
    .map((item) => `@esuiss/${item.name}`)
  await run(
    `Add ${names.length} items with the registry CLI`,
    ...runner([REGISTRY_CLI, "add", ...names, "--yes", "--overwrite"]),
    { cwd: app }
  )
  moveUtils(app)
  const { iconLibrary, menuColor } = configOf(app)
  if (iconLibrary !== SETTINGS.iconLibrary) {
    fail(`components.json iconLibrary is ${iconLibrary}`)
  }
  if ((menuColor ?? "default") !== SETTINGS.menuColor) {
    fail(`components.json menuColor is ${menuColor}`)
  }
}

try {
  const app = await scaffold()

  await run(
    `Build the registry (${SETTINGS.base})`,
    "node",
    [
      REGISTRY_BIN,
      "build",
      REGISTRY_FILES[SETTINGS.base],
      "--output",
      path.join(output, SETTINGS.base),
    ],
    { cwd: WEB }
  )
  await run(
    "Pack every style into the registry",
    "node",
    ["scripts/style-registry.mjs", output, SETTINGS.base],
    { cwd: WEB }
  )
  const origin = await serveRegistry(output)
  const env = { ESUISS_REGISTRY: await serveFiles(WEB) }

  if (SETTINGS.cli === "esuiss") await runCli(app, env)
  else await runRegistry(app, origin)

  expectItems(app)
  expectStyle(app)
  expectPrimitives(app)
  const files = installedFiles(app)
  for (const expectation of EXPECTATIONS) {
    if (expectation.when && !expectation.when()) continue
    await expectation.check(app, files)
    console.log(`\n✓ ${expectation.name}`)
  }
  await check(
    `${SETTINGS.cli} CLI, ${SETTINGS.base}, ${LABEL || "defaults"}`,
    app
  )

  console.log(
    `\nCompatible (${SETTINGS.cli} CLI, ${SETTINGS.framework}, ${SETTINGS.base}, ${STATE.style}${LABEL ? `, ${LABEL}` : ""}): every item installs, type-checks, builds and renders.`
  )
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  for (const server of servers) server.close()
  cleanup()
}
