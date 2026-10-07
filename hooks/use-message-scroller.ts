"use client"

import * as React from "react"

type MessageScrollerDefaultScrollPosition = "start" | "end" | "last-anchor"

type MessageScrollerScrollDirection = "start" | "end"

type MessageScrollerScrollAlign = "start" | "center" | "end" | "nearest"

type MessageScrollerScrollOptions = {
  align?: MessageScrollerScrollAlign
  behavior?: ScrollBehavior
  scrollMargin?: number
}

type MessageScrollerScrollable = {
  start: boolean
  end: boolean
}

type MessageScrollerVisibilityState = {
  currentAnchorId: string | null
  visibleMessageIds: string[]
}

type MessageScrollerOptions = {
  autoScroll?: boolean
  defaultScrollPosition?: MessageScrollerDefaultScrollPosition
  scrollEdgeThreshold?: number
  scrollPreviousItemPeek?: number
  scrollMargin?: number
}

type ResolvedMessageScrollerOptions = Required<MessageScrollerOptions>

type ScrollMode =
  | "following-bottom"
  | "free-scrolling"
  | "anchored-to-message"
  | "settling-jump"

type ViewportAnchor = {
  element: HTMLElement
  viewportTop: number
}

type PendingScrollToMessage = {
  messageId: string
  options?: MessageScrollerScrollOptions
}

type BlockPadding = {
  start: number
  end: number
}

const DEFAULT_SCROLL_EDGE_THRESHOLD = 8
const DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK = 64
const DEFAULT_SCROLL_MARGIN = 0
const SCROLL_TOLERANCE = 0.5
const AUTOSCROLLING_SETTLE_DELAY = 180

const USER_SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  " ",
])

const NOT_SCROLLABLE: MessageScrollerScrollable = { start: false, end: false }

const NO_VISIBLE_MESSAGES: MessageScrollerVisibilityState = {
  currentAnchorId: null,
  visibleMessageIds: [],
}

class SnapshotStore<Snapshot> {
  private snapshot: Snapshot
  private readonly isEqual: (current: Snapshot, next: Snapshot) => boolean
  private readonly listeners = new Set<() => void>()
  private readonly onFirstSubscribe?: () => void
  private readonly onLastUnsubscribe?: () => void

  constructor(
    initialSnapshot: Snapshot,
    isEqual: (current: Snapshot, next: Snapshot) => boolean,
    lifecycle: {
      onFirstSubscribe?: () => void
      onLastUnsubscribe?: () => void
    } = {}
  ) {
    this.snapshot = initialSnapshot
    this.isEqual = isEqual
    this.onFirstSubscribe = lifecycle.onFirstSubscribe
    this.onLastUnsubscribe = lifecycle.onLastUnsubscribe
  }

  getSnapshot = () => this.snapshot

  hasListeners() {
    return this.listeners.size > 0
  }

  setSnapshot(nextSnapshot: Snapshot) {
    if (this.isEqual(this.snapshot, nextSnapshot)) return
    this.snapshot = nextSnapshot
    for (const listener of this.listeners) listener()
  }

  subscribe = (listener: () => void) => {
    const isFirstListener = this.listeners.size === 0
    this.listeners.add(listener)
    if (isFirstListener) this.onFirstSubscribe?.()
    return () => {
      this.listeners.delete(listener)
      if (this.listeners.size === 0) this.onLastUnsubscribe?.()
    }
  }
}

function isSameScrollable(
  current: MessageScrollerScrollable,
  next: MessageScrollerScrollable
) {
  return current.start === next.start && current.end === next.end
}

function isSameVisibility(
  current: MessageScrollerVisibilityState,
  next: MessageScrollerVisibilityState
) {
  return (
    current.currentAnchorId === next.currentAnchorId &&
    current.visibleMessageIds.length === next.visibleMessageIds.length &&
    current.visibleMessageIds.every(
      (messageId, index) => messageId === next.visibleMessageIds[index]
    )
  )
}

function parsePixels(value: string | undefined) {
  if (!value) return 0
  const pixels = Number.parseFloat(value)
  return Number.isFinite(pixels) ? pixels : 0
}

function readBlockPadding(element: HTMLElement): BlockPadding {
  const style = window.getComputedStyle(element)
  return {
    start: parsePixels(style.paddingBlockStart || style.paddingTop),
    end: parsePixels(style.paddingBlockEnd || style.paddingBottom),
  }
}

