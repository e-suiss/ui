package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.BellRinging
import com.adamglin.phosphoricons.regular.CloudCheck
import com.adamglin.phosphoricons.regular.ShieldCheck
import com.adamglin.phosphoricons.regular.Sparkle
import com.esuiss.ui.components.BottomBar
import com.esuiss.ui.components.BottomBarContent
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Carousel
import com.esuiss.ui.components.CarouselContent
import com.esuiss.ui.components.CarouselItem
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.PageIndicator
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.rememberCarouselState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Immutable
class OnboardingPage(
    val title: String,
    val description: String,
    val illustration: (@Composable () -> Unit)? = null,
)

private fun iconPage(title: String, description: String, icon: ImageVector) = OnboardingPage(title, description) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(200.dp)
            .background(colors.primary.copy(alpha = if (colors.isDark) 0.2f else 0.1f), CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        Icon(icon, contentDescription = null, size = 96.dp, tint = colors.primary)
    }
}

private val DemoPages = listOf(
    iconPage("Welcome to suiss", "Everything you love, together in one place.", PhosphorIcons.Regular.Sparkle),
    iconPage("Always in sync", "Your photos, notes and passwords stay up to date on every device.", PhosphorIcons.Regular.CloudCheck),
    iconPage("Private by design", "Your data is encrypted end to end. Only you can read it.", PhosphorIcons.Regular.ShieldCheck),
    iconPage("Stay in the loop", "Get notified about the things that matter to you.", PhosphorIcons.Regular.BellRinging),
)

@Composable
fun Onboarding(
    modifier: Modifier = Modifier,
    pages: List<OnboardingPage> = DemoPages,
    onDone: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val state = rememberCarouselState(pageCount = pages.size)
    val last = state.selectedIndex >= pages.lastIndex
    Screen(modifier) {
        Column(Modifier.fillMaxSize()) {
            Carousel(state = state, modifier = Modifier.weight(1f)) {
                CarouselContent(modifier = Modifier.weight(1f), pageSpacing = 0.dp) { index ->
                    val page = pages[index]
                    CarouselItem(Modifier.fillMaxSize()) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(horizontal = 32.dp),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            val illustration = page.illustration
                            if (illustration != null) {
                                Box(Modifier.clearAndSetSemantics {}) { illustration() }
                                Spacer(Modifier.height(40.dp))
                            }
                            BasicText(
                                page.title,
                                modifier = Modifier.semantics { heading() },
                                style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center),
                            )
                            Spacer(Modifier.height(12.dp))
                            BasicText(
                                page.description,
                                modifier = Modifier.widthIn(max = 360.dp),
                                style = Typography.lg.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                            )
                        }
                    }
                }
            }
            PageIndicator(
                count = pages.size,
                index = state.selectedIndex,
                onIndexChange = { state.scrollTo(it) },
                modifier = Modifier
                    .align(Alignment.CenterHorizontally)
                    .padding(vertical = 12.dp),
            )
            BottomBar {
                BottomBarContent {
                    Button(
                        if (last) "Get started" else "Continue",
                        { if (last) onDone() else state.scrollNext() },
                        size = ButtonSize.Lg,
                        block = true,
                    )
                    Button(
                        "Skip",
                        onDone,
                        modifier = Modifier
                            .fillMaxWidth()
                            .graphicsLayer { alpha = if (last) 0f else 1f },
                        variant = ButtonVariant.Plain,
                        enabled = !last,
                    )
                }
            }
        }
    }
}
