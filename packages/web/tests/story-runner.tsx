import { configure, within } from "@testing-library/dom"
import { act, type ComponentType, createElement } from "react"
import { test } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DirectionProvider } from "@/components/ui/direction"

import type { Args, Decorator, Meta, StoryContext, StoryObj } from "./story-kit"

type Direction = "ltr" | "rtl"

const environment = globalThis as {
  IS_REACT_ACT_ENVIRONMENT?: boolean
  storyDirection?: Direction
}

async function withoutActEnvironment<T>(callback: () => Promise<T>) {
  const previous = environment.IS_REACT_ACT_ENVIRONMENT
  environment.IS_REACT_ACT_ENVIRONMENT = false
  try {
    const result = await callback()
    await new Promise((resolve) => setTimeout(resolve, 0))
    return result
  } finally {
    environment.IS_REACT_ACT_ENVIRONMENT = previous
  }
}

function inAct<T>(callback: () => T) {
  const previous = environment.IS_REACT_ACT_ENVIRONMENT
  environment.IS_REACT_ACT_ENVIRONMENT = true
  let result: T | undefined
  try {
    act(() => {
      result = callback()
    })
  } finally {
    environment.IS_REACT_ACT_ENVIRONMENT = previous
  }
  return result
}

configure({ asyncWrapper: withoutActEnvironment, eventWrapper: inAct })

const withDirection: Decorator = (Story, { globals }) => {
  const direction = globals.direction ?? environment.storyDirection ?? "ltr"
  document.documentElement.dir = direction
  return (
    <DirectionProvider direction={direction}>
      <Story />
    </DirectionProvider>
  )
}

function storyName(exportName: string) {
  return exportName
    .replace(/[_.-]/g, " ")
    .replace(/([^\n])([A-Z])([a-z])/g, "$1 $2$3")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([a-z])([0-9])/gi, "$1 $2")
    .replace(/([0-9])([a-z])/gi, "$1 $2")
    .replace(
      /(\s|^)(\w)/g,
      (_, space: string, letter: string) => `${space}${letter.toUpperCase()}`
    )
    .replace(/ +/g, " ")
    .trim()
}

function sanitize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function runStory(
  meta: Meta,
  story: StoryObj,
  exportName: string,
  name: string
) {
  const title = meta.title ?? ""
  const args: Args = { ...meta.args, ...story.args }
  const canvasElement = document.body.appendChild(document.createElement("div"))
  const context: StoryContext = {
    id: `${sanitize(title)}--${sanitize(exportName)}`,
    name,
    title,
    args,
    parameters: { layout: "centered", ...meta.parameters, ...story.parameters },
    globals: { ...meta.globals, ...story.globals },
    viewMode: "story",
    canvasElement,
    canvas: within(canvasElement),
    step: async (_label, play) => {
      await play(context)
    },
  }
  const renderStory =
    story.render ??
    meta.render ??
    ((storyArgs: Args) =>
      createElement(meta.component as ComponentType<Args>, storyArgs))
  const decorators = [
    ...(story.decorators ?? []),
    ...(meta.decorators ?? []),
    withDirection,
  ]
  const Story = decorators.reduce<ComponentType>(
    (Inner, decorator) => () => decorator(Inner, context),
    () => renderStory(args, context)
  )

  document.documentElement.classList.remove("dark")
  await page.viewport(1200, 900)
  await render(<Story />, { container: canvasElement })
  await (story.play ?? meta.play)?.(context)
}

export function testStories(meta: Meta, stories: Record<string, StoryObj>) {
  for (const [exportName, story] of Object.entries(stories)) {
    const name = story.name ?? storyName(exportName)
    test(name, () => runStory(meta, story, exportName, name))
  }
}
