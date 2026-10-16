import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SearchRevealField } from "@/components/interactions/search-reveal"
import {
  SelectionList,
  SelectionListTrigger,
} from "@/components/interactions/selection-list"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group"

describe("consumer handlers", () => {
  it("run alongside the selection trigger toggle", async () => {
    const onClick = vi.fn()
    await render(
      <SelectionList>
        <SelectionListTrigger onClick={onClick} />
      </SelectionList>
    )
    await page.getByRole("button", { name: "Select" }).click()
    expect(onClick).toHaveBeenCalledOnce()
    await expect
      .element(page.getByRole("button", { name: "Done" }))
      .toHaveAttribute("aria-pressed", "true")
  })

  it("can cancel the selection trigger toggle", async () => {
    await render(
      <SelectionList>
        <SelectionListTrigger onClick={(event) => event.preventDefault()} />
      </SelectionList>
    )
    await page.getByRole("button", { name: "Select" }).click()
    await expect
      .element(page.getByRole("button", { name: "Select" }))
      .toHaveAttribute("aria-pressed", "false")
  })

  it("run alongside the search field value change", async () => {
    const onChange = vi.fn()
    function Field() {
      const [value, setValue] = React.useState("")
      return (
        <SearchRevealField
          value={value}
          onValueChange={setValue}
          onChange={onChange}
        />
      )
    }
    await render(<Field />)
    await page.getByRole("searchbox", { name: "Search" }).fill("tea")
    expect(onChange).toHaveBeenCalled()
    await expect
      .element(page.getByRole("searchbox", { name: "Search" }))
      .toHaveValue("tea")
  })

  it("focus a textarea from its addon and keep the addon click handler", async () => {
    const onClick = vi.fn()
    await render(
      <InputGroup>
        <InputGroupTextarea aria-label="Message" />
        <InputGroupAddon align="block-end" onClick={onClick}>
          Hint
        </InputGroupAddon>
      </InputGroup>
    )
    await userEvent.click(page.getByText("Hint"))
    expect(onClick).toHaveBeenCalledOnce()
    await expect
      .element(page.getByRole("textbox", { name: "Message" }))
      .toHaveFocus()
  })
})
