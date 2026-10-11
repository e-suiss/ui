package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.layout
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Bell
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardFooter
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val cardStories = StoryGroup(
    section = Section.Components,
    title = "Card",
    stories = listOf(
        Story("Default") { CardDefault() },
        Story("Small") { CardSmall() },
        Story("WithAction") { CardWithAction() },
        Story("WithImage") { CardWithImage() },
        Story("Filled") { CardFilled() },
    ),
)

@Composable
private fun CardDefault() {
    var email by rememberSaveable { mutableStateOf("") }
    var password by rememberSaveable { mutableStateOf("") }
    Card {
        CardHeader("Login to your account", description = "Enter your email below to login to your account")
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Label("Email")
                    Input(
                        email,
                        { email = it },
                        Modifier.semantics { contentDescription = "Email" },
                        placeholder = "m@example.com",
                        keyboardOptions = KeyboardOptions(
                            capitalization = KeyboardCapitalization.None,
                            autoCorrectEnabled = false,
                            keyboardType = KeyboardType.Email,
                        ),
                    )
                }
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Label("Password")
                    Input(
                        password,
                        { password = it },
                        Modifier.semantics { contentDescription = "Password" },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        visualTransformation = PasswordVisualTransformation(),
                    )
                }
            }
        }
        CardFooter {
            Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Button("Login", onClick = {}, block = true)
                Button("Login with Google", onClick = {}, variant = ButtonVariant.Secondary, block = true)
            }
        }
    }
}

@Composable
private fun CardSmall() {
    Card(size = CardSize.Sm) {
        CardHeader("Team plan", description = "Up to 10 members")
        CardContent {
            Text("Shared workspaces, unlimited projects and priority support.", style = Typography.sm)
        }
    }
}

@Composable
private fun CardWithAction() {
    Card {
        CardHeader(
            "Notifications",
            description = "You have 3 unread messages.",
            action = {
                Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.Bell, contentDescription = "Notifications")
                }
            },
        )
        CardContent {
            Text("Your call has been confirmed for tomorrow at 10:00.", style = Typography.sm)
        }
        CardFooter {
            Button("Mark all as read", onClick = {}, block = true)
        }
    }
}

@Composable
private fun CardWithImage() {
    val colors = EsuissTheme.colors
    val inset = CardSize.Default.spacing
    Card {
        Box(
            Modifier
                .layout { measurable, constraints ->
                    val placeable = measurable.measure(constraints)
                    val shift = inset.roundToPx()
                    layout(placeable.width, placeable.height - shift) { placeable.place(0, -shift) }
                }
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
                .background(Brush.linearGradient(listOf(colors.teal, colors.blue, colors.indigo))),
        )
        CardHeader("Mountain retreat", description = "A quiet cabin with a view.")
        CardFooter {
            Button("Book now", onClick = {}, variant = ButtonVariant.Tinted, block = true)
        }
    }
}

@Composable
private fun CardFilled() {
    Card(variant = CardVariant.Filled) {
        CardHeader("Storage", description = "42 GB of 128 GB used")
        CardContent {
            Text(
                "Photos and backups take up most of your space.",
                style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary),
            )
        }
    }
}
