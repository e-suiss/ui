type AnyProps = Record<string, unknown>

type PropsGetter = (previous: AnyProps) => object

type MergePropsInput = object | PropsGetter | null | undefined

type Handler = (...args: unknown[]) => unknown

type StyleCallback = (state: never) => unknown

const EMPTY_PROPS: AnyProps = {}

function isEventHandler(key: string, value: unknown) {
  const code0 = key.charCodeAt(0)
  const code1 = key.charCodeAt(1)
  const code2 = key.charCodeAt(2)
  return (
    code0 === 111 &&
    code1 === 110 &&
    code2 >= 65 &&
    code2 <= 90 &&
    (typeof value === "function" || value === undefined)
  )
}

function isPropsGetter(input: MergePropsInput): input is PropsGetter {
  return typeof input === "function"
}

function mergeEventHandlers(ours: unknown, theirs: unknown): unknown {
  if (typeof theirs !== "function") return ours
  if (typeof ours !== "function") return theirs
  const ourHandler = ours as Handler
  const theirHandler = theirs as Handler
  return (...args: unknown[]) => {
    const result = theirHandler(...args)
    ourHandler(...args)
    return result
  }
}

function mergeClassNames(
  ours: string | undefined,
  theirs: string | undefined
): string | undefined {
  if (theirs) return ours ? `${theirs} ${ours}` : theirs
  return ours
}

function isStyleCallback(value: unknown): value is StyleCallback {
  return typeof value === "function"
}

function joinStyles(ours: unknown, theirs: unknown): unknown {
  if (ours == null || ours === false) return theirs
  if (theirs == null || theirs === false) return ours
  return [ours, theirs]
}

function mergeStyles(ours: unknown, theirs: unknown): unknown {
  if (theirs === undefined) return ours
  if (isStyleCallback(ours) || isStyleCallback(theirs)) {
    return (state: never) =>
      joinStyles(
        isStyleCallback(ours) ? ours(state) : ours,
        isStyleCallback(theirs) ? theirs(state) : theirs
      )
  }
  return joinStyles(ours, theirs)
}

function isPlainObject(value: unknown): value is AnyProps {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function mergeObjects(ours: unknown, theirs: unknown): unknown {
  if (isPlainObject(ours) && isPlainObject(theirs)) {
    return { ...ours, ...theirs }
  }
  return theirs === undefined ? ours : theirs
}

function mutablyMergeInto(merged: AnyProps, input: object): AnyProps {
  const external = input as AnyProps
  for (const key of Object.keys(external)) {
    const value = external[key]
    if (key === "style") {
      merged.style = mergeStyles(merged.style, value)
    } else if (key === "className") {
      merged.className = mergeClassNames(
        merged.className as string | undefined,
        value as string | undefined
      )
    } else if (isEventHandler(key, value)) {
      merged[key] = mergeEventHandlers(merged[key], value)
    } else if (key === "accessibilityState") {
      merged.accessibilityState = mergeObjects(merged.accessibilityState, value)
    } else if (key === "role" || key === "accessibilityRole") {
      if (value !== undefined) {
        delete merged[key === "role" ? "accessibilityRole" : "role"]
      }
      merged[key] = value
    } else {
      merged[key] = value
    }
  }
  return merged
}

function createInitialMergedProps(input: MergePropsInput): AnyProps {
  if (isPropsGetter(input)) return { ...input(EMPTY_PROPS) }
  if (!input) return {}
  return { ...input }
}

function mergeInto(merged: AnyProps, input: MergePropsInput): AnyProps {
  if (isPropsGetter(input)) return { ...input(merged) }
  if (!input) return merged
  return mutablyMergeInto(merged, input)
}

function mergePropsN<Result extends object = AnyProps>(
  inputs: readonly MergePropsInput[]
): Result {
  if (inputs.length === 0) return {} as Result
  let merged = createInitialMergedProps(inputs[0])
  for (let index = 1; index < inputs.length; index += 1) {
    merged = mergeInto(merged, inputs[index])
  }
  return merged as Result
}

function mergeProps<Result extends object = AnyProps>(
  ...inputs: MergePropsInput[]
): Result {
  return mergePropsN<Result>(inputs)
}

export type { MergePropsInput, PropsGetter }
export {
  mergeClassNames,
  mergeEventHandlers,
  mergeProps,
  mergePropsN,
  mergeStyles,
}
