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
} from "@/components/ui/questionnaire"

export default function QuestionnaireStartOnLaterQuestion() {
  return (
    <Questionnaire
      className="w-[28rem]"
      onSubmit={(event) => event.preventDefault()}
      defaultItem="team-size"
    >
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
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
