import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { scopedBiome } from "./theme.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const REPO = path.join(ROOT, "../..")
const MODULES = path.join(ROOT, "node_modules")
const MAP = "icons/map.json"
const SOURCES = {
  rn: ["uniwind", "stylesheet", "examples"],
  swift: ["swiftui"],
  kotlin: ["kotlin"],
}
const RN_IMPORT =
  /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*"phosphor-react-native"/g
const SWIFT_ICON = /\bPh\.([a-zA-Z0-9]+)\./g
const KOTLIN_ICON =
  /import com\.adamglin\.phosphoricons\.(?:regular|bold|fill|duotone|light|thin)\.([A-Za-z0-9]+)/g
const NUMBER_BOUNDARY = /([a-z])(\d)/g
const CAPITALS = /([A-Z])([A-Z][a-z])/g
const WORD_BOUNDARY = /([a-z\d])([A-Z])/g
const ICON_SUFFIX = /Icon$/
const TABLER_PREFIX = /^Icon/
const REMIX_PREFIX = /^Ri/
const LINE_SUFFIX = /-line$/
const SCALE_BLOCK = /\nconst SCALE[\s\S]*?\n}\n/
const NUMBER = /-?(?:\d*\.\d+|\d+\.?)(?:e[-+]?\d+)?/gi

export const ICON_LIBRARIES = ["lucide", "tabler", "hugeicons", "remixicon"]
export const DEFAULT_ICON_LIBRARY = "phosphor"

const LIBRARY = {
  lucide: {
    title: "Lucide",
    width: 2,
    rn: ["lucide-react-native"],
  },
  tabler: {
    title: "Tabler",
    width: 2,
    rn: ["@tabler/icons-react-native"],
  },
  hugeicons: {
    title: "Hugeicons",
    width: 1.5,
    rn: ["@hugeicons/react-native", "@hugeicons/core-free-icons"],
  },
  remixicon: {
    title: "Remix",
    width: 0,
    rn: ["react-native-svg"],
  },
}

export function iconFiles(library) {
  return {
    rn: `icons/rn/${library}.tsx`,
    swift: [`icons/swift/${library}/Icons/EsuissIcons.swift`],
    kotlin: [
      `icons/kotlin/${library}/icons/EsuissIcons.kt`,
      ...WEIGHTS.map(
        (weight) =>
          `icons/kotlin/${library}/icons/${weight.toLowerCase()}/${weight}.kt`
      ),
    ],
  }
}

export function iconLibraries() {
  return Object.fromEntries(
    ICON_LIBRARIES.map((library) => [
      library,
      { ...iconFiles(library), dependencies: LIBRARY[library].rn },
    ])
  )
}

const WEIGHTS = ["Thin", "Light", "Regular", "Bold", "Fill", "Duotone"]

const kebab = (name) =>
  name
    .replace(CAPITALS, "$1-$2")
    .replace(WORD_BOUNDARY, "$1-$2")
    .replace(NUMBER_BOUNDARY, "$1-$2")
    .toLowerCase()

const SWIFT_KEYWORDS = new Set([
  "case",
  "default",
  "import",
  "package",
  "repeat",
  "return",
  "switch",
  "where",
])
const lowerFirst = (name) => name[0].toLowerCase() + name.slice(1)
const swiftCase = (name) => {
  const key = lowerFirst(name)
  return SWIFT_KEYWORDS.has(key) ? `\`${key}\`` : key
}

function walk(dir, extensions) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === "build") return []
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(file, extensions)
    return extensions.some((extension) => entry.name.endsWith(extension))
      ? [file]
      : []
  })
}

