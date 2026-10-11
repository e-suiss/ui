package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Input
import com.esuiss.ui.patterns.Modal
import com.esuiss.ui.patterns.ModalBody
import com.esuiss.ui.patterns.ModalClose
import com.esuiss.ui.patterns.ModalContent
import com.esuiss.ui.patterns.ModalDescription
import com.esuiss.ui.patterns.ModalFooter
import com.esuiss.ui.patterns.ModalHeader
import com.esuiss.ui.patterns.ModalTitle

val modalStories = StoryGroup(
    section = Section.Patterns,
    title = "Modal",
    stories = listOf(
        Story("Default") { ModalDemo() },
        Story("OpenByDefault") { ModalDemo(defaultOpen = true) },
        Story("Floating") { ModalDemo(floating = true) },
    ),
)

@Composable
private fun ModalDemo(defaultOpen: Boolean = false, floating: Boolean = false) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var name by rememberSaveable { mutableStateOf("Pedro Duarte") }
    var username by rememberSaveable { mutableStateOf("@peduarte") }
    Column {
        Button("Edit profile", onClick = { open = true }, variant = ButtonVariant.Outline)
        Modal(open = open, onOpenChange = { open = it }, floating = floating) {
            ModalContent {
                ModalHeader {
                    ModalTitle("Edit profile")
                    ModalDescription("Make changes to your profile.")
                }
                ModalBody {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Input(name, { name = it }, Modifier.semantics { contentDescription = "Name" })
                        Input(username, { username = it }, Modifier.semantics { contentDescription = "Username" })
                    }
                }
                ModalFooter {
                    ModalClose("Cancel", modifier = Modifier.fillMaxWidth())
                    Button("Save changes", onClick = {}, modifier = Modifier.fillMaxWidth())
                }
            }
        }
    }
}
