type Fonts = { sans?: string; heading?: string }

const fonts: Fonts = {}

function fontFamily(heading = false) {
  const family = heading ? (fonts.heading ?? fonts.sans) : fonts.sans
  return family ? { fontFamily: family } : undefined
}

export { fontFamily, fonts }
