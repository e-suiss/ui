const ROOT_FONT_SIZE = 16

function parseAlpha(value) {
  if (value === undefined) return 1
  return value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value)
}

function encode(channel) {
  const clamped = Math.min(1, Math.max(0, channel))
  const gamma =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055
  return Math.round(gamma * 255)
}

function oklchToRgb(lightness, chroma, hue) {
  const radians = (hue * Math.PI) / 180
  const a = chroma * Math.cos(radians)
  const b = chroma * Math.sin(radians)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function parseColor(value) {
  const hex = value.match(/^#([\da-f]{6})$/i)
  if (hex) {
    const channels = hex[1]
      .match(/../g)
      .map((part) => Number.parseInt(part, 16))
    return { channels, alpha: 1 }
  }
  const rgb = value.match(
    /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
  )
  if (rgb) {
    return { channels: rgb.slice(1, 4).map(Number), alpha: parseAlpha(rgb[4]) }
  }
  const oklch = value.match(
    /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
  )
  if (oklch) {
    return {
      channels: oklchToRgb(
        Number(oklch[1]),
        Number(oklch[2]),
        Number(oklch[3])
      ),
      alpha: parseAlpha(oklch[4]),
    }
  }
  throw new Error(`Unsupported color value "${value}"`)
}

function round(value) {
  return Math.round(value * 1000) / 1000
}

function toRgb(value, opacity = 1) {
  const { channels, alpha } = parseColor(value)
  const combined = round(alpha * opacity)
  if (combined === 1) {
    return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
  }
  return `rgba(${channels.join(", ")}, ${combined})`
}

function toPixels(value) {
  if (value.endsWith("rem"))
    return round(Number.parseFloat(value) * ROOT_FONT_SIZE)
  if (value.endsWith("px")) return round(Number.parseFloat(value))
  return round(Number.parseFloat(value))
}

function variantBlock(css, name) {
  const start = css.indexOf(`@variant ${name}`)
  const end = css.indexOf("}", start)
  return Object.fromEntries(
    [...css.slice(start, end).matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map(
      (match) => [match[1], match[2].trim()]
    )
  )
}

function themeBlock(css) {
  const body = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? ""
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((match) => [
      match[1],
      match[2].trim(),
    ])
  )
}

function readTheme(css) {
  const values = themeBlock(css)
  const text = {}
  const radius = {}
  const shadow = {}
  for (const [name, value] of Object.entries(values)) {
    const textMatch = name.match(
      /^text-([\w]+)(?:--(line-height|letter-spacing))?$/
    )
    if (textMatch) {
      const [, size, property] = textMatch
      text[size] ??= {}
      if (!property) text[size].fontSize = toPixels(value)
      else if (property === "line-height")
        text[size].lineHeight = toPixels(value)
      else text[size].letterSpacing = Number.parseFloat(value)
      continue
    }
    const radiusMatch = name.match(/^radius-([\w]+)$/)
    if (radiusMatch) {
      radius[radiusMatch[1]] = toPixels(value)
      continue
    }
    const shadowMatch = name.match(/^shadow-([\w]+)$/)
    if (shadowMatch) shadow[shadowMatch[1]] = value
  }
  for (const size of Object.values(text)) {
    size.letterSpacing = round((size.letterSpacing ?? 0) * size.fontSize)
  }
  return {
    light: variantBlock(css, "light"),
    dark: variantBlock(css, "dark"),
    text,
    radius,
    shadow,
  }
}

function convertColors(value) {
  return value.replace(/(?:oklch|rgb)\([^)]*\)|#[\da-f]{6}\b/gi, (color) =>
    toRgb(color)
  )
}

export { convertColors, readTheme, toRgb }
