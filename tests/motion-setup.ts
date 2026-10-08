import { afterEach, beforeEach } from "vitest"
import { cdp, commands } from "vitest/browser"

const MOVING =
  /^(transform|translate|scale|rotate|width|height|inset|top|right|bottom|left|margin|padding|grid-template|inline-size|block-size)/

let moved = new Set<string>()

function describe(target: EventTarget | null) {
  if (!(target instanceof Element)) return "unknown"
  const slot = target.getAttribute("data-slot")
  const classes = Array.from(target.classList).slice(0, 3).join(".")
  return `${target.tagName.toLowerCase()}${slot ? `[${slot}]` : ""}${classes ? `.${classes}` : ""}`
}

function movingProperties(keyframes: Keyframe[]) {
  return Array.from(
    new Set(
      keyframes.flatMap((keyframe) =>
        Object.keys(keyframe).filter((property) =>
          MOVING.test(property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`))
        )
      )
    )
  )
}

function lasts(animation: Animation | undefined) {
  const duration = animation?.effect?.getComputedTiming().duration
  return typeof duration === "number" && duration > 1
}

function onTransition(event: Event) {
  if (!(event instanceof TransitionEvent)) return
  if (!MOVING.test(event.propertyName)) return
  if (!(event.target instanceof Element)) return
  const transition = event.target
    .getAnimations()
    .find(
      (candidate) =>
        candidate instanceof CSSTransition &&
        candidate.transitionProperty === event.propertyName
    )
  if (!lasts(transition)) return
  moved.add(`transition ${event.propertyName} on ${describe(event.target)}`)
}

function onAnimation(event: Event) {
  if (!(event instanceof AnimationEvent)) return
  if (!(event.target instanceof Element)) return
  const animation = event.target
    .getAnimations()
    .find(
      (candidate) =>
        candidate instanceof CSSAnimation &&
        candidate.animationName === event.animationName
    )
  if (!lasts(animation)) return
  const keyframes =
    animation?.effect instanceof KeyframeEffect
      ? animation.effect.getKeyframes()
      : []
  const properties = movingProperties(keyframes)
  if (properties.length > 0) {
    moved.add(
      `animation ${event.animationName} (${properties.join(", ")}) on ${describe(event.target)}`
    )
  }
}

const animate = Element.prototype.animate

beforeEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  })
  moved = new Set()
  document.addEventListener("transitionrun", onTransition, true)
  document.addEventListener("animationstart", onAnimation, true)
  Element.prototype.animate = function (keyframes, options) {
    const frames = Array.isArray(keyframes)
      ? keyframes
      : [(keyframes ?? {}) as Keyframe]
    const properties = movingProperties(frames)
    const duration = typeof options === "number" ? options : options?.duration
    if (properties.length > 0 && Number(duration) > 1) {
      moved.add(
        `script animation (${properties.join(", ")}) on ${describe(this)}`
      )
    }
    return animate.call(this, keyframes, options)
  }
})

afterEach(async ({ task }) => {
  document.removeEventListener("transitionrun", onTransition, true)
  document.removeEventListener("animationstart", onAnimation, true)
  Element.prototype.animate = animate
  if (moved.size === 0) return
  await commands.writeFile(
    `.vitest/motion/${task.file.name.replace(/\W+/g, "-")}-${task.name.replace(/\W+/g, "-")}.json`,
    JSON.stringify(
      {
        story: `${task.file.name} > ${task.name}`,
        state: task.result?.state,
        moved: Array.from(moved),
      },
      null,
      2
    )
  )
})