export function usedIcons() {
  const names = new Set()
  for (const dir of SOURCES.rn) {
    for (const file of walk(path.join(ROOT, dir), [".tsx", ".ts"])) {
      for (const match of readFileSync(file, "utf8").matchAll(RN_IMPORT)) {
        for (const part of match[1].split(",")) {
          const name = part.replace("type ", "").split(" as ")[0].trim()
          if (name.endsWith("Icon") && name !== "Icon") {
            names.add(name.replace(ICON_SUFFIX, ""))
          }
        }
      }
    }
  }
  for (const file of walk(path.join(ROOT, "swiftui"), [".swift"])) {
    for (const match of readFileSync(file, "utf8").matchAll(SWIFT_ICON)) {
      names.add(match[1][0].toUpperCase() + match[1].slice(1))
    }
  }
  for (const file of walk(path.join(ROOT, "kotlin"), [".kt"])) {
    for (const match of readFileSync(file, "utf8").matchAll(KOTLIN_ICON)) {
      names.add(match[1])
    }
  }
  return [...names].sort()
}

const LUCIDE = JSON.parse(
  readFileSync(path.join(MODULES, "lucide-static/icon-nodes.json"), "utf8")
)
const TABLER = JSON.parse(
  readFileSync(
    path.join(MODULES, "@tabler/icons/tabler-nodes-outline.json"),
    "utf8"
  )
)
const TABLER_FILLED = JSON.parse(
  readFileSync(
    path.join(MODULES, "@tabler/icons/tabler-nodes-filled.json"),
    "utf8"
  )
)
const REMIX_DIR = path.join(MODULES, "remixicon/icons")
const REMIX = Object.fromEntries(
  walk(REMIX_DIR, [".svg"]).map((file) => [path.basename(file, ".svg"), file])
)
const HUGEICONS = await import("@hugeicons/core-free-icons")

const num = (value) => Number.parseFloat(value)
const fmt = (value) => Number(value.toFixed(4)).toString()

function shapeOf(tag, attrs) {
  switch (tag) {
    case "path":
      return attrs.d
    case "circle": {
      const [cx, cy, r] = [attrs.cx, attrs.cy, attrs.r].map(num)
      return `M${fmt(cx - r)} ${fmt(cy)}a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0Z`
    }
    case "ellipse": {
      const [cx, cy, rx, ry] = [attrs.cx, attrs.cy, attrs.rx, attrs.ry].map(num)
      return `M${fmt(cx - rx)} ${fmt(cy)}a${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(2 * rx)} 0a${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(-2 * rx)} 0Z`
    }
    case "rect": {
      const x = num(attrs.x ?? 0)
      const y = num(attrs.y ?? 0)
      const w = num(attrs.width)
      const h = num(attrs.height)
      let rx = num(attrs.rx ?? attrs.ry ?? 0)
      let ry = num(attrs.ry ?? attrs.rx ?? 0)
      rx = Math.min(rx, w / 2)
      ry = Math.min(ry, h / 2)
      if (!(rx || ry)) {
        return `M${fmt(x)} ${fmt(y)}h${fmt(w)}v${fmt(h)}h${fmt(-w)}Z`
      }
      return [
        `M${fmt(x + rx)} ${fmt(y)}`,
        `h${fmt(w - 2 * rx)}`,
        `a${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(rx)} ${fmt(ry)}`,
        `v${fmt(h - 2 * ry)}`,
        `a${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(-rx)} ${fmt(ry)}`,
        `h${fmt(-(w - 2 * rx))}`,
        `a${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(-rx)} ${fmt(-ry)}`,
        `v${fmt(-(h - 2 * ry))}`,
        `a${fmt(rx)} ${fmt(ry)} 0 0 1 ${fmt(rx)} ${fmt(-ry)}Z`,
      ].join("")
    }
    case "line":
      return `M${attrs.x1} ${attrs.y1}L${attrs.x2} ${attrs.y2}`
    case "polyline":
    case "polygon": {
      const points = attrs.points.match(NUMBER) ?? []
      const pairs = []
      for (let index = 0; index + 1 < points.length; index += 2) {
        pairs.push(`${points[index]} ${points[index + 1]}`)
      }
      return `M${pairs.join("L")}${tag === "polygon" ? "Z" : ""}`
    }
    default:
      throw new Error(`Unsupported SVG element ${tag}`)
  }
}

