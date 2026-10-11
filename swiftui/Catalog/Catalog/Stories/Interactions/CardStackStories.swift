import EsuissUI
import SwiftUI

enum CardStackStories {
  static let group = StoryGroup(.interactions, "Card Stack", stories: [
    Story("Default") {
      CardStackDemo(places: cardStackPlaces)
    },
    Story("MidSwipe") {
      ZStack {
        CardStackPlaceCard(place: cardStackPlaces[2])
          .scaleEffect(0.94)
          .offset(y: 14.4)
        CardStackPlaceCard(place: cardStackPlaces[1])
          .scaleEffect(0.99)
          .offset(y: 2.4)
        CardStackPlaceCard(place: cardStackPlaces[0])
          .rotationEffect(.degrees(3))
          .offset(x: 96, y: 12)
      }
      .frame(height: 384)
    },
    Story("Empty") {
      CardStackDemo(places: [], showsLog: false)
    },
    Story("Disabled") {
      CardStackDemo(places: cardStackPlaces)
        .disabled(true)
    },
  ])
}

private struct CardStackPlace: Identifiable {
  let id: String
  let name: String
  let city: String
  let detail: String
}

private let cardStackPlaces = [
  CardStackPlace(id: "harbor", name: "Harbor Café", city: "Lisbon", detail: "Slow mornings, strong coffee and a view of the river."),
  CardStackPlace(id: "garden", name: "Garden Library", city: "Kyoto", detail: "Quiet reading rooms around a moss garden."),
  CardStackPlace(id: "market", name: "Night Market", city: "Taipei", detail: "Street food stalls open until two in the morning."),
]

private struct CardStackPlaceCard: View {
  let place: CardStackPlace

  var body: some View {
    Card {
      CardHeader(LocalizedStringKey(place.name), description: LocalizedStringKey(place.city))
      CardContent {
        RoundedRectangle(cornerRadius: Radius.xl, style: .continuous)
          .fill(Color.surfaceSecondary)
          .frame(maxHeight: .infinity)
      }
      .frame(maxHeight: .infinity)
      CardContent {
        Text(verbatim: place.detail)
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
      }
    }
    .frame(maxHeight: .infinity)
    .accessibilityElement(children: .combine)
    .accessibilityLabel(Text(verbatim: "\(place.name), \(place.city)"))
  }
}

private struct CardStackDemo: View {
  let places: [CardStackPlace]
  var showsLog = true

  @State private var controller = CardStackController()
  @State private var log = ""

  var body: some View {
    VStack(spacing: 12) {
      VStack(spacing: 24) {
        ZStack {
          if !controller.canSwipe {
            Text("You have seen every place.")
              .textStyle(.sm)
              .foregroundStyle(Color.labelSecondary)
              .multilineTextAlignment(.center)
              .padding(24)
              .frame(maxWidth: .infinity, maxHeight: .infinity)
              .overlay {
                RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
                  .strokeBorder(Color.separator, style: StrokeStyle(lineWidth: 1, dash: [4, 4]))
              }
          }
          CardStack(
            places,
            controller: controller,
            onSwipe: { direction, place in
              log = "\(direction == .left ? "Skipped" : "Liked") \(place.name)"
            },
            onUndo: { place in
              log = "Restored \(place.name)"
            }
          ) { place in
            CardStackPlaceCard(place: place)
          }
        }
        .frame(height: 384)
        HStack(spacing: 16) {
          CardStackButton(.swipeLeft, controller: controller)
          CardStackButton(.undo, controller: controller)
          CardStackButton(.swipeRight, controller: controller)
        }
      }
      if showsLog {
        Text(verbatim: log)
          .textStyle(.sm)
          .foregroundStyle(Color.labelSecondary)
          .multilineTextAlignment(.center)
          .frame(maxWidth: .infinity)
          .accessibilityAddTraits(.updatesFrequently)
      }
    }
  }
}
