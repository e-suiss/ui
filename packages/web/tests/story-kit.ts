import "@testing-library/jest-dom/vitest"

import type { BoundFunctions, queries } from "@testing-library/dom"
import type { ComponentType, JSXElementConstructor, ReactNode } from "react"

export { screen, waitFor, within } from "@testing-library/dom"
export { userEvent } from "@testing-library/user-event"
export { expect } from "vitest"

export type Args = Record<string, unknown>
type Parameters = Record<string, unknown>
type Globals = { theme?: string; direction?: "ltr" | "rtl" }
type ArgTypes<TArgs = Args> = {
  [K in keyof TArgs]?: Record<string, unknown>
}

export type StoryContext<TArgs = Args> = {
  id: string
  name: string
  title: string
  args: TArgs
  parameters: Parameters
  globals: Globals
  viewMode: "story" | "docs"
  canvasElement: HTMLElement
  canvas: BoundFunctions<typeof queries>
  step: (
    label: string,
    play: (context: StoryContext<TArgs>) => Promise<void> | void
  ) => Promise<void>
}

export type Decorator<TArgs = Args> = (
  Story: ComponentType,
  context: StoryContext<TArgs>
) => ReactNode

type Annotations<TArgs> = {
  args?: Partial<TArgs>
  argTypes?: ArgTypes<TArgs>
  parameters?: Parameters
  globals?: Globals
  tags?: string[]
  decorators?: Decorator<TArgs>[]
  render?: (args: TArgs, context: StoryContext<TArgs>) => ReactNode
  play?: (context: StoryContext<TArgs>) => Promise<void> | void
}

type PropsOf<T> = T extends (props: infer P) => ReactNode
  ? P
  : T extends new (
        props: infer P
      ) => unknown
    ? P
    : unknown

type RenderArgs<T> = T extends (...params: infer P) => unknown
  ? P extends [infer A, ...unknown[]]
    ? A
    : unknown
  : unknown

type OrArgs<T> = unknown extends T ? Args : T

type MetaArgs<TMeta> = OrArgs<
  (TMeta extends { component?: infer C } ? PropsOf<NonNullable<C>> : unknown) &
    (TMeta extends { render?: infer R } ? RenderArgs<NonNullable<R>> : unknown)
>

export type Meta<T = Args> = Annotations<
  OrArgs<T extends JSXElementConstructor<never> ? PropsOf<T> : T>
> & {
  title?: string
  component?: JSXElementConstructor<never>
}

export type StoryObj<TMeta = Meta> = Annotations<MetaArgs<TMeta>> & {
  name?: string
}
