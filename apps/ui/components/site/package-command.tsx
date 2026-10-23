"use client"

import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import * as React from "react"
import { useBaseItems } from "@/components/site/base-items"
import { useCodeOptions } from "@/components/site/code-options"
import { CodeScroll } from "@/components/site/code-scroll"
import { copyText } from "@/lib/clipboard"
import {
  DEFAULT_STYLE,
  ICON_PACKAGES,
  type IconLibrary,
  type StyleName,
} from "@/lib/code-options"
import type { Swap } from "@/lib/dependencies"
import {
  type PackageManager as Manager,
  PACKAGE_MANAGERS as managers,
} from "@/lib/package-managers"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

const RESET_AFTER = 1500
const STORAGE_KEY = "package-manager"
const CHANGE_EVENT = "package-manager-change"

const NPX = /^npx\s+(?!expo\s)/
const NPM_INSTALL = /^npm\s+(?:install|i)(?=\s|$)/
const SAVE_DEV = /\s--save-dev\b/
const SUISS_INIT = /^npx\s+@esuiss\/ui@latest\s+init\b/
const KEEPS_STYLE = /\s--(?:platform|preset|style)\b/

function withBase(
  line: string,
  base: string,
  packages: Swap<string> | undefined
) {
  const own = packages?.bases[base]
  if (!packages || !own || !NPM_INSTALL.test(line)) return line
  const words = line.replace(NPM_INSTALL, "").trim().split(" ")
  const flags = words.filter((word) => word.startsWith("-"))
  const names = words.filter((word) => !word.startsWith("-"))
  const icons = names.filter((name) => name === ICON_PACKAGES.phosphor)
  const rest = names.filter((name) => name !== ICON_PACKAGES.phosphor)
  const matches =
    rest.length === packages.from.length &&
    rest.every((name) => packages.from.includes(name))
  if (!matches) return line
  return ["npm install", ...own, ...icons, ...flags].join(" ")
}

function withStyle(line: string, style: StyleName) {
  if (style === DEFAULT_STYLE || !SUISS_INIT.test(line)) return line
  if (KEEPS_STYLE.test(line)) return line
  return `${line} --style ${style}`
}

function withIcons(line: string, icons: IconLibrary) {
  if (!NPM_INSTALL.test(line)) return line
  return line
    .split(" ")
    .map((word) =>
      word === ICON_PACKAGES.phosphor ? ICON_PACKAGES[icons] : word
    )
    .join(" ")
}

function convertLine(line: string, manager: Manager) {
  if (manager === "npm") return line
  if (NPX.test(line)) {
    const rest = line.replace(NPX, "")
    return {
      pnpm: `pnpm dlx ${rest}`,
      yarn: `yarn dlx ${rest}`,
      bun: `bunx --bun ${rest}`,
    }[manager]
  }
  if (NPM_INSTALL.test(line)) {
    const rest = line.replace(NPM_INSTALL, "").replace(SAVE_DEV, " -D")
    return {
      pnpm: `pnpm add${rest}`,
      yarn: `yarn add${rest}`,
      bun: `bun add${rest}`,
    }[manager]
  }
  return line
}

const hasPackages = (line: string) =>
  !NPM_INSTALL.test(line) ||
  line
    .replace(NPM_INSTALL, "")
    .trim()
    .split(" ")
    .some((word) => word && !word.startsWith("-"))

export function usePackageLines(command: string) {
  const { icons, base, style } = useCodeOptions()
  const { packages } = useBaseItems()
  return command
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      withStyle(withIcons(withBase(line, base, packages), icons), style)
    )
    .filter(hasPackages)
}

export function isPackageCommand(text: string) {
  return text
    .split("\n")
    .some((line) => NPX.test(line.trim()) || NPM_INSTALL.test(line.trim()))
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStored(value: Manager) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
    return true
  } catch {
    return false
  }
}

export function usePackageManager() {
  const [manager, setManager] = React.useState<Manager>("pnpm")

  React.useEffect(() => {
    const read = () => {
      const stored = readStored()
      if (managers.includes(stored as Manager)) setManager(stored as Manager)
    }
    read()
    window.addEventListener(CHANGE_EVENT, read)
    window.addEventListener("storage", read)
    return () => {
      window.removeEventListener(CHANGE_EVENT, read)
      window.removeEventListener("storage", read)
    }
  }, [])

  const choose = (next: Manager) => {
    setManager(next)
    writeStored(next)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return [manager, choose] as const
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <button
      type="button"
      aria-label={copied ? strings.copied : strings.copy}
      onClick={() => {
        copyText(text).then(
          () => setCopied(true),
          () => undefined
        )
      }}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background outline-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)] hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {copied ? (
        <CheckIcon className="size-4" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </button>
  )
}

function Line({ line }: { line: string }) {
  const [tool, ...rest] = line.split(" ")
  return (
    <span className="block">
      <span className="text-muted-foreground select-none">$ </span>
      <span className="text-foreground">{tool}</span>
      {rest.length > 0 && (
        <span className="text-foreground/70"> {rest.join(" ")}</span>
      )}
    </span>
  )
}

export function PackageCommand({ command }: { command: string }) {
  const [manager, choose] = usePackageManager()
  const lines = usePackageLines(command).map((line) =>
    convertLine(line, manager)
  )
  if (lines.length === 0) return null

  return (
    <figure
      data-slot="code-block"
      className="mt-[1em] grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-y border-foreground/12 py-3 sm:grid-cols-[auto_1fr_auto]"
    >
      <div
        role="radiogroup"
        aria-label="Package manager"
        className="flex flex-wrap gap-x-4 gap-y-1 sm:w-20 sm:flex-col sm:gap-0"
      >
        {managers.map((item) => {
          const active = item === manager
          return (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(item)}
              className={cn(
                "flex cursor-pointer items-center gap-2 py-0.5 font-mono text-[11px] tracking-[0.02em] uppercase outline-none transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-ring/50",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "h-[1.5px] shrink-0 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)]",
                  active ? "w-4 bg-foreground" : "w-2 bg-foreground/30"
                )}
              />
              {item}
            </button>
          )
        })}
      </div>
      <CodeScroll
        className="col-span-2 row-start-2 self-stretch sm:col-span-1 sm:row-start-auto sm:border-s sm:border-foreground/10"
        viewportClassName="h-full"
      >
        <pre className="h-full w-max min-w-full pb-2 font-mono text-[15px] leading-[1.6] tracking-[-0.03em] sm:ps-6 sm:text-[16px]">
          <code className="flex h-full flex-col justify-center">
            {lines.map((line, index) => (
              <Line key={index} line={line} />
            ))}
          </code>
        </pre>
      </CodeScroll>
      <div className="col-start-2 row-start-1 sm:col-start-3">
        <CopyButton text={lines.join("\n")} />
      </div>
    </figure>
  )
}
