import SwiftUI
import UIKit

public enum EsuissIcon: String, CaseIterable, Identifiable {
  public static let library = "lucide"

  public var id: Self { self }

  case airplane
  case archive
  case arrowBendUpLeft
  case arrowClockwise
  case arrowCounterClockwise
  case arrowDown
  case arrowLeft
  case arrowRight
  case arrowSquareOut
  case arrowUp
  case arrowUpRight
  case backspace
  case bell
  case bellRinging
  case bellSlash
  case bluetooth
  case book
  case bookmarkSimple
  case brain
  case calendar
  case calendarBlank
  case calendarPlus
  case camera
  case caretDown
  case caretLeft
  case caretRight
  case caretUp
  case caretUpDown
  case cashRegister
  case cellSignalFull
  case chartBar
  case chatCircle
  case chatCircleDots
  case chatsCircle
  case check
  case checkCircle
  case checks
  case circle
  case circleHalf
  case circleNotch
  case clipboardText
  case clock
  case cloud
  case cloudArrowUp
  case cloudCheck
  case cloudSun
  case coffee
  case contactlessPayment
  case cookingPot
  case copy
  case creditCard
  case desktop
  case deviceMobile
  case deviceMobileCamera
  case deviceMobileSpeaker
  case deviceTablet
  case dotsSixVertical
  case dotsThree
  case downloadSimple
  case envelope
  case envelopeOpen
  case envelopeSimple
  case exclamationMark
  case export
  case file
  case filePdf
  case filePlus
  case fileText
  case fileTs
  case fileZip
  case filmSlate
  case fingerprint
  case flag
  case flame
  case flashlight
  case flask
  case folder
  case folderOpen
  case folderSimple
  case footprints
  case forkKnife
  case funnel
  case gameController
  case gear
  case gearSix
  case gitBranch
  case gitCommit
  case globe
  case handbag
  case headphones
  case heart
  case hourglass
  case house
  case image
  case info
  case key
  case keyboard
  case laptop
  case link
  case list
  case listChecks
  case listDashes
  case listPlus
  case lock
  case lockSimple
  case magnifyingGlass
  case mapPin
  case mapTrifold
  case microphone
  case minus
  case moon
  case musicNote
  case musicNotes
  case navigationArrow
  case newspaper
  case notePencil
  case `package`
  case palette
  case paperPlaneTilt
  case path
  case pause
  case pencilSimple
  case play
  case plug
  case plus
  case pushPin
  case qrCode
  case record
  case robot
  case scanSmiley
  case scissors
  case sealCheck
  case share
  case shareNetwork
  case shield
  case shieldCheck
  case shieldWarning
  case signOut
  case sparkle
  case speakerHigh
  case squaresFour
  case star
  case storefront
  case sun
  case tag
  case television
  case terminal
  case textAlignCenter
  case textAlignLeft
  case textAlignRight
  case textB
  case textItalic
  case textUnderline
  case thumbsDown
  case thumbsUp
  case timer
  case trash
  case tray
  case uploadSimple
  case user
  case userCircleMinus
  case userFocus
  case userPlus
  case users
  case videoCamera
  case wallet
  case warning
  case warningCircle
  case watch
  case wifiHigh
  case wifiSlash
  case x
  case xCircle

  public var regular: Image { EsuissIconRenderer.image(self, scale: 1) }
  public var thin: Image { EsuissIconRenderer.image(self, scale: 0.5) }
  public var light: Image { EsuissIconRenderer.image(self, scale: 0.75) }
  public var bold: Image { EsuissIconRenderer.image(self, scale: 1.25) }
  public var fill: Image { EsuissIconRenderer.image(self, scale: 1, filled: true) }
  public var duotone: Image { EsuissIconRenderer.image(self, scale: 1) }

