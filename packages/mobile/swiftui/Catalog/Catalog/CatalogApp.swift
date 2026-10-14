import SwiftUI

@main
struct CatalogApp: App {
  @State private var model = CatalogModel()

  var body: some Scene {
    WindowGroup {
      @Bindable var model = model
      NavigationStack(path: $model.path) {
        HomeView()
          .navigationDestination(for: Route.self) { route in
            switch route {
            case .group(let id):
              if let group = StoryCatalog.groupsByID[id] {
                GroupScreen(group: group)
              }
            case .story(let id):
              if let entry = StoryCatalog.entriesByID[id] {
                StoryScreen(entry: entry)
              }
            }
          }
      }
      .environment(model)
      .preferredColorScheme(model.theme.colorScheme)
      .onOpenURL { model.open($0) }
    }
  }
}
