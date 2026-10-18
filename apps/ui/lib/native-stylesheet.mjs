import ts from "typescript"

const THEME_MODULE = "@/components/ui/theme"
const SPACING_UNIT = 4
const STYLE_ATTRIBUTES = {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
}
const CLASS_ATTRIBUTE = /ClassName$|^className$/
const WHITESPACE = /\s+/
const COMPONENT_NAME = /^[A-Z]/
const KEBAB_PART = /-(\w)/g
const NUMBER = /^\d+(?:\.\d+)?$/
const FRACTION = /^(\d+)\/(\d+)$/
const ARBITRARY = /^\[(.+)\]$/
const PERCENT = /^\d+(?:\.\d+)?%$/
const PIXELS = /^(\d+(?:\.\d+)?)px$/
const RATIO = /^(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/
const PALETTE_NAME = /^([a-z]+)-(\d+)$/
const ICON_SIZE = /^size-(\d+(?:\.\d+)?)$/
const TEXT_COLOR = /^text-(.+)$/
const LEADING_WHITESPACE = /^\s*/
const COLORS_NAME = /\bcolors\b/

const THEME_COLORS = new Set([
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "border",
  "input",
  "ring",
  "chart1",
  "chart2",
  "chart3",
  "chart4",
  "chart5",
])

const PALETTE = new Set([
  "black",
  "white",
  "red500",
  "orange500",
  "amber400",
  "amber500",
  "amber600",
  "yellow500",
  "green400",
  "green500",
  "green600",
  "teal400",
  "teal500",
  "cyan500",
  "blue500",
  "indigo500",
  "purple500",
  "pink500",
  "zinc500",
])

const THEME_FONT_SIZES = new Set(["xs", "sm", "base", "lg", "xl", "2xl", "3xl"])
const LARGE_FONT_SIZES = {
  "4xl": { fontSize: 36, lineHeight: 40 },
  "5xl": { fontSize: 48, lineHeight: 48 },
}
const RADII = new Set(["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"])
const SHADOWS = new Set(["xs", "sm", "md", "lg", "xl"])
const FONT_WEIGHTS = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
}
const MAX_WIDTHS = { xs: 320, sm: 384, md: 448, lg: 512 }

const FIXED = {
  "flex-1": { flex: 1 },
  "flex-row": { flexDirection: '"row"' },
  "flex-col": { flexDirection: '"column"' },
  "flex-wrap": { flexWrap: '"wrap"' },
  grow: { flexGrow: 1 },
  "grow-0": { flexGrow: 0 },
  shrink: { flexShrink: 1 },
  "shrink-0": { flexShrink: 0 },
  "items-start": { alignItems: '"flex-start"' },
  "items-center": { alignItems: '"center"' },
  "items-end": { alignItems: '"flex-end"' },
  "items-baseline": { alignItems: '"baseline"' },
  "items-stretch": { alignItems: '"stretch"' },
  "justify-start": { justifyContent: '"flex-start"' },
  "justify-center": { justifyContent: '"center"' },
  "justify-end": { justifyContent: '"flex-end"' },
  "justify-between": { justifyContent: '"space-between"' },
  "self-start": { alignSelf: '"flex-start"' },
  "self-center": { alignSelf: '"center"' },
  "self-end": { alignSelf: '"flex-end"' },
  "self-stretch": { alignSelf: '"stretch"' },
  "overflow-hidden": { overflow: '"hidden"' },
  absolute: { position: '"absolute"' },
  relative: { position: '"relative"' },
  "inset-0": { top: 0, right: 0, bottom: 0, left: 0 },
  "aspect-square": { aspectRatio: 1 },
  "aspect-video": { aspectRatio: "16 / 9" },
  "w-full": { width: '"100%"' },
  "h-full": { height: '"100%"' },
  "size-full": { width: '"100%"', height: '"100%"' },
  "w-auto": { width: '"auto"' },
  "h-px": { height: 1 },
  border: { borderWidth: 1 },
  "border-b": { borderBottomWidth: 1 },
  "border-t": { borderTopWidth: 1 },
  "border-dashed": { borderStyle: '"dashed"' },
}

const TEXT_FIXED = {
  "text-center": { textAlign: '"center"' },
  "text-left": { textAlign: '"left"' },
  "text-right": { textAlign: '"right"' },
  uppercase: { textTransform: '"uppercase"' },
  capitalize: { textTransform: '"capitalize"' },
  "tabular-nums": { fontVariant: '["tabular-nums"]' },
}

