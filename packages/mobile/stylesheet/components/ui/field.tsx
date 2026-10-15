import * as React from "react"
import {
  Text as RNText,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native"
import * as FieldPrimitive from "@/components/primitives/field"
import * as FieldsetPrimitive from "@/components/primitives/fieldset"
import { Separator } from "@/components/ui/separator"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type FieldGroupVariant = "default" | "inset"

type FieldOrientation = "vertical" | "horizontal" | "responsive"

interface FieldGroupItemContextValue {
  variant: FieldGroupVariant
  index: number
}

const FieldGroupItemContext =
  React.createContext<FieldGroupItemContextValue | null>(null)

const FieldSetInsetContext = React.createContext(false)

const FieldInsetContext = React.createContext(false)

const styles = StyleSheet.create({
  set: { flexDirection: "column", gap: 24 },
  setInset: { gap: 8 },
  legend: { ...fontSize.base, marginBottom: 12, fontWeight: "600" },
  legendInset: {
    ...fontSize.xs,
    marginBottom: 0,
    paddingStart: 16,
    fontWeight: "400",
    textTransform: "uppercase",
  },
  group: { width: "100%", flexDirection: "column", gap: 28 },
  groupInset: { gap: 0, overflow: "hidden", borderRadius: radius["2xl"] },
  field: { width: "100%", gap: 12 },
  vertical: { flexDirection: "column" },
  horizontal: { flexDirection: "row", alignItems: "center" },
  fieldInset: {
    position: "relative",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  insetDivider: {
    position: "absolute",
    top: 0,
    end: 0,
    start: 16,
    height: 1,
  },
  content: { flex: 1, flexDirection: "column", gap: 4 },
  label: { ...fontSize.base, fontWeight: "600" },
  labelInset: { fontWeight: "400" },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm, fontWeight: "400", textAlign: "auto" },
  descriptionInset: { ...fontSize.xs, paddingStart: 16 },
  separator: {
    position: "relative",
    marginVertical: -8,
    height: 20,
    justifyContent: "center",
  },
  separatorLine: { position: "absolute", top: "50%", start: 0 },
  separatorContent: {
    ...fontSize.sm,
    alignSelf: "center",
    paddingHorizontal: 8,
  },
  error: { ...fontSize.sm, fontWeight: "400" },
})

function FieldSet({
  style,
  children,
  ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Root>) {
  const inset = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<{ variant?: FieldGroupVariant }>(child) &&
      child.type === FieldGroup &&
      child.props.variant === "inset"
  )
  return (
    <FieldSetInsetContext.Provider value={inset}>
      <FieldsetPrimitive.Root
        style={(state) => [
          styles.set,
          inset && styles.setInset,
          typeof style === "function" ? style(state) : style,
        ]}
        {...props}
      >
        {children}
      </FieldsetPrimitive.Root>
    </FieldSetInsetContext.Provider>
  )
}

function FieldLegend({
  style,
  variant = "legend",
  ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Legend> & {
  variant?: "legend" | "label"
}) {
  const { colors } = useTheme()
  const inset = React.useContext(FieldSetInsetContext)
  return (
    <FieldsetPrimitive.Legend
      role={variant === "legend" ? "heading" : undefined}
      style={(state) => [
        styles.legend,
        { color: state.disabled ? colors.labelQuaternary : colors.label },
        inset && [styles.legendInset, { color: colors.labelSecondary }],
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function FieldGroup({
  style,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof View> & { variant?: FieldGroupVariant }) {
  const { colors } = useTheme()
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = { variant, index }
    index += 1
    return (
      <FieldGroupItemContext.Provider value={value}>
        {child}
      </FieldGroupItemContext.Provider>
    )
  })
  return (
    <FieldSetInsetContext.Provider value={false}>
      <View
        style={[
          styles.group,
          variant === "inset" && [
            styles.groupInset,
            { backgroundColor: colors.surfaceSecondary },
          ],
          style,
        ]}
        {...props}
      >
        {items}
      </View>
    </FieldSetInsetContext.Provider>
  )
}

function Field({
  style,
  orientation = "vertical",
  children,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Root> & {
  orientation?: FieldOrientation
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const item = React.useContext(FieldGroupItemContext)
  const inset = item?.variant === "inset"
  const horizontal =
    orientation === "horizontal" ||
    (orientation === "responsive" && width >= 768)
  return (
    <FieldGroupItemContext.Provider value={null}>
      <FieldInsetContext.Provider value={inset}>
        <FieldPrimitive.Root
          style={(state) => [
            styles.field,
            horizontal ? styles.horizontal : styles.vertical,
            inset && styles.fieldInset,
            typeof style === "function" ? style(state) : style,
          ]}
          {...props}
        >
          {inset && item.index > 0 ? (
            <View
              style={[
                styles.insetDivider,
                { backgroundColor: colors.separator },
              ]}
            />
          ) : null}
          {children}
        </FieldPrimitive.Root>
      </FieldInsetContext.Provider>
    </FieldGroupItemContext.Provider>
  )
}

function FieldContent({ style, ...props }: React.ComponentProps<typeof View>) {
  return <View style={[styles.content, style]} {...props} />
}

function FieldLabel({
  style,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
  const { colors } = useTheme()
  const inset = React.useContext(FieldInsetContext)
  return (
    <FieldPrimitive.Label
      style={(state) => [
        styles.label,
        inset && styles.labelInset,
        { color: state.disabled ? colors.labelQuaternary : colors.label },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function FieldTitle({ style, ...props }: React.ComponentProps<typeof RNText>) {
  const { colors } = useTheme()
  const field = FieldPrimitive.useFieldRootContext()
  return (
    <RNText
      style={[
        styles.title,
        {
          color: field.state.disabled ? colors.labelQuaternary : colors.label,
        },
        style,
      ]}
      {...props}
    />
  )
}

function FieldDescription({
  style,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
  const { colors } = useTheme()
  const inset = React.useContext(FieldSetInsetContext)
  return (
    <FieldPrimitive.Description
      style={(state) => [
        styles.description,
        inset && styles.descriptionInset,
        { color: colors.labelSecondary },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  style,
  ...props
}: React.ComponentProps<typeof View> & { children?: React.ReactNode }) {
  const { colors } = useTheme()
  return (
    <View style={[styles.separator, style]} {...props}>
      <Separator style={styles.separatorLine} />
      {children ? (
        <RNText
          style={[
            styles.separatorContent,
            {
              backgroundColor: colors.surface,
              color: colors.labelSecondary,
            },
          ]}
        >
          {children}
        </RNText>
      ) : null}
    </View>
  )
}

function FieldError({
  style,
  children,
  errors,
  match,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Error> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const { colors } = useTheme()
  const messages = React.useMemo(() => {
    if (!errors?.length) return []
    return [
      ...new Set(
        errors
          .map((error) => error?.message)
          .filter((message): message is string => Boolean(message))
      ),
    ]
  }, [errors])

  let summary: string | undefined
  if (messages.length === 1) summary = messages[0]
  if (messages.length > 1) {
    summary = messages.map((message) => `• ${message}`).join("\n")
  }
  const content = children ?? summary

  return (
    <FieldPrimitive.Error
      match={match ?? (content !== undefined ? true : undefined)}
      style={(state) => [
        styles.error,
        { color: colors.danger },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {content}
    </FieldPrimitive.Error>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
