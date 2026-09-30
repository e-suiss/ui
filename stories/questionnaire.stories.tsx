import type { Meta, StoryObj } from "@storybook/react-vite"

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
}

export const WithShortcuts: Story = {
  ...Default,
  args: { shortcuts: "letters" },
}

export const NumberShortcuts: Story = {
  ...Default,
  args: { shortcuts: "numbers" },
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
}

export const StartOnLaterQuestion: Story = {
  ...Default,
  args: { defaultItem: "team-size" },
}
