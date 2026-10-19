"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type AttachmentFile = {
  id: string
  name: string
}

const providers = [
  {
    name: "Anthropic",
    models: [
      { id: "claude-opus-5-5", name: "Claude Opus 5.5" },
      { id: "claude-sonnet-5-5", name: "Claude Sonnet 5.5" },
    ],
  },
  {
    name: "OpenAI",
    models: [
      { id: "gpt-5", name: "GPT-5" },
      { id: "gpt-5-mini", name: "GPT-5 mini" },
    ],
  },
]

const models = providers.flatMap((provider) => provider.models)

const efforts = [
  { id: "low", name: "Low" },
  { id: "medium", name: "Medium" },
  { id: "high", name: "High" },
]

export default function PromptInputDemo() {
  const [text, setText] = React.useState("")
  const [files, setFiles] = React.useState<AttachmentFile[]>([
    { id: "settings-page", name: "settings-page.tsx" },
  ])
  const [model, setModel] = React.useState("claude-opus-5-5")
  const [effort, setEffort] = React.useState("medium")
  const formRef = React.useRef<HTMLFormElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const modelName = models.find((item) => item.id === model)?.name ?? model
  const effortName = efforts.find((item) => item.id === effort)?.name ?? effort
  const canSend = text.trim().length > 0

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSend) {
      return
    }

    setText("")
    setFiles([])
  }

  function onAttach(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files
    if (!selected) {
      return
    }

    setFiles((current) => [
      ...current,
      ...Array.from(selected, (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
      })),
    ])
    event.target.value = ""
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="w-full max-w-lg py-6">
      <input
        ref={inputRef}
        type="file"
        multiple
        aria-label="Files"
        className="sr-only"
        tabIndex={-1}
        onChange={onAttach}
      />
      <InputGroup>
        {files.length > 0 && (
          <InputGroupAddon align="block-start" className="flex-wrap">
            {files.map((file) => (
              <Attachment key={file.id} size="sm">
                <AttachmentMedia>
                  <IconPlaceholder
                    lucide="FileTextIcon"
                    tabler="IconFileText"
                    hugeicons="File01Icon"
                    phosphor="FileTextIcon"
                    remixicon="RiFileTextLine"
                  />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((item) => item.id !== file.id)
                      )
                    }
                  >
                    <IconPlaceholder
                      lucide="XIcon"
                      tabler="IconX"
                      hugeicons="Cancel01Icon"
                      phosphor="XIcon"
                      remixicon="RiCloseLine"
                    />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </InputGroupAddon>
        )}
        <InputGroupTextarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ask the agent to change your code..."
          aria-label="Message"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              formRef.current?.requestSubmit()
            }
          }}
          className="p-3"
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            size="icon-sm"
            variant="outline"
            className="rounded-full"
            aria-label="Attach files"
            onClick={() => inputRef.current?.click()}
          >
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </InputGroupButton>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  size="sm"
                  variant="outline"
                  aria-label={`Model: ${modelName}`}
                  className="ms-auto min-w-0 shrink"
                />
              }
            >
              <span className="truncate">{modelName}</span>
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                {providers.map((provider, index) => (
                  <React.Fragment key={provider.name}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
                      {provider.models.map((item) => (
                        <DropdownMenuRadioItem
                          key={item.id}
                          value={item.id}
                          closeOnClick
                        >
                          {item.name}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuGroup>
                  </React.Fragment>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  size="sm"
                  variant="outline"
                  aria-label={`Effort: ${effortName}`}
                />
              }
            >
              <span className="text-muted-foreground max-sm:hidden">
                Effort
              </span>
              {effortName}
              <IconPlaceholder
                lucide="ChevronDownIcon"
                tabler="IconChevronDown"
                hugeicons="ArrowDown01Icon"
                phosphor="CaretDownIcon"
                remixicon="RiArrowDownSLine"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Effort</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={effort}
                  onValueChange={setEffort}
                >
                  {efforts.map((item) => (
                    <DropdownMenuRadioItem
                      key={item.id}
                      value={item.id}
                      closeOnClick
                    >
                      {item.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupButton
            type="submit"
            size="icon-sm"
            variant="default"
            className="rounded-full"
            disabled={!canSend}
            aria-label="Send"
          >
            <IconPlaceholder
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUp01Icon"
              phosphor="ArrowUpIcon"
              remixicon="RiArrowUpLine"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
