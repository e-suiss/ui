package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AmountInput
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.util.Locale

val amountInputStories = StoryGroup(
    section = Section.Components,
    title = "Amount Input",
    stories = listOf(
        Story("Default") { AmountInputStory("USD", "en-US") },
        Story("Filled") { AmountInputStory("USD", "en-US", "1250.5") },
        Story("Controlled") { AmountInputControlled() },
        Story("LongAmount") { AmountInputStory("USD", "en-US", "98765432109.99") },
        Story("Euro") { AmountInputStory("EUR", "de-DE", "1234.5") },
        Story("TurkishLira") { AmountInputStory("TRY", "tr-TR", "2500.75") },
        Story("Yen") { AmountInputStory("JPY", "ja-JP", "15000") },
        Story("WithMax") { AmountInputStory("USD", "en-US", max = 500.0) },
        Story("Disabled") { AmountInputStory("USD", "en-US", "42", enabled = false) },
    ),
)

@Composable
private fun AmountInputStory(
    currency: String,
    locale: String,
    defaultValue: String = "",
    max: Double? = null,
    enabled: Boolean = true,
) {
    var value by rememberSaveable { mutableStateOf(defaultValue) }
    AmountInput(
        modifier = Modifier.fillMaxWidth(),
        value = value,
        onValueChange = { next, _ -> value = next },
        currency = currency,
        locale = Locale.forLanguageTag(locale),
        max = max,
        enabled = enabled,
    )
}

@Composable
private fun AmountInputControlled() {
    var value by rememberSaveable { mutableStateOf("") }
    var amount by rememberSaveable { mutableDoubleStateOf(0.0) }
    Column(
        Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        AmountInput(
            modifier = Modifier.fillMaxWidth(),
            value = value,
            onValueChange = { next, nextAmount ->
                value = next
                amount = nextAmount
            },
            currency = "USD",
            locale = Locale.forLanguageTag("en-US"),
        )
        val shown = if (amount % 1.0 == 0.0) amount.toLong().toString() else amount.toString()
        Text(
            "value \"$value\" · amount $shown",
            style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
        )
    }
}
