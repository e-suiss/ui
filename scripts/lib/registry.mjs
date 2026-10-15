export function toTitle(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function packageName(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

const IMPORT = /(?:from\s+|import\s+)["']([^"']+)["']/g

export function collectImports(code) {
  const specifiers = new Set()
  for (const match of code.matchAll(IMPORT)) specifiers.add(match[1])
  return [...specifiers]
}

export const SCHEMA_URL = "https://ui.shadcn.com/schema"

const WHITESPACE = /\s+/g
const PAREN_SPACE = /\(\s+|\s+\)/g

export function normalize(text) {
  return text
    .replace(WHITESPACE, " ")
    .replace(PAREN_SPACE, (match) => match.trim())
}

export function toCssObject(nodes) {
  const object = {}
  for (const node of nodes) {
    if (node.type === "decl") {
      object[node.prop] = normalize(node.value)
    } else if (node.type === "rule") {
      object[normalize(node.selector)] = toCssObject(node.nodes)
    } else if (node.type === "atrule") {
      object[`@${node.name} ${normalize(node.params)}`.trim()] = toCssObject(
        node.nodes ?? []
      )
    }
  }
  return object
}

const schemas = new Map()

function fetchSchema(name) {
  if (!schemas.has(name)) {
    schemas.set(
      name,
      fetch(`${SCHEMA_URL}/${name}`).then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Could not download ${SCHEMA_URL}/${name}: ${response.status}`
          )
        }
        const { $schema: _draft, ...schema } = await response.json()
        return schema
      })
    )
  }
  return schemas.get(name)
}

export async function schemaProblems(Ajv, registry) {
  const ajv = new Ajv({ allErrors: true, strict: false })
  ajv.addSchema(
    await fetchSchema("registry-item.json"),
    `${SCHEMA_URL}/registry-item.json`
  )
  const check = ajv.compile(await fetchSchema("registry.json"))
  if (check(registry)) return []
  return check.errors.map(
    (error) => `schema: ${error.instancePath || "/"} ${error.message}`
  )
}