function nodesToShapes(nodes, paint) {
  return nodes.map(([tag, attrs]) => ({
    d: shapeOf(tag, attrs),
    ...paint(attrs),
  }))
}

const SVG_ELEMENT =
  /<(path|circle|ellipse|rect|line|polyline|polygon)\b([^>]*)\/?>/g
const SVG_ATTRIBUTE = /([a-zA-Z-]+)="([^"]*)"/g

function svgNodes(svg) {
  return [...svg.matchAll(SVG_ELEMENT)].map(([, tag, attrs]) => [
    tag,
    Object.fromEntries(
      [...attrs.matchAll(SVG_ATTRIBUTE)].map(([, key, value]) => [key, value])
    ),
  ])
}

const stroke = (width) => () => ({ fill: false, width })
const fill = () => ({ fill: true, width: 0 })

function hugePaint(attrs) {
  if (attrs.fill && attrs.fill !== "none") return fill()
  return { fill: false, width: num(attrs.strokeWidth ?? 1.5) }
}

function lookup(table, key, library, name) {
  const value = table[key]
  if (!value) throw new Error(`${library} has no ${name} (${key})`)
  return value
}

function shapesFor(library, name) {
  switch (library) {
    case "lucide": {
      const key = kebab(name.replace(ICON_SUFFIX, ""))
      return {
        regular: nodesToShapes(lookup(LUCIDE, key, library, name), stroke(2)),
      }
    }
    case "tabler": {
      const key = kebab(name.replace(TABLER_PREFIX, ""))
      return {
        regular: nodesToShapes(lookup(TABLER, key, library, name), stroke(2)),
        filled: TABLER_FILLED[key]
          ? nodesToShapes(TABLER_FILLED[key], fill)
          : undefined,
      }
    }
    case "hugeicons": {
      const nodes = HUGEICONS[name]
      if (!nodes) throw new Error(`hugeicons has no ${name}`)
      return { regular: nodesToShapes(nodes, hugePaint) }
    }
    case "remixicon": {
      const key = kebab(name.replace(REMIX_PREFIX, ""))
      const read = (file) =>
        nodesToShapes(svgNodes(readFileSync(file, "utf8")), fill)
      const filledKey = key.replace(LINE_SUFFIX, "-fill")
      return {
        regular: read(lookup(REMIX, key, library, name)),
        filled:
          filledKey !== key && REMIX[filledKey]
            ? read(REMIX[filledKey])
            : undefined,
      }
    }
    default:
      throw new Error(`Unknown icon library ${library}`)
  }
}

function loadMap() {
  return JSON.parse(readFileSync(path.join(ROOT, MAP), "utf8"))
}

function iconSet(library) {
  const map = loadMap()
  return Object.entries(map).map(([name, names]) => ({
    name,
    source: names[library],
    ...shapesFor(library, names[library]),
  }))
}

const RN_HEADER = `import type * as React from "react"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
`

const RN_TYPES = `type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

interface IconProps {
  color?: string
  duotoneColor?: string
  duotoneOpacity?: number
  mirrored?: boolean
  size?: string | number
  style?: StyleProp<ViewStyle | Omit<TextStyle, "cursor">>
  testID?: string
  title?: string
  titleId?: string
  weight?: IconWeight
}

type Icon = React.FC<IconProps>

const SCALE: Record<IconWeight, number> = {
  thin: 0.5,
  light: 0.75,
  regular: 1,
  bold: 1.25,
  fill: 1,
  duotone: 1,
}

function mirror(style: IconProps["style"], mirrored?: boolean) {
  return (
    mirrored ? [{ transform: [{ scaleX: -1 }] }, style] : style
  ) as StyleProp<ViewStyle>
}
`

const RN_FOOTER = "\nexport type { Icon, IconProps, IconWeight }\n"

