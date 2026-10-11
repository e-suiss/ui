package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.layer.drawLayer
import androidx.compose.ui.graphics.rememberGraphicsLayer
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.adamglin.phosphoricons.regular.Moon
import com.adamglin.phosphoricons.regular.Sun
import com.esuiss.ui.theme.EsuissTheme
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

enum class Theme(internal val key: String) {
    Light("light"),
    Dark("dark"),
    System("system"),
}

enum class ResolvedTheme { Light, Dark }

interface ThemeStorage {
    suspend fun getItem(key: String): String?
    suspend fun setItem(key: String, value: String)
}

class MemoryThemeStorage : ThemeStorage {
    private val items = mutableMapOf<String, String>()

    override suspend fun getItem(key: String): String? = synchronized(items) { items[key] }

    override suspend fun setItem(key: String, value: String) {
        synchronized(items) { items[key] = value }
    }
}

private val DefaultThemeStorage = MemoryThemeStorage()

internal enum class ThemeFade { Idle, Capture }

@Stable
class ThemeState internal constructor(
    defaultTheme: Theme,
    private val storageKey: String,
    private val storage: ThemeStorage,
    private val scope: CoroutineScope,
) {
    private var current by mutableStateOf(defaultTheme)

    val theme: Theme
        get() = current
    internal var systemDark by mutableStateOf(false)
    internal var animate = true
    internal var touched = false
    internal var fade by mutableStateOf(ThemeFade.Idle)
    internal val overlay = Animatable(0f)
    private var request = 0

    val resolvedTheme: ResolvedTheme
        get() = resolve(theme)

    private fun resolve(value: Theme): ResolvedTheme = when (value) {
        Theme.Light -> ResolvedTheme.Light
        Theme.Dark -> ResolvedTheme.Dark
        Theme.System -> if (systemDark) ResolvedTheme.Dark else ResolvedTheme.Light
    }

    internal fun restore(value: Theme) {
        if (!touched) current = value
    }

    fun setTheme(theme: Theme) {
        touched = true
        val id = ++request
        scope.launch { storage.setItem(storageKey, theme.key) }
        if (!animate || resolve(theme) == resolvedTheme) {
            current = theme
            return
        }
        scope.launch {
            fade = ThemeFade.Capture
            withFrameNanos { }
            withFrameNanos { }
            if (id != request) return@launch
            overlay.snapTo(1f)
            fade = ThemeFade.Idle
            current = theme
            overlay.animateTo(0f, tween(250, easing = FormEasing))
        }
    }
}

private val LocalThemeState = staticCompositionLocalOf<ThemeState?> { null }

@Composable
fun useTheme(): ThemeState =
    checkNotNull(LocalThemeState.current) { "useTheme must be used within a ThemeProvider" }

private fun themeOf(value: String?): Theme? = Theme.entries.firstOrNull { it.key == value }

@Composable
fun ThemeProvider(
    defaultTheme: Theme = Theme.System,
    storageKey: String = "theme",
    storage: ThemeStorage = DefaultThemeStorage,
    content: @Composable () -> Unit,
) {
    val scope = rememberCoroutineScope()
    val state = remember(storage, storageKey) { ThemeState(defaultTheme, storageKey, storage, scope) }
    state.systemDark = isSystemInDarkTheme()
    state.animate = !formReducedMotion()
    LaunchedEffect(state) {
        themeOf(storage.getItem(storageKey))?.let(state::restore)
    }
    val snapshot = rememberGraphicsLayer()
    CompositionLocalProvider(LocalThemeState provides state) {
        EsuissTheme(darkTheme = state.resolvedTheme == ResolvedTheme.Dark) {
            val label = EsuissTheme.colors.label
            CompositionLocalProvider(
                LocalContentStyle provides LocalContentStyle.current.copy(color = label),
                LocalContentColor provides label,
            ) {
                Box(
                    modifier = Modifier.drawWithContent {
                        if (state.fade == ThemeFade.Capture) {
                            snapshot.record { this@drawWithContent.drawContent() }
                        }
                        drawContent()
                        val alpha = state.overlay.value
                        if (alpha > 0f) {
                            snapshot.alpha = alpha
                            drawLayer(snapshot)
                        }
                    },
                    propagateMinConstraints = true,
                ) {
                    content()
                }
            }
        }
    }
}

@Composable
fun ThemeToggle(
    modifier: Modifier = Modifier,
    size: ToggleSize = ToggleSize.Default,
    enabled: Boolean = true,
) {
    val state = useTheme()
    ToggleGroup(
        value = state.theme.key,
        onValueChange = { next -> themeOf(next)?.let(state::setTheme) },
        modifier = modifier,
        size = size,
        spacing = 0,
        enabled = enabled,
    ) {
        ThemeToggleItem(Theme.Light, "Light")
        ThemeToggleItem(Theme.Dark, "Dark")
        ThemeToggleItem(Theme.System, "System")
    }
}

@Composable
private fun ThemeToggleItem(theme: Theme, label: String) {
    ToggleGroupItem(value = theme.key) {
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(
                when (theme) {
                    Theme.Light -> PhosphorIcons.Regular.Sun
                    Theme.Dark -> PhosphorIcons.Regular.Moon
                    Theme.System -> PhosphorIcons.Regular.DeviceMobile
                },
                contentDescription = null,
                size = 16.dp,
            )
            BasicText(label, style = LocalContentStyle.current, maxLines = 1)
        }
    }
}
