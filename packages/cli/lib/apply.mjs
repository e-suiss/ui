import { readFileSync, writeFileSync } from "node:fs"

import { installedItems, installItems } from "./add.mjs"
import { withFont } from "./fonts.mjs"
import {
  configureFont,
  presetFont,
  RTL_NOTE,
  stylesheetPackages,
} from "./init.mjs"
import { CliError, confirm, note, step } from "./output.mjs"
import { decodePreset } from "./preset.mjs"
import {
  detectBase,
  detectIcons,
  detectMenuAccent,
  detectMenuColor,
  detectProject,
  detectStyle,
  findAliasRoot,
  findStylesheet,
  install,
  saveBase,
} from "./project.mjs"
import { fetchRegistry, fetchStylesheet } from "./registry.mjs"
import { relative } from "./shared/project.mjs"
import {
  applyPreset,
  presetPalette,
  themeDefaults,
  withPointer,
  withTheme,
} from "./theme.mjs"

export const APPLY_MODES = ["theme", "font"]

async function themed(css, options, preset) {
  const reset = preset
    ? withTheme(css, themeDefaults(await fetchStylesheet()))
    : css
  const palette = await presetPalette(options, preset)
  return preset || palette ? applyPreset(reset, preset, palette) : reset
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
  const original = readFileSync(stylesheet, "utf8")
  let css = original

  if (only !== "font") css = await themed(css, options, preset)
  if (only !== "theme" && preset) {
    const font = presetFont(preset)
    css = withFont(css, project.framework, font)
    install(project, stylesheetPackages(css))
    manual.push(...configureFont(project, font))
  }
  if (options.pointer) css = withPointer(css)
  if (css === original) {
    step(`${relative(project, stylesheet)} already matches`)
  } else {
    writeFileSync(stylesheet, css)
    step(`Updated ${relative(project, stylesheet)}`)
  }

  if (!only && (preset || options.style)) {
    const base = options.base ?? detectBase(project.cwd)
    const style = options.style ?? preset?.style ?? detectStyle(project.cwd)
    const icons = preset?.iconLibrary ?? detectIcons(project.cwd)
    const menuColor = preset?.menuColor ?? detectMenuColor(project.cwd)
    const menuAccent = preset?.menuAccent ?? detectMenuAccent(project.cwd)
    const saved = saveBase(project, base, stylesheet, style, {
      ...(preset
        ? {
            iconLibrary: icons,
            menuColor,
            menuAccent,
            baseColor: preset.baseColor,
          }
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
          menuAccent,
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
