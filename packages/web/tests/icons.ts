import type { Plugin } from "vite"
import { iconPackages, toIcons } from "../../cli/lib/icons.mjs"

const SOURCE = /\.tsx$/

export function swapIcons(library: string): Plugin {
  return {
    name: `swap-icons-${library}`,
    enforce: "pre",
    transform(code, id) {
      if (!SOURCE.test(id.split("?")[0] ?? id)) return null
      const swapped = toIcons(code, library)
      return swapped === code ? null : { code: swapped, map: null }
    },
  }
}

export { iconPackages }