const SPACING = {
  p: ["padding"],
  px: ["paddingHorizontal"],
  py: ["paddingVertical"],
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  ps: ["paddingStart"],
  pe: ["paddingEnd"],
  m: ["margin"],
  mx: ["marginHorizontal"],
  my: ["marginVertical"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  ms: ["marginStart"],
  me: ["marginEnd"],
  gap: ["gap"],
  "gap-x": ["columnGap"],
  "gap-y": ["rowGap"],
  w: ["width"],
  h: ["height"],
  size: ["width", "height"],
  "min-w": ["minWidth"],
  "min-h": ["minHeight"],
}
const SPACING_CLASS =
  /^(-?)(gap-x|gap-y|gap|min-w|min-h|size|px|py|pt|pb|ps|pe|p|mx|my|mt|mb|ms|me|m|w|h)-(.+)$/
const NEGATIVE_ALLOWED = /^m/

const IDENTIFIER = /^[A-Za-z_]\w*$/

const member = (object, key) =>
  IDENTIFIER.test(key)
    ? `${object}.${key}`
    : `${object}[${JSON.stringify(key)}]`

const camel = (value) =>
  value.replace(KEBAB_PART, (_, letter) => letter.toUpperCase())

function length(value) {
  if (NUMBER.test(value)) return String(Number(value) * SPACING_UNIT)
  if (value === "px") return "1"
  const fraction = value.match(FRACTION)
  if (fraction)
    return `"${Number(((Number(fraction[1]) / Number(fraction[2])) * 100).toFixed(4))}%"`
  const arbitrary = value.match(ARBITRARY)?.[1]
  if (arbitrary && PERCENT.test(arbitrary)) return `"${arbitrary}"`
  const pixels = arbitrary?.match(PIXELS)
  if (pixels) return pixels[1]
  return undefined
}

function color(name, needs) {
  if (name.includes("/")) return undefined
  const key = camel(name)
  if (THEME_COLORS.has(key)) {
    needs.add("colors")
    return `colors.${key}`
  }
  const palette = name.match(PALETTE_NAME)
  const paletteKey = palette ? `${palette[1]}${palette[2]}` : key
  if (PALETTE.has(paletteKey)) {
    needs.add("palette")
    return `palette.${paletteKey}`
  }
  return undefined
}

function classStyle(name, needs) {
  if (name.includes(":")) return undefined
  if (FIXED[name]) return { style: FIXED[name] }
  if (TEXT_FIXED[name]) return { style: TEXT_FIXED[name], text: true }
  const spacing = name.match(SPACING_CLASS)
  if (spacing) {
    const [, negative, prefix, raw] = spacing
    if (negative && !NEGATIVE_ALLOWED.test(prefix)) return undefined
    const value = length(raw)
    if (value === undefined || (negative && value.startsWith('"')))
      return undefined
    const entry = negative ? `-${value}` : value
    return {
      style: Object.fromEntries(SPACING[prefix].map((key) => [key, entry])),
    }
  }
  if (name.startsWith("max-w-")) {
    const width = MAX_WIDTHS[name.slice(6)]
    return width ? { style: { maxWidth: width } } : undefined
  }
  if (name.startsWith("grow-")) {
    const value = name.slice(5).match(ARBITRARY)?.[1]
    return value && NUMBER.test(value)
      ? { style: { flexGrow: Number(value) } }
      : undefined
  }
  if (name.startsWith("aspect-")) {
    const ratio = name.slice(7).match(ARBITRARY)?.[1]?.match(RATIO)
    return ratio
      ? { style: { aspectRatio: `${ratio[1]} / ${ratio[2]}` } }
      : undefined
  }
  if (name.startsWith("rounded-")) {
    const size = name.slice(8)
    if (!RADII.has(size)) return undefined
    needs.add("radius")
    return { style: { borderRadius: member("radius", size) } }
  }
  if (name.startsWith("shadow-")) {
    const size = name.slice(7)
    if (!SHADOWS.has(size)) return undefined
    needs.add("shadow")
    return { style: { [`...${member("shadow", size)}`]: "" } }
  }
  if (name.startsWith("font-")) {
    const weight = FONT_WEIGHTS[name.slice(5)]
    return weight
      ? { style: { fontWeight: `"${weight}"` }, text: true }
      : undefined
  }
  if (name.startsWith("-rotate-") || name.startsWith("rotate-")) {
    const degrees = name.slice(name.indexOf("rotate-") + 7)
    if (!NUMBER.test(degrees)) return undefined
    const sign = name.startsWith("-") ? "-" : ""
    return { style: { transform: `[{ rotate: "${sign}${degrees}deg" }]` } }
  }
  if (name.startsWith("bg-")) {
    const value = color(name.slice(3), needs)
    return value ? { style: { backgroundColor: value } } : undefined
  }
  if (name.startsWith("border-")) {
    const value = color(name.slice(7), needs)
    return value ? { style: { borderColor: value } } : undefined
  }
  if (name.startsWith("text-")) {
    const size = name.slice(5)
    if (THEME_FONT_SIZES.has(size)) {
      needs.add("fontSize")
      return {
        style: { [`...${member("fontSize", size)}`]: "" },
        text: true,
      }
    }
    if (LARGE_FONT_SIZES[size])
      return { style: LARGE_FONT_SIZES[size], text: true }
    const value = color(size, needs)
    return value ? { style: { color: value }, text: true } : undefined
  }
  return undefined
}

function styleObject(classes, needs) {
  const entries = new Map()
  let text = false
  for (const name of classes) {
    const result = classStyle(name, needs)
    if (!result) return undefined
    text ||= Boolean(result.text)
    for (const [key, value] of Object.entries(result.style)) {
      entries.delete(key)
      entries.set(key, String(value))
    }
  }
  const body = [...entries]
    .map(([key, value]) => (key.startsWith("...") ? key : `${key}: ${value}`))
    .join(", ")
  return { text: `{ ${body} }`, isText: text }
}

function iconProps(classes, needs) {
  const props = []
  for (const name of classes) {
    const size = name.match(ICON_SIZE)
    if (size) {
      props.push(`size={${Number(size[1]) * SPACING_UNIT}}`)
      continue
    }
    const text = name.match(TEXT_COLOR)
    const value = text && color(text[1], needs)
    if (!value) return undefined
    props.push(`color={${value}}`)
  }
  return props.join(" ")
}

function classValue(attribute) {
  const initializer = attribute.initializer
  if (!initializer) return undefined
  if (ts.isStringLiteral(initializer)) return initializer.text
  if (
    ts.isJsxExpression(initializer) &&
    initializer.expression &&
    (ts.isStringLiteral(initializer.expression) ||
      ts.isNoSubstitutionTemplateLiteral(initializer.expression))
  )
    return initializer.expression.text
  return undefined
}

function componentOf(node) {
  for (let current = node.parent; current; current = current.parent) {
    if (
      ts.isFunctionDeclaration(current) &&
      current.name &&
      COMPONENT_NAME.test(current.name.text)
    )
      return current
    if (
      (ts.isArrowFunction(current) || ts.isFunctionExpression(current)) &&
      ts.isVariableDeclaration(current.parent) &&
      ts.isIdentifier(current.parent.name) &&
      COMPONENT_NAME.test(current.parent.name.text)
    )
      return current
  }
  return undefined
}

const TEXT_TAG = /(?:^|\.)(?:Text|TextInput)$|(?:Title|Label|Description)$/

export function toStyleSheet(code) {
  const source = ts.createSourceFile(
    "example.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  )
  const edits = []
  const needs = new Set()
  const hooks = new Set()
  let failed = false

  const visit = (node) => {
    if (failed) return
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source)
      const attributes = node.attributes.properties.filter(ts.isJsxAttribute)
      const names = new Set(attributes.map((item) => item.name.getText(source)))
      for (const attribute of attributes) {
        const name = attribute.name.getText(source)
        if (!CLASS_ATTRIBUTE.test(name)) continue
        const target = STYLE_ATTRIBUTES[name]
        const value = classValue(attribute)
        if (!target || value === undefined || names.has(target)) {
          failed = true
          return
        }
        const classes = value.split(WHITESPACE).filter(Boolean)
        const local = new Set()
        let replacement
        if (tag === "Icon" && name === "className") {
          if (names.has("size") || names.has("color")) {
            failed = true
            return
          }
          replacement = iconProps(classes, local)
        } else {
          const style = styleObject(classes, local)
          if (style && (!style.isText || TEXT_TAG.test(tag)))
            replacement = `${target}={${style.text}}`
        }
        if (replacement === undefined) {
          failed = true
          return
        }
        if (local.has("colors")) {
          const component = componentOf(node)
          if (!(component && ts.isBlock(component.body))) {
            failed = true
            return
          }
          hooks.add(component)
        }
        for (const item of local) needs.add(item)
        edits.push({
          start: attribute.getStart(source),
          end: attribute.getEnd(),
          text: replacement,
        })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  if (failed) return undefined
  if (!edits.length) return code

  for (const component of hooks) {
    const body = component.body
    if (COLORS_NAME.test(body.getText(source))) return undefined
    const first = body.statements[0]
    const indent = first
      ? code
          .slice(code.lastIndexOf("\n", first.getStart(source)) + 1)
          .match(LEADING_WHITESPACE)[0]
      : "  "
    edits.push({
      start: body.getStart(source) + 1,
      end: body.getStart(source) + 1,
      text: `\n${indent}const { colors } = useTheme()`,
    })
  }

  const imports = source.statements.filter(ts.isImportDeclaration)
  const theme = imports.find(
    (statement) => statement.moduleSpecifier.text === THEME_MODULE
  )
  const bindings = theme?.importClause?.namedBindings
  if (theme && !(bindings && ts.isNamedImports(bindings))) return undefined
  const present = new Set(
    bindings?.elements.map((element) => element.name.text) ?? []
  )
  const names = [...needs]
    .map((item) => (item === "colors" ? "useTheme" : item))
    .filter((name) => !present.has(name))
  if (names.length && bindings) {
    const last = bindings.elements.at(-1)
    edits.push({
      start: last.getEnd(),
      end: last.getEnd(),
      text: `, ${names.sort((a, b) => a.localeCompare(b)).join(", ")}`,
    })
  } else if (names.length) {
    const last = imports.at(-1)
    const line = `import { ${names.sort((a, b) => a.localeCompare(b)).join(", ")} } from "${THEME_MODULE}"`
    edits.push(
      last
        ? { start: last.getEnd(), end: last.getEnd(), text: `\n${line}` }
        : { start: 0, end: 0, text: `${line}\n\n` }
    )
  }

  let output = code
  for (const edit of edits.sort((a, b) => b.start - a.start))
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end)
  return output
}
