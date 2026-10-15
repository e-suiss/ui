import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import InputGroupBlockAddons from "@/examples/input-group-block-addons"
import InputGroupButtonSizes from "@/examples/input-group-button-sizes"
import InputGroupDemo from "@/examples/input-group-demo"
import InputGroupDisabled from "@/examples/input-group-disabled"
import InputGroupInvalid from "@/examples/input-group-invalid"
import InputGroupSearch from "@/examples/input-group-search"
import InputGroupWithButtons from "@/examples/input-group-with-buttons"
import InputGroupWithKbd from "@/examples/input-group-with-kbd"
import InputGroupWithText from "@/examples/input-group-with-text"
import InputGroupWithTextarea from "@/examples/input-group-with-textarea"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<InputGroupDemo />)

  const input = canvas.getByPlaceholderText("Search...")

  await step("focuses the input from an addon click", async () => {
    await userEvent.click(canvas.getByText("12 results"))
    await expect(input).toHaveFocus()
  })

  await step("accepts typed text", async () => {
    await userEvent.keyboard("button")
    await expect(input).toHaveValue("button")
  })
})
test("Search", async () => {
  const { canvas, step } = await renderExample(<InputGroupSearch />)

  const input = canvas.getByRole("textbox", { name: "Search" })

  await step("clears the query from the clear button", async () => {
    await expect(input).toHaveValue("MacBook")
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }))
    await expect(input).toHaveValue("")
    await expect(
      canvas.queryByRole("button", { name: "Clear search" })
    ).toBeNull()
  })

  await step("brings the clear button back after typing", async () => {
    await userEvent.type(input, "iPad")
    await expect(
      canvas.getByRole("button", { name: "Clear search" })
    ).toBeVisible()
  })
})
test("With Text", async () => {
  const { canvas, step } = await renderExample(<InputGroupWithText />)

  const amount = canvas.getByPlaceholderText("0.00")
  const domain = canvas.getByPlaceholderText("example.com")

  await step("focuses each input from its text addons", async () => {
    await userEvent.click(canvas.getByText("USD"))
    await expect(amount).toHaveFocus()
    await userEvent.keyboard("12.50")
    await expect(amount).toHaveValue("12.50")
    await userEvent.click(canvas.getByText("https://"))
    await expect(domain).toHaveFocus()
    await userEvent.keyboard("esuiss")
    await expect(domain).toHaveValue("esuiss")
  })
})
test("With Buttons", async () => {
  const { canvas, step } = await renderExample(<InputGroupWithButtons />)

  await step(
    "names the icon buttons and keeps the link read-only",
    async () => {
      await expect(canvas.getByRole("button", { name: "Copy" })).toBeVisible()
      await expect(canvas.getByRole("button", { name: "Info" })).toBeVisible()
      await expect(
        canvas.getByDisplayValue("https://esuiss.dev/invite/x7k2")
      ).toHaveAttribute("readonly")
    }
  )

  await step("moves focus from the input to its button", async () => {
    await userEvent.click(canvas.getByPlaceholderText("Enter your email"))
    await userEvent.tab()
    await expect(
      canvas.getByRole("button", { name: "Subscribe" })
    ).toHaveFocus()
  })
})
test("Button Sizes", async () => {
  const { canvas, step } = await renderExample(<InputGroupButtonSizes />)

  const input = canvas.getByPlaceholderText("Type a command...")

  await step("accepts typed text", async () => {
    await userEvent.click(input)
    await userEvent.keyboard("deploy")
    await expect(input).toHaveValue("deploy")
  })

  await step("tabs through every button size", async () => {
    for (const name of ["Extra small", "Copy", "Attach"]) {
      await userEvent.tab()
      await expect(canvas.getByRole("button", { name })).toHaveFocus()
    }
  })
})
test("With Kbd", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <InputGroupWithKbd />
  )

  const input = canvas.getByPlaceholderText("Search documentation...")
  const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
  const addon = kbd?.closest<HTMLElement>('[data-slot="input-group-addon"]')

  await step("focuses the input from the shortcut hint", async () => {
    await expect(kbd).toHaveTextContent("K")
    await expect(addon).toHaveAttribute("data-align", "inline-end")
    if (addon) await userEvent.click(addon)
    await expect(input).toHaveFocus()
    await userEvent.keyboard("tabs")
    await expect(input).toHaveValue("tabs")
  })
})
test("Block Addons", async () => {
  const { canvas, step } = await renderExample(<InputGroupBlockAddons />)

  const title = canvas.getByPlaceholderText("Enter a title")
  const amount = canvas.getByPlaceholderText("Enter an amount")

  await step("places the addons above and below the inputs", async () => {
    const titleAddon = canvas
      .getByText("Title")
      .closest('[data-slot="input-group-addon"]')
    const amountAddon = canvas
      .getByText("Minimum payment is $5.00")
      .closest('[data-slot="input-group-addon"]')
    await expect(titleAddon).toHaveAttribute("data-align", "block-start")
    await expect(amountAddon).toHaveAttribute("data-align", "block-end")
    await expect(
      titleAddon?.getBoundingClientRect().bottom ?? 0
    ).toBeLessThanOrEqual(title.getBoundingClientRect().top + 1)
    await expect(
      amountAddon?.getBoundingClientRect().top ?? 0
    ).toBeGreaterThanOrEqual(amount.getBoundingClientRect().bottom - 1)
  })

  await step("focuses each input from its block addon", async () => {
    await userEvent.click(canvas.getByText("Title"))
    await expect(title).toHaveFocus()
    await userEvent.keyboard("Invoice")
    await expect(title).toHaveValue("Invoice")
    await userEvent.click(canvas.getByText("Minimum payment is $5.00"))
    await expect(amount).toHaveFocus()
    await userEvent.keyboard("25")
    await expect(amount).toHaveValue("25")
  })
})
test("With Textarea", async () => {
  const { canvas, step } = await renderExample(<InputGroupWithTextarea />)

  const textarea = canvas.getByPlaceholderText("Ask, search, or chat...")

  await step("accepts multi-line text", async () => {
    await userEvent.type(textarea, "Hi{Shift>}{Enter}{/Shift}there")
    await expect(textarea).toHaveValue("Hi\nthere")
  })

  await step("names the action buttons", async () => {
    await expect(
      canvas.getByRole("button", { name: "Attach file" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Send" })).toBeVisible()
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<InputGroupInvalid />)

  await step("flags the input as invalid", async () => {
    await expect(canvas.getByRole("textbox", { name: "Email" })).toBeInvalid()
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<InputGroupDisabled />)

  const input = canvas.getByPlaceholderText("Search...")

  await step("ignores typing while disabled", async () => {
    await expect(input).toBeDisabled()
    await userEvent.type(input, "abc")
    await expect(input).toHaveValue("")
  })
})
