import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import QuestionnaireDemo from "@/examples/questionnaire-demo"
import QuestionnaireMultipleChoice from "@/examples/questionnaire-multiple-choice"
import QuestionnaireNumberShortcuts from "@/examples/questionnaire-number-shortcuts"
import QuestionnaireStartOnLaterQuestion from "@/examples/questionnaire-start-on-later-question"
import QuestionnaireTextInput from "@/examples/questionnaire-text-input"
import QuestionnaireWithChoiceDescriptions from "@/examples/questionnaire-with-choice-descriptions"
import QuestionnaireWithShortcuts from "@/examples/questionnaire-with-shortcuts"
import { renderExample } from "@/tests/render-example"

const STARTER = /^Starter/
const TEAM = /^Team/
const ENTERPRISE = /^Enterprise/

test("Default", async () => {
  const { canvas, step } = await renderExample(<QuestionnaireDemo />)

  const progress = canvas.getByRole("progressbar", {
    name: "Questionnaire progress",
  })

  await step("blocks a required question until it is answered", async () => {
    await expect(progress).toHaveAttribute("aria-valuetext", "Question 1 of 3")
    await expect(canvas.queryByRole("button", { name: "Skip" })).toBeNull()
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Choose an answer to continue."
    )
    await expect(progress).toHaveAttribute("aria-valuenow", "1")
  })

  await step("advances once a choice is picked", async () => {
    await userEvent.click(canvas.getByRole("radio", { name: "Design" }))
    await userEvent.click(canvas.getByRole("button", { name: "Next" }))
    await waitFor(() =>
      expect(progress).toHaveAttribute("aria-valuetext", "Question 2 of 3")
    )
    await expect(
      canvas.getByRole("group", { name: "How large is your team?" })
    ).toBeVisible()
  })

  await step("skips the optional question", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Skip" }))
    await waitFor(() =>
      expect(progress).toHaveAttribute("aria-valuetext", "Question 3 of 3")
    )
    await expect(canvas.getByRole("button", { name: "Submit" })).toBeVisible()
  })

  await step("goes back to the previous question", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Previous" }))
    await waitFor(() =>
      expect(progress).toHaveAttribute("aria-valuetext", "Question 2 of 3")
    )
  })
})
test("With Shortcuts", async () => {
  const { canvas, step } = await renderExample(<QuestionnaireWithShortcuts />)

  await step("picks a choice with its letter key", async () => {
    canvas.getByRole("radio", { name: "Engineering" }).focus()
    await userEvent.keyboard("c")
    await expect(canvas.getByRole("radio", { name: "Product" })).toBeChecked()
  })
})
test("Number Shortcuts", async () => {
  const { canvas, step } = await renderExample(<QuestionnaireNumberShortcuts />)

  await step("picks a choice with its number key", async () => {
    canvas.getByRole("radio", { name: "Engineering" }).focus()
    await userEvent.keyboard("2")
    await expect(canvas.getByRole("radio", { name: "Design" })).toBeChecked()
  })
})
test("Multiple Choice", async () => {
  const { canvas, step } = await renderExample(<QuestionnaireMultipleChoice />)

  await step("checks several features at once", async () => {
    await expect(
      canvas.getByRole("checkbox", { name: "Analytics" })
    ).toBeChecked()
    await userEvent.click(canvas.getByRole("checkbox", { name: "Billing" }))
    await expect(
      canvas.getByRole("checkbox", { name: "Billing" })
    ).toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: "Analytics" })
    ).toBeChecked()
    await expect(
      canvas.getByRole("checkbox", { name: "Integrations" })
    ).toBeDisabled()
  })

  await step("asks for an answer when everything is cleared", async () => {
    await userEvent.click(canvas.getByRole("checkbox", { name: "Analytics" }))
    await userEvent.click(canvas.getByRole("checkbox", { name: "Billing" }))
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }))
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Choose at least one feature."
    )
  })
})
test("With Choice Descriptions", async () => {
  const { canvas, step } = await renderExample(
    <QuestionnaireWithChoiceDescriptions />
  )

  const starter = canvas.getByRole("radio", { name: STARTER })
  const team = canvas.getByRole("radio", { name: TEAM })
  const enterprise = canvas.getByRole("radio", { name: ENTERPRISE })

  await step("names each choice by its title and describes it", async () => {
    await expect(starter).toHaveAccessibleName("Starter")
    await expect(starter).toHaveAccessibleDescription(
      "For individuals trying things out."
    )
    await expect(team).toHaveAccessibleName("Team")
    await expect(enterprise).toHaveAccessibleName("Enterprise")
  })

  await step("shows each description with its choice", async () => {
    await expect(
      canvas.getByText("For individuals trying things out.").closest("label")
    ).toContainElement(starter)
    await expect(
      canvas
        .getByText("Shared workspaces and roles for growing teams.")
        .closest("label")
    ).toContainElement(team)
    await expect(
      canvas
        .getByText("Single sign-on, audit logs, and priority support.")
        .closest("label")
    ).toContainElement(enterprise)
  })

  await step("switches the chosen plan", async () => {
    await expect(team).toBeChecked()
    await userEvent.click(
      canvas.getByText("Single sign-on, audit logs, and priority support.")
    )
    await expect(enterprise).toBeChecked()
    await expect(team).not.toBeChecked()
    await userEvent.click(starter)
    await expect(starter).toBeChecked()
  })
})
test("Text Input", async () => {
  const { canvas, step } = await renderExample(<QuestionnaireTextInput />)

  const input = canvas.getByRole("textbox", {
    name: "Where should we send your results?",
  })

  await step("shows the error when submitted empty", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Submit" }))
    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      "Enter an email address to continue."
    )
    await expect(input).toBeInvalid()
  })

  await step("clears the error once the field is filled", async () => {
    await userEvent.type(input, "ada@example.com")
    await waitFor(() => expect(canvas.queryByRole("alert")).toBeNull())
  })
})
test("Start On Later Question", async () => {
  const { canvas, step } = await renderExample(
    <QuestionnaireStartOnLaterQuestion />
  )

  await step("opens on the second question", async () => {
    await expect(
      canvas.getByRole("progressbar", { name: "Questionnaire progress" })
    ).toHaveAttribute("aria-valuetext", "Question 2 of 3")
    await expect(canvas.getByRole("button", { name: "Previous" })).toBeVisible()
  })
})
