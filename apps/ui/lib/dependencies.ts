import { readFile } from "node:fs/promises"
import path from "node:path"
import { DEFAULT_BASE, PRIMITIVE_BASES } from "@/lib/code-options"
import { source } from "@/lib/source"
import { strings } from "@/lib/strings"

export type Swap<T> = { from: string[]; bases: Record<string, T[]> }

export type Piece = { name: string; title?: string; href?: string }

export type BaseItems = {
  packages?: Swap<string>
  pieces?: Swap<Piece> & { step?: number }
}

const registryRoot = path.join(process.cwd(), "../../packages/web/registry")

const registryFile = (base: string) =>
  path.join(registryRoot, base === DEFAULT_BASE ? "" : base, "registry.json")

type Item = {
  name: string
  dependencies?: string[]
  registryDependencies?: string[]
}

type Entry = { packages: string[]; pieces: string[] }

async function registryMap(base: string) {
  "use cache"
  const { items } = JSON.parse(await readFile(registryFile(base), "utf8")) as {
    items: Item[]
  }
  return Object.fromEntries(
    items.map((item) => [
      item.name,
      {
        packages: item.dependencies ?? [],
        pieces: item.registryDependencies ?? [],
      },
    ])
  ) as Record<string, Entry>
}

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && a.every((name) => b.includes(name))

const ITEM_PREFIX = "@esuiss/"
const PIECE_SECTIONS = new Set(["components", "patterns"])

const pieceNames = (pieces: string[]) =>
  pieces
    .filter((piece) => piece.startsWith(ITEM_PREFIX))
    .map((piece) => piece.slice(ITEM_PREFIX.length))

function piece(name: string): Piece {
  const page = source
    .getPages()
    .find(
      (entry) =>
        entry.slugs.length === 2 &&
        PIECE_SECTIONS.has(entry.slugs[0] ?? "") &&
        entry.slugs[1] === name
    )
  return page ? { name, title: page.data.title, href: page.url } : { name }
}

async function piecesStep(text: () => Promise<string>) {
  const match = (await text()).match(
    new RegExp(`^(\\d+)\\. ${strings.piecesLead}`, "m")
  )
  return match ? Number(match[1]) : undefined
}

export async function baseItems(
  item: string,
  text: () => Promise<string>
): Promise<BaseItems | undefined> {
  const own = (await registryMap(DEFAULT_BASE))[item]
  if (!own) return undefined
  const packages: Record<string, string[]> = {}
  const pieces: Record<string, Piece[]> = {}
  for (const base of PRIMITIVE_BASES) {
    const entry = (await registryMap(base))[item]
    if (!entry) continue
    if (!sameSet(entry.packages, own.packages)) packages[base] = entry.packages
    if (!sameSet(entry.pieces, own.pieces))
      pieces[base] = pieceNames(entry.pieces).map(piece)
  }
  const result: BaseItems = {
    ...(Object.keys(packages).length > 0 && {
      packages: { from: own.packages, bases: packages },
    }),
    ...(Object.keys(pieces).length > 0 && {
      pieces: {
        from: pieceNames(own.pieces),
        bases: pieces,
        step: await piecesStep(text),
      },
    }),
  }
  return result.packages || result.pieces ? result : undefined
}
