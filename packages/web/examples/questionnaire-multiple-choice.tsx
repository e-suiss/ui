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

export default function QuestionnaireMultipleChoice() {
  return (
    <div className="w-[28rem]">
      <Questionnaire onSubmit={(event) => event.preventDefault()}>
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
    </div>
  )
}
