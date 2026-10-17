package com.esuiss.catalog.stories.ai

import androidx.compose.runtime.Composable
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.File
import com.adamglin.phosphoricons.regular.Folder
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceDescription
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceTitle

val fileTreeAIStories = StoryGroup(
    section = Section.AI,
    title = "File Tree",
    stories = listOf(
        Story("Default") { FileTreeAIDefault() },
    ),
)

@Composable
private fun FileTreeAIDefault() {
    Trace {
        TraceCollapsible(initiallyExpanded = true) {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Folder, contentDescription = null) }
                    TraceTitle("app")
                }
            }
            TraceCollapsibleContent {
            Trace {
                TraceCollapsible(initiallyExpanded = true) {
                    TraceCollapsibleTrigger {
                        TraceLine {
                            TraceIcon { Icon(PhosphorIcons.Regular.Folder, contentDescription = null) }
                            TraceTitle("settings")
                        }
                    }
                    TraceCollapsibleContent {
                    Trace {
                        TraceLine {
                            TraceIcon { Icon(PhosphorIcons.Regular.File, contentDescription = null) }
                            TraceTitle("page.tsx")
                            TraceDescription("+24 −6")
                        }
                        TraceLine {
                            TraceIcon { Icon(PhosphorIcons.Regular.File, contentDescription = null) }
                            TraceTitle("theme-toggle.tsx")
                            TraceDescription("+41")
                        }
                    }
                    }
                }
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.File, contentDescription = null) }
                    TraceTitle("layout.tsx")
                    TraceDescription("+3 −1")
                }
            }
            }
        }
    }
}