function readContentPadding(spacer: HTMLElement | null): BlockPadding {
  const content = spacer?.parentElement
  return content ? readBlockPadding(content) : { start: 0, end: 0 }
}

function readRowGap(element: HTMLElement | null) {
  if (!element) return 0
  const style = window.getComputedStyle(element)
  return parsePixels(style.rowGap === "normal" ? style.gap : style.rowGap)
}

function isScrollAnchor(element: HTMLElement | undefined) {
  return element?.dataset.scrollAnchor === "true"
}

function getMessageItems(content: HTMLElement, spacer: HTMLElement | null) {
  return Array.from(content.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child !== spacer
  )
}

function findScrollAnchorFrom(items: HTMLElement[], startIndex: number) {
  return items.slice(startIndex).find(isScrollAnchor) ?? null
}

function findUnhandledScrollAnchor(
  items: HTMLElement[],
  handledAnchors: WeakSet<HTMLElement>
) {
  return (
    items.find((item) => isScrollAnchor(item) && !handledAnchors.has(item)) ??
    null
  )
}

function hasMultipleScrollAnchorsFrom(
  items: HTMLElement[],
  startIndex: number
) {
  return items.slice(startIndex).filter(isScrollAnchor).length > 1
}

function findLastScrollAnchor(items: HTMLElement[]) {
  return [...items].reverse().find(isScrollAnchor) ?? null
}

