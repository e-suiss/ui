package com.esuiss.catalog

import android.net.Uri
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class ThemeMode { System, Light, Dark }

sealed interface Route {
    val key: String

    data object Home : Route {
        override val key = "home"
    }

    data class Group(val id: String) : Route {
        override val key = "group/$id"
    }

    data class StoryPage(val id: String) : Route {
        override val key = "story/$id"
    }
}

class CatalogState {
    val stack = mutableStateListOf<Route>(Route.Home)
    var theme by mutableStateOf(ThemeMode.System)
    var query by mutableStateOf("")

    val top: Route
        get() = stack.last()

    fun push(route: Route) {
        stack.add(route)
    }

    fun pop(): Route? = if (stack.size > 1) stack.removeAt(stack.lastIndex) else null

    fun cycleTheme() {
        theme = ThemeMode.entries[(theme.ordinal + 1) % ThemeMode.entries.size]
    }

    fun open(uri: Uri) {
        if (uri.scheme != "esuiss-catalog" || uri.host != "story") return
        when (uri.getQueryParameter("theme")) {
            "light" -> theme = ThemeMode.Light
            "dark" -> theme = ThemeMode.Dark
            "system" -> theme = ThemeMode.System
        }
        val id = uri.pathSegments.firstOrNull()
        val found = id?.let(Catalog::find)
        val routes = when {
            found != null -> listOf(Route.Home, Route.Group(found.first.id), Route.StoryPage(id))
            id != null && Catalog.group(id) != null -> listOf(Route.Home, Route.Group(id))
            else -> listOf(Route.Home)
        }
        stack.clear()
        stack.addAll(routes)
    }
}
