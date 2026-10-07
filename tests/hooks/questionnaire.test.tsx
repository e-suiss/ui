import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import type { QuestionnaireShortcutMode } from "@/hooks/use-questionnaire"

function Survey({
  shortcuts,
  onSubmit = (event) => event.preventDefault(),
  onItemChange,
}: {
  shortcuts?: QuestionnaireShortcutMode
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  onItemChange?: (item: string) => void
}) {
  return (
    <Questionnaire
      onSubmit={onSubmit}
      {...(shortcuts ? { shortcuts } : {})}
      {...(onItemChange ? { onItemChange } : {})}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="role" required>
        <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="engineering">
            Engineering
          </QuestionnaireChoice>
          <QuestionnaireChoice value="design">Design</QuestionnaireChoice>
          <QuestionnaireChoice value="product">Product</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="tools" multiple>
        <QuestionnaireTitle>Which tools do you use?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
          <QuestionnaireChoice value="linear">Linear</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="company" required>
        <QuestionnaireTitle>What is your company called?</QuestionnaireTitle>
        <QuestionnaireInput aria-label="Company" placeholder="Acme Inc." />
        <QuestionnaireError>
          Enter a company name to continue.
        </QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

const progress = () => page.getByRole("progressbar")
const button = (name: string) => page.getByRole("button", { name })
const question = (name: string) => page.getByText(name)

describe("Questionnaire", () => {
  it("starts on the first question with only the next button", async () => {
    await render(<Survey />)
    await expect.element(progress()).toHaveTextContent("Question 1 of 3")
    await expect
      .element(question("What best describes your role?"))
      .toBeVisible()
    await expect.element(question("Which tools do you use?")).not.toBeVisible()
    await expect.element(button("Next")).toBeVisible()
    await expect.element(button("Previous")).not.toBeInTheDocument()
    await expect.element(button("Skip")).not.toBeInTheDocument()
    await expect.element(button("Submit")).not.toBeInTheDocument()
  })

  it("will not move past a required question without an answer", async () => {
    await render(<Survey />)
    await button("Next").click()
    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Choose an answer to continue.")
    await expect.element(progress()).toHaveTextContent("Question 1 of 3")
  })

  it("moves forward and back between questions", async () => {
    const onItemChange = vi.fn()
    await render(<Survey onItemChange={onItemChange} />)
    await page.getByRole("radio", { name: "Design" }).click()
    await button("Next").click()
    await expect.element(progress()).toHaveTextContent("Question 2 of 3")
    await expect.element(question("Which tools do you use?")).toBeVisible()
    expect(onItemChange).toHaveBeenLastCalledWith("tools")

    await button("Previous").click()
    await expect.element(progress()).toHaveTextContent("Question 1 of 3")
    await expect
      .element(page.getByRole("radio", { name: "Design" }))
      .toBeChecked()
  })

  it("offers skip only on optional questions", async () => {
    await render(<Survey />)
    await page.getByRole("radio", { name: "Product" }).click()
    await button("Next").click()
    await expect.element(button("Skip")).toBeVisible()
    await button("Skip").click()
    await expect.element(progress()).toHaveTextContent("Question 3 of 3")
    await expect.element(button("Skip")).not.toBeInTheDocument()
  })

  it("allows several answers on a multiple choice question", async () => {
    await render(<Survey />)
    await page.getByRole("radio", { name: "Engineering" }).click()
    await button("Next").click()
    await page.getByRole("checkbox", { name: "Figma" }).click()
    await page.getByRole("checkbox", { name: "Linear" }).click()
    await expect
      .element(page.getByRole("checkbox", { name: "Figma" }))
      .toBeChecked()
    await expect
      .element(page.getByRole("checkbox", { name: "Linear" }))
      .toBeChecked()
  })

  it("blocks submit until the last required answer is given", async () => {
    const submitted: Record<string, FormDataEntryValue>[] = []
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      submitted.push(Object.fromEntries(new FormData(event.currentTarget)))
    })
    await render(<Survey onSubmit={onSubmit} />)
    await page.getByRole("radio", { name: "Design" }).click()
    await button("Next").click()
    await button("Skip").click()

    await button("Submit").click()
    await expect
      .element(page.getByRole("alert"))
      .toHaveTextContent("Enter a company name to continue.")
    expect(onSubmit).not.toHaveBeenCalled()

    await page.getByRole("textbox", { name: "Company" }).fill("Hestia")
    await button("Submit").click()
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(submitted[0]).toMatchObject({
      role: "design",
      company: "Hestia",
    })
  })

  it("selects answers with letter shortcuts", async () => {
    await render(<Survey shortcuts="letters" />)
    await page.getByRole("radio", { name: "Engineering" }).click()
    await userEvent.keyboard("b")
    await expect
      .element(page.getByRole("radio", { name: "Design" }))
      .toBeChecked()
  })

  it("selects answers with number shortcuts", async () => {
    await render(<Survey shortcuts="numbers" />)
    await page.getByRole("radio", { name: "Engineering" }).click()
    await userEvent.keyboard("3")
    await expect
      .element(page.getByRole("radio", { name: "Product" }))
      .toBeChecked()
  })

  it("moves on with Enter once a choice is made", async () => {
    await render(<Survey />)
    await page.getByRole("radio", { name: "Design" }).click()
    await userEvent.keyboard("{Enter}")
    await expect.element(progress()).toHaveTextContent("Question 2 of 3")
  })

  it("goes back with the left arrow key", async () => {
    await render(<Survey />)
    await page.getByRole("radio", { name: "Design" }).click()
    await button("Next").click()
    await page.getByRole("checkbox", { name: "Figma" }).click()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(progress()).toHaveTextContent("Question 1 of 3")
  })
})
