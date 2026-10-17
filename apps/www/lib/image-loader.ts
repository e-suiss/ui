const DEFAULT_QUALITY = 75

export default function cloudflareImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (process.env.NODE_ENV === "development") return `${src}?w=${width}`
  const options = `width=${width},quality=${quality ?? DEFAULT_QUALITY},format=auto`
  return `/cdn-cgi/image/${options}${src}`
}
