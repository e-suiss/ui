import { readFileSync, writeFileSync } from "node:fs"

import { installedItems, installItems } from "./add.mjs"
import { withFont } from "./fonts.mjs"
import {
  configureFont,
  presetFont,
  RTL_NOTE,
  stylesheetPackages,
  styleWarning,
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
import { assertPackageNames, relative } from "./shared/project.mjs"
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

function stylingOf(cwd) {
  return {
    base: detectBase(cwd),
    style: detectStyle(cwd),
    icons: detectIcons(cwd),
    menuColor: detectMenuColor(cwd),
    menuAccent: detectMenuAccent(cwd),
  }
}

function targetStyling(previous, options, preset) {
  const fromPreset = options.only ? null : preset
  return {
    base: previous.base,
    style: options.style ?? fromPreset?.style ?? previous.style,
    icons: fromPreset?.iconLibrary ?? previous.icons,
    menuColor: fromPreset?.menuColor ?? previous.menuColor,
    menuAccent: fromPreset?.menuAccent ?? previous.menuAccent,
  }
}

async function restylePlan(project, options, preset) {
  const previous = stylingOf(project.cwd)
  const styling = targetStyling(previous, options, preset)
  const root = findAliasRoot(project.cwd)
  const registry = await fetchRegistry(styling.base)
  const names = root ? installedItems(registry, root) : []
  const changed = Object.keys(styling).some(
    (key) => styling[key] !== previous[key]
  )
  if (!names.length || !changed) return { styling, names: [] }
  if (!options.yes && !process.stdin.isTTY) {
    throw new CliError(
      `This changes the style of the ${names.length} installed components. Run again with --yes to restyle them, nothing was changed.`
    )
  }
  const restyle =
    options.yes ||
    (await confirm(
      `Restyle the ${names.length} installed components? Local changes to them are replaced.`
    ))
  if (!restyle) {
    throw new CliError(
      "Cancelled, nothing was changed. The new style needs the installed components restyled."
    )
  }
  return { styling, names, root, registry }
}

function configExtras(options, preset, styling) {
  if (!preset) return {}
  if (options.only) return { baseColor: preset.baseColor }
  return {
    iconLibrary: styling.icons,
    menuColor: styling.menuColor,
    menuAccent: styling.menuAccent,
    baseColor: preset.baseColor,
  }
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
  if (only !== "theme") styleWarning(options, preset)
  const manual = []
  const original = readFileSync(stylesheet, "utf8")
  let css = original
  let font = null

  if (only !== "font") css = await themed(css, options, preset)
  if (only !== "theme" && preset) {
    font = presetFont(preset)
    css = withFont(css, project.framework, font)
  }
  if (options.pointer) css = withPointer(css)
  const packages = font ? stylesheetPackages(css) : []
  assertPackageNames(packages)

  const restyles =
    only === "font" ? false : Boolean(options.style || (!only && preset))
  const plan = restyles ? await restylePlan(project, options, preset) : null

  if (css === original) {
    step(`${relative(project, stylesheet)} already matches`)
  } else {
    writeFileSync(stylesheet, css)
    step(`Updated ${relative(project, stylesheet)}`)
  }
  install(project, packages)
  if (font) manual.push(...configureFont(project, font))

  if (plan || (only === "theme" && preset)) {
    const styling =
      plan?.styling ?? targetStyling(stylingOf(project.cwd), options, preset)
    const saved = saveBase(
      project,
      styling.base,
      stylesheet,
      plan ? styling.style : undefined,
      configExtras(options, preset, styling)
    )
    if (saved?.invalid) {
      manual.push(
        `Could not read ${relative(project, saved.file)}. Set its style to ${styling.base}-${styling.style} by hand.`
      )
    } else if (saved) {
      step(
        `${saved.created ? "Created" : "Updated"} ${relative(project, saved.file)} with the ${saved.style} style`
      )
    }
    if (plan?.names.length) {
      await installItems(project, plan.root, plan.registry, plan.names, {
        overwrite: true,
        ...plan.styling,
      })
    }
  }

  if (options.rtl) manual.push(RTL_NOTE)
  for (const message of manual) note(message)
  step("Applied.")
}
