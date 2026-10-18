import { CliError } from "../output.mjs"
import { choose, isInteractive } from "../prompt.mjs"
import { SCOPES } from "../registry.mjs"

const isListed = (item) => !item.optIn && item.listed !== false

function article(kind) {
  return kind === "interaction" ? "an" : "a"
}

function selectNames(
  items,
  names,
  { all, scope = "ui", scopeOf, include = () => true, suffix = "", title }
) {
  const inScope = (item) => scopeOf(item) === scope
  const pool = items.filter((item) => inScope(item) && include(item))
  const { kind, command, example } = SCOPES[scope]
  const listed = pool.filter(isListed)
  const available = `Available${title ? ` for ${title}` : ""}: ${listed.map((item) => item.name).join(", ") || "none yet"}`

  if (all) {
    if (!pool.length) throw new CliError(`No ${kind}s are available yet.`)
    return pool.filter((item) => !item.optIn).map((item) => item.name)
  }

  if (!names.length) {
    throw new CliError(
      `Name at least one ${kind}, e.g. npx @esuiss/ui ${command} ${example}${suffix}\n${available}`
    )
  }

  const byName = new Map(items.map((item) => [item.name, item]))
  for (const name of names) {
    const item = byName.get(name)
    if (item && inScope(item)) continue
    if (item) {
      const other = SCOPES[scopeOf(item)]
      throw new CliError(
        `"${name}" is ${article(other.kind)} ${other.kind}. Run npx @esuiss/ui ${other.command} ${name}${suffix}`
      )
    }
    throw new CliError(`Unknown ${kind}: ${name}.\n${available}`)
  }
  return names
}

async function pickNames(all, { scope, scopeOf }) {
  const items = all.filter(isListed)
  const group =
    scope ??
    (await choose(
      "What do you want to add?",
      Object.entries(SCOPES).flatMap(([value, { label }]) => {
        const count = items.filter((item) => scopeOf(item) === value).length
        return count ? [{ value, label, hint: String(count) }] : []
      })
    ))
  const { kind } = SCOPES[group]
  const choices = items.filter((item) => scopeOf(item) === group)
  if (!choices.length) throw new CliError(`No ${kind}s are available yet.`)
  return {
    scope: group,
    names: await choose(
      `Which ${kind}s?`,
      choices
        .map((item) => ({ value: item.name, label: item.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      { multiple: true }
    ),
  }
}

export async function chooseNames(
  items,
  names,
  options,
  { scopeOf, pickFrom = items, ...rest }
) {
  const picking =
    !names.length && !options.all && !options.yes && isInteractive()
  const picked = picking
    ? await pickNames(pickFrom, { scope: options.scope, scopeOf })
    : { scope: options.scope ?? "ui", names }
  return selectNames(items, picked.names, {
    ...options,
    ...rest,
    scope: picked.scope,
    scopeOf,
  })
}
