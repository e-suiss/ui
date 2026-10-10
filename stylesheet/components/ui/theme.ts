import { type BoxShadowValue, useColorScheme } from "react-native"

const light = {
  surface: "#ffffff",
  surfaceSecondary: "#f5f5f7",
  surfaceTertiary: "#e8e8ed",
  surfaceRaised: "#ffffff",
  label: "#1d1d1f",
  labelSecondary: "#6e6e73",
  labelTertiary: "#86868b",
  labelQuaternary: "#d2d2d7",
  control: "rgba(0, 0, 0, 0.04)",
  controlPressed: "rgba(0, 0, 0, 0.12)",
  controlSelected: "#1d1d1f",
  controlDisabled: "rgba(0, 0, 0, 0.03)",
  onControlSelected: "#ffffff",
  itemPressed: "rgba(0, 0, 0, 0.08)",
  itemSelected: "rgba(0, 0, 0, 0.06)",
  separator: "#d2d2d7",
  separatorStrong: "#86868b",
  accent: "#0071e3",
  accentPressed: "#005bb8",
  accentSelected: "#0071e3",
  accentDisabled: "rgba(0, 113, 227, 0.4)",
  onAccent: "#ffffff",
  accentSurface: "rgba(0, 113, 227, 0.09)",
  accentSurfacePressed: "rgba(0, 113, 227, 0.18)",
  link: "#0066cc",
  focus: "#0071e3",
  scrim: "rgba(0, 0, 0, 0.48)",
  danger: "#d0000a",
  dangerSurface: "rgba(215, 0, 21, 0.08)",
  dangerSurfacePressed: "rgba(215, 0, 21, 0.16)",
  success: "#008009",
  successSurface: "#effaf1",
  warning: "#b64400",
  warningSurface: "#fff5ea",
  blue: "#007aff",
  green: "#34c759",
  orange: "#ff9500",
  red: "#ff3b30",
  yellow: "#ffcc00",
  purple: "#af52de",
  pink: "#ff2d55",
  indigo: "#5856d6",
  teal: "#30b0c7",
  mint: "#00c7be",
  cyan: "#32ade6",
  brown: "#a2845e",
  gray: "#8e8e93",
}

type ThemeColors = typeof light

const dark: ThemeColors = {
  surface: "#000000",
  surfaceSecondary: "#161617",
  surfaceTertiary: "#2c2c2e",
  surfaceRaised: "#1d1d1f",
  label: "#f5f5f7",
  labelSecondary: "#a1a1a6",
  labelTertiary: "#86868b",
  labelQuaternary: "#424245",
  control: "rgba(255, 255, 255, 0.1)",
  controlPressed: "rgba(255, 255, 255, 0.22)",
  controlSelected: "#f5f5f7",
  controlDisabled: "rgba(255, 255, 255, 0.05)",
  onControlSelected: "#000000",
  itemPressed: "rgba(255, 255, 255, 0.12)",
  itemSelected: "rgba(255, 255, 255, 0.1)",
  separator: "#424245",
  separatorStrong: "#6e6e73",
  accent: "#0071e3",
  accentPressed: "#004d9e",
  accentSelected: "#0071e3",
  accentDisabled: "rgba(0, 113, 227, 0.4)",
  onAccent: "#ffffff",
  accentSurface: "rgba(0, 113, 227, 0.18)",
  accentSurfacePressed: "rgba(0, 113, 227, 0.3)",
  link: "#2997ff",
  focus: "#0071e3",
  scrim: "rgba(0, 0, 0, 0.48)",
  danger: "#ff5447",
  dangerSurface: "rgba(255, 69, 58, 0.2)",
  dangerSurfacePressed: "rgba(255, 69, 58, 0.36)",
  success: "#30d158",
  successSurface: "rgba(48, 209, 88, 0.16)",
  warning: "#ff9f0a",
  warningSurface: "rgba(255, 159, 10, 0.16)",
  blue: "#0a84ff",
  green: "#30d158",
  orange: "#ff9f0a",
  red: "#ff453a",
  yellow: "#ffd60a",
  purple: "#bf5af2",
  pink: "#ff375f",
  indigo: "#5e5ce6",
  teal: "#40c8e0",
  mint: "#66d4cf",
  cyan: "#64d2ff",
  brown: "#ac8e68",
  gray: "#8e8e93",
}

const radius = {
  xs: 3,
  sm: 5,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 18,
  "3xl": 28,
  full: 9999,
}

const fontSize = {
  "3xs": { fontSize: 11, lineHeight: 13, letterSpacing: 0.066 },
  "2xs": { fontSize: 12, lineHeight: 16, letterSpacing: 0 },
  xs: { fontSize: 13, lineHeight: 18, letterSpacing: -0.078 },
  sm: { fontSize: 15, lineHeight: 20, letterSpacing: -0.24 },
  md: { fontSize: 16, lineHeight: 21, letterSpacing: -0.32 },
  base: { fontSize: 17, lineHeight: 22, letterSpacing: -0.442 },
  lg: { fontSize: 20, lineHeight: 25, letterSpacing: -0.46 },
  xl: { fontSize: 22, lineHeight: 28, letterSpacing: -0.264 },
  "2xl": { fontSize: 28, lineHeight: 34, letterSpacing: 0.392 },
  "3xl": { fontSize: 34, lineHeight: 41, letterSpacing: 0.408 },
}

const shadow = {
  xs: { boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  sm: {
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  },
  md: { boxShadow: "2px 4px 12px rgba(0, 0, 0, 0.08)" },
  lg: { boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)" },
  xl: {
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
} satisfies Record<string, { boxShadow: string | BoxShadowValue[] }>

function useTheme() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  return { colors: isDark ? dark : light, isDark, radius, fontSize, shadow }
}

export type { ThemeColors }
export { dark, fontSize, light, radius, shadow, useTheme }
