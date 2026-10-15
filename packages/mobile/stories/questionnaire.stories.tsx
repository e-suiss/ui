import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
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
  type QuestionnaireValues,
} from "@/components/ui/questionnaire"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Questionnaire",
  component: Questionnaire,
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

function Result({ values }: { values: QuestionnaireValues | null }) {
  if (!values) return null
  return (
    <Text role="status" className="text-sm text-muted-foreground">
      {`Submitted: ${JSON.stringify(values)}`}
    </Text>
  )
}

function Onboarding({
  defaultItem,
  attempted = false,
}: {
  defaultItem?: string
  attempted?: boolean
}) {
  const [values, setValues] = React.useState<QuestionnaireValues | null>(null)
  return (
    <View className="w-full gap-4">
      <Questionnaire defaultItem={defaultItem} onSubmit={setValues}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="role" required invalid={attempted}>
          <QuestionnaireTitle>
            What best describes your role?
          </QuestionnaireTitle>
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
            <QuestionnaireChoice value="small" defaultChecked>
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
      <Result values={values} />
    </View>
  )
}

export const Default: Story = {
  render: () => <Onboarding />,
}

export const MidFlow: Story = {
  render: () => <Onboarding defaultItem="team-size" />,
}

export const Invalid: Story = {
  render: () => <Onboarding attempted />,
}

export const MultipleChoice: Story = {
  render: () => (
    <Questionnaire>
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
          <QuestionnaireChoice value="billing" defaultChecked>
            Billing
          </QuestionnaireChoice>
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
  render: () => (
    <Questionnaire>
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
  render: () => (
    <Questionnaire>
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
