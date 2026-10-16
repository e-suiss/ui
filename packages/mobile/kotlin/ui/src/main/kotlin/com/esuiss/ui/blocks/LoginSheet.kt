package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.EnvelopeSimple
import com.adamglin.phosphoricons.regular.User
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Drawer
import com.esuiss.ui.components.DrawerFooter
import com.esuiss.ui.components.DrawerHeader
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private class EmailChoice(val value: String, val label: String, val hint: String)

private val EmailChoices = listOf(
    EmailChoice("share", "Share My Email", "jamie@example.com"),
    EmailChoice("hide", "Hide My Email", "A unique address that forwards to you"),
)

@Composable
fun LoginSheet(
    modifier: Modifier = Modifier,
    onContinue: (email: String) -> Unit = {},
    onContinueWithEmail: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var open by rememberSaveable { mutableStateOf(false) }
    var email by rememberSaveable { mutableStateOf("hide") }
    var busy by remember { mutableStateOf(false) }
    var done by rememberSaveable { mutableStateOf(false) }

    LaunchedEffect(busy) {
        if (!busy) return@LaunchedEffect
        delay(1000)
        busy = false
        open = false
        done = true
    }

    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 28.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Box(
                    Modifier
                        .padding(bottom = 20.dp)
                        .size(84.dp)
                        .clip(RoundedCornerShape(20.dp))
                        .background(Palette.green500),
                )
                BasicText(
                    if (done) "Welcome, Jamie" else "Trail Routes",
                    modifier = Modifier.semantics { heading() },
                    style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                )
                Spacer(Modifier.height(8.dp))
                BasicText(
                    if (done) "Your account was created with suiss." else "Save your routes and share them with friends.",
                    style = Typography.base.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                )
            }
            BottomBar {
                BottomBarContent {
                    if (done) {
                        Button("Sign out ›", { done = false }, variant = ButtonVariant.Plain)
                    } else {
                        InvertedButton("Sign in with suiss") { open = true }
                        Button(
                            onClick = onContinueWithEmail,
                            variant = ButtonVariant.Secondary,
                            size = ButtonSize.Xl,
                            block = true,
                        ) {
                            BasicText(
                                "Continue with email",
                                style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                            )
                        }
                    }
                }
            }
        }
        Drawer(
            open = open,
            onOpenChange = { if (!busy) open = it },
            showSwipeHandle = true,
            showCloseButton = true,
            closeLabel = null,
        ) {
            DrawerHeader {
                BasicText(
                    "suiss",
                    style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                )
            }
            Column(
                modifier = Modifier.padding(start = 20.dp, end = 20.dp, top = 14.dp, bottom = 14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                BasicText(
                    "Use your suiss Account with Trail Routes",
                    modifier = Modifier
                        .fillMaxWidth()
                        .semantics { heading() },
                    style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                )
                val shape = RoundedCornerShape(Radius.xl)
                Column(
                    Modifier
                        .fillMaxWidth()
                        .clip(shape)
                        .background(colors.muted, shape),
                ) {
                    InfoRow(PhosphorIcons.Regular.User, "Name", "Jamie Rivera")
                    Divider()
                    RadioGroup(value = email, onValueChange = { email = it }) {
                        Column {
                            EmailChoices.forEachIndexed { index, choice ->
                                if (index > 0) Divider()
                                ChoiceRow(choice, icon = if (index == 0) PhosphorIcons.Regular.EnvelopeSimple else null, selected = email == choice.value) {
                                    email = choice.value
                                }
                            }
                        }
                    }
                }
            }
            DrawerFooter {
                Button(
                    onClick = {
                        onContinue(email)
                        busy = true
                    },
                    size = ButtonSize.Xl,
                    block = true,
                    enabled = !busy,
                ) {
                    if (busy) {
                        Spinner(size = 20.dp, color = colors.primaryForeground)
                    } else {
                        BasicText(
                            "Continue with face scan",
                            style = Typography.lg.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold),
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InvertedButton(text: String, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val shape = RoundedCornerShape(Radius.xl)
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(56.dp)
            .clip(shape)
            .alpha(if (pressed) 0.8f else 1f)
            .background(colors.foreground, shape)
            .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = onClick),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(text, style = Typography.lg.copy(color = colors.background, fontWeight = FontWeight.SemiBold))
    }
}

@Composable
private fun Divider() {
    Box(
        Modifier
            .padding(start = 46.dp)
            .fillMaxWidth()
            .height(1.dp)
            .background(EsuissTheme.colors.border),
    )
}

@Composable
private fun InfoRow(icon: ImageVector, caption: String, value: String) {
    val colors = EsuissTheme.colors
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.dp, vertical = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(icon, contentDescription = null, size = 20.dp, tint = colors.mutedForeground)
        Column {
            BasicText(caption, style = Typography.xs.copy(color = colors.mutedForeground))
            BasicText(value, style = Typography.base.copy(color = colors.foreground))
        }
    }
}

@Composable
private fun ChoiceRow(choice: EmailChoice, icon: ImageVector?, selected: Boolean, onSelect: () -> Unit) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 52.dp)
            .alpha(if (pressed) 0.8f else 1f)
            .selectable(
                selected = selected,
                interactionSource = interaction,
                indication = null,
                role = Role.RadioButton,
                onClick = onSelect,
            )
            .padding(start = if (icon == null) 46.dp else 14.dp, end = 14.dp, top = 10.dp, bottom = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icon != null) Icon(icon, contentDescription = null, size = 20.dp, tint = colors.mutedForeground)
        Column(Modifier.weight(1f)) {
            BasicText(choice.label, style = Typography.base.copy(color = colors.foreground))
            BasicText(choice.hint, style = Typography.xs.copy(color = colors.mutedForeground))
        }
        Box(Modifier.graphicsLayer { scaleX = 1.3f; scaleY = 1.3f }) {
            RadioGroupItem(choice.value)
        }
    }
}
