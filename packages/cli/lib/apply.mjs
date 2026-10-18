import { existsSync, readFileSync, writeFileSync } from "node:fs"

import { installItems } from "./add.mjs"
import { withPrimary } from "./color.mjs"
import {
  applyPreset,
  DEFAULT_FONT,
  OWN_THEME,
  paletteOf,
  RTL_NOTE,
  withPointer,
} from "./init.mjs"
import { CliError, confirm, note, step } from "./output.mjs"
import { decodePreset } from "./preset.mjs"
import {
  detectBase,
  detectIcons,
  detectMenuColor,
  detectProject,
  detectStyle,
  findAliasRoot,
  findStylesheet,
  saveBase,
} from "./project.mjs"
import { fetchRegistry, fetchThemes } from "./registry.mjs"
import { targetFor } from "./shared/files.mjs"
import { relative } from "./shared/project.mjs"

export const APPLY_MODES = ["theme", "font"]

function installedItems(registry, root) {
  return registry.items
    .filter(
      (item) =>
        item.files.length > 0 &&
        item.files.every((file) => existsSync(targetFor(root, file)))
    )
    .map((item) => item.name)
}

export async function apply(options) {
  const project = detectProject(options.cwd)
  const stylesheet = findStylesheet(project)
  if (!stylesheet) {
    throw new CliError(
      "No suiss/ui stylesheet found. Run `npx @esuiss/ui init` first."
    )
  }
  const preset = options.preset ? decodePreset(options.preset) : null
  const only = options.only
  const manual = []
  let css = readFileSync(stylesheet, "utf8")

  if (only !== "font") {
    const palette = withPrimary(
      preset && options.theme !== OWN_THEME
        ? paletteOf(await fetchThemes(), preset)
        : null,
      options.primary
    )
    if (preset || palette) css = applyPreset(css, preset, palette)
  }
  if (options.pointer) css = withPointer(css)
  writeFileSync(stylesheet, css)
  step(`Updated ${relative(project, stylesheet)}`)

  if (only !== "theme" && preset && preset.font !== DEFAULT_FONT) {
    manual.push(
      `Load the ${preset.font} font and point --font-sans at it in ${relative(project, stylesheet)}.`
    )
  }

  if (!only && (preset || options.style)) {
    const base = options.base ?? detectBase(project.cwd)
    const style = options.style ?? preset?.style ?? detectStyle(project.cwd)
    const icons = preset?.iconLibrary ?? detectIcons(project.cwd)
    const menuColor = preset?.menuColor ?? detectMenuColor(project.cwd)
    const saved = saveBase(project, base, stylesheet, style, {
      ...(preset
        ? { iconLibrary: icons, menuColor, menuAccent: preset.menuAccent }
        : {}),
    })
    if (saved?.invalid) {
      manual.push(
        `Could not read ${relative(project, saved.file)}. Set its style to ${base}-${style} by hand.`
      )
    } else if (saved) {
      step(
        `${saved.created ? "Created" : "Updated"} ${relative(project, saved.file)} with the ${saved.style} style`
      )
    }
    const root = findAliasRoot(project.cwd)
    const registry = await fetchRegistry(base)
    const names = root ? installedItems(registry, root) : []
    if (names.length) {
      const restyle =
        options.yes ||
        (await confirm(
          `Restyle the ${names.length} installed components? Local changes to them are replaced.`
        ))
      if (restyle) {
        await installItems(project, root, registry, names, {
          overwrite: true,
          base,
          style,
          icons,
          menuColor,
        })
      } else {
        manual.push(
          "Run npx @esuiss/ui add <name> --overwrite to restyle installed components later."
        )
      }
    }
  }

  if (options.rtl) manual.push(RTL_NOTE)
  for (const message of manual) note(message)
  step("Applied.")
}
