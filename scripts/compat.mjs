import { spawn } from "node:child_process"
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:http"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"

const NEXT_APP = "create-next-app@16.4.0"
const VITE_APP = "create-vite@9.2.1"
const REGISTRY_CLI = "shadcn@4.21.4"
const ROOT = path.resolve(import.meta.dirname, "..")
const WEB = path.join(ROOT, "packages/web")
const CLI = path.join(ROOT, "packages/cli/index.mjs")
const REGISTRY_BIN = path.join(WEB, "node_modules/shadcn/dist/index.js")
const requireFromWeb = createRequire(path.join(WEB, "package.json"))

const COMPONENTS = [
  "button",
  "dialog",
  "select",
  "dropdown-menu",
  "checkbox",
  "switch",
  "tabs",
  "sidebar",
  "theme",
]
const PATTERNS = ["date-picker"]
const CHARTS = ["area-chart-default"]
const BLOCKS = ["login-account"]
const THEME = "theme-suiss"
const PRIMITIVES = {
  base: "@base-ui/react",
  radix: "radix-ui",
  aria: "react-aria-components",
}
const TWINS = {
  base: { patterns: [], blocks: [] },
  radix: { patterns: ["flyout"], blocks: ["login-passkey"] },
  aria: { patterns: ["flyout"], blocks: ["login-passkey"] },
}
const RADIX_STYLE = /^(radix-.+|new-york|default)$/
const ARIA_STYLE = /^aria-.+$/
const ICON_PACKAGES = {
  lucide: "lucide-react",
  tabler: "@tabler/icons-react",
  hugeicons: "@hugeicons/react",
  phosphor: "@phosphor-icons/react",
  remixicon: "@remixicon/react",
}
const ICON_DEPENDENCIES = {
  hugeicons: ["@hugeicons/core-free-icons"],
}
const MENU_COLORS = [
  "default",
  "inverted",
  "default-translucent",
  "inverted-translucent",
]
const CUSTOM_ALIASES = {
  components: "@/kit",
  ui: "@/kit/elements",
  lib: "@/support",
  utils: "@/support/cn",
  hooks: "@/support/hooks",
}
const BOOLEAN = ["true", "false"]
const ARGUMENT = /^--([\w-]+)(?:=(.*))?$/
const SOURCE_FILE = /\.[jt]sx?$/
const JSX_FILE = /x$/
const WHITESPACE = /\s+/
const JSX_EXTENSION = /\.jsx$/
const JS_EXTENSION = /\.js$/
const PLACEHOLDER = /icon-placeholder|IconPlaceholder/
const DIRECTION_VARIANT = /^(rtl|ltr)(:|$)/
const PHYSICAL_SIDE = /data-\[side=(left|right)\]/
const POSITION = /^-?(left|right)-/
const OKLCH_CLASS = /^[\w:-]+-oklch\(/
const TYPESCRIPT_FILE = /\.tsx?$/
const MENU_MARKER = /cn-menu-(target|translucent)/g
const APPLY = /@apply\s+([^;]+);/g
const DEFAULT_ALIAS_IMPORT = /from "(@\/(components|lib|hooks)\b[^"]*)"/g
const QUOTES = /^["']|["']$/g

const OPTIONS = {
  base: ["all", ...Object.keys(PRIMITIVES)],
  framework: ["next", "vite"],
  icons: Object.keys(ICON_PACKAGES),
  rtl: BOOLEAN,
  prefix: /^[a-z]*$/,
  "css-variables": BOOLEAN,
  tsx: BOOLEAN,
  rsc: BOOLEAN,
  aliases: ["default", "custom"],
  "menu-color": MENU_COLORS,
  cache: /./,
  keep: BOOLEAN,
  matrix: BOOLEAN,
}
const DEFAULTS = {
  base: "all",
  framework: "next",
  icons: "lucide",
  rtl: "false",
  prefix: "",
  "css-variables": "true",
  tsx: "true",
  rsc: "true",
  aliases: "default",
  "menu-color": "default",
  keep: "false",
}
const RUN_OPTIONS = new Set(["base", "framework", "cache", "keep", "matrix"])

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

const EVERY_BASE = ["", "--framework=vite", "--rtl", "--prefix=tw"]
const FIRST_BASE = [
  ...Object.keys(ICON_PACKAGES)
    .filter((name) => name !== DEFAULTS.icons)
    .map((name) => `--icons=${name}`),
  "--css-variables=false",
  "--tsx=false",
  "--rsc=false",
  "--aliases=custom",
  ...MENU_COLORS.filter((color) => color !== DEFAULTS["menu-color"]).map(
    (color) => `--menu-color=${color}`
  ),
]
const MATRIX = [
  ...Object.keys(PRIMITIVES).flatMap((base) =>
    EVERY_BASE.map((args) => `--base=${base} ${args}`.trim())
  ),
  ...FIRST_BASE.map((args) => `--base=${Object.keys(PRIMITIVES)[0]} ${args}`),
]
if (OPTION.matrix === "true") {
  console.log(
    JSON.stringify({
      include: MATRIX.map((args) => ({
        name: args.replaceAll("--", "").replaceAll(" ", ", "),
        args,
      })),
    })
  )
  process.exit()
}
const SETTINGS = {
  framework: OPTION.framework,
  iconLibrary: OPTION.icons,
  rtl: OPTION.rtl === "true",
  prefix: OPTION.prefix,
  cssVariables: OPTION["css-variables"] === "true",
  tsx: OPTION.tsx === "true",
  rsc: OPTION.framework === "next" && OPTION.rsc === "true",
  aliases: OPTION.aliases === "custom" ? CUSTOM_ALIASES : null,
  menuColor: OPTION["menu-color"],
}
if (!SETTINGS.tsx && SETTINGS.framework !== "next") {
  throw new Error("--tsx=false runs on the JavaScript Next.js app")
}
const CHANGED = Object.keys(DEFAULTS).filter(
  (name) => !RUN_OPTIONS.has(name) && OPTION[name] !== DEFAULTS[name]
)
const STANDARD = CHANGED.length === 0
const SELECTED = OPTION.base === "all" ? Object.keys(PRIMITIVES) : [OPTION.base]
const LABEL = [
  SETTINGS.framework,
  ...CHANGED.map((name) => `--${name}=${OPTION[name]}`),
].join(" ")

function registryItems(base) {
  return [
    ...COMPONENTS,
    ...PATTERNS,
    ...TWINS[base].patterns,
    ...CHARTS,
    ...BLOCKS,
    ...TWINS[base].blocks,
    THEME,
  ].map((name) => `@esuiss/${name}`)
}

const TRIGGERS = {
  base: `<DialogTrigger render={<Button variant="outline" />}>
              Open
            </DialogTrigger>`,
  radix: `<DialogTrigger asChild>
              <Button variant="outline">Open</Button>
            </DialogTrigger>`,
  aria: `<Button variant="outline">Open</Button>`,
}

const SELECT_PROPS = { base: "", radix: "", aria: ' aria-label="Fruit"' }

const TAB_PROPS = {
  base: { root: "defaultValue", item: "value" },
  radix: { root: "defaultValue", item: "value" },
  aria: { root: "defaultSelectedKey", item: "id" },
}

const TWIN_IMPORTS = {
  base: "",
  aria: `import { LoginPasskey } from "@/components/blocks/login-passkey"
import { Flyout, FlyoutContent, FlyoutTitle } from "@/components/patterns/flyout"
`,
  radix: `import { LoginPasskey } from "@/components/blocks/login-passkey"
import {
  Flyout,
  FlyoutContent,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
`,
}

const TWIN_USAGE = {
  base: "",
  aria: `
          <Flyout>
            <Button variant="outline">Flyout</Button>
            <FlyoutContent>
              <FlyoutTitle>Flyout</FlyoutTitle>
            </FlyoutContent>
          </Flyout>
          <LoginPasskey />`,
  radix: `
          <Flyout>
            <FlyoutTrigger asChild>
              <Button variant="outline">Flyout</Button>
            </FlyoutTrigger>
            <FlyoutContent>
              <FlyoutTitle>Flyout</FlyoutTitle>
            </FlyoutContent>
          </Flyout>
          <LoginPasskey />`,
}

const page = (base) => `"use client"

import { AreaChartDefault } from "@/components/charts/area-chart-default"
import { LoginAccount } from "@/components/blocks/login-account"
${TWIN_IMPORTS[base]}import { DatePicker } from "@/components/patterns/date-picker"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeProvider, ThemeToggle } from "@/components/ui/theme"

export default function Page() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Home</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col gap-6 p-6">
          <ThemeToggle />
          <Button>Button</Button>
          <Dialog>
            ${TRIGGERS[base]}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Title</DialogTitle>
                <DialogDescription>Description</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select${SELECT_PROPS[base]}>
            <SelectTrigger>
              <SelectValue placeholder="Fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker aria-label="Date" />
          <Checkbox />
          <Switch />
          <Tabs ${TAB_PROPS[base].root}="one">
            <TabsList>
              <TabsTrigger ${TAB_PROPS[base].item}="one">One</TabsTrigger>
              <TabsTrigger ${TAB_PROPS[base].item}="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent ${TAB_PROPS[base].item}="one">One</TabsContent>
            <TabsContent ${TAB_PROPS[base].item}="two">Two</TabsContent>
          </Tabs>
          <AreaChartDefault />
          <LoginAccount />${TWIN_USAGE[base]}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
`

const CONTENT_TYPES = {
  ".json": "application/json",
  ".css": "text/css",
}

const STYLED_ITEM = /^\/r\/([^/]+)\/([^/]+)$/

function route(pathname) {
  const match = pathname.match(STYLED_ITEM)
  if (!match || match[1] in PRIMITIVES) return pathname
  if (RADIX_STYLE.test(match[1])) return `/r/radix/${match[2]}`
  if (ARIA_STYLE.test(match[1])) return `/r/aria/${match[2]}`
  return `/r/base/${match[2]}`
}

function serve(dir) {
  const server = createServer((request, response) => {
    const pathname = route(
      decodeURIComponent(new URL(request.url, "http://localhost").pathname)
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
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES[path.extname(file)] ?? "text/plain",
    })
    createReadStream(file).pipe(response)
  })
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server))
  })
}