function distanceFromViewportTop(element: HTMLElement, viewport: HTMLElement) {
  return (
    element.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}

function offsetWithinViewport(element: HTMLElement, viewport: HTMLElement) {
  return distanceFromViewportTop(element, viewport) + viewport.scrollTop
}

function getMaxScrollTop(viewport: HTMLElement) {
  return Math.max(0, viewport.scrollHeight - viewport.clientHeight)
}

type LayoutElements = {
  content: HTMLElement
  spacer: HTMLElement | null
  viewport: HTMLElement
}

function measureContentBottom({ content, spacer, viewport }: LayoutElements) {
  const padding = readBlockPadding(content)
  const viewportTop = viewport.getBoundingClientRect().top
  return getMessageItems(content, spacer).reduce(
    (bottom, item) =>
      Math.max(
        bottom,
        item.getBoundingClientRect().bottom -
          viewportTop +
          viewport.scrollTop +
          padding.end
      ),
    padding.start + padding.end
  )
}

function measureScrollable(
  layout: LayoutElements | null,
  scrollEdgeThreshold: number
): MessageScrollerScrollable {
  if (!layout) return NOT_SCROLLABLE
  const { viewport } = layout
  const contentBottom = measureContentBottom(layout)
  return {
    start: viewport.scrollTop > scrollEdgeThreshold,
    end:
      contentBottom - viewport.scrollTop - viewport.clientHeight >
      scrollEdgeThreshold,
  }
}

function measureSpacerHeightFor(layout: LayoutElements, scrollTop: number) {
  return scrollTop + layout.viewport.clientHeight - measureContentBottom(layout)
}

function measureTargetScrollTop({
  align,
  element,
  scrollMargin,
  spacer,
  viewport,
}: {
  align: MessageScrollerScrollAlign
  element: HTMLElement
  scrollMargin: number
  spacer: HTMLElement | null
  viewport: HTMLElement
}) {
  const elementTop = offsetWithinViewport(element, viewport)
  const elementHeight = element.getBoundingClientRect().height
  const padding = readContentPadding(spacer)

  if (align === "center") {
    const visibleHeight = Math.max(
      0,
      viewport.clientHeight - padding.start - padding.end
    )
    return (
      elementTop -
      padding.start -
      (visibleHeight - elementHeight) / 2 -
      scrollMargin
    )
  }

  if (align === "end") {
    return (
      elementTop -
      viewport.clientHeight +
      elementHeight +
      padding.end +
      scrollMargin
    )
  }

  if (align === "nearest") {
    const elementBottom = elementTop + elementHeight
    const visibleTop = viewport.scrollTop + padding.start
    const visibleBottom =
      viewport.scrollTop + viewport.clientHeight - padding.end
    if (elementTop >= visibleTop && elementBottom <= visibleBottom) {
      return viewport.scrollTop
    }
    if (elementTop < visibleTop) {
      return elementTop - padding.start - scrollMargin
    }
    return elementBottom - viewport.clientHeight + padding.end + scrollMargin
  }

  return elementTop - padding.start - scrollMargin
}

function findFirstVisibleMessage({
  content,
  spacer,
  viewport,
}: LayoutElements) {
  const viewportRect = viewport.getBoundingClientRect()
  return (
    getMessageItems(content, spacer).find((item) => {
      if (!item.dataset.messageId) return false
      const itemRect = item.getBoundingClientRect()
      return (
        itemRect.bottom > viewportRect.top && itemRect.top < viewportRect.bottom
      )
    }) ?? null
  )
}

function measureVisibility({
  layout,
  observedVisibleMessageIds,
  scrollMargin,
  scrollPreviousItemPeek,
}: {
  layout: LayoutElements | null
  observedVisibleMessageIds: Set<string>
  scrollMargin: number
  scrollPreviousItemPeek: number
}): MessageScrollerVisibilityState {
  if (!layout) return NO_VISIBLE_MESSAGES
  const { content, spacer, viewport } = layout

  const viewportRect = viewport.getBoundingClientRect()
  const anchorLine = viewportRect.top + scrollMargin + scrollPreviousItemPeek
  const canObserveIntersections = typeof IntersectionObserver !== "undefined"
  const visibleMessageIds: string[] = []
  let currentAnchorId: string | null = null

  for (const item of getMessageItems(content, spacer)) {
    const messageId = item.dataset.messageId
    if (!messageId) continue
    const itemIsAnchor = isScrollAnchor(item)
    const itemRect =
      itemIsAnchor || !canObserveIntersections
        ? item.getBoundingClientRect()
        : null
    const isVisible =
      !canObserveIntersections && itemRect
        ? itemRect.bottom > anchorLine && itemRect.top < viewportRect.bottom
        : observedVisibleMessageIds.has(messageId)
    if (isVisible) visibleMessageIds.push(messageId)
    if (
      itemIsAnchor &&
      itemRect &&
      itemRect.top <= anchorLine + SCROLL_TOLERANCE
    ) {
      currentAnchorId = messageId
    }
  }

  if (visibleMessageIds.length === 0 && currentAnchorId === null) {
    return NO_VISIBLE_MESSAGES
  }
  return { currentAnchorId, visibleMessageIds }
}

function resolveOptions(
  options: MessageScrollerOptions
): ResolvedMessageScrollerOptions {
  return {
    autoScroll: options.autoScroll ?? false,
    defaultScrollPosition: options.defaultScrollPosition ?? "end",
    scrollEdgeThreshold:
      options.scrollEdgeThreshold ?? DEFAULT_SCROLL_EDGE_THRESHOLD,
    scrollPreviousItemPeek:
      options.scrollPreviousItemPeek ?? DEFAULT_SCROLL_PREVIOUS_ITEM_PEEK,
    scrollMargin: options.scrollMargin ?? DEFAULT_SCROLL_MARGIN,
  }
}

class MessageScrollerController {
  readonly scrollableStore: SnapshotStore<MessageScrollerScrollable>
  readonly visibilityStore: SnapshotStore<MessageScrollerVisibilityState>
  readonly pendingDefaultScrollStore: SnapshotStore<boolean>
  preserveScrollOnPrepend = true

  private options: ResolvedMessageScrollerOptions
  private mode: ScrollMode
  private anchoredElement: HTMLElement | null = null
  private isAutoscrolling = false
  private autoscrollingTimeout: number | null = null
  private rootElement: HTMLElement | null = null
  private viewportElement: HTMLElement | null = null
  private contentElement: HTMLElement | null = null
  private spacerElement: HTMLElement | null = null
  private spacerGap = 0
  private spacerHeight = 0
  private itemCount = 0
  private firstItem: HTMLElement | null = null
  private lastScrollTop = 0
  private defaultScrollPositionApplied = false
  private pendingScrollToMessage: PendingScrollToMessage | null = null
  private prependAnchor: ViewportAnchor | null = null
  private readonly messageElements = new Map<string, HTMLElement>()
  private readonly handledScrollAnchors = new WeakSet<HTMLElement>()
  private readonly observedVisibleMessageIds = new Set<string>()
  private visibilityObserver: IntersectionObserver | null = null
  private stateFrame: number | null = null
  private visibilityFrame: number | null = null
  private pendingScrollFrame: number | null = null

  constructor(options: ResolvedMessageScrollerOptions) {
    this.options = options
    this.mode = options.autoScroll ? "following-bottom" : "free-scrolling"
    this.scrollableStore = new SnapshotStore(NOT_SCROLLABLE, isSameScrollable)
    this.visibilityStore = new SnapshotStore(
      NO_VISIBLE_MESSAGES,
      isSameVisibility,
      {
        onFirstSubscribe: this.observeVisibility,
        onLastUnsubscribe: this.unobserveVisibility,
      }
    )
    this.pendingDefaultScrollStore = new SnapshotStore(
      options.defaultScrollPosition !== "start",
      Object.is
    )
  }

  updateOptions(options: ResolvedMessageScrollerOptions) {
    if (options.defaultScrollPosition !== this.options.defaultScrollPosition) {
      this.defaultScrollPositionApplied = false
    }
    this.options = options
  }

  setRootElement = (element: HTMLElement | null) => {
    this.rootElement = element
    if (element) this.applyDataAttributes(this.scrollableStore.getSnapshot())
  }

  setViewportElement = (element: HTMLElement | null) => {
    this.viewportElement = element
    if (element) this.applyDataAttributes(this.scrollableStore.getSnapshot())
  }

  setContentElement = (element: HTMLElement | null) => {
    this.contentElement = element
  }

  setSpacerElement = (element: HTMLElement | null) => {
    this.spacerElement = element
    this.spacerGap = readRowGap(element?.parentElement ?? null)
  }

  scrollToStart = ({
    behavior = "auto",
  }: MessageScrollerScrollOptions = {}) => {
    if (!this.viewportElement) return false
    this.setSpacerHeight(0)
    this.anchoredElement = null
    this.mode = "free-scrolling"
    this.scrollViewportTo(0, { behavior })
    this.scheduleVisibilitySync()
    return true
  }

  scrollToEnd = ({ behavior = "auto" }: MessageScrollerScrollOptions = {}) => {
    const viewport = this.viewportElement
    if (!viewport) return false
    this.setSpacerHeight(0)
    this.anchoredElement = null
    this.mode = this.options.autoScroll ? "following-bottom" : "free-scrolling"
    this.scrollViewportTo(getMaxScrollTop(viewport), {
      autoscrolling: true,
      behavior,
    })
    this.scheduleVisibilitySync()
    return true
  }

  scrollToMessage = (
    messageId: string,
    options?: MessageScrollerScrollOptions
  ) => {
    const element = this.messageElements.get(messageId)
    if (element) {
      this.markDefaultScrollPositionApplied()
      this.pendingScrollToMessage = this.scrollToElement(element, options)
        ? null
        : { messageId, options }
      return true
    }
    if (this.itemCount === 0) {
      this.pendingScrollToMessage = { messageId, options }
      this.markDefaultScrollPositionApplied()
      return true
    }
    return false
  }

  handleContentChange = () => {
    const content = this.contentElement
    if (!content) return
    const items = getMessageItems(content, this.spacerElement)
    const previousItemCount = this.itemCount
    const previousFirstItem = this.firstItem
    this.itemCount = items.length
    this.firstItem = items[0] ?? null
    this.respondToContentChange(items, previousItemCount, previousFirstItem)
    this.capturePrependAnchor()
  }

  handleResize = () => {
    if (this.isFollowingBottom()) {
      this.scrollToEnd()
      return
    }
    const previousSpacerHeight = this.spacerHeight
    if (this.reanchorToAnchoredElement()) {
      const spacerCollapsed =
        previousSpacerHeight > 0 && this.spacerHeight === 0
      if (this.options.autoScroll && spacerCollapsed) this.scrollToEnd()
      return
    }
    this.scheduleStateCommit()
    this.scheduleVisibilitySync()
  }

  handleUserScrollIntent = () => {
    if (this.mode === "free-scrolling") return
    this.anchoredElement = null
    this.mode = "free-scrolling"
  }

  handleKeyboardScrollIntent = (key: string) => {
    if (USER_SCROLL_KEYS.has(key)) this.handleUserScrollIntent()
  }

  syncAfterScroll = () => {
    this.commitScrollState()
    this.scheduleVisibilitySync()
    this.capturePrependAnchor()
  }

  registerMessage = (
    messageId: string,
    element: HTMLElement | null,
    previousElement: HTMLElement | null
  ) => {
    if (element) {
      this.messageElements.set(messageId, element)
      this.visibilityObserver?.observe(element)
      this.scheduleVisibilitySync()
      if (this.pendingScrollToMessage?.messageId === messageId) {
        this.schedulePendingScrollFlush()
      }
      return
    }
    if (!previousElement) return
    if (this.messageElements.get(messageId) !== previousElement) return
    this.messageElements.delete(messageId)
    this.observedVisibleMessageIds.delete(messageId)
    this.visibilityObserver?.unobserve(previousElement)
    this.scheduleVisibilitySync()
  }

  settleDefaultScrollPosition() {
    if (this.applyDefaultScrollPosition()) return
    if (this.itemCount === 0) this.pendingDefaultScrollStore.setSnapshot(false)
  }

  syncAutoScroll() {
    if (this.isFollowingBottom() && this.itemCount > 0) {
      this.scrollToEnd()
      return
    }
    this.commitScrollState()
  }

  dispose() {
    this.cancelFrame("stateFrame")
    this.cancelFrame("visibilityFrame")
    this.cancelFrame("pendingScrollFrame")
    this.clearAutoscrollingTimeout()
    this.visibilityObserver?.disconnect()
    this.visibilityObserver = null
  }

  private observeVisibility = () => {
    const viewport = this.viewportElement
    if (!viewport || !this.visibilityStore.hasListeners()) return
    if (typeof IntersectionObserver === "undefined") {
      this.scheduleVisibilitySync()
      return
    }
    this.visibilityObserver ??= this.createVisibilityObserver(viewport)
    for (const element of this.messageElements.values()) {
      this.visibilityObserver?.observe(element)
    }
    this.scheduleVisibilitySync()
  }

  private unobserveVisibility = () => {
    this.cancelFrame("visibilityFrame")
    this.visibilityObserver?.disconnect()
    this.visibilityObserver = null
    this.observedVisibleMessageIds.clear()
    this.visibilityStore.setSnapshot(NO_VISIBLE_MESSAGES)
  }

  private createVisibilityObserver(viewport: HTMLElement) {
    const topInset =
      this.options.scrollMargin + this.options.scrollPreviousItemPeek
    return new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const messageId = (entry.target as HTMLElement).dataset.messageId
          if (!messageId) continue
          if (entry.isIntersecting) {
            this.observedVisibleMessageIds.add(messageId)
          } else {
            this.observedVisibleMessageIds.delete(messageId)
          }
        }
        this.scheduleVisibilitySync()
      },
      {
        root: viewport,
        rootMargin: `${-topInset}px 0px 0px 0px`,
        threshold: [0, 0.01, 0.5, 1],
      }
    )
  }

  private getLayout(): LayoutElements | null {
    const content = this.contentElement
    const viewport = this.viewportElement
    if (!content || !viewport) return null
    return { content, spacer: this.spacerElement, viewport }
  }

  private isFollowingBottom() {
    return this.mode === "following-bottom" && this.options.autoScroll
  }

  private respondToContentChange(
    items: HTMLElement[],
    previousItemCount: number,
    previousFirstItem: HTMLElement | null
  ) {
    if (this.flushPendingScrollToMessage()) return

    if (previousItemCount === 0) {
      this.respondToInitialContent(items)
      return
    }

    const previousFirstIndex = previousFirstItem
      ? items.indexOf(previousFirstItem)
      : -1
    if (this.preserveScrollOnPrepend && previousFirstIndex > 0) {
      this.restorePrependAnchor()
      return
    }

    if (this.scrollToNewScrollAnchor(items, previousItemCount)) return

    if (this.isFollowingBottom()) {
      this.scrollToEnd()
      return
    }
    this.syncState()
  }

  private respondToInitialContent(items: HTMLElement[]) {
    if (this.applyDefaultScrollPosition()) return
    if (items.length > 0 && this.options.autoScroll && this.scrollToEnd()) {
      return
    }
    this.syncState()
  }

  private scrollToNewScrollAnchor(
    items: HTMLElement[],
    previousItemCount: number
  ) {
    if (items.length > previousItemCount) {
      const newAnchor = findScrollAnchorFrom(items, previousItemCount)
      if (newAnchor) {
        if (
          this.isFollowingBottom() &&
          hasMultipleScrollAnchorsFrom(items, previousItemCount)
        ) {
          this.scrollToEnd()
        } else {
          this.anchorTo(newAnchor)
        }
        return true
      }
    }

    if (items.length === previousItemCount) {
      const unhandledAnchor = findUnhandledScrollAnchor(
        items,
        this.handledScrollAnchors
      )
      if (unhandledAnchor) {
        this.anchorTo(unhandledAnchor)
        return true
      }
    }

    return false
  }

  private anchorTo(anchor: HTMLElement) {
    this.scrollToElement(anchor, { align: "start" }, { keepPreviousPeek: true })
    this.handledScrollAnchors.add(anchor)
  }

  private applyDefaultScrollPosition() {
    const position = this.options.defaultScrollPosition
    if (this.defaultScrollPositionApplied || this.itemCount === 0) return false

    const applied = this.scrollToPosition(position)
    if (applied) this.markDefaultScrollPositionApplied()
    return applied
  }

  private scrollToPosition(position: MessageScrollerDefaultScrollPosition) {
    if (position === "start") return this.scrollToStart()
    if (position === "last-anchor") return this.scrollToLastAnchor()
    return this.scrollToEnd()
  }

  private scrollToLastAnchor() {
    const layout = this.getLayout()
    const lastAnchor = layout
      ? findLastScrollAnchor(getMessageItems(layout.content, layout.spacer))
      : null
    if (!layout || !lastAnchor) return this.scrollToEnd()

    const heightBelowAnchor =
      measureContentBottom(layout) -
      offsetWithinViewport(lastAnchor, layout.viewport)
    if (heightBelowAnchor <= layout.viewport.clientHeight) {
      return this.scrollToEnd()
    }
    return this.scrollToElement(
      lastAnchor,
      { align: "start" },
      { keepPreviousPeek: true }
    )
  }

  private markDefaultScrollPositionApplied() {
    this.defaultScrollPositionApplied = true
    this.pendingDefaultScrollStore.setSnapshot(false)
  }

  private scrollToElement(
    element: HTMLElement,
    {
      align = "start",
      behavior = "auto",
      scrollMargin = this.options.scrollMargin,
    }: MessageScrollerScrollOptions = {},
    { keepPreviousPeek = false }: { keepPreviousPeek?: boolean } = {}
  ) {
    const layout = this.getLayout()
    if (!layout?.content.contains(element)) return false

    const targetScrollTop = measureTargetScrollTop({
      align,
      element,
      scrollMargin: keepPreviousPeek
        ? scrollMargin + this.options.scrollPreviousItemPeek
        : scrollMargin,
      spacer: layout.spacer,
      viewport: layout.viewport,
    })
    this.setSpacerHeight(measureSpacerHeightFor(layout, targetScrollTop))
    this.prependAnchor = {
      element,
      viewportTop: distanceFromViewportTop(element, layout.viewport),
    }
    this.mode = keepPreviousPeek ? "anchored-to-message" : "settling-jump"
    this.anchoredElement = keepPreviousPeek ? element : null
    this.scrollViewportTo(targetScrollTop, { behavior })
    this.scheduleVisibilitySync()
    return true
  }

  private reanchorToAnchoredElement() {
    const element = this.anchoredElement
    if (!element?.isConnected || this.mode !== "anchored-to-message") {
      return false
    }
    return this.scrollToElement(
      element,
      { align: "start" },
      { keepPreviousPeek: true }
    )
  }

  private flushPendingScrollToMessage() {
    const pending = this.pendingScrollToMessage
    if (!pending) return false
    const element = this.messageElements.get(pending.messageId)
    if (!element || !this.scrollToElement(element, pending.options)) {
      return false
    }
    this.pendingScrollToMessage = null
    this.markDefaultScrollPositionApplied()
    return true
  }

  private schedulePendingScrollFlush() {
    if (this.pendingScrollFrame !== null) return
    this.pendingScrollFrame = window.requestAnimationFrame(() => {
      this.pendingScrollFrame = null
      if (this.flushPendingScrollToMessage()) this.capturePrependAnchor()
    })
  }

  private capturePrependAnchor() {
    const layout = this.getLayout()
    const element = layout ? findFirstVisibleMessage(layout) : null
    this.prependAnchor =
      layout && element
        ? {
            element,
            viewportTop: distanceFromViewportTop(element, layout.viewport),
          }
        : null
  }

  private restorePrependAnchor() {
    const anchor = this.prependAnchor
    const viewport = this.viewportElement
    if (!anchor || !viewport || !anchor.element.isConnected) return false

    const drift =
      distanceFromViewportTop(anchor.element, viewport) - anchor.viewportTop
    if (Math.abs(drift) <= SCROLL_TOLERANCE) return false

    viewport.scrollTop += drift
    anchor.viewportTop = distanceFromViewportTop(anchor.element, viewport)
    this.scheduleStateCommit()
    this.scheduleVisibilitySync()
    return true
  }

  private setSpacerHeight(height: number) {
    const spacer = this.spacerElement
    if (!spacer) return
    const nextHeight = Math.max(0, Math.ceil(height))
    if (this.spacerHeight === nextHeight) return
    this.spacerHeight = nextHeight
    spacer.hidden = nextHeight === 0
    spacer.style.height = `${nextHeight}px`
    spacer.style.marginTop = nextHeight > 0 ? `${-this.spacerGap}px` : ""
  }

  private scrollViewportTo(
    scrollTop: number,
    {
      behavior = "auto",
      autoscrolling = false,
    }: { behavior?: ScrollBehavior; autoscrolling?: boolean } = {}
  ) {
    const viewport = this.viewportElement
    if (!viewport) return
    const targetScrollTop = Math.max(0, scrollTop)
    if (Math.abs(viewport.scrollTop - targetScrollTop) <= SCROLL_TOLERANCE) {
      viewport.scrollTop = targetScrollTop
      this.commitScrollState()
      return
    }
    if (autoscrolling) this.setAutoscrolling(true)
    viewport.scrollTo({ top: targetScrollTop, behavior })
    this.scheduleStateCommit()
  }

  private setAutoscrolling(isAutoscrolling: boolean) {
    this.clearAutoscrollingTimeout()
    if (this.isAutoscrolling !== isAutoscrolling) {
      this.isAutoscrolling = isAutoscrolling
      this.commitScrollState()
    }
    if (!isAutoscrolling) return
    this.autoscrollingTimeout = window.setTimeout(() => {
      this.autoscrollingTimeout = null
      this.isAutoscrolling = false
      this.commitScrollState()
    }, AUTOSCROLLING_SETTLE_DELAY)
  }

  private clearAutoscrollingTimeout() {
    if (this.autoscrollingTimeout === null) return
    window.clearTimeout(this.autoscrollingTimeout)
    this.autoscrollingTimeout = null
  }

  private syncState() {
    this.commitScrollState()
    this.scheduleVisibilitySync()
  }

  private commitScrollState() {
    const scrollable = measureScrollable(
      this.getLayout(),
      this.options.scrollEdgeThreshold
    )
    this.updateModeAfterScroll(scrollable)
    const reported =
      this.mode === "following-bottom"
        ? { ...scrollable, end: false }
        : scrollable
    this.applyDataAttributes(reported)
    this.scrollableStore.setSnapshot(reported)
  }

  private updateModeAfterScroll(scrollable: MessageScrollerScrollable) {
    const scrollTop = this.viewportElement?.scrollTop ?? 0
    const scrolledTowardStart =
      scrollTop < this.lastScrollTop - SCROLL_TOLERANCE
    this.lastScrollTop = scrollTop

    const canResumeFollowing =
      this.options.autoScroll &&
      !scrollable.end &&
      this.mode !== "settling-jump" &&
      this.mode !== "anchored-to-message"
    if (canResumeFollowing) {
      this.mode = "following-bottom"
      return
    }

    const userLeftBottom =
      this.mode === "following-bottom" &&
      scrollable.end &&
      scrolledTowardStart &&
      !this.isAutoscrolling
    if (userLeftBottom) this.mode = "free-scrolling"
  }

  private applyDataAttributes(scrollable: MessageScrollerScrollable) {
    const scrollableEdges = [
      scrollable.start && "start",
      scrollable.end && "end",
    ]
      .filter(Boolean)
      .join(" ")
    for (const element of [this.rootElement, this.viewportElement]) {
      if (!element) continue
      if (scrollableEdges) {
        element.setAttribute("data-scrollable", scrollableEdges)
      } else {
        element.removeAttribute("data-scrollable")
      }
      element.toggleAttribute("data-autoscrolling", this.isAutoscrolling)
    }
  }

  private scheduleStateCommit() {
    if (this.stateFrame !== null) return
    this.stateFrame = window.requestAnimationFrame(() => {
      this.stateFrame = null
      this.commitScrollState()
    })
  }

  private scheduleVisibilitySync() {
    if (!this.visibilityStore.hasListeners() || this.visibilityFrame !== null) {
      return
    }
    this.visibilityFrame = window.requestAnimationFrame(() => {
      this.visibilityFrame = null
      if (!this.visibilityStore.hasListeners()) return
      this.visibilityStore.setSnapshot(
        measureVisibility({
          layout: this.getLayout(),
          observedVisibleMessageIds: this.observedVisibleMessageIds,
          scrollMargin: this.options.scrollMargin,
          scrollPreviousItemPeek: this.options.scrollPreviousItemPeek,
        })
      )
    })
  }

  private cancelFrame(
    frame: "stateFrame" | "visibilityFrame" | "pendingScrollFrame"
  ) {
    const frameId = this[frame]
    if (frameId === null) return
    window.cancelAnimationFrame(frameId)
    this[frame] = null
  }
}