function rnLucide(icons) {
  const imports = [...new Set(icons.map((icon) => icon.source))]
    .sort()
    .map(
      (source) =>
        `  ${source.replace(ICON_SUFFIX, "")} as Lucide${source.replace(ICON_SUFFIX, "")},`
    )
  return `${RN_HEADER}import {
  type LucideIcon,
${imports.join("\n")}
} from "lucide-react-native"

${RN_TYPES}
function icon(Component: LucideIcon): Icon {
  return function LucideAdapter({
    color = "#000",
    mirrored,
    size = 24,
    style,
    testID,
    weight = "regular",
  }: IconProps) {
    return (
      <Component
        color={color}
        size={size}
        strokeWidth={${LIBRARY.lucide.width} * SCALE[weight]}
        style={mirror(style, mirrored)}
        testID={testID}
      />
    )
  }
}

${icons
  .map(
    (icon) =>
      `export const ${icon.name}Icon = icon(Lucide${icon.source.replace(ICON_SUFFIX, "")})`
  )
  .join("\n")}
${RN_FOOTER}`
}

function rnTabler(icons) {
  const sources = new Set()
  for (const icon of icons) {
    sources.add(icon.source)
    if (icon.filled) sources.add(`${icon.source}Filled`)
  }
  return `${RN_HEADER}import {
  type Icon as TablerIcon,
${[...sources]
  .sort()
  .map((source) => `  ${source},`)
  .join("\n")}
} from "@tabler/icons-react-native"

${RN_TYPES}
function icon(Outline: TablerIcon, Filled?: TablerIcon): Icon {
  return function TablerAdapter({
    color = "#000",
    mirrored,
    size = 24,
    style,
    testID,
    weight = "regular",
  }: IconProps) {
    const Component = weight === "fill" && Filled ? Filled : Outline
    return (
      <Component
        color={color}
        size={size}
        strokeWidth={${LIBRARY.tabler.width} * SCALE[weight]}
        style={mirror(style, mirrored)}
        testID={testID}
      />
    )
  }
}

${icons
  .map(
    (icon) =>
      `export const ${icon.name}Icon = icon(${icon.source}${icon.filled ? `, ${icon.source}Filled` : ""})`
  )
  .join("\n")}
${RN_FOOTER}`
}

function rnHugeicons(icons) {
  const imports = [...new Set(icons.map((icon) => icon.source))]
    .sort()
    .map((source) => `  ${source} as Huge${source.replace(ICON_SUFFIX, "")},`)
  return `${RN_HEADER}import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react-native"
import {
${imports.join("\n")}
} from "@hugeicons/core-free-icons"

${RN_TYPES}
function icon(data: IconSvgElement): Icon {
  return function HugeiconsAdapter({
    color = "#000",
    mirrored,
    size = 24,
    style,
    testID,
    weight = "regular",
  }: IconProps) {
    return (
      <HugeiconsIcon
        icon={data}
        color={color}
        size={size}
        strokeWidth={${LIBRARY.hugeicons.width} * SCALE[weight]}
        style={mirror(style, mirrored)}
        testID={testID}
      />
    )
  }
}

${icons
  .map(
    (icon) =>
      `export const ${icon.name}Icon = icon(Huge${icon.source.replace(ICON_SUFFIX, "")})`
  )
  .join("\n")}
${RN_FOOTER}`
}

const paths = (shapes) =>
  `[${shapes.map((shape) => JSON.stringify(shape.d)).join(", ")}]`

function rnRemix(icons) {
  return `${RN_HEADER}import Svg, { Path } from "react-native-svg"

${RN_TYPES.replace(SCALE_BLOCK, "\n")}
function icon(line: string[], filled?: string[]): Icon {
  return function RemixAdapter({
    color = "#000",
    mirrored,
    size = 24,
    style,
    testID,
    weight = "regular",
  }: IconProps) {
    const shapes = weight === "fill" && filled ? filled : line
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={color}
        style={mirror(style, mirrored)}
        testID={testID}
      >
        {shapes.map((d) => (
          <Path key={d} d={d} />
        ))}
      </Svg>
    )
  }
}

${icons
  .map(
    (icon) =>
      `export const ${icon.name}Icon = icon(${paths(icon.regular)}${icon.filled ? `, ${paths(icon.filled)}` : ""})`
  )
  .join("\n")}
${RN_FOOTER}`
}

