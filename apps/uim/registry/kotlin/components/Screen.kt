package com.esuiss.ui.components

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import android.os.Build
import android.view.View
import android.view.Window
import android.view.WindowInsetsController
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.displayCutout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBars
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Stable
internal class KeyboardAccessoryInset {
    var height by mutableIntStateOf(0)
}

internal val LocalKeyboardAccessory = staticCompositionLocalOf<KeyboardAccessoryInset?> { null }

enum class ScreenEdge { Top, Bottom, Left, Right }

enum class ScreenVariant { Default, Secondary }

private val AllScreenEdges = setOf(ScreenEdge.Top, ScreenEdge.Bottom, ScreenEdge.Left, ScreenEdge.Right)

private fun Set<ScreenEdge>.sides(): WindowInsetsSides? = map {
    when (it) {
        ScreenEdge.Top -> WindowInsetsSides.Top
        ScreenEdge.Bottom -> WindowInsetsSides.Bottom
        ScreenEdge.Left -> WindowInsetsSides.Left
        ScreenEdge.Right -> WindowInsetsSides.Right
    }
}.reduceOrNull { sides, side -> sides + side }

private tailrec fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.findActivity()
    else -> null
}

@Suppress("DEPRECATION")
private fun Window.applyLightBars(light: Boolean) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        val mask = WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS or WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS
        insetsController?.setSystemBarsAppearance(if (light) mask else 0, mask)
        return
    }
    var flags = decorView.systemUiVisibility
    flags = if (light) flags or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR else flags and View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR.inv()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        flags = if (light) flags or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR else flags and View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR.inv()
    }
    if (decorView.systemUiVisibility != flags) decorView.systemUiVisibility = flags
}

@Composable
fun Screen(
    modifier: Modifier = Modifier,
    edges: Set<ScreenEdge> = AllScreenEdges,
    variant: ScreenVariant = ScreenVariant.Default,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val view = LocalView.current
    val light = !colors.isDark
    SideEffect {
        if (!view.isInEditMode) view.context.findActivity()?.window?.applyLightBars(light)
    }
    val sides = edges.sides()
    val accessory = remember { KeyboardAccessoryInset() }
    val fill = when (variant) {
        ScreenVariant.Default -> colors.surface
        ScreenVariant.Secondary -> colors.surfaceSecondary
    }
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(fill)
            .then(
                if (sides != null) {
                    Modifier.windowInsetsPadding(WindowInsets.systemBars.union(WindowInsets.displayCutout).only(sides))
                } else {
                    Modifier
                },
            ),
    ) {
        CompositionLocalProvider(
            LocalKeyboardAccessory provides accessory,
            LocalContentStyle provides Typography.base.copy(color = colors.label),
            LocalContentColor provides colors.label,
        ) {
            content()
        }
    }
}

@Composable
fun ScreenContent(
    modifier: Modifier = Modifier,
    scrollable: Boolean = false,
    contentPadding: PaddingValues = PaddingValues(16.dp),
    verticalArrangement: Arrangement.Vertical = Arrangement.spacedBy(16.dp),
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(if (scrollable) Modifier.verticalScroll(rememberScrollState()) else Modifier)
            .padding(contentPadding),
        verticalArrangement = verticalArrangement,
        content = content,
    )
}
