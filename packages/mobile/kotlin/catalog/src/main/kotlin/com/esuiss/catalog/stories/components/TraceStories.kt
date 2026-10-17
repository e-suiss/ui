package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ArrowUpRight
import com.adamglin.phosphoricons.regular.Brain
import com.adamglin.phosphoricons.regular.CheckCircle
import com.adamglin.phosphoricons.regular.Circle
import com.adamglin.phosphoricons.regular.CircleNotch
import com.adamglin.phosphoricons.regular.FilePlus
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.FolderOpen
import com.adamglin.phosphoricons.regular.GitBranch
import com.adamglin.phosphoricons.regular.GitCommit
import com.adamglin.phosphoricons.regular.Globe
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.Terminal
import com.adamglin.phosphoricons.regular.WarningCircle
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Bubble
import com.esuiss.ui.components.BubbleContent
import com.esuiss.ui.components.BubbleVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Message
import com.esuiss.ui.components.MessageAlign
import com.esuiss.ui.components.MessageContent
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Trace
import com.esuiss.ui.components.TraceCollapsible
import com.esuiss.ui.components.TraceCollapsibleContent
import com.esuiss.ui.components.TraceCollapsibleTrigger
import com.esuiss.ui.components.TraceDescription
import com.esuiss.ui.components.TraceIcon
import com.esuiss.ui.components.TraceLine
import com.esuiss.ui.components.TraceStatus
import com.esuiss.ui.components.TraceTitle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val traceStories = StoryGroup(
    section = Section.Components,
    title = "Trace",
    stories = listOf(
        Story("Default") { TraceDefault() },
        Story("Static") { TraceStatic() },
        Story("Status") { TraceStatusStory() },
        Story("Description") { TraceDescriptionStory() },
        Story("Collapsible") { TraceCollapsibleStory() },
        Story("Controlled") { TraceControlled() },
        Story("Link") { TraceLink() },
        Story("Group") { TraceGroup() },
        Story("Sources") { TraceSources() },
        Story("Steps") { TraceSteps() },
        Story("Commit") { TraceCommit() },
        Story("Turn") { TraceTurn() },
        Story("Reasoning") { TraceReasoning() },
        Story("Tool calls") { TraceToolCalls() },
    ),
)

@Composable
private fun TraceOutput(text: String, error: Boolean = false) {
    val colors = EsuissTheme.colors
    BasicText(
        text,
        modifier = Modifier
            .fillMaxWidth()
            .background(
                if (error) colors.destructive.copy(alpha = 0.1f) else colors.muted,
                RoundedCornerShape(12.dp),
            )
            .padding(horizontal = 12.dp, vertical = 8.dp),
        style = Typography.xs.copy(
            fontFamily = FontFamily.Monospace,
            color = if (error) colors.destructive else colors.foreground,
        ),
    )
}

@Composable
private fun TraceRow(icon: ImageVector, title: String, status: TraceStatus? = null, description: String? = null) {
    TraceLine(status = status) {
        TraceIcon { Icon(icon, contentDescription = null) }
        TraceTitle(title)
        if (description != null) TraceDescription(description)
    }
}

@Composable
private fun SourceRow(title: String, url: String) {
    val uriHandler = LocalUriHandler.current
    TraceLine(Modifier.clickable(role = Role.Button) { uriHandler.openUri(url) }) {
        TraceIcon { Icon(PhosphorIcons.Regular.Globe, contentDescription = null) }
        TraceTitle(title)
        TraceIcon { Icon(PhosphorIcons.Regular.ArrowUpRight, contentDescription = null) }
    }
}

@Composable
private fun TraceDefault() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Message(Modifier.fillMaxWidth(), align = MessageAlign.End) {
            MessageContent {
                Bubble(variant = BubbleVariant.Muted) {
                    BubbleContent("Why does pnpm install fail in CI?")
                }
            }
        }
        Trace {
            TraceCollapsible {
                TraceCollapsibleTrigger {
                    TraceLine {
                        TraceIcon { Icon(PhosphorIcons.Regular.CheckCircle, contentDescription = null) }
                        TraceTitle("Thought for 5s")
                    }
                }
                TraceCollapsibleContent {
                    Text("CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree.")
                }
            }
            TraceRow(PhosphorIcons.Regular.CheckCircle, "Ran pnpm --version")
            TraceCollapsible(initiallyExpanded = true) {
                TraceCollapsibleTrigger {
                    TraceLine(status = TraceStatus.Error) {
                        TraceIcon { Icon(PhosphorIcons.Regular.WarningCircle, contentDescription = null) }
                        TraceTitle("Failed to run pnpm install")
                    }
                }
                TraceCollapsibleContent {
                    TraceOutput(
                        "ERR_PNPM_OUTDATED_LOCKFILE Cannot install with \"frozen-lockfile\" because pnpm-lock.yaml is not up to date with package.json",
                        error = true,
                    )
                }
            }
        }
        Text("The last commit bumped a version in package.json without updating pnpm-lock.yaml. Run pnpm install locally and commit the lockfile.")
    }
}

@Composable
private fun TraceStatic() {
    Trace { TraceRow(PhosphorIcons.Regular.GitBranch, "Created branch fix/frozen-lockfile") }
}

@Composable
private fun TraceStatusStory() {
    Trace {
        TraceRow(PhosphorIcons.Regular.CheckCircle, "Ran pnpm install")
        TraceRow(PhosphorIcons.Regular.WarningCircle, "Failed to run pnpm lint", TraceStatus.Error)
        TraceRow(PhosphorIcons.Regular.CircleNotch, "Running pnpm build", TraceStatus.Running)
        TraceRow(PhosphorIcons.Regular.Circle, "Run pnpm test", TraceStatus.Pending)
    }
}

