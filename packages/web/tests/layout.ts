export type LayoutFinding = { check: string; rule: string; targets: string[] }

export function describeElement(element: Element) {
  const slot = element.getAttribute("data-slot")
  const name = (element.textContent ?? "").trim().slice(0, 40)
  return `${element.tagName.toLowerCase()}${slot ? `[${slot}]` : ""} "${name}"`
}

function visuallyHidden(element: Element) {
  const box = element.getBoundingClientRect()
  return box.width <= 1 || box.height <= 1
}

function hasOwnText(element: Element) {
  return Array.from(element.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  )
}

function clips(style: CSSStyleDeclaration) {
  return ["hidden", "clip"].includes(style.overflowX)
}

function clipsText(element: Element) {
  if (visuallyHidden(element) || !hasOwnText(element)) return false
  const style = getComputedStyle(element)
  if (style.textOverflow === "ellipsis") return false
  if (style.webkitLineClamp !== "none") return false
  const clipsX = clips(style) && element.scrollWidth > element.clientWidth + 1
  const clipsY =
    ["hidden", "clip"].includes(style.overflowY) &&
    element.scrollHeight > element.clientHeight + 1
  return clipsX || clipsY
}

function clippingAncestor(element: Element) {
  let node = element.parentElement
  while (node && node !== document.body) {
    const style = getComputedStyle(node)
    if (["auto", "scroll"].includes(style.overflowX)) return null
    if (clips(style)) return node
    node = node.parentElement
  }
  return null
}

function spillsOutOfClip(element: Element) {
  if (visuallyHidden(element) || !hasOwnText(element)) return false
  if (element.closest("[aria-hidden=true], [inert], [data-visual-mask]"))
    return false
  if (element.closest("[aria-roledescription=carousel]")) return false
  if (getComputedStyle(element).visibility === "hidden") return false
  const ancestor = clippingAncestor(element)
  if (!ancestor) return false
  const box = element.getBoundingClientRect()
  const clip = ancestor.getBoundingClientRect()
  const inside = box.right > clip.left + 1 && box.left < clip.right - 1
  return inside && (box.right > clip.right + 1 || box.left < clip.left - 1)
}

function sticksOut(width: number) {
  return Array.from(document.body.querySelectorAll("*")).filter((element) => {
    const parent = element.parentElement
    return (
      element.getBoundingClientRect().right > width + 1 &&
      parent !== null &&
      parent.getBoundingClientRect().right <= width + 1
    )
  })
}

export function findLayoutIssues(check: string) {
  const found: LayoutFinding[] = []
  const scroller = document.scrollingElement
  if (scroller && scroller.scrollWidth > scroller.clientWidth + 1) {
    found.push({
      check,
      rule: "page-scrolls-sideways",
      targets: [
        `${scroller.scrollWidth}px wide in ${scroller.clientWidth}px`,
        ...sticksOut(scroller.clientWidth).map(describeElement),
      ],
    })
  }
  const elements = Array.from(document.body.querySelectorAll("*"))
  const clipped = elements.filter(clipsText).map(describeElement)
  if (clipped.length > 0) {
    found.push({ check, rule: "text-clipped", targets: clipped })
  }
  const spilled = elements.filter(spillsOutOfClip).map(describeElement)
  if (spilled.length > 0) {
    found.push({ check, rule: "content-cut-by-container", targets: spilled })
  }
  return found
}