function run(label, command, args, options = {}) {
  console.log(`\n> ${label}`)
  const child = spawn(command, args, {
    stdio: "inherit",
    ...options,
    env: {
      ...process.env,
      CI: "1",
      NEXT_TELEMETRY_DISABLED: "1",
      ...options.env,
    },
  })
  return new Promise((resolve, reject) => {
    child.on("error", reject)
    child.on("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${label} failed with exit code ${code ?? signal}`))
    })
  })
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
  ]
}

function itemFile(app, alias, name) {
  return path.join(
    aliasPath(app, configOf(app).aliases[alias]),
    `${name}.${SETTINGS.tsx ? "tsx" : "jsx"}`
  )
}

function read(app, file) {
  if (!existsSync(file)) fail(`${path.relative(app, file)} was not written`)
  return readFileSync(file, "utf8")
}

function stylesheet(app) {
  return path.join(app, configOf(app).tailwind.css)
}

function expectStyles(app, expected) {
  const css = read(app, stylesheet(app))
  for (const text of expected) {
    if (!css.includes(text)) {
      fail(`${configOf(app).tailwind.css} is missing ${text}`)
    }
  }
}

function expectPrimitives(app, base) {
  const files = [
    itemFile(app, "ui", "dialog"),
    ...TWINS[base].patterns.map((name) =>
      itemFile(app, "components", `patterns/${name}`)
    ),
  ]
  for (const file of files) {
    if (!read(app, file).includes(PRIMITIVES[base]))
      fail(`${path.relative(app, file)} does not import ${PRIMITIVES[base]}`)
  }
}

