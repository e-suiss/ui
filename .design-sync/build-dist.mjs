import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const pkgDir = join(root, ".design-sync", ".cache", "pkg")
const dist = join(pkgDir, "dist")
const vite = createRequire(join(root, "package.json")).resolve("vite")
const esbuild = createRequire(vite)("esbuild")

const rootPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const components = readdirSync(join(root, "components", "ui"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => file.slice(0, -4))
  .sort()

rmSync(pkgDir, { recursive: true, force: true })
mkdirSync(dist, { recursive: true })

writeFileSync(
  join(pkgDir, "package.json"),
  `${JSON.stringify(
    {
      name: "esuiss-ui",
      version: rootPkg.version,
      type: "module",
      module: "dist/index.js",
      types: "dist/index.d.ts",
      dependencies: rootPkg.dependencies,
    },
    null,
    2
  )}\n`
)

const entry = components
  .map((name) => `export * from "@/components/ui/${name}"`)
  .join("\n")

await esbuild.build({
  stdin: { contents: entry, resolveDir: root, loader: "ts" },
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2020",
  jsx: "automatic",
  packages: "external",
  tsconfig: join(root, "tsconfig.json"),
  outfile: join(dist, "index.js"),
  logLevel: "warning",
})

const tsconfig = join(pkgDir, "tsconfig.dts.json")
writeFileSync(
  tsconfig,
  JSON.stringify({
    extends: join(root, "tsconfig.json"),
    compilerOptions: {
      noEmit: false,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: dist,
      rootDir: root,
      baseUrl: root,
    },
    include: [
      join(root, "components", "ui", "*.tsx"),
      join(root, "hooks", "*.ts"),
    ],
  })
)
try {
  execFileSync(join(root, "node_modules", ".bin", "tsc"), ["-p", tsconfig], {
    stdio: "pipe",
  })
} catch (error) {
  const output = String(error.stdout ?? "")
  const blocking = output
    .split("\n")
    .filter(
      (line) => TYPE_ERROR.test(line) && !UNNAMED_EXPORT_TYPE_ERROR.test(line)
    )
  if (blocking.length) {
    console.error(blocking.join("\n"))
    process.exit(1)
  }
}
rmSync(tsconfig)

const TYPE_ERROR = /error TS/
const UNNAMED_EXPORT_TYPE_ERROR = /TS4058/

function rewriteAliases(dir) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, item.name)
    if (item.isDirectory()) {
      rewriteAliases(file)
      continue
    }
    if (!item.name.endsWith(".d.ts")) continue
    const text = readFileSync(file, "utf8").replace(
      /from "@\/([^"]+)"/g,
      (_, target) => {
        let path = relative(dirname(file), join(dist, target))
        if (!path.startsWith(".")) path = `./${path}`
        return `from "${path}"`
      }
    )
    writeFileSync(file, text)
  }
}
rewriteAliases(dist)

writeFileSync(
  join(dist, "index.d.ts"),
  `${components.map((name) => `export * from "./components/ui/${name}";`).join("\n")}\n`
)

if (!existsSync(join(dist, "components", "ui", "button.d.ts"))) {
  console.error("type declarations were not emitted")
  process.exit(1)
}
console.log(
  `built ${components.length} components into ${relative(root, dist)}`
)
