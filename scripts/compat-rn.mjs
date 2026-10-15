import { spawn } from "node:child_process"
import {
  cpSync,
  createReadStream,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

const EXPO_APP = "create-expo-app@5.0.0"
const EXPO_TEMPLATE = "blank-typescript@latest"
const REGISTRY_CLI = "shadcn@4.21.4"
const ROOT = path.resolve(import.meta.dirname, "..")
const MOBILE = path.join(ROOT, "packages/mobile")
const REGISTRY_BIN = path.join(
  ROOT,
  "apps/ui/node_modules/shadcn/dist/index.js"
)
const ITEMS = [
  "theme-suiss",
  "button",
  "dialog",
  "select",
  "switch",
  "primitives-portal",
]
const WEB_PACKAGES = ["react-dom", "react-native-web", "@expo/metro-runtime"]
const PRIMARY = "0.5629 0.1933 256.16"
const BUNDLED_PRIMARY = "color-primary:#0071e3"
const ENV = {
  ...Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) =>
        !(key.toLowerCase().startsWith("npm_") || key.startsWith("PNPM"))
    )
  ),
  CI: "1",
  EXPO_NO_TELEMETRY: "1",
}

const STYLINGS = {
  uniwind: {
    packages: ["uniwind", "tailwindcss"],
    css: "global.css",
    files: {
      "global.css": '@import "tailwindcss";\n@import "uniwind";\n',
      "css.d.ts": 'declare module "*.css"\n',
      "metro.config.js": `const { getDefaultConfig } = require("expo/metro-config")
const { withUniwindConfig } = require("uniwind/metro")

const config = getDefaultConfig(__dirname)

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./global.css",
  dtsFile: "./uniwind-types.d.ts",
})
`,
    },
  },
  nativewind: {
    packages: ["nativewind@^4.2.7", "react-native-css-interop@^0.2.7"],
    devPackages: ["tailwindcss@^3.4.17", "babel-preset-expo"],
    css: "global.css",
    config: "tailwind.config.js",
    files: {
      "global.css":
        "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
      "css.d.ts": 'declare module "*.css"\n',
      "nativewind-env.d.ts": '/// <reference types="nativewind/types" />\n',
      "tailwind.config.js": `module.exports = {
  content: ["./App.tsx", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
      "babel.config.js": `module.exports = (api) => {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  }
}
`,
      "metro.config.js": `const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: "./global.css" })
`,
    },
  },
  stylesheet: { packages: [], css: "", files: {} },
}

const SELECTED =
  process.argv
    .find((arg) => arg.startsWith("--styling="))
    ?.slice(10)
    .split(",") ?? Object.keys(STYLINGS)
for (const styling of SELECTED) {
  if (!(styling in STYLINGS)) throw new Error(`Unknown styling: ${styling}`)
}

const app = (
  styling
) => `${STYLINGS[styling].css ? 'import "./global.css"\n' : ""}import * as React from "react"
import { View } from "react-native"
import { PortalHost } from "@/components/primitives/portal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" },
]

export default function App() {
  const [fruit, setFruit] = React.useState<string | null>(null)
  const [checked, setChecked] = React.useState(false)
  return (
    <View style={{ flex: 1, gap: 16, padding: 24, justifyContent: "center" }}>
      <Button>
        <Text>Button</Text>
      </Button>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          <Text>Open</Text>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              <Text>Close</Text>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Select items={fruits} value={fruit} onValueChange={setFruit}>
        <SelectTrigger>
          <SelectValue placeholder="Fruit" />
        </SelectTrigger>
        <SelectContent>
          {fruits.map((item) => (
            <SelectItem key={item.value} value={item.value} label={item.label} />
          ))}
        </SelectContent>
      </Select>
      <Switch checked={checked} onCheckedChange={setChecked} />
      <PortalHost />
    </View>
  )
}
`

function components(origin, styling) {
  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: false,
    tsx: true,
    tailwind: {
      config: STYLINGS[styling].config ?? "",
      css: STYLINGS[styling].css,
      baseColor: "neutral",
      cssVariables: true,
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      hooks: "@/hooks",
    },
    registries: { "@esuiss-rn": `${origin}/r/rn-${styling}/{name}.json` },
  }
}

function serve(dir) {
  const server = createServer((request, response) => {
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
    response.writeHead(200, { "Content-Type": "application/json" })
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
    env: ENV,
  })
  return new Promise((resolve, reject) => {
    child.on("error", reject)
    child.on("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${label} failed with exit code ${code ?? signal}`))
    })
  })
}

function copy(from, to) {
  if (process.platform === "darwin") {
    return run(`Copy the app to ${path.basename(to)}`, "cp", ["-cR", from, to])
  }
  cpSync(from, to, { recursive: true, verbatimSymlinks: true })
  return Promise.resolve()
}

