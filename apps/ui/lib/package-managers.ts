export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const

export type PackageManager = (typeof PACKAGE_MANAGERS)[number]
