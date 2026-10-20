"use client"

import {
  CheckIcon,
  CopyIcon,
  FoldersIcon,
  GlobeIcon,
  HandPointingIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import { CommandLine } from "@/components/create/command-line"
import { usePackageManager } from "@/components/site/package-command"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { copyText } from "@/lib/clipboard"
import {
  APPLY_MODES,
  type ApplyMode,
  applyCommand,
  type CreateState,
  cliCommand,
  newProjectCommand,
  PRIMITIVE_BASES,
  shadcnCommand,
  shadcnRegistries,
  shadcnThemeCommand,
  TEMPLATES,
  type Template,
  type ThemeDefaults,
  themeCss,
} from "@/lib/create/options"
import { BASE_TITLES, TEMPLATE_DETAILS } from "@/lib/create/templates"
import { PACKAGE_MANAGERS, type PackageManager } from "@/lib/package-managers"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

type Tab = "new" | "existing" | "theme"

const RESET_AFTER = 1500

const MODES: Record<ApplyMode, { title: string; description: string }> = {
  setup: {
    title: strings.getCodeSetup,
    description: strings.getCodeSetupDescription,
  },
  full: {
    title: strings.getCodeFull,
    description: strings.getCodeFullDescription,
  },
  theme: {
    title: strings.getCodeThemeOnly,
    description: strings.getCodeThemeOnlyDescription,
  },
  font: {
    title: strings.getCodeFontsOnly,
    description: strings.getCodeFontsOnlyDescription,
  },
}

const TAB_LABELS: Record<Tab, string> = {
  new: strings.getCodeNew,
  existing: strings.getCodeExisting,
  theme: strings.getCodeTheme,
}

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(null), RESET_AFTER)
    return () => clearTimeout(timeout)
  }, [copied])
  const copy = (target: string, text: string) =>
    copyText(text).then(
      () => setCopied(target),
      () => undefined
    )
  return { copied, copy }
}

