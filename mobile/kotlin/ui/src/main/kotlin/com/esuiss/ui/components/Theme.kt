package com.esuiss.ui.components

import android.graphics.Bitmap
import android.os.Build
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.ClipOp
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.asAndroidBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.layer.GraphicsLayer
import androidx.compose.ui.graphics.rememberGraphicsLayer
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.adamglin.phosphoricons.regular.Moon
import com.adamglin.phosphoricons.regular.Sun
import com.esuiss.ui.theme.EsuissTheme
import kotlin.math.max
import kotlin.math.sqrt
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

enum class ThemeEffect { Circle, Rectangle, Polygon, CircleBlur }

enum class ThemeOrigin {
    Center,
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight,
    TopCenter,
    BottomCenter,
    BottomUp,
    TopDown,
    LeftRight,
    RightLeft,
}

data class ThemeTransition(
    val effect: ThemeEffect = ThemeEffect.Circle,
    val origin: ThemeOrigin? = null,
    val blur: Boolean = false,
)

internal enum class ThemeFade { Idle, Capture }

private val RevealEasing = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)

private val Points = mapOf(
    ThemeOrigin.Center to Offset(0.5f, 0.5f),
    ThemeOrigin.TopLeft to Offset(0f, 0f),
    ThemeOrigin.TopRight to Offset(1f, 0f),
    ThemeOrigin.BottomLeft to Offset(0f, 1f),
    ThemeOrigin.BottomRight to Offset(1f, 1f),
    ThemeOrigin.TopCenter to Offset(0.5f, 0f),
    ThemeOrigin.BottomCenter to Offset(0.5f, 1f),
)

private fun polygon(vararg values: Float): List<Offset> =
    values.toList().chunked(2).map { Offset(it[0] / 100f, it[1] / 100f) }

private val Full = polygon(0f, 0f, 100f, 0f, 100f, 100f, 0f, 100f)

private val Edges = mapOf(
    ThemeOrigin.BottomUp to polygon(0f, 100f, 100f, 100f, 100f, 100f, 0f, 100f),
    ThemeOrigin.TopDown to polygon(0f, 0f, 100f, 0f, 100f, 0f, 0f, 0f),
    ThemeOrigin.LeftRight to polygon(0f, 0f, 0f, 0f, 0f, 100f, 0f, 100f),
    ThemeOrigin.RightLeft to polygon(100f, 0f, 100f, 0f, 100f, 100f, 100f, 100f),
)

private val Diagonals = mapOf(
    ThemeOrigin.TopLeft to mapOf(
        ResolvedTheme.Dark to (
            polygon(50f, -71f, -50f, 71f, -50f, 71f, 50f, -71f) to
                polygon(50f, -71f, -50f, 71f, 50f, 171f, 171f, 50f)
            ),
        ResolvedTheme.Light to (
            polygon(171f, 50f, 50f, 171f, 50f, 171f, 171f, 50f) to
                polygon(171f, 50f, 50f, 171f, -50f, 71f, 50f, -71f)
            ),
    ),
    ThemeOrigin.TopRight to mapOf(
        ResolvedTheme.Dark to (
            polygon(150f, -71f, 250f, 71f, 250f, 71f, 150f, -71f) to
                polygon(150f, -71f, 250f, 71f, 50f, 171f, -71f, 50f)
            ),
        ResolvedTheme.Light to (
            polygon(-71f, 50f, 50f, 171f, 50f, 171f, -71f, 50f) to
                polygon(-71f, 50f, 50f, 171f, 250f, 71f, 150f, -71f)
            ),
    ),
)

private val SoftEdge = arrayOf(
    0f to Color.Black,
    14f / 23f to Color.Black.copy(alpha = 0.977f),
    16f / 23f to Color.Black.copy(alpha = 0.841f),
    18f / 23f to Color.Black.copy(alpha = 0.5f),
    20f / 23f to Color.Black.copy(alpha = 0.159f),
    22f / 23f to Color.Black.copy(alpha = 0.023f),
    1f to Color.Transparent,
)

internal class ThemeReveal(
    val effect: ThemeEffect,
    val point: Offset,
    val from: List<Offset>,
    val to: List<Offset>,
    val radius: Float,
    val blur: Boolean,
    val duration: Int,
)

private fun themeReveal(transition: ThemeTransition, target: ResolvedTheme): ThemeReveal {
    val effect = transition.effect
    val origin = transition.origin
    return when (effect) {
        ThemeEffect.Rectangle -> ThemeReveal(
            effect = effect,
            point = Offset.Zero,
            from = Edges[origin ?: ThemeOrigin.BottomUp] ?: Edges.getValue(ThemeOrigin.BottomUp),
            to = Full,
            radius = 0f,
            blur = transition.blur,
            duration = 900,
        )
        ThemeEffect.Polygon -> {
            val paths = (Diagonals[origin ?: ThemeOrigin.TopLeft] ?: Diagonals.getValue(ThemeOrigin.TopLeft)).getValue(target)
            ThemeReveal(effect, Offset.Zero, paths.first, paths.second, 0f, transition.blur, 900)
        }
        else -> {
            val point = Points[origin ?: ThemeOrigin.Center] ?: Points.getValue(ThemeOrigin.Center)
            val centered = point == Points.getValue(ThemeOrigin.Center)
            ThemeReveal(
                effect = effect,
                point = point,
                from = Full,
                to = Full,
                radius = if (centered) 1f else 1.5f,
                blur = transition.blur,
                duration = 900,
            )
        }
    }
}

