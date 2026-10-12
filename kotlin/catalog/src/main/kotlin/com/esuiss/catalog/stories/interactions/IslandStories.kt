package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.bold.DownloadSimple
import com.adamglin.phosphoricons.fill.Bell
import com.adamglin.phosphoricons.fill.ChatCircle
import com.adamglin.phosphoricons.fill.CheckCircle
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.Island
import com.esuiss.ui.interactions.IslandProvider
import com.esuiss.ui.interactions.IslandRegion
import com.esuiss.ui.interactions.IslandRing
import com.esuiss.ui.interactions.useIsland
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlin.math.roundToInt

val islandStories = StoryGroup(
    section = Section.Interactions,
    title = "Island",
    stories = listOf(
        Story("Compact") { IslandProvider { IslandDownloads(initial = 0.42f) } },
        Story("Expanded") { IslandProvider { IslandDownloads(initial = 0.42f, start = IslandStart.Expanded) } },
        Story("Minimal") { IslandProvider { IslandDownloads(initial = 0.42f, start = IslandStart.Minimal) } },
        Story("Notice") { IslandProvider { IslandNoticeOnMount() } },
        Story("LiveActivity") { IslandProvider { IslandDownloads(withNotifications = true) } },
    ),
)

private enum class IslandStart { Compact, Expanded, Minimal }

private const val IslandSize = 120

@Composable
private fun IslandNotifyButtons(extra: @Composable () -> Unit = {}) {
    val island = useIsland()
    val colors = EsuissTheme.colors
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp, Alignment.CenterHorizontally),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Button(
            "New message",
            onClick = {
                island.notify(
                    title = "Jordan Lee",
                    description = "Are we still on for Saturday?",
                    icon = { Icon(PhosphorIcons.Fill.ChatCircle, contentDescription = null, tint = colors.green) },
                )
            },
            variant = ButtonVariant.Secondary,
        )
        Button(
            "Reminder",
            onClick = {
                island.notify(
                    title = "Design review",
                    description = "Starts in 10 minutes",
                    icon = { Icon(PhosphorIcons.Fill.Bell, contentDescription = null, tint = colors.orange) },
                )
            },
            variant = ButtonVariant.Secondary,
        )
        extra()
    }
}

@Composable
private fun IslandProgress(progress: Float) {
    val colors = EsuissTheme.colors
    if (progress >= 1f) {
        Icon(PhosphorIcons.Fill.CheckCircle, contentDescription = null, tint = colors.green)
    } else {
        IslandRing(progress)
    }
}

