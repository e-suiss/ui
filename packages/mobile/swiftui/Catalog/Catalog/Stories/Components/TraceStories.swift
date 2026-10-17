import EsuissUI
import PhosphorSwift
import SwiftUI

private struct TraceOutput: View {
  let text: String
  var error = false

  var body: some View {
    CodeBlock(error ? .destructive : .default, size: .sm) {
      CodeBlockContent(text, wrap: true)
    }
  }
}

private struct TraceSourceRow: View {
  let title: String
  let url: String

  @Environment(\.openURL) private var openURL

  var body: some View {
    Button {
      if let link = URL(string: url) { openURL(link) }
    } label: {
      TraceLine {
        TraceIcon { Ph.globe.regular }
        TraceTitle(verbatim: title)
        TraceIcon { Ph.arrowUpRight.regular }
      }
    }
    .buttonStyle(.plain)
    .accessibilityAddTraits(.isLink)
  }
}

private struct TraceControlledExample: View {
  @State private var open = false

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      TraceCollapsible(isExpanded: $open) {
        TraceCollapsibleTrigger {
          TraceLine {
            TraceIcon { Ph.terminal.regular }
            TraceTitle("Ran pnpm --version")
          }
        }
        TraceCollapsibleContent { TraceOutput(text: "$ pnpm --version\n10.33.4") }
      }
      Button(open ? "Hide the pnpm output" : "Show the pnpm output") { open.toggle() }
        .buttonStyle(.variant(.outline, size: .sm))
    }
  }
}

