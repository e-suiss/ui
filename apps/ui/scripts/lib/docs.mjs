const CHART_SUFFIX = /-chart-.*/
const CODE_SPAN = /(`[^`]*`)/
export const MARKER = "generated: true"

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export const pascal = (name) =>
  name.replace(/(^|-)([a-z0-9])/g, (_, __, letter) => letter.toUpperCase())

export function groupOf(item) {
  if (item.type === "chart")
    return capitalize(item.name.replace(CHART_SUFFIX, ""))
  if (item.type === "block") return capitalize(item.name.split("-")[0])
  return undefined
}

export function mdx(text = "") {
  return text
    .split(CODE_SPAN)
    .map((part) =>
      part.startsWith("`")
        ? part
        : part.replace(/[{}<>]/g, (char) => `\\${char}`)
    )
    .join("")
}

export const fence = (code, lang = "tsx", title) =>
  `<Code lang="${lang}"${title ? ` title="${title}"` : ""} code={${JSON.stringify(code.trimEnd())}} />`

export function propsTable(part, text) {
  const props = part.props.map((prop) => ({
    name: prop.name,
    type: prop.type,
    ...(prop.default ? { default: prop.default } : {}),
    ...(prop.required ? { required: true } : {}),
    ...(text?.[prop.name] ? { description: text[prop.name] } : {}),
  }))
  const attrs = [
    part.extends.length ? ` extends={${JSON.stringify(part.extends)}}` : "",
    props.length ? ` props={${JSON.stringify(props)}}` : "",
  ].join("")
  return `<PropsTable${attrs} />`
}
