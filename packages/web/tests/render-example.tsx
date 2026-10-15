import "@testing-library/jest-dom/vitest"

import { configure, within } from "@testing-library/dom"
import { act, type ReactNode } from "react"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DirectionProvider } from "@/components/ui/direction"

type Direction = "ltr" | "rtl"

const environment = globalThis as {
  IS_REACT_ACT_ENVIRONMENT?: boolean
  exampleDirection?: Direction
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

async function step(_label: string, run: () => Promise<void> | void) {
  await run()
}

export async function renderExample(
  ui: ReactNode,
  { direction }: { direction?: Direction } = {}
) {
  const dir = direction ?? environment.exampleDirection ?? "ltr"
  const canvasElement = document.body.appendChild(document.createElement("div"))
  document.documentElement.classList.remove("dark")
  document.documentElement.dir = dir
  await page.viewport(1200, 900)
  await render(<DirectionProvider direction={dir}>{ui}</DirectionProvider>, {
    container: canvasElement,
  })
  return { canvasElement, canvas: within(canvasElement), step }
}

export type ExampleContext = Awaited<ReturnType<typeof renderExample>>
