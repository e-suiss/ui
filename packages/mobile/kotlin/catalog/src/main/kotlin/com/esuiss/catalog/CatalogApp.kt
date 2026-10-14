package com.esuiss.catalog

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.saveable.rememberSaveableStateHolder
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CircleHalf
import com.adamglin.phosphoricons.regular.Moon
import com.adamglin.phosphoricons.regular.Sun
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun CatalogApp(state: CatalogState) {
    val dark = when (state.theme) {
        ThemeMode.System -> isSystemInDarkTheme()
        ThemeMode.Light -> false
        ThemeMode.Dark -> true
    }
    val holder = rememberSaveableStateHolder()
    EsuissTheme(darkTheme = dark) {
        val back = { state.pop()?.let { holder.removeState(it.key) } ?: Unit }
        BackHandler(enabled = state.stack.size > 1, onBack = back)
        val route = state.top
        holder.SaveableStateProvider(route.key) {
            when (route) {
                Route.Home -> HomeScreen(state)
                is Route.Group -> GroupScreen(state, route.id, back)
                is Route.StoryPage -> StoryScreen(state, route.id, back)
            }
        }
    }
}

@Composable
internal fun ThemeButton(state: CatalogState) {
    val icon = when (state.theme) {
        ThemeMode.System -> PhosphorIcons.Regular.CircleHalf
        ThemeMode.Light -> PhosphorIcons.Regular.Sun
        ThemeMode.Dark -> PhosphorIcons.Regular.Moon
    }
    Button(
        onClick = state::cycleTheme,
        modifier = Modifier.semantics { contentDescription = "Theme: ${state.theme.name}" },
        variant = ButtonVariant.Ghost,
        size = ButtonSize.Icon,
    ) {
        Icon(icon, contentDescription = null)
    }
}
