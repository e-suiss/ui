import EsuissUI
import PhosphorSwift
import SwiftUI

enum AttachmentStories {
  static let group = StoryGroup(.components, "Attachment", stories: [
    Story("Default") {
      Attachment {
        AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
        AttachmentContent {
          AttachmentTitle("Quarterly report.pdf")
          AttachmentDescription("2.4 MB")
        }
        AttachmentActions {
          AttachmentAction("Remove", icon: Ph.x.bold) {}
        }
      }
    },
    Story("Sizes") {
      VStack(alignment: .leading, spacing: 12) {
        ForEach(AttachmentSize.allCases, id: \.self) { size in
          Attachment(size: size) {
            AttachmentMedia(icon: Ph.fileText.regular)
            AttachmentContent {
              AttachmentTitle("Meeting notes.docx")
              AttachmentDescription("184 KB")
            }
            AttachmentActions {
              AttachmentAction("Remove", icon: Ph.x.bold) {}
            }
          }
        }
      }
    },
    Story("States") {
      VStack(spacing: 12) {
        Attachment(state: .idle, block: true) {
          AttachmentMedia(icon: Ph.uploadSimple.regular)
          AttachmentContent {
            AttachmentTitle("Add a file")
            AttachmentDescription("PDF, PNG or JPG up to 10 MB")
          }
          AttachmentActions {
            AttachmentAction("Choose File") {}
          }
        }
        Attachment(state: .uploading, block: true) {
          AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
          AttachmentContent {
            AttachmentTitle("Invoice March.pdf")
            AttachmentProgress(value: 64, label: "Uploading")
          }
          AttachmentActions {
            AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
          }
        }
        Attachment(state: .processing, block: true) {
          AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
          AttachmentContent {
            AttachmentTitle("Invoice March.pdf")
            AttachmentDescription("Processing…")
          }
          AttachmentActions {
            Spinner(dimension: 20)
          }
        }
        Attachment(state: .error, block: true) {
          AttachmentMedia(.document) { AttachmentLabel("key", tint: .warning) }
          AttachmentContent {
            AttachmentTitle("Presentation.key")
            AttachmentDescription("File type not supported")
          }
          AttachmentActions {
            AttachmentAction("Remove", icon: Ph.x.bold) {}
          }
        }
        Attachment(state: .done, block: true) {
          AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
          AttachmentContent {
            AttachmentTitle("Invoice March.pdf")
            AttachmentDescription("1.1 MB")
          }
        }
      }
    },
    Story("Image") {
      Attachment {
        AttachmentThumbnail()
        AttachmentContent {
          AttachmentTitle("Lake.jpg")
          AttachmentDescription("3.2 MB")
        }
        AttachmentActions {
          AttachmentAction("Remove", icon: Ph.x.bold) {}
        }
      }
    },
    Story("Vertical") {
      HStack(alignment: .top, spacing: 12) {
        Attachment(orientation: .vertical) {
          AttachmentThumbnail()
          AttachmentActions {
            AttachmentAction("Remove", icon: Ph.x.bold) {}
          }
        }
        Attachment(orientation: .vertical) {
          AttachmentMedia(icon: Ph.filePdf.regular)
          AttachmentContent {
            AttachmentTitle("Contract.pdf")
            AttachmentDescription("860 KB")
          }
        }
      }
    },
    Story("Pressable") {
      Attachment {
        AttachmentTrigger("Open Brand guidelines.pdf") {}
        AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
        AttachmentContent {
          AttachmentTitle("Brand guidelines.pdf")
          AttachmentDescription("5.8 MB")
        }
        AttachmentActions {
          AttachmentAction("Download", icon: Ph.downloadSimple.bold) {}
        }
      }
    },
    Story("Group") {
      AttachmentGroup {
        Attachment(state: .uploading) {
          AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
          AttachmentContent {
            AttachmentTitle("Invoice_1042.pdf")
            AttachmentProgress(value: 64, label: "Uploading")
          }
          AttachmentActions {
            AttachmentAction("Cancel upload", icon: Ph.x.bold) {}
          }
        }
        Attachment(state: .processing) {
          AttachmentMedia(.document) { AttachmentLabel("docx", tint: .accent) }
          AttachmentContent {
            AttachmentTitle("Contract.docx")
            AttachmentDescription("Processing…")
          }
          AttachmentActions {
            Spinner(dimension: 20)
          }
        }
        Attachment {
          AttachmentMedia(.document) { AttachmentLabel("xlsx", tint: .success) }
          AttachmentContent {
            AttachmentTitle("Menu_October.xlsx")
            AttachmentDescription("2.4 MB")
          }
          AttachmentActions {
            Ph.checkCircle.fill
              .frame(width: 24, height: 24)
              .foregroundStyle(Color.success)
              .accessibilityElement()
              .accessibilityLabel(Text("Uploaded"))
          }
        }
        Attachment {
          AttachmentThumbnail()
          AttachmentContent {
            AttachmentTitle("Table_12.jpg")
            AttachmentDescription("1.8 MB")
          }
          AttachmentActions {
            AttachmentAction("Remove", icon: Ph.x.bold) {}
          }
        }
        Attachment(state: .error) {
          AttachmentMedia(.document) { AttachmentLabel("pdf", tint: .danger) }
          AttachmentContent {
            AttachmentTitle("Z-Report_30-09.pdf")
            AttachmentDescription("Upload failed")
          }
          AttachmentActions {
            AttachmentAction("Try Again") {}
          }
        }
      }
    },
    Story("FileTypes") {
      VStack(alignment: .leading, spacing: 12) {
        ForEach(AttachmentFile.all, id: \.name) { file in
          Attachment {
            AttachmentMedia(.document) { AttachmentLabel(verbatim: file.ext, tint: file.tint) }
            AttachmentContent {
              AttachmentTitle(verbatim: file.name)
              AttachmentDescription(verbatim: file.meta)
            }
          }
        }
      }
    },
  ])
}

private struct AttachmentThumbnail: View {
  var body: some View {
    AttachmentMedia(url: URL(string: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80"))
      .accessibilityLabel(Text("Mountain lake"))
  }
}

private struct AttachmentFile {
  let name: String
  let meta: String
  let ext: String
  let tint: Color

  static let all: [AttachmentFile] = [
    AttachmentFile(name: "Invoice.pdf", meta: "128 KB", ext: "pdf", tint: .danger),
    AttachmentFile(name: "Menu.xlsx", meta: "2.4 MB", ext: "xlsx", tint: .success),
    AttachmentFile(name: "Contract.docx", meta: "84 KB", ext: "docx", tint: .accent),
    AttachmentFile(name: "Pitch.key", meta: "12 MB", ext: "key", tint: .warning),
    AttachmentFile(name: "Archive.zip", meta: "48 MB", ext: "zip", tint: .accent),
  ]
}