function Logo({ svg }: { svg: string }) {
  return (
    <span
      aria-hidden
      className="size-4 shrink-0 text-foreground [&_svg]:size-4 [&_svg]:fill-current"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

function CopyIconButton({
  copied,
  label,
  onClick,
}: {
  copied: boolean
  label: string
  onClick: () => void
}) {
  return (
    <Button
      size="icon-sm"
      variant="ghost"
      className="ms-auto"
      aria-label={copied ? strings.copied : label}
      onClick={onClick}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}

function CommandBox({
  commands,
  manager,
  onManager,
  copied,
  onCopy,
}: {
  commands: Record<PackageManager, string>
  manager: PackageManager
  onManager: (manager: PackageManager) => void
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <Tabs
        value={manager}
        onValueChange={(value) => onManager(value as PackageManager)}
        className="min-w-0 gap-0 overflow-hidden rounded-xl ring-1 ring-border"
      >
        <div className="flex items-center gap-2 py-1 ps-1 pe-1.5">
          <TabsList
            aria-label={strings.getCodePackageManager}
            className="bg-transparent font-mono"
          >
            {PACKAGE_MANAGERS.map((item) => (
              <TabsTrigger key={item} value={item}>
                {item}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyIconButton
            copied={copied}
            label={strings.getCodeCopyCommand}
            onClick={onCopy}
          />
        </div>
        {PACKAGE_MANAGERS.map((item) => (
          <TabsContent key={item} value={item}>
            <div className="overflow-x-auto border-t border-border bg-muted p-3">
              <code
                dir="ltr"
                className="block font-mono text-[13px] leading-[1.6] break-words"
              >
                {commands[item].split(" ").map((word, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && " "}
                    <span className="whitespace-nowrap">{word}</span>
                  </React.Fragment>
                ))}
              </code>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Button block onClick={onCopy}>
        {copied ? strings.copied : strings.getCodeCopyCommand}
      </Button>
    </div>
  )
}

function ChoiceGrid<T extends string>({
  name,
  label,
  value,
  options,
  onChange,
  className,
}: {
  name: string
  label: string
  value: T
  options: { value: T; title: string; logo?: string }[]
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      onValueChange={(next) => onChange(next as T)}
      className={cn("grid gap-2", className)}
    >
      {options.map((option) => (
        <FieldLabel
          key={option.value}
          htmlFor={`${name}-${option.value}`}
          className="w-full"
        >
          <Field orientation="horizontal" className="items-center">
            <FieldContent className="flex-row items-center gap-2">
              {option.logo && <Logo svg={option.logo} />}
              <FieldTitle className="whitespace-nowrap">
                {option.title}
              </FieldTitle>
            </FieldContent>
            <RadioGroupItem
              value={option.value}
              id={`${name}-${option.value}`}
            />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  )
}

function OptionSwitch({
  id,
  icon,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string
  icon: React.ReactNode
  label: string
  description?: string
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}) {
  return (
    <Field orientation="horizontal" data-disabled={disabled || undefined}>
      <FieldContent>
        <FieldLabel htmlFor={id} className="gap-2">
          {icon}
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onChange?.(next)}
      />
    </Field>
  )
}

export function GetCode({
  state,
  themeDefaults,
  onBaseChange,
}: {
  state: CreateState
  themeDefaults: ThemeDefaults
  onBaseChange: (base: CreateState["base"]) => void
}) {
  const web = state.platform === "web"
  const templates: readonly Template[] = TEMPLATES[state.platform]
  const tabs: Tab[] = [
    ...(templates.length ? (["new"] as const) : []),
    "existing",
    ...(web ? (["theme"] as const) : []),
  ]
  const [manager, setManager] = usePackageManager()
  const [chosenTab, setTab] = React.useState<Tab>("new")
  const [chosenTemplate, setTemplate] = React.useState<Template>("next")
  const [mode, setMode] = React.useState<ApplyMode>("setup")
  const [pointer, setPointer] = React.useState(false)
  const [rtl, setRtl] = React.useState(false)
  const { copied, copy } = useCopy()

  const tab = tabs.includes(chosenTab) ? chosenTab : (tabs[0] ?? "existing")
  const template = templates.includes(chosenTemplate)
    ? chosenTemplate
    : templates[0]
  const options = { pointer, rtl }
  const registries = shadcnRegistries(state)
  const themeCommand = shadcnThemeCommand(state, manager)

  const commandsFor = (build: (manager: PackageManager) => string) =>
    Object.fromEntries(
      PACKAGE_MANAGERS.map((item) => [item, build(item)])
    ) as Record<PackageManager, string>

  const newCommands = template
    ? commandsFor((item) => newProjectCommand(state, template, item, options))
    : null
  const existingCommands = commandsFor((item) =>
    mode === "setup"
      ? cliCommand(state, item, options)
      : applyCommand(state, mode, item)
  )
  const css = web ? themeCss(state, themeDefaults) : ""

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>{strings.getCode}</DialogTrigger>
      <DialogContent className="flex max-h-[calc(100svh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="gap-4 border-b border-border py-5 ps-6 pe-6 sm:pe-16">
          <DialogTitle className={cn(tabs.length > 1 && "sm:sr-only")}>
            {strings.getCodeTitle}
          </DialogTitle>
          {tabs.length > 1 && (
            <ToggleGroup
              aria-label={strings.getCodeTabs}
              value={[tab]}
              onValueChange={(values) => {
                const next = values[0] as Tab | undefined
                if (next) setTab(next)
              }}
              spacing={0}
              className="w-full sm:w-fit"
            >
              {tabs.map((item) => (
                <ToggleGroupItem
                  key={item}
                  value={item}
                  className="flex-1 sm:flex-none"
                >
                  {TAB_LABELS[item]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "new" && template && newCommands && (
            <>
              <FieldGroup className="px-6 py-4">
                <FieldSet className="gap-3">
                  <FieldLegend variant="label">
                    {strings.getCodeTemplate}
                  </FieldLegend>
                  <ChoiceGrid
                    name="template"
                    label={strings.getCodeTemplate}
                    value={template}
                    onChange={setTemplate}
                    className="grid-cols-1 sm:grid-cols-2"
                    options={templates.map((item) => ({
                      value: item,
                      ...TEMPLATE_DETAILS[item],
                    }))}
                  />
                </FieldSet>
                {web && (
                  <>
                    <FieldSeparator />
                    <FieldSet className="gap-3">
                      <FieldLegend variant="label">
                        {strings.getCodeBase}
                      </FieldLegend>
                      <ChoiceGrid
                        name="base"
                        label={strings.getCodeBase}
                        value={state.base}
                        onChange={onBaseChange}
                        className="grid-cols-1 sm:grid-cols-3"
                        options={PRIMITIVE_BASES.map((item) => ({
                          value: item,
                          title: BASE_TITLES[item],
                        }))}
                      />
                    </FieldSet>
                  </>
                )}
                <FieldSeparator />
                <FieldSet className="gap-4">
                  <FieldLegend variant="label" className="sr-only">
                    {strings.getCodeOptions}
                  </FieldLegend>
                  {web && (
                    <OptionSwitch
                      id="get-code-pointer"
                      icon={<HandPointingIcon aria-hidden className="size-4" />}
                      label={strings.getCodePointer}
                      checked={pointer}
                      onChange={setPointer}
                    />
                  )}
                  <OptionSwitch
                    id="get-code-monorepo"
                    icon={<FoldersIcon aria-hidden className="size-4" />}
                    label={strings.getCodeMonorepo}
                    description={strings.getCodeMonorepoNote}
                    checked={false}
                    disabled
                  />
                  {web && (
                    <OptionSwitch
                      id="get-code-rtl"
                      icon={<GlobeIcon aria-hidden className="size-4" />}
                      label={strings.getCodeRtl}
                      checked={rtl}
                      onChange={setRtl}
                    />
                  )}
                </FieldSet>
              </FieldGroup>
              <DialogFooter className="p-6 pt-2">
                <CommandBox
                  commands={newCommands}
                  manager={manager}
                  onManager={setManager}
                  copied={copied === "new"}
                  onCopy={() => copy("new", newCommands[manager])}
                />
              </DialogFooter>
            </>
          )}
          {tab === "existing" && (
            <>
              <FieldGroup className="px-6 py-4">
                <FieldSet className="gap-3">
                  <FieldLegend variant="label">
                    {strings.getCodeApply}
                  </FieldLegend>
                  <FieldDescription>
                    {strings.getCodeApplyDescription}
                  </FieldDescription>
                  <RadioGroup
                    aria-label={strings.getCodeApply}
                    value={mode}
                    onValueChange={(next) => setMode(next as ApplyMode)}
                  >
                    {APPLY_MODES.map((item) => (
                      <FieldLabel key={item} htmlFor={`apply-${item}`}>
                        <Field orientation="horizontal">
                          <RadioGroupItem value={item} id={`apply-${item}`} />
                          <FieldContent>
                            <FieldTitle>{MODES[item].title}</FieldTitle>
                            <FieldDescription>
                              {MODES[item].description}
                            </FieldDescription>
                          </FieldContent>
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                </FieldSet>
                {web && mode === "setup" && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[13px] leading-[1.5] text-muted-foreground">
                      {strings.createShadcnNote}
                    </p>
                    <CommandLine command={shadcnCommand(state, manager)} />
                    {registries && (
                      <>
                        <p className="text-[13px] leading-[1.5] text-muted-foreground">
                          {strings.createShadcnRegistries}
                        </p>
                        <div className="w-full min-w-0 overflow-hidden rounded-xl ring-1 ring-border">
                          <div className="flex items-center gap-2 py-1 ps-3 pe-1.5">
                            <span className="min-w-0 truncate font-mono text-sm text-muted-foreground">
                              components.json
                            </span>
                            <CopyIconButton
                              copied={copied === "registries"}
                              label={strings.getCodeCopyRegistries}
                              onClick={() => copy("registries", registries)}
                            />
                          </div>
                          <div className="overflow-auto border-t border-border bg-muted p-3">
                            <pre
                              dir="ltr"
                              className="min-w-max font-mono text-[13px] leading-normal"
                            >
                              <code>{registries}</code>
                            </pre>
                          </div>
                        </div>
                      </>
                    )}
                    {themeCommand && (
                      <>
                        <p className="text-[13px] leading-[1.5] text-muted-foreground">
                          {strings.createShadcnTheme}
                        </p>
                        <CommandLine command={themeCommand} />
                      </>
                    )}
                    {state.primary && (
                      <p className="text-[13px] leading-[1.5] text-muted-foreground">
                        {strings.createCustomNote}
                      </p>
                    )}
                  </div>
                )}
                {!web && (
                  <p className="text-[13px] leading-[1.5] text-muted-foreground">
                    {strings.createNativeNote}
                  </p>
                )}
              </FieldGroup>
              <DialogFooter className="p-6 pt-2">
                <CommandBox
                  commands={existingCommands}
                  manager={manager}
                  onManager={setManager}
                  copied={copied === "existing"}
                  onCopy={() => copy("existing", existingCommands[manager])}
                />
              </DialogFooter>
            </>
          )}
          {tab === "theme" && (
            <>
              <FieldGroup className="min-w-0 px-6 py-4">
                <FieldSet className="min-w-0 gap-3">
                  <FieldLegend variant="label">
                    {strings.getCodeThemeTokens}
                  </FieldLegend>
                  <FieldDescription>
                    {strings.getCodeThemeDescription}
                  </FieldDescription>
                  <div className="w-full min-w-0 overflow-hidden rounded-xl ring-1 ring-border">
                    <div className="flex items-center gap-2 py-1 ps-3 pe-1.5">
                      <span className="min-w-0 truncate font-mono text-sm text-muted-foreground">
                        globals.css
                      </span>
                      <CopyIconButton
                        copied={copied === "theme"}
                        label={strings.getCodeCopyTheme}
                        onClick={() => copy("theme", css)}
                      />
                    </div>
                    <div className="max-h-[45svh] overflow-auto border-t border-border bg-muted p-3">
                      <pre
                        dir="ltr"
                        className="min-w-max font-mono text-[13px] leading-normal"
                      >
                        <code>{css}</code>
                      </pre>
                    </div>
                  </div>
                </FieldSet>
              </FieldGroup>
              <DialogFooter className="p-6 pt-2">
                <Button block onClick={() => copy("theme", css)}>
                  {copied === "theme"
                    ? strings.copied
                    : strings.getCodeCopyTheme}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