const RN = {
  lucide: rnLucide,
  tabler: rnTabler,
  hugeicons: rnHugeicons,
  remixicon: rnRemix,
}

const swiftString = (value) => JSON.stringify(value)
const swiftShapes = (shapes) =>
  `[${shapes
    .map(
      (shape) =>
        `IconShape(${swiftString(shape.d)}, fill: ${shape.fill}, width: ${fmt(shape.width)})`
    )
    .join(", ")}]`

function swiftFile(library, icons) {
  return `import SwiftUI
import UIKit

public enum EsuissIcon: String, CaseIterable, Identifiable {
  public static let library = "${library}"

  public var id: Self { self }

${icons.map((icon) => `  case ${swiftCase(icon.name)}`).join("\n")}

  public var regular: Image { EsuissIconRenderer.image(self, scale: 1) }
  public var thin: Image { EsuissIconRenderer.image(self, scale: 0.5) }
  public var light: Image { EsuissIconRenderer.image(self, scale: 0.75) }
  public var bold: Image { EsuissIconRenderer.image(self, scale: 1.25) }
  public var fill: Image { EsuissIconRenderer.image(self, scale: 1, filled: true) }
  public var duotone: Image { EsuissIconRenderer.image(self, scale: 1) }

  fileprivate var shapes: [IconShape] {
    switch self {
${icons.map((icon) => `    case .${swiftCase(icon.name)}: ${swiftShapes(icon.regular)}`).join("\n")}
    }
  }

  fileprivate var filledShapes: [IconShape]? {
    switch self {
${icons
  .filter((icon) => icon.filled)
  .map(
    (icon) => `    case .${swiftCase(icon.name)}: ${swiftShapes(icon.filled)}`
  )
  .join("\n")}
    default: nil
    }
  }
}

${SWIFT_RUNTIME}`
}

