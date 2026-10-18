import {
  Questionnaire,
  QuestionnaireActions,
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

export default function QuestionnaireTextInput() {
  return (
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
  )
}
