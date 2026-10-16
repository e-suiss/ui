export async function copyText(text: string | Promise<string>) {
  if (typeof text === "string") return navigator.clipboard.writeText(text)
  if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
    const blob = text.then((value) => new Blob([value], { type: "text/plain" }))
    return navigator.clipboard.write([
      new ClipboardItem({ "text/plain": blob }),
    ])
  }
  return navigator.clipboard.writeText(await text)
}