const SWIFT_RUNTIME = `struct IconShape: Sendable {
  let d: String
  let fill: Bool
  let width: CGFloat

  init(_ d: String, fill: Bool, width: CGFloat) {
    self.d = d
    self.fill = fill
    self.width = width
  }
}

private final class IconCache: @unchecked Sendable {
  private let lock = NSLock()
  private var images: [String: UIImage] = [:]

  func image(_ key: String, make: () -> UIImage) -> UIImage {
    lock.lock()
    defer { lock.unlock() }
    if let image = images[key] { return image }
    let image = make()
    images[key] = image
    return image
  }
}

enum EsuissIconRenderer {
  private static let cache = IconCache()
  private static let canvas: CGFloat = 48
  private static let viewBox: CGFloat = 24

  static func image(_ icon: EsuissIcon, scale: CGFloat, filled: Bool = false) -> Image {
    let shapes = filled ? icon.filledShapes ?? icon.shapes : icon.shapes
    let key = "\\(icon.rawValue)-\\(scale)-\\(filled && icon.filledShapes != nil)"
    let uiImage = cache.image(key) {
      UIGraphicsImageRenderer(size: CGSize(width: canvas, height: canvas)).image { context in
        let graphics = context.cgContext
        graphics.scaleBy(x: canvas / viewBox, y: canvas / viewBox)
        graphics.setFillColor(UIColor.black.cgColor)
        graphics.setStrokeColor(UIColor.black.cgColor)
        graphics.setLineCap(.round)
        graphics.setLineJoin(.round)
        for shape in shapes {
          graphics.addPath(SVGPath.parse(shape.d))
          if shape.fill {
            graphics.fillPath()
          } else {
            graphics.setLineWidth(shape.width * scale)
            graphics.strokePath()
          }
        }
      }
    }
    return Image(uiImage: uiImage)
      .renderingMode(.template)
      .interpolation(.medium)
      .resizable()
  }
}

private struct SVGPath {
  private let characters: [Character]
  private var index = 0

  private init(_ text: String) {
    characters = Array(text)
  }

  static func parse(_ text: String) -> CGPath {
    var parser = SVGPath(text)
    return parser.build()
  }

  private mutating func skipSeparators() {
    while index < characters.count,
      characters[index] == " " || characters[index] == "," || characters[index] == "\\n"
        || characters[index] == "\\t"
    {
      index += 1
    }
  }

  private mutating func command() -> Character? {
    skipSeparators()
    guard index < characters.count, characters[index].isLetter else { return nil }
    defer { index += 1 }
    return characters[index]
  }

  private mutating func hasNumber() -> Bool {
    skipSeparators()
    guard index < characters.count else { return false }
    let character = characters[index]
    return character.isNumber || character == "-" || character == "+" || character == "."
  }

  private mutating func number() -> CGFloat {
    skipSeparators()
    let start = index
    if index < characters.count, characters[index] == "-" || characters[index] == "+" {
      index += 1
    }
    var dot = false
    var exponent = false
    while index < characters.count {
      let character = characters[index]
      if character.isNumber {
        index += 1
      } else if character == ".", !dot, !exponent {
        dot = true
        index += 1
      } else if character == "e" || character == "E", !exponent {
        exponent = true
        index += 1
        if index < characters.count, characters[index] == "-" || characters[index] == "+" {
          index += 1
        }
      } else {
        break
      }
    }
    return CGFloat(Double(String(characters[start..<index])) ?? 0)
  }

  private mutating func flag() -> Bool {
    skipSeparators()
    guard index < characters.count else { return false }
    defer { index += 1 }
    return characters[index] == "1"
  }

  private mutating func build() -> CGPath {
    let path = CGMutablePath()
    var current = CGPoint.zero
    var start = CGPoint.zero
    var control: CGPoint?
    var quadratic: CGPoint?

    while let next = command() {
      var name = next
      repeat {
        let relative = name.isLowercase
        let origin = relative ? current : .zero
        switch name.uppercased() {
        case "M":
          current = CGPoint(x: origin.x + number(), y: origin.y + number())
          start = current
          path.move(to: current)
          name = relative ? "l" : "L"
          control = nil
          quadratic = nil
        case "L":
          current = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "H":
          current = CGPoint(x: (relative ? current.x : 0) + number(), y: current.y)
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "V":
          current = CGPoint(x: current.x, y: (relative ? current.y : 0) + number())
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "C":
          let first = CGPoint(x: origin.x + number(), y: origin.y + number())
          let second = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addCurve(to: end, control1: first, control2: second)
          control = second
          quadratic = nil
          current = end
        case "S":
          let first = control.map { CGPoint(x: 2 * current.x - $0.x, y: 2 * current.y - $0.y) } ?? current
          let second = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addCurve(to: end, control1: first, control2: second)
          control = second
          quadratic = nil
          current = end
        case "Q":
          let point = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addQuadCurve(to: end, control: point)
          quadratic = point
          control = nil
          current = end
        case "T":
          let point = quadratic.map { CGPoint(x: 2 * current.x - $0.x, y: 2 * current.y - $0.y) } ?? current
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addQuadCurve(to: end, control: point)
          quadratic = point
          control = nil
          current = end
        case "A":
          let radiusX = abs(number())
          let radiusY = abs(number())
          let rotation = number() * .pi / 180
          let large = flag()
          let sweep = flag()
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          addArc(path, from: current, to: end, radiusX: radiusX, radiusY: radiusY, rotation: rotation, large: large, sweep: sweep)
          control = nil
          quadratic = nil
          current = end
        case "Z":
          path.closeSubpath()
          current = start
          control = nil
          quadratic = nil
        default:
          return path
        }
      } while name.uppercased() != "Z" && hasNumber()
    }
    return path
  }

  private func addArc(
    _ path: CGMutablePath, from: CGPoint, to: CGPoint, radiusX: CGFloat, radiusY: CGFloat,
    rotation: CGFloat, large: Bool, sweep: Bool
  ) {
    if from == to { return }
    if radiusX == 0 || radiusY == 0 {
      path.addLine(to: to)
      return
    }
    let cosine = cos(rotation)
    let sine = sin(rotation)
    let dx = (from.x - to.x) / 2
    let dy = (from.y - to.y) / 2
    let x1 = cosine * dx + sine * dy
    let y1 = -sine * dx + cosine * dy
    var rx = radiusX
    var ry = radiusY
    let lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
    if lambda > 1 {
      rx *= sqrt(lambda)
      ry *= sqrt(lambda)
    }
    let numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
    let denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1
    var coefficient = sqrt(max(0, numerator / denominator))
    if large == sweep { coefficient = -coefficient }
    let cx1 = coefficient * rx * y1 / ry
    let cy1 = -coefficient * ry * x1 / rx
    let center = CGPoint(
      x: cosine * cx1 - sine * cy1 + (from.x + to.x) / 2,
      y: sine * cx1 + cosine * cy1 + (from.y + to.y) / 2
    )
    func angle(_ ux: CGFloat, _ uy: CGFloat, _ vx: CGFloat, _ vy: CGFloat) -> CGFloat {
      let value = atan2(ux * vy - uy * vx, ux * vx + uy * vy)
      return value
    }
    let startAngle = angle(1, 0, (x1 - cx1) / rx, (y1 - cy1) / ry)
    var delta = angle((x1 - cx1) / rx, (y1 - cy1) / ry, (-x1 - cx1) / rx, (-y1 - cy1) / ry)
    if !sweep && delta > 0 { delta -= 2 * .pi }
    if sweep && delta < 0 { delta += 2 * .pi }
    let segments = max(1, Int(ceil(abs(delta) / (.pi / 2))))
    let step = delta / CGFloat(segments)
    let handle = 4 / 3 * tan(step / 4)
    var theta = startAngle
    func point(_ angle: CGFloat) -> CGPoint {
      let x = rx * cos(angle)
      let y = ry * sin(angle)
      return CGPoint(x: center.x + cosine * x - sine * y, y: center.y + sine * x + cosine * y)
    }
    func derivative(_ angle: CGFloat) -> CGPoint {
      let x = -rx * sin(angle)
      let y = ry * cos(angle)
      return CGPoint(x: cosine * x - sine * y, y: sine * x + cosine * y)
    }
    for _ in 0..<segments {
      let next = theta + step
      let p1 = point(theta)
      let p2 = point(next)
      let d1 = derivative(theta)
      let d2 = derivative(next)
      path.addCurve(
        to: p2,
        control1: CGPoint(x: p1.x + handle * d1.x, y: p1.y + handle * d1.y),
        control2: CGPoint(x: p2.x - handle * d2.x, y: p2.y - handle * d2.y)
      )
      theta = next
    }
  }
}
`

