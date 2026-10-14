import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { step } from "../output.mjs"

const MINIMUM_TARGET = "15.1"
const HOOK = /^([ \t]*)post_install do \|installer\|\n/m

export function ensurePodDeploymentTarget(project) {
  if (project.framework !== "react-native") return []
  const file = path.join(project.cwd, "ios", "Podfile")
  if (!existsSync(file)) return []
  const text = readFileSync(file, "utf8")
  if (text.includes('["IPHONEOS_DEPLOYMENT_TARGET"].to_f')) return []

  const hook = text.match(HOOK)
  if (!hook) {
    return [
      `Raise IPHONEOS_DEPLOYMENT_TARGET to ${MINIMUM_TARGET} for every pod in the post_install hook of ios/Podfile.`,
    ]
  }
  const indent = `${hook[1]}  `
  const snippet = [
    "installer.pods_project.targets.each do |pod_target|",
    "  pod_target.build_configurations.each do |build_config|",
    `    if build_config.build_settings["IPHONEOS_DEPLOYMENT_TARGET"].to_f < ${MINIMUM_TARGET}`,
    `      build_config.build_settings["IPHONEOS_DEPLOYMENT_TARGET"] = "${MINIMUM_TARGET}"`,
    "    end",
    "  end",
    "end",
  ]
    .map((line) => `${indent}${line}\n`)
    .join("")
  const end = hook.index + hook[0].length
  writeFileSync(file, `${text.slice(0, end)}${snippet}${text.slice(end)}`)
  step(`Raised the pod deployment target to ${MINIMUM_TARGET} in ios/Podfile`)
  return []
}
