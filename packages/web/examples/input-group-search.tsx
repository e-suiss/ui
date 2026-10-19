import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupSearch() {
  const [query, setQuery] = React.useState("MacBook")
  return (
    <InputGroup className="w-96">
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <InputGroupAddon>
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="Search01Icon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      </InputGroupAddon>
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            className="text-muted-foreground"
            onClick={() => setQuery("")}
          >
            <IconPlaceholder
              lucide="CircleXIcon"
              tabler="IconCircleX"
              hugeicons="CancelCircleIcon"
              phosphor="XCircleIcon"
              remixicon="RiCloseCircleLine"
              className="fill-muted-foreground text-background"
            />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