enum TraceStories {
  static let group = StoryGroup(.components, "Trace", stories: [
    Story("Default") {
      VStack(alignment: .leading, spacing: 16) {
        Message(align: .end) {
          MessageContent {
            Bubble(variant: .muted, align: .end) { BubbleContent("Why does pnpm install fail in CI?") }
          }
        }
        Trace {
          TraceCollapsible {
            TraceCollapsibleTrigger {
              TraceLine {
                TraceIcon { Ph.checkCircle.regular }
                TraceTitle("Thought for 5s")
              }
            }
            TraceCollapsibleContent {
              Text("CI installs with a frozen lockfile, so the install stops when package.json and pnpm-lock.yaml disagree.")
            }
          }
          TraceLine {
            TraceIcon { Ph.checkCircle.regular }
            TraceTitle("Ran pnpm --version")
          }
          TraceCollapsible(initiallyExpanded: true) {
            TraceCollapsibleTrigger {
              TraceLine(status: .error) {
                TraceIcon { Ph.warningCircle.regular }
                TraceTitle("Failed to run pnpm install")
              }
            }
            TraceCollapsibleContent {
              TraceOutput(text: "ERR_PNPM_OUTDATED_LOCKFILE Cannot install with \"frozen-lockfile\" because pnpm-lock.yaml is not up to date with package.json", error: true)
            }
          }
        }
        Text("The last commit bumped a version in package.json without updating pnpm-lock.yaml. Run pnpm install locally and commit the lockfile.")
          .textStyle(.base)
      }
    },
    Story("Static") {
      Trace {
        TraceLine {
          TraceIcon { Ph.gitBranch.regular }
          TraceTitle("Created branch fix/frozen-lockfile")
        }
      }
    },
    Story("Status") {
      Trace {
        TraceLine {
          TraceIcon { Ph.checkCircle.regular }
          TraceTitle("Ran pnpm install")
        }
        TraceLine(status: .error) {
          TraceIcon { Ph.warningCircle.regular }
          TraceTitle("Failed to run pnpm lint")
        }
        TraceLine(status: .running) {
          TraceIcon { Ph.circleNotch.regular }
          TraceTitle("Running pnpm build")
        }
        TraceLine(status: .pending) {
          TraceIcon { Ph.circle.regular }
          TraceTitle("Run pnpm test")
        }
      }
    },
    Story("Description") {
      Trace {
        TraceLine {
          TraceIcon { Ph.notePencil.regular }
          TraceTitle("Edited settings/notifications.tsx")
          TraceDescription(verbatim: "+48 −12")
        }
        TraceLine {
          TraceIcon { Ph.terminal.regular }
          TraceTitle("Ran pnpm test")
          TraceDescription(verbatim: "14s")
        }
        TraceLine {
          TraceIcon { Ph.magnifyingGlass.regular }
          TraceTitle("Searched for useChat")
          TraceDescription("8 results")
        }
      }
    },
    Story("Collapsible") {
      TraceCollapsible {
        TraceCollapsibleTrigger {
          TraceLine {
            TraceIcon { Ph.terminal.regular }
            TraceTitle("Ran node --version")
          }
        }
        TraceCollapsibleContent { TraceOutput(text: "$ node --version\nv24.18.0") }
      }
    },
    Story("Controlled") { TraceControlledExample() },
    Story("Link") {
      Trace {
        TraceSourceRow(title: "Install Astro | docs.astro.build", url: "https://docs.astro.build/en/install-and-setup/")
      }
    },
    Story("Group") {
      Trace {
        TraceLine {
          TraceIcon { Ph.magnifyingGlass.regular }
          TraceTitle("Searched for minimumReleaseAge")
        }
        TraceLine {
          TraceIcon { Ph.fileText.regular }
          TraceTitle("Read pnpm-workspace.yaml")
        }
        TraceLine {
          TraceIcon { Ph.terminal.regular }
          TraceTitle("Ran pnpm install")
        }
      }
    },
    Story("Sources") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine {
            TraceIcon { Ph.globe.regular }
            TraceTitle("Used 2 sources")
          }
        }
        TraceCollapsibleContent {
          Trace {
            TraceSourceRow(title: "pnpm install | pnpm.io", url: "https://pnpm.io/cli/install")
            TraceSourceRow(title: "Continuous Integration | pnpm.io", url: "https://pnpm.io/continuous-integration")
          }
        }
      }
    },
    Story("Steps") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine(status: .running) { TraceTitle("Looking into the slow deploy") }
        }
        TraceCollapsibleContent {
          Trace {
            TraceLine {
              TraceIcon { Ph.magnifyingGlass.regular }
              TraceTitle("Searched for the checkout build log")
            }
            TraceLine {
              TraceIcon { Ph.fileText.regular }
              TraceTitle("Read the last twelve deploys")
            }
            TraceLine(status: .running) {
              TraceIcon { Ph.magnifyingGlass.regular }
              TraceTitle("Searching for the cache key")
            }
          }
        }
      }
    },
    Story("Commit") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine {
            TraceIcon { Ph.gitCommit.regular }
            TraceTitle("Committed a1b2c3: Fix the login redirect")
          }
        }
        TraceCollapsibleContent {
          Trace {
            TraceLine {
              TraceIcon { Ph.notePencil.regular }
              TraceTitle(verbatim: "app/login/page.tsx")
              TraceDescription(verbatim: "+12 −4")
            }
            TraceLine {
              TraceIcon { Ph.notePencil.regular }
              TraceTitle(verbatim: "lib/auth/redirect.ts")
              TraceDescription(verbatim: "+31 −9")
            }
            TraceLine {
              TraceIcon { Ph.filePlus.regular }
              TraceTitle(verbatim: "lib/auth/redirect.test.ts")
              TraceDescription(verbatim: "+58")
            }
          }
        }
      }
    },
    Story("Turn") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine(status: .error) { TraceTitle("Worked for 2m 4s, 1 command failed") }
        }
        TraceCollapsibleContent {
          Trace {
            TraceLine {
              TraceIcon { Ph.brain.regular }
              TraceTitle("Thought")
              TraceDescription(verbatim: "12s")
            }
            TraceLine {
              TraceIcon { Ph.terminal.regular }
              TraceTitle("Ran node --version")
            }
            TraceLine(status: .error) {
              TraceIcon { Ph.terminal.regular }
              TraceTitle("Failed to run pnpm --version")
            }
          }
          Text("Node is installed and pnpm is not. Reading the docs config.")
            .foregroundStyle(EsuissColor.foreground)
          Trace {
            TraceLine {
              TraceIcon { Ph.folderOpen.regular }
              TraceTitle(verbatim: "Read apps/web/lib/docs.ts")
            }
          }
        }
      }
    },
    Story("Reasoning") {
      TraceCollapsible(initiallyExpanded: true) {
        TraceCollapsibleTrigger {
          TraceLine {
            TraceIcon { Ph.brain.regular }
            TraceTitle("Thought")
          }
        }
        TraceCollapsibleContent {
          Text("The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.")
        }
      }
    },
    Story("Tool calls") {
      Trace {
        TraceCollapsible {
          TraceCollapsibleTrigger {
            TraceLine {
              TraceIcon { Ph.fileText.regular }
              TraceTitle(verbatim: "Read package.json")
            }
          }
          TraceCollapsibleContent {
            TraceOutput(text: "{ \"name\": \"acme\", \"packageManager\": \"pnpm@10.18.0\" }")
          }
        }
        TraceCollapsible {
          TraceCollapsibleTrigger {
            TraceLine(status: .error) {
              TraceIcon { Ph.warningCircle.regular }
              TraceTitle("Failed to run pnpm install")
            }
          }
          TraceCollapsibleContent {
            TraceOutput(text: "ERR_PNPM_OUTDATED_LOCKFILE pnpm-lock.yaml is out of date", error: true)
          }
        }
      }
    },
  ])
}