const CLASS_CALLS = new Set(["cn", "cva"])
const ts = requireFromWeb("typescript")
const COMPARISONS = new Set([
  ts.SyntaxKind.EqualsEqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsEqualsToken,
  ts.SyntaxKind.EqualsEqualsToken,
  ts.SyntaxKind.ExclamationEqualsToken,
])

function keyOf(source, node) {
  return node.name.getText(source).replace(QUOTES, "")
}

function inCompoundVariants(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      ts.isPropertyAssignment(parent) &&
      parent.name.getText() === "compoundVariants"
    ) {
      return true
    }
  }
  return false
}

function classStrings(file, { compound = true } = {}) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    JSX_FILE.test(file) ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
  const found = []
  function collect(node) {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      found.push(node.text)
    } else if (ts.isPropertyAssignment(node)) {
      const key = keyOf(source, node)
      if (key === "defaultVariants") return
      if (key === "compoundVariants") {
        if (!compound) return
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
  function descendants(node) {
    const nodes = []
    const visit = (child) => {
      nodes.push(child)
      ts.forEachChild(child, visit)
    }
    ts.forEachChild(node, visit)
    return nodes
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
      keyOf(source, node) === "className" &&
      (compound || !inCompoundVariants(node))
    ) {
      collect(node.initializer)
    }
  }
  return found
}

