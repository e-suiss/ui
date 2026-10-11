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
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.User
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardFooter
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Tabs
import com.esuiss.ui.components.TabsContent
import com.esuiss.ui.components.TabsList
import com.esuiss.ui.components.TabsListVariant
import com.esuiss.ui.components.TabsTrigger
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val tabsStories = StoryGroup(
    section = Section.Components,
    title = "Tabs",
    stories = listOf(
        Story("Default") { TabsDemo() },
        Story("WithIcons") { TabsWithIcons(TabsListVariant.Default) },
        Story("DisabledTab") { TabsDisabledTab(TabsListVariant.Default) },
        Story("Line") { TabsSections(TabsListVariant.Line) },
        Story("WithIconsLine") { TabsWithIcons(TabsListVariant.Line) },
        Story("DisabledTabLine") { TabsDisabledTab(TabsListVariant.Line) },
    ),
)

@Composable
private fun TabsField(label: String, initial: String, password: Boolean = false, capitalize: Boolean = true) {
    var value by rememberSaveable(label) { mutableStateOf(initial) }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Label(label)
        Input(
            value,
            { value = it },
            Modifier.semantics { contentDescription = label },
            keyboardOptions = when {
                password -> KeyboardOptions(keyboardType = KeyboardType.Password)
                capitalize -> KeyboardOptions.Default
                else -> KeyboardOptions(capitalization = KeyboardCapitalization.None, autoCorrectEnabled = false)
            },
            visualTransformation = if (password) PasswordVisualTransformation() else VisualTransformation.None,
        )
    }
}

@Composable
private fun TabsSecondaryText(text: String) {
    Text(text, style = Typography.sm, color = EsuissTheme.colors.labelSecondary)
}

@Composable
private fun TabsDemo() {
    var value by rememberSaveable { mutableStateOf("account") }
    Tabs(value, { value = it }, Modifier.fillMaxWidth()) {
        TabsList {
            TabsTrigger("account", "Account")
            TabsTrigger("password", "Password")
        }
        TabsContent("account") {
            Card(Modifier.fillMaxWidth()) {
                CardHeader("Account", description = "Make changes to your account here.")
                CardContent {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        TabsField("Name", "Pedro Duarte")
                        TabsField("Username", "@peduarte", capitalize = false)
                    }
                }
                CardFooter {
                    Button("Save changes", onClick = {})
                }
            }
        }
        TabsContent("password") {
            Card(Modifier.fillMaxWidth()) {
                CardHeader("Password", description = "Change your password here. You will be logged out after saving.")
                CardContent {
                    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                        TabsField("Current password", "", password = true)
                        TabsField("New password", "", password = true)
                    }
                }
                CardFooter {
                    Button("Save password", onClick = {})
                }
            }
        }
    }
}

@Composable
private fun TabsWithIcons(variant: TabsListVariant) {
    var value by rememberSaveable { mutableStateOf("profile") }
    Tabs(value, { value = it }) {
        TabsList(variant = variant) {
            TabsTrigger("profile") {
                Icon(PhosphorIcons.Regular.User, contentDescription = null, size = 16.dp)
                Text("Profile")
            }
            TabsTrigger("settings") {
                Icon(PhosphorIcons.Regular.Gear, contentDescription = null, size = 16.dp)
                Text("Settings")
            }
        }
        TabsContent("profile") { TabsSecondaryText("Your public profile information.") }
        TabsContent("settings") { TabsSecondaryText("Manage your preferences.") }
    }
}

@Composable
private fun TabsDisabledTab(variant: TabsListVariant) {
    var value by rememberSaveable { mutableStateOf("overview") }
    Tabs(value, { value = it }) {
        TabsList(variant = variant) {
            TabsTrigger("overview", "Overview")
            TabsTrigger("analytics", "Analytics")
            TabsTrigger("reports", "Reports", enabled = false)
        }
        TabsContent("overview") { TabsSecondaryText("A summary of your activity.") }
        TabsContent("analytics") { TabsSecondaryText("Detailed metrics and trends.") }
    }
}

@Composable
private fun TabsSections(variant: TabsListVariant) {
    var value by rememberSaveable { mutableStateOf("overview") }
    Tabs(value, { value = it }) {
        TabsList(variant = variant) {
            TabsTrigger("overview", "Overview")
            TabsTrigger("analytics", "Analytics")
            TabsTrigger("reports", "Reports")
        }
        TabsContent("overview") { TabsSecondaryText("A summary of your activity.") }
        TabsContent("analytics") { TabsSecondaryText("Detailed metrics and trends.") }
        TabsContent("reports") { TabsSecondaryText("Exported reports and schedules.") }
    }
}
