// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
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

const STARTER = /^Starter/
const TEAM = /^Team/
const ENTERPRISE = /^Enterprise/

const meta = {
  title: "Components/Questionnaire",
  component: Questionnaire,
  args: {
    onSubmit: (event) => event.preventDefault(),
  },
  argTypes: {
    shortcuts: {
      control: "select",
      options: [undefined, "letters", "numbers"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Questionnaire>

export default meta

type Story = StoryObj<typeof meta>

function Actions() {
  return (
    <QuestionnaireActions>
      <QuestionnairePrevious />
      <QuestionnaireSkip />
      <QuestionnaireNext />
      <QuestionnaireSubmit />
    </QuestionnaireActions>
  )
}

export const Default: Story = {
  render: (args) => (
    <Questionnaire {...args}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="role" required>
        <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
        <QuestionnaireDescription>
          This helps us tailor the setup to your team.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="engineering">
            Engineering
          </QuestionnaireChoice>
          <QuestionnaireChoice value="design">Design</QuestionnaireChoice>
          <QuestionnaireChoice value="product">Product</QuestionnaireChoice>
          <QuestionnaireChoice value="other">
            Something else
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="team-size">
        <QuestionnaireTitle>How large is your team?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="solo">Just me</QuestionnaireChoice>
          <QuestionnaireChoice value="small">
            2 to 10 people
          </QuestionnaireChoice>
          <QuestionnaireChoice value="medium">
            11 to 50 people
          </QuestionnaireChoice>
          <QuestionnaireChoice value="large">
            More than 50 people
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="company" required>
        <QuestionnaireTitle>What is your company called?</QuestionnaireTitle>
        <QuestionnaireInput placeholder="Acme Inc." />
        <QuestionnaireError>
          Enter a company name to continue.
        </QuestionnaireError>
      </QuestionnaireItem>
      <Actions />
    </Questionnaire>
  ),
  play: async ({ canvas, step }) => {
    const progress = canvas.getByRole("progressbar", {
      name: "Questionnaire progress",
    })

    await step("blocks a required question until it is answered", async () => {
      await expect(progress).toHaveAttribute(
        "aria-valuetext",
        "Question 1 of 3"
      )
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
  },
}

export const WithShortcuts: Story = {
  args: { shortcuts: "letters" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("picks a choice with its letter key", async () => {
      canvas.getByRole("radio", { name: "Engineering" }).focus()
      await userEvent.keyboard("c")
      await expect(canvas.getByRole("radio", { name: "Product" })).toBeChecked()
    })
  },
}

export const NumberShortcuts: Story = {
  args: { shortcuts: "numbers" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("picks a choice with its number key", async () => {
      canvas.getByRole("radio", { name: "Engineering" }).focus()
      await userEvent.keyboard("2")
      await expect(canvas.getByRole("radio", { name: "Design" })).toBeChecked()
    })
  },
}

export const MultipleChoice: Story = {
  render: (args) => (
    <Questionnaire {...args}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="features" multiple required>
        <QuestionnaireTitle>
          Which features do you plan to use?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Select all that apply.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="analytics" defaultChecked>
            Analytics
          </QuestionnaireChoice>
          <QuestionnaireChoice value="billing">Billing</QuestionnaireChoice>
          <QuestionnaireChoice value="automations">
            Automations
          </QuestionnaireChoice>
          <QuestionnaireChoice value="integrations" disabled>
            Integrations
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>Choose at least one feature.</QuestionnaireError>
      </QuestionnaireItem>
      <Actions />
    </Questionnaire>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

export const WithChoiceDescriptions: Story = {
  render: (args) => (
    <Questionnaire {...args}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="plan" required>
        <QuestionnaireTitle>Which plan fits you best?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="starter">
            Starter
            <QuestionnaireChoiceDescription>
              For individuals trying things out.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="team" defaultChecked>
            Team
            <QuestionnaireChoiceDescription>
              Shared workspaces and roles for growing teams.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="enterprise">
            Enterprise
            <QuestionnaireChoiceDescription>
              Single sign-on, audit logs, and priority support.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <Actions />
    </Questionnaire>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

export const TextInput: Story = {
  render: (args) => (
    <Questionnaire {...args}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="email" required>
        <QuestionnaireTitle>
          Where should we send your results?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          We only use your email to share the report.
        </QuestionnaireDescription>
        <QuestionnaireInput type="email" placeholder="you@example.com" />
        <QuestionnaireError>
          Enter an email address to continue.
        </QuestionnaireError>
      </QuestionnaireItem>
      <Actions />
    </Questionnaire>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

export const StartOnLaterQuestion: Story = {
  args: { defaultItem: "team-size" },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("opens on the second question", async () => {
      await expect(
        canvas.getByRole("progressbar", { name: "Questionnaire progress" })
      ).toHaveAttribute("aria-valuetext", "Question 2 of 3")
      await expect(
        canvas.getByRole("button", { name: "Previous" })
      ).toBeVisible()
    })
  },
}
