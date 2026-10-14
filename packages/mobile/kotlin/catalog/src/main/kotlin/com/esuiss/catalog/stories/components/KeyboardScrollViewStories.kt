package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val keyboardScrollViewStories = StoryGroup(
    section = Section.Components,
    title = "Keyboard Scroll View",
    stories = listOf(
        Story("Default", fullScreen = true) { KeyboardScrollViewDefault() },
        Story("Focused", fullScreen = true) { KeyboardScrollViewFocused() },
        Story("WithBottomBar", fullScreen = true) { KeyboardScrollViewWithBottomBar() },
    ),
)

private val keyboardScrollViewFields = listOf(
    "First name",
    "Last name",
    "Email",
    "Phone",
    "Street",
    "City",
    "Postal code",
    "Country",
    "Company",
    "Notes",
)

@Composable
private fun KeyboardScrollViewField(label: String, modifier: Modifier = Modifier) {
    var value by rememberSaveable(label) { mutableStateOf("") }
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, variant = TextVariant.Small)
        Input(value, { value = it }, modifier, placeholder = label)
    }
}

@Composable
private fun ColumnScope.KeyboardScrollViewFields() {
    keyboardScrollViewFields.forEach { key(it) { KeyboardScrollViewField(it) } }
}

@Composable
private fun KeyboardScrollViewDefault() {
    Screen {
        KeyboardScrollView(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("Shipping address", variant = TextVariant.H3)
            KeyboardScrollViewFields()
        }
    }
}

@Composable
private fun KeyboardScrollViewFocused() {
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { focus.requestFocus() }
    Screen {
        KeyboardScrollView(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Text("Last field focused", variant = TextVariant.H3)
            keyboardScrollViewFields.dropLast(1).forEach { key(it) { KeyboardScrollViewField(it) } }
            KeyboardScrollViewField("Notes", Modifier.focusRequester(focus))
        }
    }
}

@Composable
private fun KeyboardScrollViewWithBottomBar() {
    Screen(edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        Column(Modifier.fillMaxSize()) {
            KeyboardScrollView(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text("Shipping address", variant = TextVariant.H3)
                KeyboardScrollViewFields()
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Save address", onClick = {}, size = ButtonSize.Lg, block = true)
                }
            }
        }
    }
}