const kotlinString = (value) => JSON.stringify(value).replaceAll("$", "\\$")
const kotlinShapes = (shapes) =>
  `listOf(${shapes
    .map(
      (shape) =>
        `IconShape(${kotlinString(shape.d)}, ${shape.fill}, ${fmt(shape.width)}f)`
    )
    .join(", ")})`

function kotlinBase(library, icons) {
  return `package com.esuiss.ui.icons

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.addPathNodes
import androidx.compose.ui.unit.dp

object EsuissIcons {
  const val LIBRARY = "${library}"
}

${WEIGHTS.map((weight) => `object ${weight}Icons`).join("\n")}

${WEIGHTS.map(
  (weight) =>
    `val EsuissIcons.${weight}: ${weight}Icons\n  get() = ${weight}Icons`
).join("\n\n")}

class IconShape(val d: String, val fill: Boolean, val width: Float)

class IconSet(val regular: List<IconShape>, val filled: List<IconShape>? = null)

enum class IconWeight(val scale: Float) {
  Thin(0.5f),
  Light(0.75f),
  Regular(1f),
  Bold(1.25f),
  Fill(1f),
  Duotone(1f),
}

private val cache = HashMap<String, ImageVector>()

fun iconVector(name: String, set: IconSet, weight: IconWeight): ImageVector {
  val filled = weight == IconWeight.Fill && set.filled != null
  return cache.getOrPut("$name-$weight-$filled") {
    val builder =
      ImageVector.Builder(
        name = name,
        defaultWidth = 24.dp,
        defaultHeight = 24.dp,
        viewportWidth = 24f,
        viewportHeight = 24f,
      )
    for (shape in if (filled) set.filled.orEmpty() else set.regular) {
      builder.addPath(
        pathData = addPathNodes(shape.d),
        fill = if (shape.fill) SolidColor(Color.Black) else null,
        stroke = if (shape.fill) null else SolidColor(Color.Black),
        strokeLineWidth = shape.width * weight.scale,
        strokeLineCap = StrokeCap.Round,
        strokeLineJoin = StrokeJoin.Round,
      )
    }
    builder.build()
  }
}

object IconData {
${icons
  .map(
    (icon) =>
      `  val ${icon.name}: IconSet\n    get() = IconSet(${kotlinShapes(icon.regular)}${icon.filled ? `, ${kotlinShapes(icon.filled)}` : ""})`
  )
  .join("\n\n")}
}
`
}

