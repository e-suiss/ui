import { useColorScheme } from "react-native"

const light = {
  background: "#ffffff",
  foreground: "#000000",
  card: "#ffffff",
  cardForeground: "#000000",
  popover: "#ffffff",
  popoverForeground: "#000000",
  primary: "#0088ff",
  primaryForeground: "#ffffff",
  secondary: "rgba(118, 118, 128, 0.12)",
  secondaryForeground: "#000000",
  muted: "#f2f2f7",
  mutedForeground: "rgba(60, 60, 67, 0.6)",
  accent: "rgba(118, 118, 128, 0.12)",
  accentForeground: "#000000",
  destructive: "#ff383c",
  destructiveSubtle: "rgba(255, 56, 60, 0.1)",
  destructivePressed: "rgba(255, 56, 60, 0.2)",
  border: "rgba(60, 60, 67, 0.12)",
  input: "#c6c6c8",
  inputSubtle: "rgba(198, 198, 200, 0.5)",
  inputSoft: "rgba(198, 198, 200, 0.5)",
  inputStrong: "rgba(198, 198, 200, 0.9)",
  mutedSubtle: "rgba(242, 242, 247, 0.5)",
  foregroundSubtle: "rgba(0, 0, 0, 0.6)",
  destructiveStrong: "rgba(255, 56, 60, 0.9)",
  borderSubtle: "rgba(60, 60, 67, 0.06)",
  ring: "#0088ff",
  outline: "rgba(0, 0, 0, 0.05)",
  overlay: "rgba(0, 0, 0, 0.3)",
  chart1: "#00c0e8",
  chart2: "#0088ff",
  chart3: "#6155f5",
  chart4: "#cb30e0",
  chart5: "#ff2d55",
}

type ThemeColors = typeof light

const dark: ThemeColors = {
  background: "#000000",
  foreground: "#ffffff",
  card: "#1c1c1e",
  cardForeground: "#ffffff",
  popover: "#2c2c2e",
  popoverForeground: "#ffffff",
  primary: "#0091ff",
  primaryForeground: "#ffffff",
  secondary: "rgba(118, 118, 128, 0.24)",
  secondaryForeground: "#ffffff",
  muted: "#1c1c1e",
  mutedForeground: "rgba(235, 235, 245, 0.6)",
  accent: "rgba(118, 118, 128, 0.24)",
  accentForeground: "#ffffff",
  destructive: "#ff4245",
  destructiveSubtle: "rgba(255, 66, 69, 0.2)",
  destructivePressed: "rgba(255, 66, 69, 0.3)",
  border: "rgba(84, 84, 88, 0.5)",
  input: "#38383a",
  inputSubtle: "rgba(56, 56, 58, 0.3)",
  inputSoft: "rgba(56, 56, 58, 0.5)",
  inputStrong: "rgba(56, 56, 58, 0.9)",
  mutedSubtle: "rgba(28, 28, 30, 0.5)",
  foregroundSubtle: "rgba(255, 255, 255, 0.6)",
  destructiveStrong: "rgba(255, 66, 69, 0.9)",
  borderSubtle: "rgba(84, 84, 88, 0.25)",
  ring: "#0091ff",
  outline: "rgba(255, 255, 255, 0.1)",
  overlay: "rgba(0, 0, 0, 0.3)",
  chart1: "#3cd3fe",
  chart2: "#0091ff",
  chart3: "#6d7cff",
  chart4: "#db34f2",
  chart5: "#ff375f",
}

const radius = {
  sm: 7.2,
  md: 9.6,
  lg: 12,
  xl: 16.8,
  "2xl": 21.6,
  "3xl": 26.4,
  "4xl": 31.2,
  full: 9999,
}

const fontSize = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  base: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
  "2xl": { fontSize: 24, lineHeight: 32 },
  "3xl": { fontSize: 30, lineHeight: 36 },
  "4xl": { fontSize: 36, lineHeight: 40 },
}

const shadow = {
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
}

function useTheme() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  return { colors: isDark ? dark : light, isDark, radius, fontSize, shadow }
}

export type { ThemeColors }
export { dark, fontSize, light, radius, shadow, useTheme }