private fun ImageBitmap.softened(): ImageBitmap {
    val source = asAndroidBitmap().let {
        if (Build.VERSION.SDK_INT >= 26 && it.config == Bitmap.Config.HARDWARE) it.copy(Bitmap.Config.ARGB_8888, false) else it
    }
    val width = max(1, source.width / 16)
    val height = max(1, source.height / 16)
    return Bitmap.createScaledBitmap(source, width, height, true).asImageBitmap()
}

private fun revealBlur(progress: Float): Float =
    if (progress < 0.5f) {
        8f - 4f * RevealEasing.transform(progress * 2f)
    } else {
        4f - 4f * RevealEasing.transform((progress - 0.5f) * 2f)
    }

private fun DrawScope.revealPath(reveal: ThemeReveal, progress: Float, path: Path) {
    path.reset()
    val width = size.width
    val height = size.height
    if (reveal.effect == ThemeEffect.Circle) {
        val radius = progress * reveal.radius * sqrt(width * width + height * height) / sqrt(2f)
        val center = Offset(reveal.point.x * width, reveal.point.y * height)
        path.addOval(Rect(center, radius))
        return
    }
    reveal.from.forEachIndexed { index, start ->
        val end = reveal.to[index]
        val x = (start.x + (end.x - start.x) * progress) * width
        val y = (start.y + (end.y - start.y) * progress) * height
        if (index == 0) path.moveTo(x, y) else path.lineTo(x, y)
    }
    path.close()
}

private fun DrawScope.drawReveal(reveal: ThemeReveal, progress: Float, snapshot: ImageBitmap, path: Path) {
    if (reveal.effect != ThemeEffect.CircleBlur) {
        revealPath(reveal, progress, path)
        clipPath(path, ClipOp.Difference) { drawImage(snapshot) }
        return
    }
    val extent = progress * 3.5f * max(size.width, size.height)
    drawIntoCanvas { canvas ->
        canvas.saveLayer(Rect(Offset.Zero, size), Paint())
        drawImage(snapshot)
        if (extent > 0f) {
            val center = Offset(
                reveal.point.x * (size.width - extent) + extent / 2f,
                reveal.point.y * (size.height - extent) + extent / 2f,
            )
            val radius = extent * 23f / 40f
            drawCircle(
                brush = Brush.radialGradient(*SoftEdge, center = center, radius = radius),
                radius = radius,
                center = center,
                blendMode = BlendMode.DstOut,
            )
        }
        canvas.restore()
    }
}

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
    internal var layer: GraphicsLayer? = null
    internal var image by mutableStateOf<ImageBitmap?>(null)
    internal var blurred by mutableStateOf<ImageBitmap?>(null)
    internal val overlay = Animatable(0f)
    internal var reveal by mutableStateOf<ThemeReveal?>(null)
    internal val progress = Animatable(0f)
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

    fun setTheme(theme: Theme, transition: ThemeTransition? = null) {
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
            val captured = layer?.toImageBitmap()
            if (id != request) return@launch
            if (captured == null) {
                fade = ThemeFade.Idle
                current = theme
                return@launch
            }
            image = captured
            if (transition == null) {
                reveal = null
                overlay.snapTo(1f)
                fade = ThemeFade.Idle
                current = theme
                overlay.animateTo(0f, tween(250, easing = FormEasing))
                if (id == request) image = null
                return@launch
            }
            val next = themeReveal(transition, resolve(theme))
            overlay.snapTo(0f)
            progress.snapTo(0f)
            reveal = next
            fade = ThemeFade.Idle
            current = theme
            if (next.blur) {
                fade = ThemeFade.Capture
                withFrameNanos { }
                withFrameNanos { }
                fade = ThemeFade.Idle
                if (id != request) return@launch
                blurred = layer?.toImageBitmap()?.softened()
                if (id != request) return@launch
            }
            progress.animateTo(1f, tween(next.duration, easing = LinearEasing))
            if (id == request) {
                reveal = null
                image = null
                blurred = null
            }
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
    state.layer = snapshot
    val path = remember { Path() }
    CompositionLocalProvider(LocalThemeState provides state) {
        EsuissTheme(darkTheme = state.resolvedTheme == ResolvedTheme.Dark) {
            val label = EsuissTheme.colors.label
            CompositionLocalProvider(
                LocalContentStyle provides LocalContentStyle.current.copy(color = label),
                LocalContentColor provides label,
            ) {
                Box(
                    modifier = Modifier
                        .drawWithContent {
                            if (state.fade == ThemeFade.Capture) {
                                snapshot.record { this@drawWithContent.drawContent() }
                            }
                            drawContent()
                            val image = state.image ?: return@drawWithContent
                            val reveal = state.reveal
                            val blurred = state.blurred
                            if (reveal != null && blurred != null) {
                                drawImage(
                                    blurred,
                                    dstSize = IntSize(size.width.toInt(), size.height.toInt()),
                                    alpha = revealBlur(state.progress.value) / 8f,
                                    filterQuality = FilterQuality.High,
                                )
                            }
                            if (reveal != null) {
                                drawReveal(reveal, RevealEasing.transform(state.progress.value), image, path)
                                return@drawWithContent
                            }
                            val alpha = state.overlay.value
                            if (alpha > 0f) {
                                drawImage(image, alpha = alpha)
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
    effect: ThemeEffect? = null,
    origin: ThemeOrigin? = null,
    blur: Boolean = false,
) {
    val state = useTheme()
    val transition = if (effect != null || origin != null || blur) {
        ThemeTransition(effect ?: ThemeEffect.Circle, origin, blur)
    } else {
        null
    }
    ToggleGroup(
        value = state.theme.key,
        onValueChange = { next -> themeOf(next)?.let { state.setTheme(it, transition) } },
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
