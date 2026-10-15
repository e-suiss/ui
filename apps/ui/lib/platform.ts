export type Platform = "web" | "rn" | "swift" | "kotlin"

export const PLATFORM_LABELS: Record<Platform, string> = {
  web: "React",
  rn: "React Native",
  swift: "SwiftUI",
  kotlin: "Compose",
}

export const KEY = "suiss-platform"

const PLATFORMS = Object.keys(PLATFORM_LABELS)

export function isPlatform(value: unknown): value is Platform {
  return PLATFORMS.includes(value as string)
}

export const platformScript = `(()=>{try{const p=new URLSearchParams(location.search).get("platform")||localStorage.getItem("${KEY}");if(${JSON.stringify(PLATFORMS)}.includes(p))document.documentElement.dataset.platform=p}catch(e){}})()`