@Composable
private fun TraceDescriptionStory() {
    Trace {
        TraceRow(PhosphorIcons.Regular.NotePencil, "Edited settings/notifications.tsx", description = "+48 −12")
        TraceRow(PhosphorIcons.Regular.Terminal, "Ran pnpm test", description = "14s")
        TraceRow(PhosphorIcons.Regular.MagnifyingGlass, "Searched for useChat", description = "8 results")
    }
}

@Composable
private fun TraceCollapsibleStory() {
    TraceCollapsible {
        TraceCollapsibleTrigger {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                TraceTitle("Ran node --version")
            }
        }
        TraceCollapsibleContent { TraceOutput("$ node --version\nv24.18.0") }
    }
}

@Composable
private fun TraceControlled() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        TraceCollapsible(expanded = open, onExpandedChange = { open = it }) {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.Terminal, contentDescription = null) }
                    TraceTitle("Ran pnpm --version")
                }
            }
            TraceCollapsibleContent { TraceOutput("$ pnpm --version\n10.33.4") }
        }
        Button(
            if (open) "Hide the pnpm output" else "Show the pnpm output",
            onClick = { open = !open },
            variant = ButtonVariant.Outline,
            size = ButtonSize.Sm,
        )
    }
}

@Composable
private fun TraceLink() {
    Trace { SourceRow("Install Astro | docs.astro.build", "https://docs.astro.build/en/install-and-setup/") }
}

@Composable
private fun TraceGroup() {
    Trace {
        TraceRow(PhosphorIcons.Regular.MagnifyingGlass, "Searched for minimumReleaseAge")
        TraceRow(PhosphorIcons.Regular.FileText, "Read pnpm-workspace.yaml")
        TraceRow(PhosphorIcons.Regular.Terminal, "Ran pnpm install")
    }
}

@Composable
private fun TraceSources() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.Globe, contentDescription = null) }
                TraceTitle("Used 2 sources")
            }
        }
        TraceCollapsibleContent {
            Trace {
                SourceRow("pnpm install | pnpm.io", "https://pnpm.io/cli/install")
                SourceRow("Continuous Integration | pnpm.io", "https://pnpm.io/continuous-integration")
            }
        }
    }
}

@Composable
private fun TraceSteps() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine(status = TraceStatus.Running) { TraceTitle("Looking into the slow deploy") }
        }
        TraceCollapsibleContent {
            Trace {
                TraceRow(PhosphorIcons.Regular.MagnifyingGlass, "Searched for the checkout build log")
                TraceRow(PhosphorIcons.Regular.FileText, "Read the last twelve deploys")
                TraceRow(PhosphorIcons.Regular.MagnifyingGlass, "Searching for the cache key", TraceStatus.Running)
            }
        }
    }
}

@Composable
private fun TraceCommit() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.GitCommit, contentDescription = null) }
                TraceTitle("Committed a1b2c3: Fix the login redirect")
            }
        }
        TraceCollapsibleContent {
            Trace {
                TraceRow(PhosphorIcons.Regular.NotePencil, "app/login/page.tsx", description = "+12 −4")
                TraceRow(PhosphorIcons.Regular.NotePencil, "lib/auth/redirect.ts", description = "+31 −9")
                TraceRow(PhosphorIcons.Regular.FilePlus, "lib/auth/redirect.test.ts", description = "+58")
            }
        }
    }
}

@Composable
private fun TraceTurn() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine(status = TraceStatus.Error) { TraceTitle("Worked for 2m 4s, 1 command failed") }
        }
        TraceCollapsibleContent {
            Trace {
                TraceRow(PhosphorIcons.Regular.Brain, "Thought", description = "12s")
                TraceRow(PhosphorIcons.Regular.Terminal, "Ran node --version")
                TraceRow(PhosphorIcons.Regular.Terminal, "Failed to run pnpm --version", TraceStatus.Error)
            }
            BasicText(
                "Node is installed and pnpm is not. Reading the docs config.",
                style = Typography.sm.copy(color = EsuissTheme.colors.foreground),
            )
            Trace { TraceRow(PhosphorIcons.Regular.FolderOpen, "Read apps/web/lib/docs.ts") }
        }
    }
}

@Composable
private fun TraceReasoning() {
    TraceCollapsible(initiallyExpanded = true) {
        TraceCollapsibleTrigger {
            TraceLine {
                TraceIcon { Icon(PhosphorIcons.Regular.Brain, contentDescription = null) }
                TraceTitle("Thought")
            }
        }
        TraceCollapsibleContent {
            Text("The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.")
        }
    }
}

@Composable
private fun TraceToolCalls() {
    Trace {
        TraceCollapsible {
            TraceCollapsibleTrigger {
                TraceLine {
                    TraceIcon { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                    TraceTitle("Read package.json")
                }
            }
            TraceCollapsibleContent {
                TraceOutput("{ \"name\": \"acme\", \"packageManager\": \"pnpm@10.18.0\" }")
            }
        }
        TraceCollapsible {
            TraceCollapsibleTrigger {
                TraceLine(status = TraceStatus.Error) {
                    TraceIcon { Icon(PhosphorIcons.Regular.WarningCircle, contentDescription = null) }
                    TraceTitle("Failed to run pnpm install")
                }
            }
            TraceCollapsibleContent {
                TraceOutput("ERR_PNPM_OUTDATED_LOCKFILE pnpm-lock.yaml is out of date", error = true)
            }
        }
    }
}