function kotlinWeight(weight, icons) {
  return `package com.esuiss.ui.icons.${weight.toLowerCase()}

import androidx.compose.ui.graphics.vector.ImageVector
import com.esuiss.ui.icons.IconData
import com.esuiss.ui.icons.IconWeight
import com.esuiss.ui.icons.${weight}Icons
import com.esuiss.ui.icons.iconVector

${icons
  .map(
    (icon) =>
      `val ${weight}Icons.${icon.name}: ImageVector\n  get() = iconVector("${icon.name}", IconData.${icon.name}, IconWeight.${weight})`
  )
  .join("\n\n")}
`
}

function outputs() {
  const used = usedIcons()
  const map = loadMap()
  const missing = used.filter((name) => !map[name])
  if (missing.length) {
    throw new Error(
      `Add these icons to ${MAP} with a name for every library: ${missing.join(", ")}`
    )
  }
  const files = {}
  for (const library of ICON_LIBRARIES) {
    const icons = iconSet(library)
    const target = iconFiles(library)
    files[target.rn] = RN[library](icons)
    files[target.swift[0]] = swiftFile(library, icons)
    files[target.kotlin[0]] = kotlinBase(library, icons)
    WEIGHTS.forEach((weight, index) => {
      files[target.kotlin[index + 1]] = kotlinWeight(weight, icons)
    })
  }
  return files
}

function read(base, file) {
  try {
    return readFileSync(path.join(base, file), "utf8")
  } catch {
    return ""
  }
}

function generate(target) {
  const files = outputs()
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(target, file)), { recursive: true })
    writeFileSync(path.join(target, file), content)
  }
  execFileSync(
    path.join(REPO, "node_modules/.bin/biome"),
    [
      "check",
      "--write",
      ...Object.keys(files).filter((file) => file.endsWith(".tsx")),
    ],
    { cwd: target, stdio: "ignore" }
  )
  return Object.keys(files)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes("--check")) {
    const temp = mkdtempSync(path.join(tmpdir(), "esuiss-icons-"))
    try {
      writeFileSync(
        path.join(temp, "biome.json"),
        JSON.stringify(scopedBiome(JSON.parse(read(REPO, "biome.json"))))
      )
      const files = generate(temp)
      const stale = files.filter(
        (file) => read(temp, file) !== read(ROOT, file)
      )
      if (stale.length) {
        console.error("Icons are out of date. Run `pnpm icons`.")
        for (const file of stale) console.error(`  ${file}`)
        process.exit(1)
      }
      console.log(`Icons are up to date: ${files.length} files`)
    } finally {
      rmSync(temp, { recursive: true, force: true })
    }
  } else {
    const files = generate(ROOT)
    console.log(`Wrote ${files.length} icon files`)
  }
}
