package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.InputAccessoryBar
import com.esuiss.ui.components.InputAccessoryState
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.components.inputAccessory
import com.esuiss.ui.components.rememberInputAccessoryState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val inputAccessoryBarStories = StoryGroup(
    section = Section.Components,
    title = "Input Accessory Bar",
    stories = listOf(
        Story("Default", fullScreen = true) { InputAccessoryBarForm(autoFocus = false) },
        Story("Focused", fullScreen = true) { InputAccessoryBarForm(autoFocus = true) },
        Story("CustomLabels", fullScreen = true) {
            InputAccessoryBarForm(autoFocus = true, previousLabel = "Back", nextLabel = "Forward", doneLabel = "Close")
        },
        Story("WithTextarea", fullScreen = true) { InputAccessoryBarDoneLog() },
    ),
)

@Composable
private fun InputAccessoryBarField(
    label: String,
    state: InputAccessoryState,
    index: Int,
    autoFocus: Boolean = false,
) {
    var value by rememberSaveable(label) { mutableStateOf("") }
    val requester = remember { FocusRequester() }
    if (autoFocus) {
        LaunchedEffect(Unit) { requester.requestFocus() }
    }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, variant = TextVariant.Small)
        Input(
            value,
            { value = it },
            Modifier.focusRequester(requester).inputAccessory(state, index),
            placeholder = label,
        )
    }
}

@Composable
private fun InputAccessoryBarForm(
    autoFocus: Boolean,
    previousLabel: String = "Previous",
    nextLabel: String = "Next",
    doneLabel: String = "Done",
) {
    val state = rememberInputAccessoryState()
    Screen {
        KeyboardScrollView(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            InputAccessoryBarField("Name", state, 0, autoFocus)
            InputAccessoryBarField("Email", state, 1)
            InputAccessoryBarField("Phone", state, 2)
            InputAccessoryBarField("City", state, 3)
        }
        InputAccessoryBar(state, previousLabel = previousLabel, nextLabel = nextLabel, doneLabel = doneLabel)
    }
}

@Composable
private fun InputAccessoryBarDoneLog() {
    val state = rememberInputAccessoryState()
    var log by rememberSaveable { mutableStateOf("Tap Done.") }
    var message by rememberSaveable { mutableStateOf("") }
    Screen {
        KeyboardScrollView(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            InputAccessoryBarField("Subject", state, 0, autoFocus = true)
            Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Message", variant = TextVariant.Small)
                Textarea(
                    message,
                    { message = it },
                    Modifier.inputAccessory(state, 1),
                    placeholder = "Message",
                )
            }
            Text(
                log,
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
            )
        }
        InputAccessoryBar(state, onDone = { log = "Done pressed" })
    }
}
