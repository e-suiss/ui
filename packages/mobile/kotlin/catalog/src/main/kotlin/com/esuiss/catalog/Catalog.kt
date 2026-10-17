package com.esuiss.catalog

import androidx.compose.runtime.Composable
import com.esuiss.catalog.stories.aiStories
import com.esuiss.catalog.stories.blocksCharts
import com.esuiss.catalog.stories.componentsA
import com.esuiss.catalog.stories.componentsB
import com.esuiss.catalog.stories.patternsInteractions

enum class Section(val title: String) {
    Components("Components"),
    Patterns("Patterns"),
    Interactions("Interactions"),
    Blocks("Blocks"),
    Charts("Charts"),
    AI("AI"),
}

class Story(
    val exportName: String,
    val displayName: String? = null,
    val fullScreen: Boolean = false,
    val content: @Composable () -> Unit,
) {
    val name: String
        get() = displayName ?: startCase(exportName)
}

class StoryGroup(
    val section: Section,
    val title: String,
    val stories: List<Story>,
    val displayTitle: String = title,
) {
    val id: String = sanitize("${section.title}/$title")

    fun storyId(story: Story): String = "$id--${sanitize(startCase(story.exportName))}"
}

private val wordPattern = Regex("[A-Z]+(?=[A-Z][a-z])|[A-Z]?[a-z]+|[A-Z]+|[0-9]+")

fun startCase(value: String): String =
    wordPattern.findAll(value).joinToString(" ") { word -> word.value.replaceFirstChar { it.uppercaseChar() } }

fun sanitize(value: String): String =
    value.lowercase().replace(Regex("[^a-z0-9]+"), "-").trim('-')

fun matches(text: String, query: String): Boolean = text.lowercase().contains(query.lowercase())

object Catalog {
    val groups: List<StoryGroup> by lazy {
        (componentsA + componentsB + patternsInteractions + blocksCharts + aiStories)
            .sortedWith(compareBy({ it.section.ordinal }, { it.displayTitle.lowercase() }))
    }

    fun groups(section: Section): List<StoryGroup> = groups.filter { it.section == section }

    fun group(id: String): StoryGroup? = groups.firstOrNull { it.id == id }

    fun find(storyId: String): Pair<StoryGroup, Story>? {
        for (group in groups) {
            for (story in group.stories) {
                if (group.storyId(story) == storyId) return group to story
            }
        }
        return null
    }
}
