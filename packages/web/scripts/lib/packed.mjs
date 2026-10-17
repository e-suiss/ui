const MAGIC = "ESUISS-STYLES 1\n"
const NEWLINE = 10
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const magic = encoder.encode(MAGIC)

export function packStyles(variants) {
  const chunks = []
  const styles = {}
  for (const [style, text] of variants) {
    let index = chunks.indexOf(text)
    if (index === -1) index = chunks.push(text) - 1
    styles[style] = index
  }
  const bodies = chunks.map((chunk) => encoder.encode(chunk))
  let offset = 0
  const ranges = bodies.map((body) => {
    const range = [offset, body.length]
    offset += body.length
    return range
  })
  const header = encoder.encode(
    `${MAGIC}${JSON.stringify({ styles, ranges })}\n`
  )
  const result = new Uint8Array(header.length + offset)
  result.set(header)
  let cursor = header.length
  for (const body of bodies) {
    result.set(body, cursor)
    cursor += body.length
  }
  return result
}

export function isPacked(bytes) {
  if (bytes.length < magic.length) return false
  for (let index = 0; index < magic.length; index++) {
    if (bytes[index] !== magic[index]) return false
  }
  return true
}

export function unpackStyle(bytes, style, fallback) {
  const end = bytes.indexOf(NEWLINE, magic.length)
  const { styles, ranges } = JSON.parse(
    decoder.decode(bytes.subarray(magic.length, end))
  )
  const chunk = styles[style] ?? styles[fallback]
  const [start, length] = ranges[chunk]
  const from = end + 1 + start
  return bytes.subarray(from, from + length)
}
