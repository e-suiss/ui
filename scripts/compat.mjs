import { spawn } from "node:child_process"
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

const NEXT_APP = "create-next-app@16.4.0"
const REGISTRY_CLI = "shadcn@4.21.4"
const ROOT = path.resolve(import.meta.dirname, "..")
const WEB = path.join(ROOT, "packages/web")
const CLI = path.join(ROOT, "packages/cli/index.mjs")
const REGISTRY_BIN = path.join(WEB, "node_modules/shadcn/dist/index.js")

const COMPONENTS = [
  "button",
  "dialog",
  "select",
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
const ICON_LIBRARY =
  process.argv.find((arg) => arg.startsWith("--icons="))?.slice(8) ?? "lucide"
if (!(ICON_LIBRARY in ICON_PACKAGES)) {
  throw new Error(`Unknown icon library: ${ICON_LIBRARY}`)
}
const BASE =
  process.argv.find((arg) => arg.startsWith("--base="))?.slice(7) ?? "all"
if (!(BASE === "all" || BASE in PRIMITIVES)) {
  throw new Error(`Unknown base: ${BASE}`)
}
const SELECTED = BASE === "all" ? Object.keys(PRIMITIVES) : [BASE]

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

function expectStyles(app, expected) {
  const css = readFileSync(path.join(app, "app/globals.css"), "utf8")
  for (const text of expected) {
    if (!css.includes(text)) {
      throw new Error(`app/globals.css is missing ${text}`)
    }
  }
}

function expectPrimitives(app, base) {
  const files = [
    "components/ui/dialog.tsx",
    ...TWINS[base].patterns.map((name) => `components/patterns/${name}.tsx`),
  ]
  for (const file of files) {
    if (!readFileSync(path.join(app, file), "utf8").includes(PRIMITIVES[base]))
      throw new Error(`${file} does not import ${PRIMITIVES[base]}`)
  }
}

async function check(label, app, base) {
  writeFileSync(path.join(app, "app/page.tsx"), page(base))
  if (
    !readFileSync(path.join(app, "next.config.ts"), "utf8").includes(
      "cacheComponents: true"
    )
  ) {
    throw new Error("The new app does not enable cacheComponents")
  }
  await run(`Type-check (${label})`, "npx", ["tsc", "--noEmit"], { cwd: app })
  await run(`Build (${label})`, "npx", ["next", "build"], { cwd: app })
}

const workspace = mkdtempSync(path.join(tmpdir(), "esuiss-compat-"))
const fresh = path.join(workspace, "next")
const output = path.join(workspace, "public")
const cleanup = () => rmSync(workspace, { recursive: true, force: true })
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
  const config = path.join(app, "components.json")
  const current = JSON.parse(readFileSync(config, "utf8"))
  console.log(`\n${base}: components.json style is ${current.style}`)
  writeFileSync(
    config,
    `${JSON.stringify(
      {
        ...current,
        iconLibrary: ICON_LIBRARY,
        registries: { "@esuiss": `${origin}/r/{style}/{name}.json` },
      },
      null,
      2
    )}\n`
  )
  await run(
    `Install ${ICON_PACKAGES[ICON_LIBRARY]} (${base})`,
    "npm",
    ["install", ICON_PACKAGES[ICON_LIBRARY]],
    { cwd: app }
  )
  await run(
    `Add items with the registry CLI (${base}, ${ICON_LIBRARY} icons)`,
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
  expectStyles(app, [
    "@keyframes theme-reveal",
    "oklch(0.5629 0.1933 256.16)",
    "@fontsource-variable/inter",
  ])
  expectPrimitives(app, base)
  await check(`registry CLI, ${base}`, app, base)
}

try {
  await run("Create a Next.js app", "npx", [
    "--yes",
    NEXT_APP,
    fresh,
    "--ts",
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
    const initialized = path.join(workspace, base)
    cpSync(fresh, initialized, { recursive: true, verbatimSymlinks: true })
    await run(
      `Initialize the registry CLI (${base})`,
      "npx",
      [
        "--yes",
        REGISTRY_CLI,
        "init",
        "--base",
        base,
        "--defaults",
        "--yes",
        "--no-monorepo",
      ],
      { cwd: initialized }
    )
    const cliApp = path.join(workspace, `${base}-cli`)
    const registryApp = path.join(workspace, `${base}-registry`)
    cpSync(initialized, cliApp, { recursive: true, verbatimSymlinks: true })
    cpSync(initialized, registryApp, {
      recursive: true,
      verbatimSymlinks: true,
    })
    rmSync(initialized, { recursive: true, force: true })

    await runCli(base, cliApp, env)
    rmSync(cliApp, { recursive: true, force: true })
    await runRegistry(base, registryApp, origin)
    rmSync(registryApp, { recursive: true, force: true })
  }

  console.log(
    `\nCompatible (${SELECTED.join(", ")}): the items install through both CLIs, type-check and build.`
  )
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  for (const server of servers) server.close()
  cleanup()
}
