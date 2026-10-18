import { spawnSync } from "node:child_process"
import { mkdirSync, symlinkSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { withIcons } from "../lib/mobile/icons.mjs"
import { install as installMobile } from "../lib/mobile/project.mjs"
import { printable } from "../lib/output.mjs"
import { install } from "../lib/project.mjs"
import { checkCss, checkStylesheet } from "../lib/registry.mjs"
import { targetFor } from "../lib/shared/files.mjs"
import { serveRegistry, silenceOutput, temporaryDirectory } from "./helpers.mjs"

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const VERSION_PATH = /\/v\d+\.\d+\.\d+\//
const TAG_NOTE = /Using the v\d+\.\d+\.\d+ registry\./

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe("targetFor", () => {
  const root = path.resolve("/project/src")

  it.each([
    "../escape.tsx",
    "components/../../escape.tsx",
    "/etc/passwd.tsx",
    "C:\\Users\\me\\escape.tsx",
    "components\\..\\..\\escape.tsx",
  ])("refuses %s outside the project", (file) => {
    expect(() => targetFor(root, file)).toThrow(
      `Refusing to write ${file} outside the project.`
    )
  })

  it.each([
    ".vscode/tasks.json",
    ".github/workflows/ci.yml",
    ".husky/pre-commit",
    "components/.git/hooks/post-checkout.ts",
    "components/ui/.npmrc",
    "next.config.js",
    "postcss.config.mjs",
    "components/ui/tailwind.config.ts",
    "app/page.tsx",
    "components/ui/button.sh",
    "components/ui/but ton.tsx",
    "components//button.tsx",
    "components/%2e%2e/button.tsx",
  ])("refuses %s outside the component folders", (file) => {
    expect(() => targetFor(root, file)).toThrow(`Refusing to write ${file}.`)
  })

  it.each([
    "components/ui/button.tsx",
    "components/charts/area-chart.tsx",
    "hooks/use-mobile.ts",
    "lib/utils.ts",
  ])("accepts %s", (file) => {
    expect(targetFor(root, file)).toBe(path.join(root, file))
  })

  it("keeps native files to their own language", () => {
    expect(targetFor(root, "Components/Button.swift", "swift")).toBe(
      path.join(root, "Components", "Button.swift")
    )
    expect(targetFor(root, "icons/bold/Bold.kt", "kotlin")).toBe(
      path.join(root, "icons", "bold", "Bold.kt")
    )
    expect(() => targetFor(root, "Package.swift", "swift")).toThrow(
      "Refusing to write Package.swift."
    )
    expect(() => targetFor(root, "build.gradle.kts", "kotlin")).toThrow(
      "Refusing to write build.gradle.kts."
    )
    expect(() => targetFor(root, "Components/Button.kt", "swift")).toThrow(
      "Refusing to write Components/Button.kt."
    )
  })

  it("refuses a folder that links outside the project", () => {
    const cwd = temporaryDirectory("esuiss-link-")
    const outside = temporaryDirectory("esuiss-outside-")
    mkdirSync(path.join(cwd, "components"))
    symlinkSync(outside, path.join(cwd, "components", "ui"))
    expect(() => targetFor(cwd, "components/ui/button.tsx")).toThrow(
      "Refusing to write components/ui/button.tsx outside the project."
    )
  })

  it("refuses a broken link in place of a file", () => {
    const cwd = temporaryDirectory("esuiss-link-")
    mkdirSync(path.join(cwd, "lib"))
    symlinkSync(
      path.join(temporaryDirectory("esuiss-outside-"), "missing.ts"),
      path.join(cwd, "lib", "utils.ts")
    )
    expect(() => targetFor(cwd, "lib/utils.ts")).toThrow(
      "Refusing to write lib/utils.ts through a broken link."
    )
  })
})

describe("native icon files from the registry", () => {
  const swiftFile = {
    target: "/project/EsuissUI/Components/Button.swift",
    content: "import PhosphorSwift\nPh.check\n",
  }
  const registryWith = (swift) => ({
    icons: { lucide: { swift, kotlin: [], dependencies: [] } },
  })
  const fetchText = vi.fn(async () => "struct Pwned {}\n")

  it.each([
    "icons/swift/lucide/../../../ESCAPED-pwned.swift",
    "icons/swift/lucide//Users/me/ABS-pwned.swift",
    "icons/swift/lucide/C:\\Users\\me\\ABS-pwned.swift",
  ])("refuses %s outside the project", async (source) => {
    const root = temporaryDirectory("esuiss-icons-")
    await expect(
      withIcons(
        {
          platform: "swift",
          root,
          registry: registryWith([source]),
          library: "lucide",
          fetchText,
        },
        [swiftFile]
      )
    ).rejects.toThrow("Refusing to write")
    expect(fetchText).not.toHaveBeenCalled()
  })

  it("refuses icon files that skip the library prefix", async () => {
    await expect(
      withIcons(
        {
          platform: "swift",
          root: temporaryDirectory("esuiss-icons-"),
          registry: registryWith(["elsewhere/EsuissIcons.swift"]),
          library: "lucide",
          fetchText,
        },
        [swiftFile]
      )
    ).rejects.toThrow(
      "The registry lists elsewhere/EsuissIcons.swift as a lucide icon file outside icons/swift/lucide/."
    )
  })

  it("places valid icon files inside the folder", async () => {
    const root = temporaryDirectory("esuiss-icons-")
    const files = await withIcons(
      {
        platform: "swift",
        root,
        registry: registryWith(["icons/swift/lucide/Icons/EsuissIcons.swift"]),
        library: "lucide",
        fetchText,
      },
      [swiftFile]
    )
    expect(files.at(-1).target).toBe(
      path.join(root, "Icons", "EsuissIcons.swift")
    )
  })
})

describe("package names from the registry", () => {
  const project = (framework = "next") => ({
    cwd: "/project",
    framework,
    packageManager: "npm",
    packages: {},
  })

  beforeEach(() => {
    vi.mocked(spawnSync).mockClear()
  })

  it.each(["--global", "-g", "--prefix=/tmp", "@-scope/name", ".hidden"])(
    "refuses %s",
    (name) => {
      expect(() => install(project(), [name])).toThrow(
        `Refusing to install an invalid package name: ${name}`
      )
      expect(spawnSync).not.toHaveBeenCalled()
    }
  )

  it.each(["left-pad@file:../evil", "left-pad@https://evil.test/x.tgz"])(
    "refuses the spec %s",
    (spec) => {
      expect(() => installMobile(project("react-native"), [spec])).toThrow(
        `Refusing to install an invalid package spec: ${spec}`
      )
      expect(spawnSync).not.toHaveBeenCalled()
    }
  )

  it("ends the options before the package names", () => {
    install(project(), ["left-pad"])
    expect(spawnSync).toHaveBeenCalledWith(
      "npm",
      ["install", "--", "left-pad"],
      expect.anything()
    )
  })
})

describe("registry styles", () => {
  it.each([
    { '@import url("https://attacker.example/steal.css")': {} },
    { '@import "https://attacker.example/steal.css"': {} },
    { "@import '//attacker.example/steal.css'": {} },
    { "@font-face": { src: "url(https://attacker.example/x.woff2)" } },
    { ".a": { background: "url(//attacker.example/x.png)" } },
    { ".a": { background: 'image-set("https://attacker.example/x.png" 1x)' } },
    { ".a": { color: "red} body { color: blue" } },
    { "@namespace svg": {} },
  ])("refuses %j", (css) => {
    expect(() => checkCss({ name: "evil", css })).toThrow(
      "Refusing the styles of evil"
    )
  })

  it("keeps package imports, keyframes and inline data images", () => {
    expect(() =>
      checkCss({
        name: "theme",
        css: {
          '@import "@fontsource-variable/inter"': {},
          "@keyframes spin": { to: { rotate: "1turn" } },
          ".mask": {
            mask: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"/>') center",
          },
        },
      })
    ).not.toThrow()
  })

  it("refuses a base stylesheet that loads remote files", () => {
    expect(() =>
      checkStylesheet(
        '@import "tailwindcss";\n@import url(https://attacker.example/x.css);\n',
        "styles/globals.css"
      )
    ).toThrow(
      "Refusing styles/globals.css: it loads files from outside the project."
    )
    expect(
      checkStylesheet('@import "tailwindcss";\n', "styles/globals.css")
    ).toBe('@import "tailwindcss";\n')
  })
})

describe("registry location", () => {
  function freshRegistry() {
    vi.resetModules()
    return import("../lib/registry.mjs")
  }

  it.each([
    "http://registry.example/web",
    "ftp://registry.example/web",
    "not a url",
  ])("refuses the override %s", async (override) => {
    vi.stubEnv("ESUISS_REGISTRY", override)
    const fetch = serveRegistry({})
    const { fetchText } = await freshRegistry()
    await expect(fetchText("a.tsx")).rejects.toThrow("ESUISS_REGISTRY must")
    expect(fetch).not.toHaveBeenCalled()
  })

  it.each([
    "http://localhost:4000/web",
    "http://127.0.0.1:4000/web",
    "https://registry.example/web",
  ])("accepts the override %s", async (override) => {
    silenceOutput()
    vi.stubEnv("ESUISS_REGISTRY", override)
    const fetch = serveRegistry({ "a.tsx": "export {}" })
    const { fetchText } = await freshRegistry()
    await expect(fetchText("a.tsx")).resolves.toBe("export {}")
    expect(fetch.mock.calls[0][0]).toBe(`${override}/a.tsx`)
  })

  it("stays on the release tag once it answered", async () => {
    const output = silenceOutput()
    const fetch = serveRegistry({ "a.tsx": "export {}" })
    const { fetchText } = await freshRegistry()
    await fetchText("a.tsx")
    await expect(fetchText("b.tsx")).rejects.toThrow(
      "Could not download b.tsx (HTTP 404)."
    )
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch.mock.calls.every(([url]) => VERSION_PATH.test(url))).toBe(true)
    expect(output()).toMatch(TAG_NOTE)
  })

  it("names main when the release tag is not published", async () => {
    const output = silenceOutput()
    serveRegistry({})
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url) =>
        VERSION_PATH.test(url)
          ? new Response("missing", { status: 404 })
          : new Response("export {}", { status: 200 })
      )
    )
    const { fetchText } = await freshRegistry()
    await fetchText("a.tsx")
    expect(output()).toContain("Using the registry from main, because v")
  })

  it("refuses registry sources that leave the registry", async () => {
    const fetch = serveRegistry({})
    const { fetchText } = await freshRegistry()
    for (const file of [
      "../secret",
      "/etc/passwd",
      "https://evil.test/x",
      "a/%2e%2e/b",
    ]) {
      await expect(fetchText(file)).rejects.toThrow(
        `Refusing to download ${file} from the registry.`
      )
    }
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe("terminal output", () => {
  it("drops control characters from registry strings", () => {
    expect(
      printable("button\u001b]8;;https://evil.test\u0007x\u001b[2J\r.tsx")
    ).toBe("button]8;;https://evil.testx[2J.tsx")
    expect(printable("a\tb\nc")).toBe("a\tb\nc")
  })
})
