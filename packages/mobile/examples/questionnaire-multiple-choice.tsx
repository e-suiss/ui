import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"

export default function QuestionnaireMultipleChoice() {
  return (
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
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