function expectFile(app, file, text) {
  const target = path.join(app, file)
  if (!existsSync(target)) throw new Error(`${file} was not written`)
  if (text && !readFileSync(target, "utf8").includes(text)) {
    throw new Error(`${file} is missing ${text}`)
  }
}

function expectBundledTheme(app) {
  const dir = path.join(app, "dist/_expo/static/css")
  const css = existsSync(dir)
    ? readdirSync(dir).map((file) => readFileSync(path.join(dir, file), "utf8"))
    : []
  if (!css.some((text) => text.includes(BUNDLED_PRIMARY))) {
    throw new Error("The web bundle does not carry the theme colors")
  }
}

async function check(styling, fresh, origin) {
  const dir = path.join(path.dirname(fresh), styling)
  await copy(fresh, dir)
  const setup = STYLINGS[styling]
  if (setup.packages.length) {
    await run(
      `Install ${setup.packages.join(", ")}`,
      "npx",
      ["expo", "install", ...setup.packages],
      { cwd: dir }
    )
  }
  if (setup.devPackages) {
    await run(
      `Install ${setup.devPackages.join(", ")}`,
      "npm",
      ["install", "--save-dev", ...setup.devPackages],
      { cwd: dir }
    )
  }
  for (const [file, content] of Object.entries(setup.files)) {
    writeFileSync(path.join(dir, file), content)
  }
  writeFileSync(
    path.join(dir, "components.json"),
    `${JSON.stringify(components(origin, styling), null, 2)}\n`
  )
  await run(
    `Add items with the registry CLI (${styling})`,
    "npx",
    [
      "--yes",
      REGISTRY_CLI,
      "add",
      ...ITEMS.map((name) => `@esuiss-rn/${name}`),
      "--yes",
      "--overwrite",
    ],
    { cwd: dir }
  )
  if (styling === "uniwind") {
    expectFile(dir, "theme-suiss.css", PRIMARY)
    expectFile(dir, "global.css", '@import "./theme-suiss.css"')
    await run(
      "Generate the Uniwind types",
      "npx",
      [
        "uniwind",
        "generate-artifacts",
        "--css",
        "./global.css",
        "--dts",
        "./uniwind-types.d.ts",
      ],
      { cwd: dir }
    )
  } else if (styling === "nativewind") {
    expectFile(dir, "global.css", "--primary")
    expectFile(dir, "tailwind.config.js", "primary-foreground")
  } else {
    expectFile(dir, "components/ui/theme.ts", "useTheme")
  }
  for (const file of [
    "components/ui/button.tsx",
    "components/ui/dialog.tsx",
    "components/primitives/portal.tsx",
  ]) {
    expectFile(dir, file)
  }
  writeFileSync(path.join(dir, "App.tsx"), app(styling))
  await run(`Type-check (${styling})`, "npx", ["tsc", "--noEmit"], {
    cwd: dir,
  })
  await run(
    `Bundle for the web (${styling})`,
    "npx",
    ["expo", "export", "--platform", "web", "--output-dir", "dist"],
    { cwd: dir }
  )
  if (styling === "uniwind") expectBundledTheme(dir)
  rmSync(dir, { recursive: true, force: true })
}

const workspace = mkdtempSync(path.join(tmpdir(), "esuiss-compat-rn-"))
const cleanup = () => rmSync(workspace, { recursive: true, force: true })
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    cleanup()
    process.exit(1)
  })
}

let server
try {
  const output = path.join(workspace, "public")
  for (const styling of SELECTED) {
    await run(
      `Build the registry (${styling})`,
      "node",
      [
        REGISTRY_BIN,
        "build",
        `registry/${styling}/registry.json`,
        "--output",
        path.join(output, "r", `rn-${styling}`),
      ],
      { cwd: MOBILE }
    )
  }
  server = await serve(output)
  const origin = `http://127.0.0.1:${server.address().port}`

  const fresh = path.join(workspace, "starter")
  await run("Create an Expo app", "npx", [
    "--yes",
    EXPO_APP,
    fresh,
    "--template",
    EXPO_TEMPLATE,
    "--yes",
  ])
  writeFileSync(
    path.join(fresh, "tsconfig.json"),
    `${JSON.stringify(
      {
        extends: "expo/tsconfig.base",
        compilerOptions: { strict: true, paths: { "@/*": ["./*"] } },
      },
      null,
      2
    )}\n`
  )
  await run(
    "Install the web runtime",
    "npx",
    ["expo", "install", ...WEB_PACKAGES],
    {
      cwd: fresh,
    }
  )

  for (const styling of SELECTED) await check(styling, fresh, origin)

  console.log(
    `\nCompatible (${SELECTED.join(", ")}): the items install through the registry CLI, type-check and bundle.`
  )
} catch (error) {
  console.error(`\n${error.message}`)
  process.exitCode = 1
} finally {
  server?.close()
  cleanup()
}
