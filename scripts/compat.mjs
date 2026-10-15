import { spawn } from "node:child_process"
import {
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
const CHARTS = ["area-chart-default"]
const BLOCKS = ["login-account"]

const PAGE = `"use client"

import { AreaChartDefault } from "@/components/charts/area-chart-default"
import { LoginAccount } from "@/components/blocks/login-account"
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

function serve(dir) {
  const server = createServer((request, response) => {
    const file = path.join(
      dir,
      decodeURIComponent(new URL(request.url, "http://localhost").pathname)
    )
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

const workspace = mkdtempSync(path.join(tmpdir(), "esuiss-compat-"))
const app = path.join(workspace, "app")
const cleanup = () => rmSync(workspace, { recursive: true, force: true })
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    cleanup()
    process.exit(1)
  })
}

let server
try {
  await run("Create a Next.js app", "npx", [
    "--yes",
    NEXT_APP,
    app,
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
    { cwd: app }
  )

  server = await serve(WEB)
  const registry = `http://127.0.0.1:${server.address().port}`
  const env = { ESUISS_REGISTRY: registry }
  await run(
    "Add components",
    "node",
    [CLI, "add", ...COMPONENTS, "--yes", "--overwrite", "--cwd", app],
    { env }
  )
  await run(
    "Add charts",
    "node",
    [CLI, "add", "charts", ...CHARTS, "--yes", "--cwd", app],
    { env }
  )
  await run(
    "Add blocks",
    "node",
    [CLI, "add", "blocks", ...BLOCKS, "--yes", "--cwd", app],
    { env }
  )
  server.close()
  server = undefined

  const css = readFileSync(path.join(app, "app/globals.css"), "utf8")
  if (!css.includes("@keyframes theme-reveal")) {
    throw new Error("The theme styles were not added to app/globals.css")
  }

  writeFileSync(path.join(app, "app/page.tsx"), PAGE)
  await run("Type-check", "npx", ["tsc", "--noEmit"], { cwd: app })
  await run("Build", "npx", ["next", "build"], { cwd: app })
  console.log("\nCompatible: the components install, type-check and build.")
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  server?.close()
  cleanup()
}