  fileprivate var shapes: [IconShape] {
    switch self {
    case .airplane: [IconShape("M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z", fill: false, width: 2)]
    case .archive: [IconShape("M3 3h18a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-18a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8", fill: false, width: 2), IconShape("M10 12h4", fill: false, width: 2)]
    case .arrowBendUpLeft: [IconShape("M20 18v-2a4 4 0 0 0-4-4H4", fill: false, width: 2), IconShape("m9 17-5-5 5-5", fill: false, width: 2)]
    case .arrowClockwise: [IconShape("M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", fill: false, width: 2), IconShape("M21 3v5h-5", fill: false, width: 2)]
    case .arrowCounterClockwise: [IconShape("M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", fill: false, width: 2), IconShape("M3 3v5h5", fill: false, width: 2)]
    case .arrowDown: [IconShape("M12 5v14", fill: false, width: 2), IconShape("m19 12-7 7-7-7", fill: false, width: 2)]
    case .arrowLeft: [IconShape("m12 19-7-7 7-7", fill: false, width: 2), IconShape("M19 12H5", fill: false, width: 2)]
    case .arrowRight: [IconShape("M5 12h14", fill: false, width: 2), IconShape("m12 5 7 7-7 7", fill: false, width: 2)]
    case .arrowSquareOut: [IconShape("M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6", fill: false, width: 2), IconShape("m21 3-9 9", fill: false, width: 2), IconShape("M15 3h6v6", fill: false, width: 2)]
    case .arrowUp: [IconShape("m5 12 7-7 7 7", fill: false, width: 2), IconShape("M12 19V5", fill: false, width: 2)]
    case .arrowUpRight: [IconShape("M7 7h10v10", fill: false, width: 2), IconShape("M7 17 17 7", fill: false, width: 2)]
    case .backspace: [IconShape("M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z", fill: false, width: 2), IconShape("m12 9 6 6", fill: false, width: 2), IconShape("m18 9-6 6", fill: false, width: 2)]
    case .bell: [IconShape("M10.268 21a2 2 0 0 0 3.464 0", fill: false, width: 2), IconShape("M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326", fill: false, width: 2)]
    case .bellRinging: [IconShape("M10.268 21a2 2 0 0 0 3.464 0", fill: false, width: 2), IconShape("M22 8c0-2.3-.8-4.3-2-6", fill: false, width: 2), IconShape("M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326", fill: false, width: 2), IconShape("M4 2C2.8 3.7 2 5.7 2 8", fill: false, width: 2)]
    case .bellSlash: [IconShape("M10.268 21a2 2 0 0 0 3.464 0", fill: false, width: 2), IconShape("M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742", fill: false, width: 2), IconShape("m2 2 20 20", fill: false, width: 2), IconShape("M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05", fill: false, width: 2)]
    case .bluetooth: [IconShape("m7 7 10 10-5 5V2l5 5L7 17", fill: false, width: 2)]
    case .book: [IconShape("M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20", fill: false, width: 2)]
    case .bookmarkSimple: [IconShape("M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z", fill: false, width: 2)]
    case .brain: [IconShape("M12 18V5", fill: false, width: 2), IconShape("M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4", fill: false, width: 2), IconShape("M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5", fill: false, width: 2), IconShape("M17.997 5.125a4 4 0 0 1 2.526 5.77", fill: false, width: 2), IconShape("M18 18a4 4 0 0 0 2-7.464", fill: false, width: 2), IconShape("M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517", fill: false, width: 2), IconShape("M6 18a4 4 0 0 1-2-7.464", fill: false, width: 2), IconShape("M6.003 5.125a4 4 0 0 0-2.526 5.77", fill: false, width: 2)]
    case .calendar: [IconShape("M8 2v3", fill: false, width: 2), IconShape("M16 2v3", fill: false, width: 2), IconShape("M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M3 9h18", fill: false, width: 2)]
    case .calendarBlank: [IconShape("M8 2v3", fill: false, width: 2), IconShape("M16 2v3", fill: false, width: 2), IconShape("M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M3 9h18", fill: false, width: 2)]
    case .calendarPlus: [IconShape("M16 18h6", fill: false, width: 2), IconShape("M16 2v3", fill: false, width: 2), IconShape("M19 15v6", fill: false, width: 2), IconShape("M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3", fill: false, width: 2), IconShape("M3 9h18", fill: false, width: 2), IconShape("M8 2v3", fill: false, width: 2)]
    case .camera: [IconShape("M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z", fill: false, width: 2), IconShape("M9 13a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .caretDown: [IconShape("m6 9 6 6 6-6", fill: false, width: 2)]
    case .caretLeft: [IconShape("m15 18-6-6 6-6", fill: false, width: 2)]
    case .caretRight: [IconShape("m9 18 6-6-6-6", fill: false, width: 2)]
    case .caretUp: [IconShape("m18 15-6-6-6 6", fill: false, width: 2)]
    case .caretUpDown: [IconShape("m7 15 5 5 5-5", fill: false, width: 2), IconShape("m7 9 5-5 5 5", fill: false, width: 2)]
    case .cashRegister: [IconShape("M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M8 6L16 6", fill: false, width: 2), IconShape("M16 14L16 18", fill: false, width: 2), IconShape("M16 10h.01", fill: false, width: 2), IconShape("M12 10h.01", fill: false, width: 2), IconShape("M8 10h.01", fill: false, width: 2), IconShape("M12 14h.01", fill: false, width: 2), IconShape("M8 14h.01", fill: false, width: 2), IconShape("M12 18h.01", fill: false, width: 2), IconShape("M8 18h.01", fill: false, width: 2)]
    case .cellSignalFull: [IconShape("M2 20h.01", fill: false, width: 2), IconShape("M7 20v-4", fill: false, width: 2), IconShape("M12 20v-8", fill: false, width: 2), IconShape("M17 20V8", fill: false, width: 2), IconShape("M22 4v16", fill: false, width: 2)]
    case .chartBar: [IconShape("M3 3v16a2 2 0 0 0 2 2h16", fill: false, width: 2), IconShape("M18 17V9", fill: false, width: 2), IconShape("M13 17V5", fill: false, width: 2), IconShape("M8 17v-3", fill: false, width: 2)]
    case .chatCircle: [IconShape("M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719", fill: false, width: 2)]
    case .chatCircleDots: [IconShape("M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719", fill: false, width: 2), IconShape("M8 12h.01", fill: false, width: 2), IconShape("M12 12h.01", fill: false, width: 2), IconShape("M16 12h.01", fill: false, width: 2)]
    case .chatsCircle: [IconShape("M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z", fill: false, width: 2), IconShape("M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1", fill: false, width: 2)]
    case .check: [IconShape("M20 6 9 17l-5-5", fill: false, width: 2)]
    case .checkCircle: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("m16 9-5.5 5.5L8 12", fill: false, width: 2)]
    case .checks: [IconShape("M18 6 7 17l-5-5", fill: false, width: 2), IconShape("m22 10-7.5 7.5L13 16", fill: false, width: 2)]
    case .circle: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2)]
    case .circleHalf: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 18a6 6 0 0 0 0-12v12z", fill: false, width: 2)]
    case .circleNotch: [IconShape("M21 12a9 9 0 1 1-6.219-8.56", fill: false, width: 2)]
    case .clipboardText: [IconShape("M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2", fill: false, width: 2), IconShape("M12 11h4", fill: false, width: 2), IconShape("M12 16h4", fill: false, width: 2), IconShape("M8 11h.01", fill: false, width: 2), IconShape("M8 16h.01", fill: false, width: 2)]
    case .clock: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 6v6l4 2", fill: false, width: 2)]
    case .cloud: [IconShape("M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", fill: false, width: 2)]
    case .cloudArrowUp: [IconShape("M12 13v8", fill: false, width: 2), IconShape("M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242", fill: false, width: 2), IconShape("m8 17 4-4 4 4", fill: false, width: 2)]
    case .cloudCheck: [IconShape("m17 15-5.5 5.5L9 18", fill: false, width: 2), IconShape("M5.516 16.07A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 3.501 7.327", fill: false, width: 2)]
    case .cloudSun: [IconShape("M12 2v2", fill: false, width: 2), IconShape("m4.93 4.93 1.41 1.41", fill: false, width: 2), IconShape("M20 12h2", fill: false, width: 2), IconShape("m19.07 4.93-1.41 1.41", fill: false, width: 2), IconShape("M15.947 12.65a4 4 0 0 0-5.925-4.128", fill: false, width: 2), IconShape("M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z", fill: false, width: 2)]
    case .coffee: [IconShape("M10 2v2", fill: false, width: 2), IconShape("M14 2v2", fill: false, width: 2), IconShape("M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1", fill: false, width: 2), IconShape("M6 2v2", fill: false, width: 2)]
    case .contactlessPayment: [IconShape("M6 8.32a7.43 7.43 0 0 1 0 7.36", fill: false, width: 2), IconShape("M9.46 6.21a11.76 11.76 0 0 1 0 11.58", fill: false, width: 2), IconShape("M12.91 4.1a15.91 15.91 0 0 1 .01 15.8", fill: false, width: 2), IconShape("M16.37 2a20.16 20.16 0 0 1 0 20", fill: false, width: 2)]
    case .cookingPot: [IconShape("M2 12h20", fill: false, width: 2), IconShape("M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8", fill: false, width: 2), IconShape("m4 8 16-4", fill: false, width: 2), IconShape("m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8", fill: false, width: 2)]
    case .copy: [IconShape("M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", fill: false, width: 2)]
    case .creditCard: [IconShape("M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M2 10L22 10", fill: false, width: 2), IconShape("M6 14h2", fill: false, width: 2)]
    case .desktop: [IconShape("M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M8 21L16 21", fill: false, width: 2), IconShape("M12 17L12 21", fill: false, width: 2)]
    case .deviceMobile: [IconShape("M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M12 18h.01", fill: false, width: 2)]
    case .deviceMobileCamera: [IconShape("M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M12 18h.01", fill: false, width: 2)]
    case .deviceMobileSpeaker: [IconShape("M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M12 18h.01", fill: false, width: 2)]
    case .deviceTablet: [IconShape("M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M12 18L12.01 18", fill: false, width: 2)]
    case .dotsSixVertical: [IconShape("M8 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M8 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M8 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M14 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M14 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M14 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2)]
    case .dotsThree: [IconShape("M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2)]
    case .downloadSimple: [IconShape("M12 15V3", fill: false, width: 2), IconShape("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", fill: false, width: 2), IconShape("m7 10 5 5 5-5", fill: false, width: 2)]
    case .envelope: [IconShape("m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", fill: false, width: 2), IconShape("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2Z", fill: false, width: 2)]
    case .envelopeOpen: [IconShape("M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z", fill: false, width: 2), IconShape("m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10", fill: false, width: 2)]
    case .envelopeSimple: [IconShape("m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", fill: false, width: 2), IconShape("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2Z", fill: false, width: 2)]
    case .exclamationMark: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 8L12 12", fill: false, width: 2), IconShape("M12 16L12.01 16", fill: false, width: 2)]
    case .export: [IconShape("M12 2v13", fill: false, width: 2), IconShape("m16 6-4-4-4 4", fill: false, width: 2), IconShape("M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", fill: false, width: 2)]
    case .file: [IconShape("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2)]
    case .filePdf: [IconShape("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2), IconShape("M10 9H8", fill: false, width: 2), IconShape("M16 13H8", fill: false, width: 2), IconShape("M16 17H8", fill: false, width: 2)]
    case .filePlus: [IconShape("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2), IconShape("M9 15h6", fill: false, width: 2), IconShape("M12 18v-6", fill: false, width: 2)]
    case .fileText: [IconShape("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2), IconShape("M10 9H8", fill: false, width: 2), IconShape("M16 13H8", fill: false, width: 2), IconShape("M16 17H8", fill: false, width: 2)]
    case .fileTs: [IconShape("M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2), IconShape("M10 12.5 8 15l2 2.5", fill: false, width: 2), IconShape("m14 12.5 2 2.5-2 2.5", fill: false, width: 2)]
    case .fileZip: [IconShape("M13.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v11.5", fill: false, width: 2), IconShape("M14 2v5a1 1 0 0 0 1 1h5", fill: false, width: 2), IconShape("M8 12v-1", fill: false, width: 2), IconShape("M8 18v-2", fill: false, width: 2), IconShape("M8 7V6", fill: false, width: 2), IconShape("M6 20a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z", fill: false, width: 2)]
    case .filmSlate: [IconShape("m12.296 3.464 3.02 3.956", fill: false, width: 2), IconShape("M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z", fill: false, width: 2), IconShape("M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", fill: false, width: 2), IconShape("m6.18 5.276 3.1 3.899", fill: false, width: 2)]
    case .fingerprint: [IconShape("M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", fill: false, width: 2), IconShape("M14 13.12c0 2.38 0 6.38-1 8.88", fill: false, width: 2), IconShape("M17.29 21.02c.12-.6.43-2.3.5-3.02", fill: false, width: 2), IconShape("M2 12a10 10 0 0 1 18-6", fill: false, width: 2), IconShape("M2 16h.01", fill: false, width: 2), IconShape("M21.8 16c.2-2 .131-5.354 0-6", fill: false, width: 2), IconShape("M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", fill: false, width: 2), IconShape("M8.65 22c.21-.66.45-1.32.57-2", fill: false, width: 2), IconShape("M9 6.8a6 6 0 0 1 9 5.2v2", fill: false, width: 2)]
    case .flag: [IconShape("M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528", fill: false, width: 2)]
    case .flame: [IconShape("M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4", fill: false, width: 2)]
    case .flashlight: [IconShape("M12 13v1", fill: false, width: 2), IconShape("M17 2a1 1 0 0 1 1 1v4a3 3 0 0 1-.6 1.8l-.6.8A4 4 0 0 0 16 12v8a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-8a4 4 0 0 0-.8-2.4l-.6-.8A3 3 0 0 1 6 7V3a1 1 0 0 1 1-1z", fill: false, width: 2), IconShape("M6 6h12", fill: false, width: 2)]
    case .flask: [IconShape("M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2", fill: false, width: 2), IconShape("M6.453 15h11.094", fill: false, width: 2), IconShape("M8.5 2h7", fill: false, width: 2)]
    case .folder: [IconShape("M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z", fill: false, width: 2)]
    case .folderOpen: [IconShape("M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1", fill: false, width: 2), IconShape("m21 21-1.9-1.9", fill: false, width: 2), IconShape("M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .folderSimple: [IconShape("M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z", fill: false, width: 2)]
    case .footprints: [IconShape("M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z", fill: false, width: 2), IconShape("M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z", fill: false, width: 2), IconShape("M16 17h4", fill: false, width: 2), IconShape("M4 13h4", fill: false, width: 2)]
    case .forkKnife: [IconShape("M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2", fill: false, width: 2), IconShape("M7 2v20", fill: false, width: 2), IconShape("M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", fill: false, width: 2)]
    case .funnel: [IconShape("M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z", fill: false, width: 2)]
    case .gameController: [IconShape("M6 11L10 11", fill: false, width: 2), IconShape("M8 9L8 13", fill: false, width: 2), IconShape("M15 12L15.01 12", fill: false, width: 2), IconShape("M18 10L18.01 10", fill: false, width: 2), IconShape("M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z", fill: false, width: 2)]
    case .gear: [IconShape("M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915", fill: false, width: 2), IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .gearSix: [IconShape("M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915", fill: false, width: 2), IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .gitBranch: [IconShape("M15 6a9 9 0 0 0-9 9V3", fill: false, width: 2), IconShape("M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .gitCommit: [IconShape("M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M3 12L9 12", fill: false, width: 2), IconShape("M15 12L21 12", fill: false, width: 2)]
    case .globe: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", fill: false, width: 2), IconShape("M2 12h20", fill: false, width: 2)]
    case .handbag: [IconShape("M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z", fill: false, width: 2), IconShape("M8 11V6a4 4 0 0 1 8 0v5", fill: false, width: 2)]
    case .headphones: [IconShape("M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3", fill: false, width: 2)]
    case .heart: [IconShape("M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5", fill: false, width: 2)]
    case .hourglass: [IconShape("M5 22h14", fill: false, width: 2), IconShape("M5 2h14", fill: false, width: 2), IconShape("M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22", fill: false, width: 2), IconShape("M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2", fill: false, width: 2)]
    case .house: [IconShape("M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", fill: false, width: 2), IconShape("M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", fill: false, width: 2)]
    case .image: [IconShape("M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M7 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0Z", fill: false, width: 2), IconShape("m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", fill: false, width: 2)]
    case .info: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 16v-4", fill: false, width: 2), IconShape("M12 8h.01", fill: false, width: 2)]
    case .key: [IconShape("m2 21 9.6-9.6", fill: false, width: 2), IconShape("m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19", fill: false, width: 2), IconShape("M10 7.5a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0Z", fill: false, width: 2)]
    case .keyboard: [IconShape("M10 8h.01", fill: false, width: 2), IconShape("M12 12h.01", fill: false, width: 2), IconShape("M14 8h.01", fill: false, width: 2), IconShape("M16 12h.01", fill: false, width: 2), IconShape("M18 8h.01", fill: false, width: 2), IconShape("M6 8h.01", fill: false, width: 2), IconShape("M7 16h10", fill: false, width: 2), IconShape("M8 12h.01", fill: false, width: 2), IconShape("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2Z", fill: false, width: 2)]
    case .laptop: [IconShape("M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z", fill: false, width: 2), IconShape("M20.054 15.987H3.946", fill: false, width: 2)]
    case .link: [IconShape("M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", fill: false, width: 2), IconShape("M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", fill: false, width: 2)]
    case .list: [IconShape("M4 5h16", fill: false, width: 2), IconShape("M4 12h16", fill: false, width: 2), IconShape("M4 19h16", fill: false, width: 2)]
    case .listChecks: [IconShape("M13 5h8", fill: false, width: 2), IconShape("M13 12h8", fill: false, width: 2), IconShape("M13 19h8", fill: false, width: 2), IconShape("m3 17 2 2 4-4", fill: false, width: 2), IconShape("m3 7 2 2 4-4", fill: false, width: 2)]
    case .listDashes: [IconShape("M13 5h8", fill: false, width: 2), IconShape("M13 12h8", fill: false, width: 2), IconShape("M13 19h8", fill: false, width: 2), IconShape("m3 17 2 2 4-4", fill: false, width: 2), IconShape("M4 4h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1Z", fill: false, width: 2)]
    case .listPlus: [IconShape("M16 5H3", fill: false, width: 2), IconShape("M11 12H3", fill: false, width: 2), IconShape("M16 19H3", fill: false, width: 2), IconShape("M18 9v6", fill: false, width: 2), IconShape("M21 12h-6", fill: false, width: 2)]
    case .lock: [IconShape("M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-7a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M7 11V7a5 5 0 0 1 10 0v4", fill: false, width: 2)]
    case .lockSimple: [IconShape("M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-7a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M7 11V7a5 5 0 0 1 10 0v4", fill: false, width: 2)]
    case .magnifyingGlass: [IconShape("m21 21-4.34-4.34", fill: false, width: 2), IconShape("M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0Z", fill: false, width: 2)]
    case .mapPin: [IconShape("M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0", fill: false, width: 2), IconShape("M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .mapTrifold: [IconShape("M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z", fill: false, width: 2), IconShape("M15 5.764v15", fill: false, width: 2), IconShape("M9 3.236v15", fill: false, width: 2)]
    case .microphone: [IconShape("M12 19v3", fill: false, width: 2), IconShape("M19 10v2a7 7 0 0 1-14 0v-2", fill: false, width: 2), IconShape("M12 2h0a3 3 0 0 1 3 3v7a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3v-7a3 3 0 0 1 3 -3Z", fill: false, width: 2)]
    case .minus: [IconShape("M5 12h14", fill: false, width: 2)]
    case .moon: [IconShape("M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401", fill: false, width: 2)]
    case .musicNote: [IconShape("M9 18V5l12-2v13", fill: false, width: 2), IconShape("M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M15 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .musicNotes: [IconShape("M4 18a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z", fill: false, width: 2), IconShape("M12 18V2l7 4", fill: false, width: 2)]
    case .navigationArrow: [IconShape("M3 11L22 2L13 21L11 13L3 11Z", fill: false, width: 2)]
    case .newspaper: [IconShape("M15 18h-5", fill: false, width: 2), IconShape("M18 14h-8", fill: false, width: 2), IconShape("M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2", fill: false, width: 2), IconShape("M11 6h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1Z", fill: false, width: 2)]
    case .notePencil: [IconShape("M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", fill: false, width: 2), IconShape("M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z", fill: false, width: 2)]
    case .`package`: [IconShape("M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z", fill: false, width: 2), IconShape("M12 22V12", fill: false, width: 2), IconShape("M3.29 7L12 12L20.71 7", fill: false, width: 2), IconShape("m7.5 4.27 9 5.15", fill: false, width: 2)]
    case .palette: [IconShape("M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z", fill: false, width: 2), IconShape("M13 6.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0Z", fill: false, width: 2), IconShape("M17 10.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0Z", fill: false, width: 2), IconShape("M6 12.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0Z", fill: false, width: 2), IconShape("M8 7.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0Z", fill: false, width: 2)]
    case .paperPlaneTilt: [IconShape("M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z", fill: false, width: 2), IconShape("m21.854 2.147-10.94 10.939", fill: false, width: 2)]
    case .path: [IconShape("M3 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15", fill: false, width: 2), IconShape("M15 5a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2)]
    case .pause: [IconShape("M15 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-16a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M6 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-16a1 1 0 0 1 1 -1Z", fill: false, width: 2)]
    case .pencilSimple: [IconShape("M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z", fill: false, width: 2), IconShape("m15 5 4 4", fill: false, width: 2)]
    case .play: [IconShape("M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z", fill: false, width: 2)]
    case .plug: [IconShape("M12 22v-5", fill: false, width: 2), IconShape("M15 8V2", fill: false, width: 2), IconShape("M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z", fill: false, width: 2), IconShape("M9 8V2", fill: false, width: 2)]
    case .plus: [IconShape("M5 12h14", fill: false, width: 2), IconShape("M12 5v14", fill: false, width: 2)]
    case .pushPin: [IconShape("M12 17v5", fill: false, width: 2), IconShape("M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z", fill: false, width: 2)]
    case .qrCode: [IconShape("M4 3h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M17 3h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M4 16h3a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M21 16h-3a2 2 0 0 0-2 2v3", fill: false, width: 2), IconShape("M21 21v.01", fill: false, width: 2), IconShape("M12 7v3a2 2 0 0 1-2 2H7", fill: false, width: 2), IconShape("M3 12h.01", fill: false, width: 2), IconShape("M12 3h.01", fill: false, width: 2), IconShape("M12 16v.01", fill: false, width: 2), IconShape("M16 12h1", fill: false, width: 2), IconShape("M21 12v.01", fill: false, width: 2), IconShape("M12 21v-1", fill: false, width: 2)]
    case .record: [IconShape("M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0Z", fill: false, width: 2), IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2)]
    case .robot: [IconShape("M12 8V4H8", fill: false, width: 2), IconShape("M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2Z", fill: false, width: 2), IconShape("M2 14h2", fill: false, width: 2), IconShape("M20 14h2", fill: false, width: 2), IconShape("M15 13v2", fill: false, width: 2), IconShape("M9 13v2", fill: false, width: 2)]
    case .scanSmiley: [IconShape("M3 7V5a2 2 0 0 1 2-2h2", fill: false, width: 2), IconShape("M17 3h2a2 2 0 0 1 2 2v2", fill: false, width: 2), IconShape("M21 17v2a2 2 0 0 1-2 2h-2", fill: false, width: 2), IconShape("M7 21H5a2 2 0 0 1-2-2v-2", fill: false, width: 2), IconShape("M8 14s1.5 2 4 2 4-2 4-2", fill: false, width: 2), IconShape("M9 9h.01", fill: false, width: 2), IconShape("M15 9h.01", fill: false, width: 2)]
    case .scissors: [IconShape("M3 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M8.12 8.12 12 12", fill: false, width: 2), IconShape("M20 4 8.12 15.88", fill: false, width: 2), IconShape("M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M14.8 14.8 20 20", fill: false, width: 2)]
    case .sealCheck: [IconShape("M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z", fill: false, width: 2), IconShape("m16 9-5.5 5.5L8 12", fill: false, width: 2)]
    case .share: [IconShape("M12 2v13", fill: false, width: 2), IconShape("m16 6-4-4-4 4", fill: false, width: 2), IconShape("M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", fill: false, width: 2)]
    case .shareNetwork: [IconShape("M15 5a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M15 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z", fill: false, width: 2), IconShape("M8.59 13.51L15.42 17.49", fill: false, width: 2), IconShape("M15.41 6.51L8.59 10.49", fill: false, width: 2)]
    case .shield: [IconShape("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", fill: false, width: 2)]
    case .shieldCheck: [IconShape("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", fill: false, width: 2), IconShape("m9 12 2 2 4-4", fill: false, width: 2)]
    case .shieldWarning: [IconShape("M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z", fill: false, width: 2), IconShape("M12 8v4", fill: false, width: 2), IconShape("M12 16h.01", fill: false, width: 2)]
    case .signOut: [IconShape("m16 17 5-5-5-5", fill: false, width: 2), IconShape("M21 12H9", fill: false, width: 2), IconShape("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", fill: false, width: 2)]
    case .sparkle: [IconShape("M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z", fill: false, width: 2)]
    case .speakerHigh: [IconShape("M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z", fill: false, width: 2), IconShape("M16 9a5 5 0 0 1 0 6", fill: false, width: 2), IconShape("M19.364 18.364a9 9 0 0 0 0-12.728", fill: false, width: 2)]
    case .squaresFour: [IconShape("M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1Z", fill: false, width: 2), IconShape("M4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1Z", fill: false, width: 2)]
    case .star: [IconShape("M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z", fill: false, width: 2)]
    case .storefront: [IconShape("M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5", fill: false, width: 2), IconShape("M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244", fill: false, width: 2), IconShape("M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05", fill: false, width: 2)]
    case .sun: [IconShape("M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z", fill: false, width: 2), IconShape("M12 2v2", fill: false, width: 2), IconShape("M12 20v2", fill: false, width: 2), IconShape("m4.93 4.93 1.41 1.41", fill: false, width: 2), IconShape("m17.66 17.66 1.41 1.41", fill: false, width: 2), IconShape("M2 12h2", fill: false, width: 2), IconShape("M20 12h2", fill: false, width: 2), IconShape("m6.34 17.66-1.41 1.41", fill: false, width: 2), IconShape("m19.07 4.93-1.41 1.41", fill: false, width: 2)]
    case .tag: [IconShape("M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z", fill: false, width: 2), IconShape("M7 7.5a0.5 0.5 0 1 0 1 0a0.5 0.5 0 1 0 -1 0Z", fill: false, width: 2)]
    case .television: [IconShape("m17 2-5 5-5-5", fill: false, width: 2), IconShape("M4 7h16a2 2 0 0 1 2 2v11a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2Z", fill: false, width: 2)]
    case .terminal: [IconShape("M12 19h8", fill: false, width: 2), IconShape("m4 17 6-6-6-6", fill: false, width: 2)]
    case .textAlignCenter: [IconShape("M21 5H3", fill: false, width: 2), IconShape("M17 12H7", fill: false, width: 2), IconShape("M19 19H5", fill: false, width: 2)]
    case .textAlignLeft: [IconShape("M21 5H3", fill: false, width: 2), IconShape("M15 12H3", fill: false, width: 2), IconShape("M17 19H3", fill: false, width: 2)]
    case .textAlignRight: [IconShape("M21 5H3", fill: false, width: 2), IconShape("M21 12H9", fill: false, width: 2), IconShape("M21 19H7", fill: false, width: 2)]
    case .textB: [IconShape("M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", fill: false, width: 2)]
    case .textItalic: [IconShape("M19 4L10 4", fill: false, width: 2), IconShape("M14 20L5 20", fill: false, width: 2), IconShape("M15 4L9 20", fill: false, width: 2)]
    case .textUnderline: [IconShape("M6 4v6a6 6 0 0 0 12 0V4", fill: false, width: 2), IconShape("M4 20L20 20", fill: false, width: 2)]
    case .thumbsDown: [IconShape("M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z", fill: false, width: 2), IconShape("M17 14V2", fill: false, width: 2)]
    case .thumbsUp: [IconShape("M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z", fill: false, width: 2), IconShape("M7 10v12", fill: false, width: 2)]
    case .timer: [IconShape("M10 2L14 2", fill: false, width: 2), IconShape("M12 14L15 11", fill: false, width: 2), IconShape("M4 14a8 8 0 1 0 16 0a8 8 0 1 0 -16 0Z", fill: false, width: 2)]
    case .trash: [IconShape("M10 11v6", fill: false, width: 2), IconShape("M14 11v6", fill: false, width: 2), IconShape("M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", fill: false, width: 2), IconShape("M3 6h18", fill: false, width: 2), IconShape("M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", fill: false, width: 2)]
    case .tray: [IconShape("M22 12L16 12L14 15L10 15L8 12L2 12", fill: false, width: 2), IconShape("M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z", fill: false, width: 2)]
    case .uploadSimple: [IconShape("M12 3v12", fill: false, width: 2), IconShape("m17 8-5-5-5 5", fill: false, width: 2), IconShape("M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", fill: false, width: 2)]
    case .user: [IconShape("M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", fill: false, width: 2), IconShape("M8 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z", fill: false, width: 2)]
    case .userCircleMinus: [IconShape("M2 21a8 8 0 0 1 13.292-6", fill: false, width: 2), IconShape("M5 8a5 5 0 1 0 10 0a5 5 0 1 0 -10 0Z", fill: false, width: 2), IconShape("M22 19h-6", fill: false, width: 2)]
    case .userFocus: [IconShape("M3 7V5a2 2 0 0 1 2-2h2", fill: false, width: 2), IconShape("M17 3h2a2 2 0 0 1 2 2v2", fill: false, width: 2), IconShape("M21 17v2a2 2 0 0 1-2 2h-2", fill: false, width: 2), IconShape("M7 21H5a2 2 0 0 1-2-2v-2", fill: false, width: 2), IconShape("M8 14s1.5 2 4 2 4-2 4-2", fill: false, width: 2), IconShape("M9 9h.01", fill: false, width: 2), IconShape("M15 9h.01", fill: false, width: 2)]
    case .userPlus: [IconShape("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", fill: false, width: 2), IconShape("M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z", fill: false, width: 2), IconShape("M19 8L19 14", fill: false, width: 2), IconShape("M22 11L16 11", fill: false, width: 2)]
    case .users: [IconShape("M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", fill: false, width: 2), IconShape("M16 3.128a4 4 0 0 1 0 7.744", fill: false, width: 2), IconShape("M22 21v-2a4 4 0 0 0-3-3.87", fill: false, width: 2), IconShape("M5 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z", fill: false, width: 2)]
    case .videoCamera: [IconShape("m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5", fill: false, width: 2), IconShape("M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2Z", fill: false, width: 2)]
    case .wallet: [IconShape("M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1", fill: false, width: 2), IconShape("M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", fill: false, width: 2)]
    case .warning: [IconShape("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3", fill: false, width: 2), IconShape("M12 9v4", fill: false, width: 2), IconShape("M12 17h.01", fill: false, width: 2)]
    case .warningCircle: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("M12 8L12 12", fill: false, width: 2), IconShape("M12 16L12.01 16", fill: false, width: 2)]
    case .watch: [IconShape("M12 10v2.2l1.6 1", fill: false, width: 2), IconShape("m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05", fill: false, width: 2), IconShape("m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05", fill: false, width: 2), IconShape("M6 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z", fill: false, width: 2)]
    case .wifiHigh: [IconShape("M12 20h.01", fill: false, width: 2), IconShape("M2 8.82a15 15 0 0 1 20 0", fill: false, width: 2), IconShape("M5 12.859a10 10 0 0 1 14 0", fill: false, width: 2), IconShape("M8.5 16.429a5 5 0 0 1 7 0", fill: false, width: 2)]
    case .wifiSlash: [IconShape("M12 20h.01", fill: false, width: 2), IconShape("M8.5 16.429a5 5 0 0 1 7 0", fill: false, width: 2), IconShape("M5 12.859a10 10 0 0 1 5.17-2.69", fill: false, width: 2), IconShape("M19 12.859a10 10 0 0 0-2.007-1.523", fill: false, width: 2), IconShape("M2 8.82a15 15 0 0 1 4.177-2.643", fill: false, width: 2), IconShape("M22 8.82a15 15 0 0 0-11.288-3.764", fill: false, width: 2), IconShape("m2 2 20 20", fill: false, width: 2)]
    case .x: [IconShape("M18 6 6 18", fill: false, width: 2), IconShape("m6 6 12 12", fill: false, width: 2)]
    case .xCircle: [IconShape("M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0Z", fill: false, width: 2), IconShape("m15 9-6 6", fill: false, width: 2), IconShape("m9 9 6 6", fill: false, width: 2)]
    }
  }

  fileprivate var filledShapes: [IconShape]? {
    switch self {

    default: nil
    }
  }
}

struct IconShape: Sendable {
  let d: String
  let fill: Bool
  let width: CGFloat

  init(_ d: String, fill: Bool, width: CGFloat) {
    self.d = d
    self.fill = fill
    self.width = width
  }
}

private final class IconCache: @unchecked Sendable {
  private let lock = NSLock()
  private var images: [String: UIImage] = [:]

  func image(_ key: String, make: () -> UIImage) -> UIImage {
    lock.lock()
    defer { lock.unlock() }
    if let image = images[key] { return image }
    let image = make()
    images[key] = image
    return image
  }
}

enum EsuissIconRenderer {
  private static let cache = IconCache()
  private static let canvas: CGFloat = 48
  private static let viewBox: CGFloat = 24

  static func image(_ icon: EsuissIcon, scale: CGFloat, filled: Bool = false) -> Image {
    let shapes = filled ? icon.filledShapes ?? icon.shapes : icon.shapes
    let key = "\(icon.rawValue)-\(scale)-\(filled && icon.filledShapes != nil)"
    let uiImage = cache.image(key) {
      UIGraphicsImageRenderer(size: CGSize(width: canvas, height: canvas)).image { context in
        let graphics = context.cgContext
        graphics.scaleBy(x: canvas / viewBox, y: canvas / viewBox)
        graphics.setFillColor(UIColor.black.cgColor)
        graphics.setStrokeColor(UIColor.black.cgColor)
        graphics.setLineCap(.round)
        graphics.setLineJoin(.round)
        for shape in shapes {
          graphics.addPath(SVGPath.parse(shape.d))
          if shape.fill {
            graphics.fillPath()
          } else {
            graphics.setLineWidth(shape.width * scale)
            graphics.strokePath()
          }
        }
      }
    }
    return Image(uiImage: uiImage)
      .renderingMode(.template)
      .interpolation(.medium)
      .resizable()
  }
}

private struct SVGPath {
  private let characters: [Character]
  private var index = 0

  private init(_ text: String) {
    characters = Array(text)
  }

  static func parse(_ text: String) -> CGPath {
    var parser = SVGPath(text)
    return parser.build()
  }

  private mutating func skipSeparators() {
    while index < characters.count,
      characters[index] == " " || characters[index] == "," || characters[index] == "\n"
        || characters[index] == "\t"
    {
      index += 1
    }
  }

  private mutating func command() -> Character? {
    skipSeparators()
    guard index < characters.count, characters[index].isLetter else { return nil }
    defer { index += 1 }
    return characters[index]
  }

  private mutating func hasNumber() -> Bool {
    skipSeparators()
    guard index < characters.count else { return false }
    let character = characters[index]
    return character.isNumber || character == "-" || character == "+" || character == "."
  }

  private mutating func number() -> CGFloat {
    skipSeparators()
    let start = index
    if index < characters.count, characters[index] == "-" || characters[index] == "+" {
      index += 1
    }
    var dot = false
    var exponent = false
    while index < characters.count {
      let character = characters[index]
      if character.isNumber {
        index += 1
      } else if character == ".", !dot, !exponent {
        dot = true
        index += 1
      } else if character == "e" || character == "E", !exponent {
        exponent = true
        index += 1
        if index < characters.count, characters[index] == "-" || characters[index] == "+" {
          index += 1
        }
      } else {
        break
      }
    }
    return CGFloat(Double(String(characters[start..<index])) ?? 0)
  }

  private mutating func flag() -> Bool {
    skipSeparators()
    guard index < characters.count else { return false }
    defer { index += 1 }
    return characters[index] == "1"
  }

  private mutating func build() -> CGPath {
    let path = CGMutablePath()
    var current = CGPoint.zero
    var start = CGPoint.zero
    var control: CGPoint?
    var quadratic: CGPoint?

    while let next = command() {
      var name = next
      repeat {
        let relative = name.isLowercase
        let origin = relative ? current : .zero
        switch name.uppercased() {
        case "M":
          current = CGPoint(x: origin.x + number(), y: origin.y + number())
          start = current
          path.move(to: current)
          name = relative ? "l" : "L"
          control = nil
          quadratic = nil
        case "L":
          current = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "H":
          current = CGPoint(x: (relative ? current.x : 0) + number(), y: current.y)
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "V":
          current = CGPoint(x: current.x, y: (relative ? current.y : 0) + number())
          path.addLine(to: current)
          control = nil
          quadratic = nil
        case "C":
          let first = CGPoint(x: origin.x + number(), y: origin.y + number())
          let second = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addCurve(to: end, control1: first, control2: second)
          control = second
          quadratic = nil
          current = end
        case "S":
          let first = control.map { CGPoint(x: 2 * current.x - $0.x, y: 2 * current.y - $0.y) } ?? current
          let second = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addCurve(to: end, control1: first, control2: second)
          control = second
          quadratic = nil
          current = end
        case "Q":
          let point = CGPoint(x: origin.x + number(), y: origin.y + number())
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addQuadCurve(to: end, control: point)
          quadratic = point
          control = nil
          current = end
        case "T":
          let point = quadratic.map { CGPoint(x: 2 * current.x - $0.x, y: 2 * current.y - $0.y) } ?? current
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          path.addQuadCurve(to: end, control: point)
          quadratic = point
          control = nil
          current = end
        case "A":
          let radiusX = abs(number())
          let radiusY = abs(number())
          let rotation = number() * .pi / 180
          let large = flag()
          let sweep = flag()
          let end = CGPoint(x: origin.x + number(), y: origin.y + number())
          addArc(path, from: current, to: end, radiusX: radiusX, radiusY: radiusY, rotation: rotation, large: large, sweep: sweep)
          control = nil
          quadratic = nil
          current = end
        case "Z":
          path.closeSubpath()
          current = start
          control = nil
          quadratic = nil
        default:
          return path
        }
      } while name.uppercased() != "Z" && hasNumber()
    }
    return path
  }

  private func addArc(
    _ path: CGMutablePath, from: CGPoint, to: CGPoint, radiusX: CGFloat, radiusY: CGFloat,
    rotation: CGFloat, large: Bool, sweep: Bool
  ) {
    if from == to { return }
    if radiusX == 0 || radiusY == 0 {
      path.addLine(to: to)
      return
    }
    let cosine = cos(rotation)
    let sine = sin(rotation)
    let dx = (from.x - to.x) / 2
    let dy = (from.y - to.y) / 2
    let x1 = cosine * dx + sine * dy
    let y1 = -sine * dx + cosine * dy
    var rx = radiusX
    var ry = radiusY
    let lambda = (x1 * x1) / (rx * rx) + (y1 * y1) / (ry * ry)
    if lambda > 1 {
      rx *= sqrt(lambda)
      ry *= sqrt(lambda)
    }
    let numerator = rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1
    let denominator = rx * rx * y1 * y1 + ry * ry * x1 * x1
    var coefficient = sqrt(max(0, numerator / denominator))
    if large == sweep { coefficient = -coefficient }
    let cx1 = coefficient * rx * y1 / ry
    let cy1 = -coefficient * ry * x1 / rx
    let center = CGPoint(
      x: cosine * cx1 - sine * cy1 + (from.x + to.x) / 2,
      y: sine * cx1 + cosine * cy1 + (from.y + to.y) / 2
    )
    func angle(_ ux: CGFloat, _ uy: CGFloat, _ vx: CGFloat, _ vy: CGFloat) -> CGFloat {
      let value = atan2(ux * vy - uy * vx, ux * vx + uy * vy)
      return value
    }
    let startAngle = angle(1, 0, (x1 - cx1) / rx, (y1 - cy1) / ry)
    var delta = angle((x1 - cx1) / rx, (y1 - cy1) / ry, (-x1 - cx1) / rx, (-y1 - cy1) / ry)
    if !sweep && delta > 0 { delta -= 2 * .pi }
    if sweep && delta < 0 { delta += 2 * .pi }
    let segments = max(1, Int(ceil(abs(delta) / (.pi / 2))))
    let step = delta / CGFloat(segments)
    let handle = 4 / 3 * tan(step / 4)
    var theta = startAngle
    func point(_ angle: CGFloat) -> CGPoint {
      let x = rx * cos(angle)
      let y = ry * sin(angle)
      return CGPoint(x: center.x + cosine * x - sine * y, y: center.y + sine * x + cosine * y)
    }
    func derivative(_ angle: CGFloat) -> CGPoint {
      let x = -rx * sin(angle)
      let y = ry * cos(angle)
      return CGPoint(x: cosine * x - sine * y, y: sine * x + cosine * y)
    }
    for _ in 0..<segments {
      let next = theta + step
      let p1 = point(theta)
      let p2 = point(next)
      let d1 = derivative(theta)
      let d2 = derivative(next)
      path.addCurve(
        to: p2,
        control1: CGPoint(x: p1.x + handle * d1.x, y: p1.y + handle * d1.y),
        control2: CGPoint(x: p2.x - handle * d2.x, y: p2.y - handle * d2.y)
      )
      theta = next
    }
  }
}
