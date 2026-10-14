import EsuissUI
import PhosphorSwift
import SwiftUI

enum PermissionPrimerStories {
  static let group = StoryGroup(.blocks, "Permission Primer", stories: [
    Story("Default") {
      PermissionPrimer(onAllow: {}, onDismiss: {})
    },
    Story("Camera") {
      PermissionPrimer(
        icon: Ph.camera.duotone,
        title: "Scan and snap",
        description: "Allow camera access to scan codes and add photos to your messages.",
        benefits: [
          PermissionPrimerBenefit(
            icon: Ph.qrCode.regular,
            title: "Scan codes",
            description: "Pay, sign in and join networks with a QR code."
          ),
          PermissionPrimerBenefit(
            icon: Ph.userFocus.regular,
            title: "Profile photo",
            description: "Take a new picture without leaving the app."
          ),
          PermissionPrimerBenefit(
            icon: Ph.shieldCheck.regular,
            title: "Only when you ask",
            description: "The camera is used only while this screen is open."
          ),
        ],
        allowLabel: "Allow Camera",
        onAllow: {},
        onDismiss: {}
      )
    },
    Story("Location") {
      PermissionPrimer(
        icon: Ph.mapPin.duotone,
        title: "Find stores near you",
        description: "Share your location to see pickup times and directions.",
        benefits: [
          PermissionPrimerBenefit(
            icon: Ph.storefront.regular,
            title: "Nearby stores",
            description: "See which store has your item in stock today."
          ),
          PermissionPrimerBenefit(
            icon: Ph.navigationArrow.regular,
            title: "Directions",
            description: "Get walking and driving routes in one tap."
          ),
        ],
        allowLabel: "Share Location",
        dismissLabel: "Maybe later",
        onAllow: {},
        onDismiss: {}
      )
    },
  ])
}
