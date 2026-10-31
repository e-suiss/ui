package com.esuiss.catalog

import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onAllNodesWithTag
import androidx.compose.ui.test.performSemanticsAction
import com.github.takahirom.roborazzi.captureScreenRoboImage
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.ParameterizedRobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

@RunWith(ParameterizedRobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [36], qualifiers = "w412dp-h915dp-xxhdpi")
class StoryScreenshotTest(private val id: String, private val theme: ThemeMode) {
    @get:Rule
    val compose = createComposeRule()

    @Test
    fun screenshot() {
        val (group) = Catalog.find(id) ?: error("No story $id")
        val state = CatalogState()
        state.theme = theme
        state.stack.addAll(listOf(Route.Group(group.id), Route.StoryPage(id)))
        compose.mainClock.autoAdvance = false
        compose.setContent { CatalogApp(state) }
        compose.mainClock.advanceTimeBy(2_000)
        val name = "$id-${theme.name.lowercase()}"
        captureScreenRoboImage("$name.png")
        val story = compose.onAllNodesWithTag("story").fetchSemanticsNodes().singleOrNull() ?: return
        val range = story.config[SemanticsProperties.VerticalScrollAxisRange]
        val page = story.size.height.toFloat()
        var number = 1
        while (range.value() < range.maxValue()) {
            number += 1
            compose.onAllNodesWithTag("story")[0].performSemanticsAction(SemanticsActions.ScrollBy) { it(0f, page) }
            compose.mainClock.advanceTimeBy(1_000)
            captureScreenRoboImage("$name-$number.png")
        }
    }

    companion object {
        @JvmStatic
        @ParameterizedRobolectricTestRunner.Parameters(name = "{0}-{1}")
        fun stories(): List<Array<Any>> {
            val only = System.getProperty("only").orEmpty().split(",").filter(String::isNotBlank).toSet()
            return Catalog.groups
                .flatMap { group -> group.stories.filterNot(Story::live).map(group::storyId) }
                .filter { only.isEmpty() || it in only }
                .sorted()
                .flatMap { id -> listOf(ThemeMode.Light, ThemeMode.Dark).map { arrayOf<Any>(id, it) } }
        }
    }
}
