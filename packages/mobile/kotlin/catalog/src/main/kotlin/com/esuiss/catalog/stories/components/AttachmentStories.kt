package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.CheckCircle
import com.adamglin.phosphoricons.regular.DownloadSimple
import com.adamglin.phosphoricons.regular.FilePdf
import com.adamglin.phosphoricons.regular.FileText
import com.adamglin.phosphoricons.regular.UploadSimple
import com.adamglin.phosphoricons.regular.X
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Attachment
import com.esuiss.ui.components.AttachmentAction
import com.esuiss.ui.components.AttachmentActions
import com.esuiss.ui.components.AttachmentContent
import com.esuiss.ui.components.AttachmentDescription
import com.esuiss.ui.components.AttachmentGroup
import com.esuiss.ui.components.AttachmentLabel
import com.esuiss.ui.components.AttachmentMedia
import com.esuiss.ui.components.AttachmentMediaVariant
import com.esuiss.ui.components.AttachmentOrientation
import com.esuiss.ui.components.AttachmentProgress
import com.esuiss.ui.components.AttachmentSize
import com.esuiss.ui.components.AttachmentState
import com.esuiss.ui.components.AttachmentTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Spinner
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette

val attachmentStories = StoryGroup(
    section = Section.Components,
    title = "Attachment",
    stories = listOf(
        Story("Default") { AttachmentDefault() },
        Story("Sizes") { AttachmentSizes() },
        Story("States") { AttachmentStates() },
        Story("Image") { AttachmentImage() },
        Story("Vertical") { AttachmentVertical() },
        Story("Pressable") { AttachmentPressable() },
        Story("Group") { AttachmentGroupStory() },
        Story("FileTypes") { AttachmentFileTypes() },
    ),
)

@Composable
private fun attachmentPhoto(): Painter {
    val colors = EsuissTheme.colors
    return remember(colors) { BrushPainter(Brush.linearGradient(listOf(Palette.teal500, Palette.blue500, Palette.indigo500))) }
}

@Composable
private fun AttachmentDocument(extension: String, tone: Color) {
    AttachmentMedia(variant = AttachmentMediaVariant.Document) {
        AttachmentLabel(extension, background = tone)
    }
}

@Composable
private fun AttachmentIconAction(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector = PhosphorIcons.Regular.X) {
    AttachmentAction(onClick = {}, contentDescription = label) {
        Icon(icon, contentDescription = null)
    }
}

@Composable
private fun AttachmentDefault() {
    Row {
        Attachment {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Quarterly report.pdf")
                AttachmentDescription("2.4 MB")
            }
            AttachmentActions { AttachmentIconAction("Remove") }
        }
    }
}

@Composable
private fun AttachmentSizes() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        AttachmentSize.entries.forEach { size ->
            Attachment(size = size) {
                AttachmentMedia { Icon(PhosphorIcons.Regular.FileText, contentDescription = null) }
                AttachmentContent {
                    AttachmentTitle("Meeting notes.docx")
                    AttachmentDescription("184 KB")
                }
                AttachmentActions { AttachmentIconAction("Remove") }
            }
        }
    }
}

@Composable
private fun AttachmentStates() {
    val colors = EsuissTheme.colors
    val fill = Modifier.fillMaxWidth()
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Attachment(fill, state = AttachmentState.Idle) {
            AttachmentMedia { Icon(PhosphorIcons.Regular.UploadSimple, contentDescription = null) }
            AttachmentContent {
                AttachmentTitle("Add a file")
                AttachmentDescription("PDF, PNG or JPG up to 10 MB")
            }
            AttachmentActions { AttachmentAction("Choose File", onClick = {}) }
        }
        Attachment(fill, state = AttachmentState.Uploading) {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Invoice March.pdf")
                AttachmentProgress(64f, contentDescription = "Uploading")
            }
            AttachmentActions { AttachmentIconAction("Cancel upload") }
        }
        Attachment(fill, state = AttachmentState.Processing) {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Invoice March.pdf")
                AttachmentDescription("Processing…")
            }
            AttachmentActions { Spinner(size = 20.dp) }
        }
        Attachment(fill, state = AttachmentState.Error) {
            AttachmentDocument("key", Palette.orange500)
            AttachmentContent {
                AttachmentTitle("Presentation.key")
                AttachmentDescription("File type not supported")
            }
            AttachmentActions { AttachmentIconAction("Remove") }
        }
        Attachment(fill, state = AttachmentState.Done) {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Invoice March.pdf")
                AttachmentDescription("1.1 MB")
            }
        }
    }
}

