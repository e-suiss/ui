package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Questionnaire
import com.esuiss.ui.components.QuestionnaireActions
import com.esuiss.ui.components.QuestionnaireChoice
import com.esuiss.ui.components.QuestionnaireChoiceDescription
import com.esuiss.ui.components.QuestionnaireChoices
import com.esuiss.ui.components.QuestionnaireDescription
import com.esuiss.ui.components.QuestionnaireError
import com.esuiss.ui.components.QuestionnaireInput
import com.esuiss.ui.components.QuestionnaireItem
import com.esuiss.ui.components.QuestionnaireNext
import com.esuiss.ui.components.QuestionnairePrevious
import com.esuiss.ui.components.QuestionnaireProgress
import com.esuiss.ui.components.QuestionnaireSkip
import com.esuiss.ui.components.QuestionnaireSubmit
import com.esuiss.ui.components.QuestionnaireTitle
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.rememberQuestionnaireState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val questionnaireStories = StoryGroup(
    section = Section.Components,
    title = "Questionnaire",
    stories = listOf(
        Story("Default") { QuestionnaireOnboarding() },
        Story("MidFlow") { QuestionnaireOnboarding(defaultItem = "team-size") },
        Story("Invalid") { QuestionnaireOnboarding(attempted = true) },
        Story("MultipleChoice") { QuestionnaireMultipleChoice() },
        Story("WithChoiceDescriptions") { QuestionnaireWithChoiceDescriptions() },
        Story("TextInput") { QuestionnaireTextInput() },
    ),
)

private fun questionnaireJson(values: Map<String, List<String>>): String =
    values.entries.joinToString(",", "{", "}") { (key, list) ->
        "\"$key\":" + list.joinToString(",", "[", "]") { "\"$it\"" }
    }

@Composable
private fun QuestionnaireActionsRow() {
    QuestionnaireActions {
        QuestionnairePrevious()
        QuestionnaireSkip()
        QuestionnaireNext()
        QuestionnaireSubmit()
    }
}

@Composable
private fun QuestionnaireResult(values: String?) {
    if (values == null) return
    Text(
        "Submitted: $values",
        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
        style = Typography.sm,
        color = EsuissTheme.colors.mutedForeground,
    )
}

@Composable
private fun QuestionnaireOnboarding(defaultItem: String? = null, attempted: Boolean = false) {
    var values by rememberSaveable { mutableStateOf<String?>(null) }
    val state = rememberQuestionnaireState(defaultItem = defaultItem)
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Questionnaire(state = state, onSubmit = { values = questionnaireJson(it) }) {
            QuestionnaireProgress()
            QuestionnaireItem(name = "role", required = true, invalid = attempted) {
                QuestionnaireTitle("What best describes your role?")
                QuestionnaireDescription("This helps us tailor the setup to your team.")
                QuestionnaireChoices {
                    QuestionnaireChoice("Engineering", value = "engineering")
                    QuestionnaireChoice("Design", value = "design")
                    QuestionnaireChoice("Product", value = "product")
                    QuestionnaireChoice("Something else", value = "other")
                }
                QuestionnaireError()
            }
            QuestionnaireItem(name = "team-size") {
                QuestionnaireTitle("How large is your team?")
                QuestionnaireChoices {
                    QuestionnaireChoice("Just me", value = "solo")
                    QuestionnaireChoice("2 to 10 people", value = "small", defaultChecked = true)
                    QuestionnaireChoice("11 to 50 people", value = "medium")
                    QuestionnaireChoice("More than 50 people", value = "large")
                }
                QuestionnaireError()
            }
            QuestionnaireItem(name = "company", required = true) {
                QuestionnaireTitle("What is your company called?")
                QuestionnaireInput(placeholder = "Acme Inc.")
                QuestionnaireError("Enter a company name to continue.")
            }
            QuestionnaireActionsRow()
        }
        QuestionnaireResult(values)
    }
}

@Composable
private fun QuestionnaireMultipleChoice() {
    Questionnaire(Modifier.fillMaxWidth()) {
        QuestionnaireProgress()
        QuestionnaireItem(name = "features", multiple = true, required = true) {
            QuestionnaireTitle("Which features do you plan to use?")
            QuestionnaireDescription("Select all that apply.")
            QuestionnaireChoices {
                QuestionnaireChoice("Analytics", value = "analytics", defaultChecked = true)
                QuestionnaireChoice("Billing", value = "billing", defaultChecked = true)
                QuestionnaireChoice("Automations", value = "automations")
                QuestionnaireChoice("Integrations", value = "integrations", enabled = false)
            }
            QuestionnaireError("Choose at least one feature.")
        }
        QuestionnaireActionsRow()
    }
}

@Composable
private fun QuestionnaireWithChoiceDescriptions() {
    Questionnaire(Modifier.fillMaxWidth()) {
        QuestionnaireProgress()
        QuestionnaireItem(name = "plan", required = true) {
            QuestionnaireTitle("Which plan fits you best?")
            QuestionnaireChoices {
                QuestionnaireChoice(value = "starter") {
                    Text("Starter")
                    QuestionnaireChoiceDescription("For individuals trying things out.")
                }
                QuestionnaireChoice(value = "team", defaultChecked = true) {
                    Text("Team")
                    QuestionnaireChoiceDescription("Shared workspaces and roles for growing teams.")
                }
                QuestionnaireChoice(value = "enterprise") {
                    Text("Enterprise")
                    QuestionnaireChoiceDescription("Single sign-on, audit logs, and priority support.")
                }
            }
            QuestionnaireError()
        }
        QuestionnaireActionsRow()
    }
}

@Composable
private fun QuestionnaireTextInput() {
    Questionnaire(Modifier.fillMaxWidth()) {
        QuestionnaireProgress()
        QuestionnaireItem(name = "email", required = true) {
            QuestionnaireTitle("Where should we send your results?")
            QuestionnaireDescription("We only use your email to share the report.")
            QuestionnaireInput(
                placeholder = "you@example.com",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            )
            QuestionnaireError("Enter an email address to continue.")
        }
        QuestionnaireActionsRow()
    }
}
