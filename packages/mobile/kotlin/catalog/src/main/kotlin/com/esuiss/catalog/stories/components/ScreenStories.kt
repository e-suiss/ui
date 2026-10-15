package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenContent
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.ScreenVariant
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius

val screenStories = StoryGroup(
    section = Section.Components,
    title = "Screen",
    stories = listOf(
        Story("Default", fullScreen = true) { ScreenDefault() },
        Story("Secondary", fullScreen = true) { ScreenSecondary() },
        Story("Scrollable", fullScreen = true) { ScreenScrollable() },
        Story("TopEdgeOnly", fullScreen = true) { ScreenTopEdgeOnly() },
        Story("WithBottomBar", fullScreen = true) { ScreenWithBottomBar() },
    ),
)

@Composable
private fun ScreenRows(labels: List<String>, background: Color) {
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(Radius.xl2))
            .background(background),
    ) {
        labels.forEachIndexed { index, label ->
            if (index > 0) Separator()
            Text(label, Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp))
        }
    }
}

private fun screenRowLabels(count: Int): List<String> = (1..count).map { "Row $it" }

@Composable
private fun ScreenDefault() {
    Screen {
        ScreenContent {
            Text("Account", variant = TextVariant.H2)
            Text(
                "The screen pads every safe-area edge and sets the status bar style from the color scheme.",
                variant = TextVariant.Muted,
            )
            ScreenRows(screenRowLabels(4), EsuissTheme.colors.muted)
        }
    }
}

@Composable
private fun ScreenSecondary() {
    Screen(variant = ScreenVariant.Secondary) {
        ScreenContent {
            Text("Settings", variant = TextVariant.H2)
            ScreenRows(listOf("General", "Privacy", "Notifications"), EsuissTheme.colors.background)
        }
    }
}

@Composable
private fun ScreenScrollable() {
    Screen {
        ScreenContent(Modifier.fillMaxSize(), scrollable = true) {
            Text("Long content", variant = TextVariant.H2)
            ScreenRows(screenRowLabels(24), EsuissTheme.colors.muted)
        }
    }
}

@Composable
private fun ScreenTopEdgeOnly() {
    Screen(edges = setOf(ScreenEdge.Top)) {
        ScreenContent(Modifier.background(EsuissTheme.colors.muted)) {
            Text("Top edge only", variant = TextVariant.H3)
            Text("The bottom, left and right edges are not padded.", variant = TextVariant.Muted)
        }
    }
}

@Composable
private fun ScreenWithBottomBar() {
    var email by rememberSaveable { mutableStateOf("") }
    Screen {
        Column(Modifier.fillMaxSize()) {
            ScreenContent(Modifier.weight(1f), scrollable = true) {
                Text("Your email", variant = TextVariant.H2)
                Text("We will send a code to this address.", variant = TextVariant.Muted)
                Input(
                    email,
                    { email = it },
                    placeholder = "name@example.com",
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                )
            }
            BottomBar(separator = true) {
                BottomBarContent {
                    Button("Continue", onClick = {}, size = ButtonSize.Lg, block = true)
                }
            }
        }
    }
}
