import EsuissUI
import PhosphorSwift
import SwiftUI

struct StoryScreen: View {
  let entry: StoryEntry

  @Environment(CatalogModel.self) private var model

  var body: some View {
    if entry.group.isFullScreen(entry.story) {
      FullScreenStory(entry: entry)
    } else {
      Group {
        if entry.story.scrolls {
          ScrollView {
            entry.story.content()
              .padding(16)
              .frame(maxWidth: .infinity, alignment: .topLeading)
          }
        } else {
          entry.story.content()
            .padding(.horizontal, 16)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
      }
      .background(EsuissColor.background.ignoresSafeArea())
      .navigationTitle(Text(verbatim: entry.story.name))
      .navigationBarTitleDisplayMode(.inline)
      .toolbar(model.demo || model.reveal ? .hidden : .automatic, for: .navigationBar)
      .task(id: model.demo) { if model.demo { await StoryDemo.run() } }
      .task(id: model.reveal) { if model.reveal { await StoryDemo.reveal() } }
      .toolbar {
        ToolbarItem(placement: .topBarTrailing) {
          ThemeMenu()
        }
      }
    }
  }
}

private struct FullScreenStory: View {
  let entry: StoryEntry

  @Environment(\.dismiss) private var dismiss

  var body: some View {
    entry.story.content()
      .frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(EsuissColor.background.ignoresSafeArea())
      .toolbar(.hidden, for: .navigationBar)
      .statusBarHidden()
      .overlay(alignment: .top) {
        GeometryReader { proxy in
          let inset = proxy.safeAreaInsets.top
          HStack {
            Button {
              dismiss()
            } label: {
              ChromeIcon { Ph.caretLeft.bold }
            }
            .accessibilityLabel(Text(verbatim: "Back"))
            Spacer()
            ThemeMenu(compact: true)
          }
          .padding(.horizontal, 16)
          .frame(height: max(inset, 44))
          .offset(y: inset >= 44 ? -inset : 0)
        }
      }
  }
}

private struct ChromeIcon<Icon: View>: View {
  @ViewBuilder let icon: () -> Icon

  var body: some View {
    icon()
      .frame(width: 16, height: 16)
      .foregroundStyle(EsuissColor.foreground)
      .frame(width: 32, height: 32)
      .background {
        Circle()
          .fill(EsuissColor.card)
          .shadow(.md)
      }
      .overlay {
        Circle().strokeBorder(EsuissColor.border)
      }
  }
}

struct ThemeMenu: View {
  var compact = false

  @Environment(CatalogModel.self) private var model
  @Environment(\.colorScheme) private var colorScheme

  var body: some View {
    let dark = colorScheme == .dark
    Button {
      model.theme = dark ? .light : .dark
    } label: {
      if compact {
        ChromeIcon { dark ? Ph.moon.bold : Ph.sun.bold }
      } else {
        (dark ? Ph.moon.regular : Ph.sun.regular)
          .frame(width: 22, height: 22)
      }
    }
    .accessibilityLabel(Text(verbatim: dark ? "Switch to light theme" : "Switch to dark theme"))
  }
}