const MessageScrollerContext =
  React.createContext<MessageScrollerController | null>(null)

function useMessageScrollerController(options: MessageScrollerOptions) {
  const resolvedOptions = resolveOptions(options)
  const [controller] = React.useState(
    () => new MessageScrollerController(resolvedOptions)
  )
  controller.updateOptions(resolvedOptions)

  React.useLayoutEffect(() => {
    controller.settleDefaultScrollPosition()
  }, [controller, resolvedOptions.defaultScrollPosition])

  React.useEffect(() => () => controller.dispose(), [controller])

  React.useLayoutEffect(() => {
    controller.syncAutoScroll()
  }, [controller, resolvedOptions.autoScroll])

  return controller
}

function useMessageScrollerContext() {
  const controller = React.useContext(MessageScrollerContext)
  if (!controller) {
    throw new Error(
      "MessageScroller components and hooks must be used within a MessageScrollerProvider."
    )
  }
  return controller
}

function useStoreSnapshot<Snapshot>(store: SnapshotStore<Snapshot>) {
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  )
}

function useMessageScroller() {
  const { scrollToEnd, scrollToMessage, scrollToStart } =
    useMessageScrollerContext()
  return React.useMemo(
    () => ({ scrollToEnd, scrollToMessage, scrollToStart }),
    [scrollToEnd, scrollToMessage, scrollToStart]
  )
}