@Composable
private fun IslandDownloadIsland(progress: Float?, onCancel: () -> Unit) {
    val colors = EsuissTheme.colors
    val current = progress ?: 0f
    val done = current >= 1f
    val percent = (current * 100).roundToInt()
    Island(
        compactLeading = progress?.let {
            { Icon(PhosphorIcons.Bold.DownloadSimple, contentDescription = null, tint = colors.accent) }
        },
        compactTrailing = progress?.let { value -> { IslandProgress(value) } },
        minimal = progress?.let { value -> { IslandProgress(value) } },
        modifier = Modifier.semantics { contentDescription = "Downloading Design-Kit.zip, $percent%" },
    ) {
        IslandExpandedRegion(IslandRegion.Leading) {
            val foreground = LocalContentColor.current
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(foreground.copy(alpha = 0.15f), RoundedCornerShape(Radius.xl)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(PhosphorIcons.Bold.DownloadSimple, contentDescription = null, size = 24.dp, tint = colors.accent)
            }
        }
        IslandExpandedRegion(IslandRegion.Trailing) {
            Text("$percent%", style = Typography.xl2.copy(color = LocalContentColor.current, fontWeight = FontWeight.SemiBold))
        }
        IslandExpandedRegion(IslandRegion.Center) {
            val foreground = LocalContentColor.current
            Text(
                if (done) "Downloaded" else "Downloading",
                style = Typography.sm.copy(color = foreground, fontWeight = FontWeight.SemiBold),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                if (done) "Design-Kit.zip" else "Design-Kit.zip · ${(current * IslandSize).roundToInt()} of $IslandSize MB",
                style = Typography.sm.copy(color = foreground.copy(alpha = 0.7f)),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        IslandExpandedRegion(IslandRegion.Bottom) {
            val foreground = LocalContentColor.current
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp)
                    .clip(CircleShape)
                    .background(foreground.copy(alpha = 0.2f))
                    .semantics {
                        contentDescription = "Download progress"
                        progressBarRangeInfo = ProgressBarRangeInfo(percent.toFloat(), 0f..100f)
                    },
            ) {
                Box(
                    Modifier
                        .fillMaxWidth(current.coerceIn(0f, 1f))
                        .fillMaxHeight()
                        .background(colors.accent, CircleShape),
                )
            }
            Spacer(Modifier.height(12.dp))
            val interaction = remember { MutableInteractionSource() }
            val pressed by interaction.collectIsPressedAsState()
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
                    .alpha(if (done) 0.5f else 1f)
                    .clip(CircleShape)
                    .background(foreground.copy(alpha = if (pressed) 0.25f else 0.15f))
                    .clickable(interactionSource = interaction, indication = null, enabled = !done, role = Role.Button, onClick = onCancel),
                contentAlignment = Alignment.Center,
            ) {
                Text("Cancel download", style = Typography.sm.copy(color = foreground, fontWeight = FontWeight.SemiBold))
            }
        }
    }
}

@Composable
private fun IslandDownloads(initial: Float? = null, start: IslandStart = IslandStart.Compact, withNotifications: Boolean = false) {
    val island = useIsland()
    val colors = EsuissTheme.colors
    var progress by rememberSaveable { mutableStateOf(initial) }
    LaunchedEffect(progress) {
        val current = progress ?: return@LaunchedEffect
        if (initial != null) return@LaunchedEffect
        if (current < 1f) {
            delay(150)
            progress = minOf(current + 0.01f, 1f)
        } else {
            delay(1200)
            progress = null
            island.notify(
                title = "Download complete",
                description = "Design-Kit.zip",
                icon = { Icon(PhosphorIcons.Fill.CheckCircle, contentDescription = null, tint = colors.green) },
            )
        }
    }
    LaunchedEffect(start) {
        when (start) {
            IslandStart.Expanded -> island.expand()
            IslandStart.Minimal -> island.minimize()
            IslandStart.Compact -> Unit
        }
    }
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        IslandDownloadIsland(progress) { progress = null }
        Text(
            "Start a download, then tap the pill at the top to see the details. Swipe up on it to close.",
            modifier = Modifier.widthIn(max = 320.dp),
            style = Typography.sm.copy(color = colors.labelSecondary),
            textAlign = TextAlign.Center,
        )
        if (initial == null) {
            Button(
                if (progress == null) "Download Design-Kit.zip" else "Downloading…",
                onClick = { progress = 0f },
                enabled = progress == null,
            )
        }
        if (withNotifications) {
            IslandNotifyButtons {
                Button(
                    "Minimize",
                    onClick = island::minimize,
                    variant = ButtonVariant.Secondary,
                    enabled = progress != null,
                )
            }
        }
    }
}

@Composable
private fun IslandNoticeOnMount() {
    val island = useIsland()
    val colors = EsuissTheme.colors
    var shown by rememberSaveable { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        if (shown) return@LaunchedEffect
        shown = true
        island.notify(
            title = "Jordan Lee",
            description = "Are we still on for Saturday?",
            duration = 600000L,
            icon = { Icon(PhosphorIcons.Fill.ChatCircle, contentDescription = null, tint = colors.green) },
        )
    }
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Island()
        Text(
            "The pill grows to show the notification and shrinks back on its own.",
            modifier = Modifier.widthIn(max = 320.dp),
            style = Typography.sm.copy(color = colors.labelSecondary),
            textAlign = TextAlign.Center,
        )
        IslandNotifyButtons()
    }
}