@Composable
private fun AttachmentImage() {
    val photo = attachmentPhoto()
    Row {
        Attachment {
            AttachmentMedia(photo, contentDescription = "Mountain lake")
            AttachmentContent {
                AttachmentTitle("Lake.jpg")
                AttachmentDescription("3.2 MB")
            }
            AttachmentActions { AttachmentIconAction("Remove") }
        }
    }
}

@Composable
private fun AttachmentVertical() {
    val photo = attachmentPhoto()
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
        Attachment(orientation = AttachmentOrientation.Vertical) {
            AttachmentMedia(photo, contentDescription = "Mountain lake")
            AttachmentActions { AttachmentIconAction("Remove") }
        }
        Attachment(orientation = AttachmentOrientation.Vertical) {
            AttachmentMedia { Icon(PhosphorIcons.Regular.FilePdf, contentDescription = null) }
            AttachmentContent {
                AttachmentTitle("Contract.pdf")
                AttachmentDescription("860 KB")
            }
        }
    }
}

@Composable
private fun AttachmentPressable() {
    Row {
        Attachment(onClick = {}, onClickLabel = "Open Brand guidelines.pdf") {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Brand guidelines.pdf")
                AttachmentDescription("5.8 MB")
            }
            AttachmentActions { AttachmentIconAction("Download", PhosphorIcons.Regular.DownloadSimple) }
        }
    }
}

@Composable
private fun AttachmentGroupStory() {
    val colors = EsuissTheme.colors
    val photo = attachmentPhoto()
    AttachmentGroup {
        Attachment(state = AttachmentState.Uploading) {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Invoice_1042.pdf")
                AttachmentProgress(64f, contentDescription = "Uploading")
            }
            AttachmentActions { AttachmentIconAction("Cancel upload") }
        }
        Attachment(state = AttachmentState.Processing) {
            AttachmentDocument("docx", Palette.blue500)
            AttachmentContent {
                AttachmentTitle("Contract.docx")
                AttachmentDescription("Processing…")
            }
            AttachmentActions { Spinner(size = 20.dp) }
        }
        Attachment {
            AttachmentDocument("xlsx", Palette.green500)
            AttachmentContent {
                AttachmentTitle("Menu_October.xlsx")
                AttachmentDescription("2.4 MB")
            }
            AttachmentActions {
                Box(Modifier.clearAndSetSemantics { contentDescription = "Uploaded" }) {
                    Icon(PhosphorIcons.Fill.CheckCircle, contentDescription = null, size = 24.dp, tint = if (colors.isDark) Palette.green400 else Palette.green600)
                }
            }
        }
        Attachment {
            AttachmentMedia(photo, contentDescription = "Mountain lake")
            AttachmentContent {
                AttachmentTitle("Table_12.jpg")
                AttachmentDescription("1.8 MB")
            }
            AttachmentActions { AttachmentIconAction("Remove") }
        }
        Attachment(state = AttachmentState.Error) {
            AttachmentDocument("pdf", Palette.red500)
            AttachmentContent {
                AttachmentTitle("Z-Report_30-09.pdf")
                AttachmentDescription("Upload failed")
            }
            AttachmentActions { AttachmentAction("Try Again", onClick = {}) }
        }
    }
}

private class AttachmentFile(val name: String, val meta: String, val extension: String, val tone: @Composable () -> Color)

private val attachmentFiles = listOf(
    AttachmentFile("Invoice.pdf", "128 KB", "pdf") { Palette.red500 },
    AttachmentFile("Menu.xlsx", "2.4 MB", "xlsx") { Palette.green500 },
    AttachmentFile("Contract.docx", "84 KB", "docx") { Palette.blue500 },
    AttachmentFile("Pitch.key", "12 MB", "key") { Palette.orange500 },
    AttachmentFile("Archive.zip", "48 MB", "zip") { EsuissTheme.colors.primary },
)

@Composable
private fun AttachmentFileTypes() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        attachmentFiles.forEach { file ->
            Attachment {
                AttachmentDocument(file.extension, file.tone())
                AttachmentContent {
                    AttachmentTitle(file.name)
                    AttachmentDescription(file.meta)
                }
            }
        }
    }
}
