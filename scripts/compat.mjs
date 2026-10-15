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
const REGISTRY_ITEMS = [
  ...COMPONENTS,
  ...PATTERNS,
  ...CHARTS,
  ...BLOCKS,
  THEME,
].map((name) => `@esuiss/${name}`)

const PAGE = `"use client"

import { AreaChartDefault } from "@/components/charts/area-chart-default"
import { LoginAccount } from "@/components/blocks/login-account"
import { DatePicker } from "@/components/patterns/date-picker"
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
            <DialogTrigger render={<Button variant="outline" />}>
              Open
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Title</DialogTitle>
                <DialogDescription>Description</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Select>
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
          <Tabs defaultValue="one">
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one">One</TabsContent>
            <TabsContent value="two">Two</TabsContent>
          </Tabs>
          <AreaChartDefault />
          <LoginAccount />
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

const STYLED_ITEM = /^\/r\/[^/]+\/([^/]+)$/

function serve(dir) {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    ).replace(STYLED_ITEM, "/r/$1")
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

async function check(label, app) {
  writeFileSync(path.join(app, "app/page.tsx"), PAGE)
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
const base = path.join(workspace, "base")
const cliApp = path.join(workspace, "cli")
const registryApp = path.join(workspace, "registry")
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

try {
  await run("Create a Next.js app", "npx", [
    "--yes",
    NEXT_APP,
    base,
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
  await run(
    "Initialize the registry CLI for Base UI",
    "npx",
    [
      "--yes",
      REGISTRY_CLI,
      "init",
      "--base",
      "base",
      "--defaults",
      "--yes",
      "--no-monorepo",
    ],
    { cwd: base }
  )
  cpSync(base, cliApp, { recursive: true, verbatimSymlinks: true })
  cpSync(base, registryApp, { recursive: true, verbatimSymlinks: true })
  rmSync(base, { recursive: true, force: true })

  const env = { ESUISS_REGISTRY: await serveDirectory(WEB) }
  await run(
    "Add components with the suiss/ui CLI",
    "node",
    [CLI, "add", ...COMPONENTS, "--yes", "--overwrite", "--cwd", cliApp],
    { env }
  )
  for (const [scope, names] of [
    ["patterns", PATTERNS],
    ["charts", CHARTS],
    ["blocks", BLOCKS],
  ]) {
    await run(
      `Add ${scope} with the suiss/ui CLI`,
      "node",
      [CLI, "add", scope, ...names, "--yes", "--cwd", cliApp],
      { env }
    )
  }
  expectStyles(cliApp, ["@keyframes theme-reveal"])
  await check("suiss/ui CLI", cliApp)

  await run(
    "Build the registry",
    "node",
    [
      REGISTRY_BIN,
      "build",
      "registry/registry.json",
      "--output",
      path.join(output, "r"),
    ],
    { cwd: WEB }
  )
  const origin = await serveDirectory(output)
  const config = path.join(registryApp, "components.json")
  writeFileSync(
    config,
    `${JSON.stringify(
      {
        ...JSON.parse(readFileSync(config, "utf8")),
        iconLibrary: ICON_LIBRARY,
        registries: { "@esuiss": `${origin}/r/{style}/{name}.json` },
      },
      null,
      2
    )}\n`
  )
  await run(
    `Install ${ICON_PACKAGES[ICON_LIBRARY]}`,
    "npm",
    ["install", ICON_PACKAGES[ICON_LIBRARY]],
    { cwd: registryApp }
  )
  await run(
    `Add items with the registry CLI (${ICON_LIBRARY} icons)`,
    "npx",
    ["--yes", REGISTRY_CLI, "add", ...REGISTRY_ITEMS, "--yes", "--overwrite"],
    { cwd: registryApp }
  )
  expectStyles(registryApp, [
    "@keyframes theme-reveal",
    "oklch(0.5629 0.1933 256.16)",
    "@fontsource-variable/inter",
  ])
  await check("registry CLI", registryApp)

  console.log(
    "\nCompatible: the items install through both CLIs, type-check and build."
  )
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  for (const server of servers) server.close()
  cleanup()
}
