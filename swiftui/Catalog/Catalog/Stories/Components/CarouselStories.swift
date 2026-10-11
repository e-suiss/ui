import EsuissUI
import SwiftUI

enum CarouselStories {
  static let group = StoryGroup(.components, "Carousel", stories: [
    Story("Default") {
      Carousel {
        HStack(spacing: 12) {
          CarouselPrevious()
          CarouselNumberSlides(basis: nil)
          CarouselNext()
        }
      }
    },
    Story("MultipleItems") {
      Carousel {
        HStack(spacing: 12) {
          CarouselPrevious()
          CarouselNumberSlides(basis: 0.5)
          CarouselNext()
        }
      }
    },
    Story("Loop") {
      Carousel(loop: true) {
        HStack(spacing: 12) {
          CarouselPrevious()
          CarouselNumberSlides(basis: nil)
          CarouselNext()
        }
      }
    },
    Story("Vertical") {
      Carousel(orientation: .vertical) {
        VStack(spacing: 12) {
          CarouselPrevious()
          CarouselContent {
            ForEach(CarouselData.slides, id: \.self) { slide in
              CarouselItem(basis: 0.5) {
                Card(size: .sm) {
                  CardContent {
                    Text(verbatim: "\(slide)")
                      .textStyle(.xl2, weight: .semibold)
                      .frame(maxWidth: .infinity, maxHeight: .infinity)
                  }
                }
              }
            }
          }
          .frame(height: 256)
          CarouselNext()
        }
      }
    },
    Story("WithPageIndicator") {
      CarouselPageIndicatorDemo()
    },
    Story("Featured") {
      Carousel {
        CarouselContent {
          ForEach(CarouselData.picks, id: \.title) { pick in
            CarouselItem(basis: 0.88) {
              CarouselPickCard(pick: pick)
            }
          }
        }
        CarouselControls {
          CarouselDots(variant: .plain)
          CarouselPlayButton(variant: .ghost)
        }
      }
    },
    Story("Spotlight") {
      Carousel(loop: true) {
        CarouselFeatureSlides()
        CarouselControls {
          CarouselDots()
          CarouselNext(size: .iconSm)
        }
      }
    },
    Story("Autoplay") {
      Carousel(loop: true, autoplay: .seconds(4)) {
        CarouselFeatureSlides()
        CarouselControls {
          CarouselDots()
          CarouselPlayButton()
        }
      }
    },
    Story("Shelf") {
      Carousel {
        Text("Popular")
          .textStyle(.xl, weight: .bold)
          .foregroundStyle(Color.label)
          .frame(maxWidth: .infinity, alignment: .leading)
          .padding(.bottom, 12)
        CarouselContent(spacing: 12) {
          ForEach(CarouselData.picks, id: \.title) { pick in
            CarouselItem(basis: 0.4) {
              VStack(alignment: .leading, spacing: 8) {
                RoundedRectangle(cornerRadius: Radius.xl2, style: .continuous)
                  .fill(pick.tint)
                  .aspectRatio(1, contentMode: .fit)
                Text(verbatim: pick.title)
                  .textStyle(.sm, weight: .semibold)
                  .foregroundStyle(Color.label)
                  .lineLimit(1)
              }
            }
          }
        }
      }
    },
  ])
}

private struct CarouselPick {
  let eyebrow: String
  let title: String
  let tint: Color
}

private enum CarouselData {
  static let slides = [1, 2, 3, 4, 5]

  static let picks = [
    CarouselPick(eyebrow: "Today's pick", title: "Weekend breakfast", tint: .warning),
    CarouselPick(eyebrow: "New", title: "Grilled meatballs", tint: .danger),
    CarouselPick(eyebrow: "Chef's special", title: "Lentil soup", tint: .success),
    CarouselPick(eyebrow: "Dessert", title: "Künefe", tint: .accent),
  ]

  static let features = [
    "Take orders at the table.",
    "Every ticket, right on time.",
    "A full room, every night.",
  ]
}

private struct CarouselNumberSlides: View {
  let basis: CGFloat?

  var body: some View {
    CarouselContent {
      ForEach(CarouselData.slides, id: \.self) { slide in
        CarouselItem(basis: basis ?? 1) {
          Card(size: basis == nil ? .default : .sm) {
            CardContent {
              Text(verbatim: "\(slide)")
                .textStyle(.xl3, weight: .semibold)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .aspectRatio(1, contentMode: .fit)
            }
          }
        }
      }
    }
  }
}

private struct CarouselPickCard: View {
  let pick: CarouselPick

  var body: some View {
    VStack(alignment: .leading, spacing: 4) {
      Text(verbatim: pick.eyebrow.uppercased())
        .textStyle(.xs2, weight: .semibold)
      Text(verbatim: pick.title)
        .textStyle(.xl2, weight: .bold)
    }
    .foregroundStyle(Color.onAccent)
    .padding(20)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
    .aspectRatio(4.0 / 5.0, contentMode: .fit)
    .background(pick.tint, in: RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
  }
}

private struct CarouselFeatureSlides: View {
  var body: some View {
    CarouselContent {
      ForEach(CarouselData.features, id: \.self) { feature in
        CarouselItem {
          VStack(spacing: 12) {
            Text(verbatim: "Hestia POS")
              .textStyle(.xl2, weight: .bold)
              .foregroundStyle(Color.label)
            Text(verbatim: feature)
              .textStyle(.base)
              .foregroundStyle(Color.labelSecondary)
              .multilineTextAlignment(.center)
          }
          .padding(32)
          .frame(maxWidth: .infinity, maxHeight: .infinity)
          .aspectRatio(10.0 / 7.0, contentMode: .fit)
          .background(Color.surfaceSecondary, in: RoundedRectangle(cornerRadius: Radius.xl3, style: .continuous))
        }
      }
    }
  }
}

private struct CarouselPageIndicatorDemo: View {
  @State private var controller = CarouselController()

  var body: some View {
    Carousel(controller: controller) {
      CarouselContent {
        ForEach(CarouselData.picks, id: \.title) { pick in
          CarouselItem {
            CarouselPickCard(pick: pick)
          }
        }
      }
      PageIndicator(count: controller.count, index: controller.selectedIndex) { controller.scrollTo($0) }
        .padding(.top, 16)
    }
  }
}