function useMessageScrollerScrollable() {
  return useStoreSnapshot(useMessageScrollerContext().scrollableStore)
}

function useMessageScrollerVisibility() {
  return useStoreSnapshot(useMessageScrollerContext().visibilityStore)
}

function useMessageScrollerPendingScroll() {
  return useStoreSnapshot(useMessageScrollerContext().pendingDefaultScrollStore)
}

function useMessageScrollerCanScroll(
  direction: MessageScrollerScrollDirection
) {
  const { scrollableStore } = useMessageScrollerContext()
  const getCanScroll = React.useCallback(
    () => scrollableStore.getSnapshot()[direction],
    [direction, scrollableStore]
  )
  return React.useSyncExternalStore(
    scrollableStore.subscribe,
    getCanScroll,
    getCanScroll
  )
}

function useFrameThrottledResizeObserver(
  elementRef: React.RefObject<HTMLElement | null>,
  onResize: () => void
) {
  React.useEffect(() => {
    const element = elementRef.current
    if (!element || typeof ResizeObserver === "undefined") return
    let frame = 0
    const observer = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(onResize)
    })
    observer.observe(element)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [elementRef, onResize])
}

function useChildListObserver(
  elementRef: React.RefObject<HTMLElement | null>,
  onChange: () => void
) {
  React.useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) return
    onChange()
    if (typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(onChange)
    observer.observe(element, { childList: true })
    return () => observer.disconnect()
  }, [elementRef, onChange])
}

function useMergedRefs<Instance>(
  ...refs: Array<React.Ref<Instance> | undefined>
) {
  return React.useCallback((instance: Instance | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(instance)
      else if (ref) ref.current = instance
    }
  }, refs)
}

export {
  MessageScrollerContext,
  type MessageScrollerDefaultScrollPosition,
  type MessageScrollerOptions,
  type MessageScrollerScrollAlign,
  type MessageScrollerScrollable,
  type MessageScrollerScrollDirection,
  type MessageScrollerScrollOptions,
  type MessageScrollerVisibilityState,
  useChildListObserver,
  useFrameThrottledResizeObserver,
  useMergedRefs,
  useMessageScroller,
  useMessageScrollerCanScroll,
  useMessageScrollerContext,
  useMessageScrollerController,
  useMessageScrollerPendingScroll,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
