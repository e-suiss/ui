const kinds: Record<string, string> = {
  Component: "component",
  Pattern: "pattern",
  Interaction: "interaction",
  Chart: "chart",
  Block: "block",
}

const platformNames: Record<string, string> = {
  web: "React",
  rn: "React Native",
  swift: "SwiftUI",
  kotlin: "Jetpack Compose",
}

function list(items: string[]) {
  if (items.length < 2) return items.join("")
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
}

export function pageSummary(
  title: string,
  eyebrow: string | undefined,
  platforms: string[] = []
) {
  const kind = eyebrow ? kinds[eyebrow] : undefined
  if (!kind) return undefined
  const names = platforms
    .map((platform) => platformNames[platform])
    .filter(Boolean)
  const target = names.length ? ` for ${list(names)}` : ""
  return `${title} is an open-source ${kind} from suiss/ui${target}. The @esuiss/ui CLI copies its source into your project, so you own the code.`
}
