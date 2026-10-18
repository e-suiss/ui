import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
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

export default function QuestionnaireWithChoiceDescriptions() {
  return (
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
  )
}