function classNames(file, options) {
  return [
    ...new Set(
      classStrings(file, options).flatMap((value) =>
        value.split(WHITESPACE).filter(Boolean)
      )
    ),
  ]
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

function expectNone(app, files, find, describe) {
  const found = files.flatMap((file) =>
    find(file).map((value) => `${path.relative(app, file)}: ${value}`)
  )
  if (found.length > 0) {
    fail(`${describe}\n  ${found.slice(0, 20).join("\n  ")}`)
  }
}

function registrySource(app, file, base) {
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
      path.join(WEB, "bases", base, relative),
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
      if (inverted !== classNames(file).includes("dark")) {
        fail(`dropdown-menu ${inverted ? "lacks" : "has"} the dark class`)
      }
      const translucent = SETTINGS.menuColor.endsWith("translucent")
      if (translucent !== source.includes("backdrop-blur-2xl")) {
        fail(`dropdown-menu ${translucent ? "lacks" : "has"} the blur`)
      }
    },
  },
  {
    when: () => SETTINGS.rtl,
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
    check(app, files) {
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
      const unprefixed = (file, options) =>
        classNames(file, options).filter(
          (name) => !name.startsWith(`${SETTINGS.prefix}:`)
        )
      expectNone(
        app,
        files,
        (file) => unprefixed(file, { compound: false }),
        "files have unprefixed classes"
      )
      const compound = files.filter((file) => unprefixed(file).length > 0)
      if (compound.length > 0) {
        console.log(
          `\n${REGISTRY_CLI} leaves the compoundVariants classes of cva() unprefixed in ${compound.map((file) => path.relative(app, file)).join(", ")}`
        )
      }
    },
  },
  {
    when: () => !SETTINGS.cssVariables,
    name: "inline colors instead of theme variables",
    check(app, files) {
      if (configOf(app).tailwind.cssVariables !== false) {
        fail("components.json still uses CSS variables")
      }
      expectNone(
        app,
        files,
        (file) =>
          classNames(file).filter((name) =>
            THEME_COLOR.test(utility(name).value)
          ),
        "files keep theme colors"
      )
      const names = classNames(itemFile(app, "ui", "button"))
      if (!names.some((name) => name.startsWith("dark:bg-"))) {
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
    name: SETTINGS.rsc ? '"use client" directives' : 'no "use client"',
    check(app, files, base) {
      const directives = files.flatMap((file) => {
        const source = registrySource(app, file, base)
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
      const dialog = read(app, itemFile(app, "ui", "dialog"))
      for (const target of [
        `"${CUSTOM_ALIASES.utils}"`,
        `"${CUSTOM_ALIASES.ui}/button"`,
        `"${CUSTOM_ALIASES.hooks}/use-scrollbar-gap"`,
      ]) {
        if (!dialog.includes(target)) fail(`dialog does not import ${target}`)
      }
    },
  },
]

function pagePath(app) {
  if (SETTINGS.framework === "vite") return path.join(app, "src/App.tsx")
  return path.join(app, `app/page.${SETTINGS.tsx ? "tsx" : "jsx"}`)
}

function pageFor(app, base) {
  const { aliases, tailwind } = configOf(app)
  let source = page(base)
    .replaceAll('"@/components/ui/', `"${aliases.ui}/`)
    .replaceAll('"@/components/', `"${aliases.components}/`)
  if (SETTINGS.framework === "vite") {
    source = source.replace('"use client"\n\n', "")
  }
  if (tailwind.prefix) {
    source = source.replace(
      'className="flex flex-col gap-6 p-6"',
      `className="${["flex", "flex-col", "gap-6", "p-6"]
        .map((name) => `${tailwind.prefix}:${name}`)
        .join(" ")}"`
    )
  }
  return source
}

function nextConfig(app) {
  const file = ["next.config.ts", "next.config.mjs", "next.config.js"]
    .map((name) => path.join(app, name))
    .find((name) => existsSync(name))
  return file ? readFileSync(file, "utf8") : ""
}

async function check(label, app, base) {
  for (const file of ["app/page.tsx", "app/page.js", "src/App.tsx"]) {
    rmSync(path.join(app, file), { force: true })
  }
  writeFileSync(pagePath(app), pageFor(app, base))
  if (SETTINGS.framework === "vite") {
    await run(`Type-check and build (${label})`, "npm", ["run", "build"], {
      cwd: app,
    })
    return
  }
  if (!nextConfig(app).includes("cacheComponents: true")) {
    fail("the new app does not enable cacheComponents")
  }
  if (SETTINGS.tsx) {
    await run(`Type-check (${label})`, "npx", ["tsc", "--noEmit"], {
      cwd: app,
    })
  }
  await run(`Build (${label})`, "npx", ["next", "build"], { cwd: app })
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
async function serveDirectory(dir) {
  const server = await serve(dir)
  servers.push(server)
  return `http://127.0.0.1:${server.address().port}`
}

const REGISTRY_FILES = {
  base: "registry/registry.json",
  radix: "registry/radix/registry.json",
  aria: "registry/aria/registry.json",
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
    key: `${NEXT_APP}-${SETTINGS.tsx ? "ts" : "js"}`,
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
        "--use-npm",
        "--disable-git",
        "--no-agents-md",
        "--no-agent-feedback",
        "--yes",
      ])
    },
    init: ["--defaults"],
  },
  vite: {
    key: VITE_APP,
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
      await run(
        "Add Tailwind CSS to the Vite app",
        "npm",
        ["install", "tailwindcss", "@tailwindcss/vite"],
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
    init: ["--preset", "nova"],
  },
}

async function scaffold() {
  const framework = FRAMEWORKS[SETTINGS.framework]
  const fresh = path.join(workspace, "fresh")
  const cached =
    OPTION.cache && path.join(path.resolve(OPTION.cache), framework.key)
  if (cached && existsSync(cached)) {
    console.log(`\n> Copy the app from ${cached}`)
    copy(cached, fresh)
    return fresh
  }
  await framework.create(fresh)
  if (cached) {
    mkdirSync(path.dirname(cached), { recursive: true })
    copy(fresh, cached)
  }
  return fresh
}

async function initialize(fresh, base) {
  const app = path.join(workspace, base)
  copy(fresh, app)
  await run(
    `Initialize the registry CLI (${base})`,
    "npx",
    [
      "--yes",
      REGISTRY_CLI,
      "init",
      "--base",
      base,
      ...FRAMEWORKS[SETTINGS.framework].init,
      ...(SETTINGS.rtl ? ["--rtl"] : []),
      ...(SETTINGS.cssVariables ? [] : ["--no-css-variables"]),
      "--yes",
      "--no-monorepo",
    ],
    { cwd: app }
  )
  return app
}

function configure(app, origin) {
  const file = path.join(app, "components.json")
  const config = readJson(file)
  console.log(`\ncomponents.json style is ${config.style}`)
  writeJson(file, {
    ...config,
    rsc: SETTINGS.rsc,
    iconLibrary: SETTINGS.iconLibrary,
    menuColor: SETTINGS.menuColor,
    tailwind: { ...config.tailwind, prefix: SETTINGS.prefix },
    aliases: SETTINGS.aliases ?? config.aliases,
    registries: { "@esuiss": `${origin}/r/{style}/{name}.json` },
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

async function runCli(base, app, env) {
  await run(
    `Add components with the suiss/ui CLI (${base})`,
    "node",
    [CLI, "add", ...COMPONENTS, "--yes", "--overwrite", "--cwd", app],
    { env }
  )
  for (const [scope, names] of [
    ["patterns", [...PATTERNS, ...TWINS[base].patterns]],
    ["charts", CHARTS],
    ["blocks", [...BLOCKS, ...TWINS[base].blocks]],
  ]) {
    await run(
      `Add ${scope} with the suiss/ui CLI (${base})`,
      "node",
      [CLI, "add", scope, ...names, "--yes", "--cwd", app],
      { env }
    )
  }
  expectStyles(app, ["@keyframes theme-reveal"])
  expectPrimitives(app, base)
  await check(`suiss/ui CLI, ${base}`, app, base)
}

async function runRegistry(base, app, origin) {
  configure(app, origin)
  await run(
    `Install ${ICON_PACKAGES[SETTINGS.iconLibrary]} (${base})`,
    "npm",
    [
      "install",
      ICON_PACKAGES[SETTINGS.iconLibrary],
      ...(ICON_DEPENDENCIES[SETTINGS.iconLibrary] ?? []),
    ],
    { cwd: app }
  )
  await run(
    `Add items with the registry CLI (${base}, ${LABEL})`,
    "npx",
    [
      "--yes",
      REGISTRY_CLI,
      "add",
      ...registryItems(base),
      "--yes",
      "--overwrite",
    ],
    { cwd: app }
  )
  moveUtils(app)
  expectStyles(app, [
    "@keyframes theme-reveal",
    "oklch(0.5629 0.1933 256.16)",
    "@fontsource-variable/inter",
  ])
  expectPrimitives(app, base)
  const files = installedFiles(app)
  for (const expectation of EXPECTATIONS) {
    if (expectation.when && !expectation.when()) continue
    expectation.check(app, files, base)
    console.log(`\n✓ ${expectation.name}`)
  }
  await check(`registry CLI, ${base}, ${LABEL}`, app, base)
}

try {
  const fresh = await scaffold()

  for (const base of SELECTED) {
    await run(
      `Build the registry (${base})`,
      "node",
      [
        REGISTRY_BIN,
        "build",
        REGISTRY_FILES[base],
        "--output",
        path.join(output, "r", base),
      ],
      { cwd: WEB }
    )
  }
  const origin = await serveDirectory(output)
  const env = { ESUISS_REGISTRY: await serveDirectory(WEB) }

  for (const base of SELECTED) {
    const initialized = await initialize(fresh, base)
    if (STANDARD) {
      const cliApp = path.join(workspace, `${base}-cli`)
      copy(initialized, cliApp)
      await runCli(base, cliApp, env)
      rmSync(cliApp, { recursive: true, force: true })
    }
    await runRegistry(base, initialized, origin)
    if (OPTION.keep !== "true") {
      rmSync(initialized, { recursive: true, force: true })
    }
  }

  console.log(
    `\nCompatible (${SELECTED.join(", ")}, ${LABEL}): the items install${STANDARD ? " through both CLIs" : ""}, type-check and build.`
  )
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  for (const server of servers) server.close()
  cleanup()
}
