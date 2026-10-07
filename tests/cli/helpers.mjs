import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { vi } from "vitest"

export function createProject(files) {
  const cwd = mkdtempSync(path.join(tmpdir(), "esuiss-cli-"))
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(cwd, file)
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(
      target,
      typeof content === "string" ? content : JSON.stringify(content, null, 2)
    )
  }
  return cwd
}

export function read(cwd, file) {
  return readFileSync(path.join(cwd, file), "utf8")
}

export function viteProject(extra = {}) {
  return createProject({
    "package.json": {
      dependencies: { react: "19.0.0", "react-dom": "19.0.0" },
      devDependencies: { vite: "7.0.0", tailwindcss: "4.2.0" },
    },
    "tsconfig.json": {
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    },
    "src/main.tsx": "",
    ...extra,
  })
}

export function serveRegistry(files) {
  const fetch = vi.fn((url) => {
    const file = Object.keys(files).find((name) => url.endsWith(`/${name}`))
    if (file === undefined) {
      return Promise.resolve(new Response("missing", { status: 404 }))
    }
    const body = files[file]
    return Promise.resolve(
      new Response(typeof body === "string" ? body : JSON.stringify(body), {
        status: 200,
      })
    )
  })
  vi.stubGlobal("fetch", fetch)
  return fetch
}

export function silenceOutput() {
  const log = vi.spyOn(console, "log").mockImplementation(() => undefined)
  return () => log.mock.calls.map((call) => call.join(" ")).join("\n")
}
