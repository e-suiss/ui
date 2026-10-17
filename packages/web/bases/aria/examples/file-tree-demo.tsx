"use client"

import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

type FileNode =
  | { type: "file"; name: string; path: string }
  | { type: "folder"; name: string; path: string; children: FileNode[] }

const files: FileNode[] = [
  {
    type: "folder",
    name: "app",
    path: "app",
    children: [
      { type: "file", name: "layout.tsx", path: "app/layout.tsx" },
      { type: "file", name: "page.tsx", path: "app/page.tsx" },
    ],
  },
  {
    type: "folder",
    name: "components",
    path: "components",
    children: [
      {
        type: "folder",
        name: "ui",
        path: "components/ui",
        children: [
          {
            type: "file",
            name: "button.tsx",
            path: "components/ui/button.tsx",
          },
        ],
      },
      {
        type: "file",
        name: "login-form.tsx",
        path: "components/login-form.tsx",
      },
    ],
  },
]

function FileTreeNode({
  node,
  selected,
  onSelect,
}: {
  node: FileNode
  selected: string
  onSelect: (path: string) => void
}) {
  if (node.type === "folder") {
    return (
      <Collapsible defaultExpanded>
        <Button
          variant="ghost"
          size="sm"
          className="group/folder w-full justify-start font-normal aria-expanded:bg-transparent aria-expanded:hover:bg-accent"
          slot="trigger"
        >
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
            className="transition-transform group-aria-expanded/folder:rotate-90 rtl:rotate-180 rtl:group-aria-expanded/folder:rotate-90"
          />
          <IconPlaceholder
            lucide="FolderIcon"
            tabler="IconFolder"
            hugeicons="Folder01Icon"
            phosphor="FolderIcon"
            remixicon="RiFolderLine"
          />
          {node.name}
        </Button>
        <CollapsibleContent>
          <div className="ms-4 flex flex-col">
            {node.children.map((child) => (
              <FileTreeNode
                key={child.path}
                node={child}
                selected={selected}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start font-normal",
        selected === node.path && "bg-accent text-accent-foreground"
      )}
      aria-current={selected === node.path ? "true" : undefined}
      onPress={() => onSelect(node.path)}
    >
      <IconPlaceholder
        lucide="FileIcon"
        tabler="IconFile"
        hugeicons="File01Icon"
        phosphor="FileIcon"
        remixicon="RiFileLine"
      />
      {node.name}
    </Button>
  )
}

export default function FileTreeDemo() {
  const [selected, setSelected] = React.useState("components/ui/button.tsx")

  return (
    <div className="flex w-full max-w-xs flex-col py-6 text-sm">
      {files.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          selected={selected}
          onSelect={setSelected}
        />
      ))}
    </div>
  )
}
