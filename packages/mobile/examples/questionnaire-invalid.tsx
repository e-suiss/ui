import * as React from "react"
import { View } from "react-native"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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

export default function QuestionnaireInvalid() {
  return <Onboarding attempted />
}
