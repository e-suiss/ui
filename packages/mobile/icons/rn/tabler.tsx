import {
  IconAlertCircle,
  IconAlertCircleFilled,
  IconAlertTriangle,
  IconAlertTriangleFilled,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconAntennaBars5,
  IconArchive,
  IconArchiveFilled,
  IconArrowBackUp,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconArrowUpRight,
  IconBackspace,
  IconBackspaceFilled,
  IconBell,
  IconBellFilled,
  IconBellOff,
  IconBellRinging,
  IconBellRingingFilled,
  IconBluetooth,
  IconBold,
  IconBook,
  IconBookFilled,
  IconBookmark,
  IconBookmarkFilled,
  IconBrain,
  IconBuildingStore,
  IconBulb,
  IconBulbFilled,
  IconCalendar,
  IconCalendarFilled,
  IconCalendarPlus,
  IconCamera,
  IconCameraFilled,
  IconCashRegister,
  IconChartBar,
  IconCheck,
  IconCheckFilled,
  IconChecks,
  IconChevronDown,
  IconChevronDownFilled,
  IconChevronLeft,
  IconChevronRight,
  IconChevronRightFilled,
  IconChevronUp,
  IconCircle,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleDot,
  IconCircleDotFilled,
  IconCircleFilled,
  IconCircleHalf2,
  IconCircleX,
  IconCircleXFilled,
  IconClipboardText,
  IconClipboardTextFilled,
  IconClock,
  IconClockFilled,
  IconCloud,
  IconCloudCheck,
  IconCloudFilled,
  IconCloudUpload,
  IconCoffee,
  IconCopy,
  IconCopyFilled,
  IconCreditCard,
  IconCreditCardFilled,
  IconCut,
  IconDeviceDesktop,
  IconDeviceDesktopFilled,
  IconDeviceGamepad2,
  IconDeviceGamepad2Filled,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceMobileFilled,
  IconDeviceTablet,
  IconDeviceTabletFilled,
  IconDeviceTv,
  IconDeviceTvFilled,
  IconDeviceWatch,
  IconDeviceWatchFilled,
  IconDots,
  IconDotsFilled,
  IconDownload,
  IconDownloadFilled,
  IconEdit,
  IconEditFilled,
  IconExclamationMark,
  IconExternalLink,
  IconExternalLinkFilled,
  IconFaceId,
  IconFile,
  IconFileFilled,
  IconFilePlus,
  IconFileText,
  IconFileTextFilled,
  IconFileTypePdf,
  IconFileTypeTs,
  IconFileZip,
  IconFilter,
  IconFilterFilled,
  IconFingerprint,
  IconFlag,
  IconFlagFilled,
  IconFlame,
  IconFlameFilled,
  IconFlask,
  IconFlaskFilled,
  IconFolder,
  IconFolderFilled,
  IconFolderSearch,
  IconGitBranch,
  IconGitCommit,
  IconGripVertical,
  IconHeadphones,
  IconHeadphonesFilled,
  IconHeart,
  IconHeartFilled,
  IconHome,
  IconHomeFilled,
  IconHourglass,
  IconHourglassFilled,
  IconHourglassHigh,
  IconInbox,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconItalic,
  IconKey,
  IconKeyboard,
  IconKeyboardFilled,
  IconKeyFilled,
  IconLayoutGrid,
  IconLayoutGridFilled,
  IconLink,
  IconLinkFilled,
  IconListCheck,
  IconListCheckFilled,
  IconListDetails,
  IconListDetailsFilled,
  IconLoader2,
  IconLock,
  IconLockFilled,
  IconLogout,
  IconMail,
  IconMailFilled,
  IconMailOpened,
  IconMailOpenedFilled,
  IconMap,
  IconMapPin,
  IconMapPinFilled,
  IconMenu2,
  IconMenu2Filled,
  IconMessageCircle,
  IconMessageCircleFilled,
  IconMessages,
  IconMessagesFilled,
  IconMicrophone,
  IconMicrophoneFilled,
  IconMinus,
  IconMoon,
  IconMoonFilled,
  IconMovie,
  IconMusic,
  IconNavigation,
  IconNavigationFilled,
  IconNews,
  IconNfc,
  IconPackage,
  IconPalette,
  IconPaletteFilled,
  IconPencil,
  IconPencilFilled,
  IconPhoto,
  IconPhotoFilled,
  IconPin,
  IconPinFilled,
  IconPlane,
  IconPlaneFilled,
  IconPlayerPause,
  IconPlayerPauseFilled,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPlaylistAdd,
  IconPlug,
  IconPlus,
  IconPlusFilled,
  IconQrcode,
  IconRobot,
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckFilled,
  IconRotate,
  IconRotateClockwise,
  IconRoute,
  IconSearch,
  IconSearchFilled,
  IconSelector,
  IconSend,
  IconSendFilled,
  IconSettings,
  IconSettingsFilled,
  IconShare,
  IconShare2,
  IconShield,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconShieldExclamation,
  IconShieldFilled,
  IconShoe,
  IconShoppingBag,
  IconSoup,
  IconSoupFilled,
  IconSparkles,
  IconSparklesFilled,
  IconStar,
  IconStarFilled,
  IconSun,
  IconSunFilled,
  IconSunHigh,
  IconSunHighFilled,
  IconTag,
  IconTagFilled,
  IconTerminal,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
  IconToolsKitchen2,
  IconToolsKitchen2Filled,
  IconTrash,
  IconTrashFilled,
  IconUnderline,
  IconUpload,
  IconUser,
  IconUserFilled,
  IconUserMinus,
  IconUserPlus,
  IconUsers,
  IconVideo,
  IconVideoFilled,
  IconVolume,
  IconWallet,
  IconWifi,
  IconWifiOff,
  IconWorld,
  IconWorldFilled,
  IconX,
  IconXFilled,
  type Icon as TablerIcon,
} from "@tabler/icons-react-native"
import type * as React from "react"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"

type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone"

interface IconProps {
  color?: string
  duotoneColor?: string
  duotoneOpacity?: number
  mirrored?: boolean
  size?: string | number
  style?: StyleProp<ViewStyle | Omit<TextStyle, "cursor">>
  testID?: string
  title?: string
  titleId?: string
  weight?: IconWeight
}

type Icon = React.FC<IconProps>

const SCALE: Record<IconWeight, number> = {
  thin: 0.5,
  light: 0.75,
  regular: 1,
  bold: 1.25,
  fill: 1,
  duotone: 1,
}

function mirror(style: IconProps["style"], mirrored?: boolean) {
  return (
    mirrored ? [{ transform: [{ scaleX: -1 }] }, style] : style
  ) as StyleProp<ViewStyle>
}

function icon(Outline: TablerIcon, Filled?: TablerIcon): Icon {
  return function TablerAdapter({
    color = "#000",
    mirrored,
    size = 24,
    style,
    testID,
    weight = "regular",
  }: IconProps) {
    const Component = weight === "fill" && Filled ? Filled : Outline
    return (
      <Component
        color={color}
        size={size}
        strokeWidth={2 * SCALE[weight]}
        style={mirror(style, mirrored)}
        testID={testID}
      />
    )
  }
}

export const AirplaneIcon = icon(IconPlane, IconPlaneFilled)
export const ArchiveIcon = icon(IconArchive, IconArchiveFilled)
export const ArrowBendUpLeftIcon = icon(IconArrowBackUp)
export const ArrowClockwiseIcon = icon(IconRotateClockwise)
export const ArrowCounterClockwiseIcon = icon(IconRotate)
export const ArrowDownIcon = icon(IconArrowDown)
export const ArrowLeftIcon = icon(IconArrowLeft)
export const ArrowRightIcon = icon(IconArrowRight)
export const ArrowSquareOutIcon = icon(IconExternalLink, IconExternalLinkFilled)
export const ArrowUpIcon = icon(IconArrowUp)
export const ArrowUpRightIcon = icon(IconArrowUpRight)
export const BackspaceIcon = icon(IconBackspace, IconBackspaceFilled)
export const BellIcon = icon(IconBell, IconBellFilled)
export const BellRingingIcon = icon(IconBellRinging, IconBellRingingFilled)
export const BellSlashIcon = icon(IconBellOff)
export const BluetoothIcon = icon(IconBluetooth)
export const BookIcon = icon(IconBook, IconBookFilled)
export const BookmarkSimpleIcon = icon(IconBookmark, IconBookmarkFilled)
export const BrainIcon = icon(IconBrain)
export const CalendarIcon = icon(IconCalendar, IconCalendarFilled)
export const CalendarBlankIcon = icon(IconCalendar, IconCalendarFilled)
export const CalendarPlusIcon = icon(IconCalendarPlus)
export const CameraIcon = icon(IconCamera, IconCameraFilled)
export const CaretDownIcon = icon(IconChevronDown, IconChevronDownFilled)
export const CaretLeftIcon = icon(IconChevronLeft)
export const CaretRightIcon = icon(IconChevronRight, IconChevronRightFilled)
export const CaretUpIcon = icon(IconChevronUp)
export const CaretUpDownIcon = icon(IconSelector)
export const CashRegisterIcon = icon(IconCashRegister)
export const CellSignalFullIcon = icon(IconAntennaBars5)
export const ChartBarIcon = icon(IconChartBar)
export const ChatCircleIcon = icon(IconMessageCircle, IconMessageCircleFilled)
export const ChatCircleDotsIcon = icon(
  IconMessageCircle,
  IconMessageCircleFilled
)
export const ChatsCircleIcon = icon(IconMessages, IconMessagesFilled)
export const CheckIcon = icon(IconCheck, IconCheckFilled)
export const CheckCircleIcon = icon(IconCircleCheck, IconCircleCheckFilled)
export const ChecksIcon = icon(IconChecks)
export const CircleIcon = icon(IconCircle, IconCircleFilled)
export const CircleHalfIcon = icon(IconCircleHalf2)
export const CircleNotchIcon = icon(IconLoader2)
export const ClipboardTextIcon = icon(
  IconClipboardText,
  IconClipboardTextFilled
)
export const ClockIcon = icon(IconClock, IconClockFilled)
export const CloudIcon = icon(IconCloud, IconCloudFilled)
export const CloudArrowUpIcon = icon(IconCloudUpload)
export const CloudCheckIcon = icon(IconCloudCheck)
export const CloudSunIcon = icon(IconSunHigh, IconSunHighFilled)
export const CoffeeIcon = icon(IconCoffee)
export const ContactlessPaymentIcon = icon(IconNfc)
export const CookingPotIcon = icon(IconSoup, IconSoupFilled)
export const CopyIcon = icon(IconCopy, IconCopyFilled)
export const CreditCardIcon = icon(IconCreditCard, IconCreditCardFilled)
export const DesktopIcon = icon(IconDeviceDesktop, IconDeviceDesktopFilled)
export const DeviceMobileIcon = icon(IconDeviceMobile, IconDeviceMobileFilled)
export const DeviceMobileCameraIcon = icon(
  IconDeviceMobile,
  IconDeviceMobileFilled
)
export const DeviceMobileSpeakerIcon = icon(
  IconDeviceMobile,
  IconDeviceMobileFilled
)
export const DeviceTabletIcon = icon(IconDeviceTablet, IconDeviceTabletFilled)
export const DotsSixVerticalIcon = icon(IconGripVertical)
export const DotsThreeIcon = icon(IconDots, IconDotsFilled)
export const DownloadSimpleIcon = icon(IconDownload, IconDownloadFilled)
export const EnvelopeIcon = icon(IconMail, IconMailFilled)
export const EnvelopeOpenIcon = icon(IconMailOpened, IconMailOpenedFilled)
export const EnvelopeSimpleIcon = icon(IconMail, IconMailFilled)
export const ExclamationMarkIcon = icon(IconExclamationMark)
export const ExportIcon = icon(IconShare2)
export const FileIcon = icon(IconFile, IconFileFilled)
export const FilePdfIcon = icon(IconFileTypePdf)
export const FilePlusIcon = icon(IconFilePlus)
export const FileTextIcon = icon(IconFileText, IconFileTextFilled)
export const FileTsIcon = icon(IconFileTypeTs)
export const FileZipIcon = icon(IconFileZip)
export const FilmSlateIcon = icon(IconMovie)
export const FingerprintIcon = icon(IconFingerprint)
export const FlagIcon = icon(IconFlag, IconFlagFilled)
export const FlameIcon = icon(IconFlame, IconFlameFilled)
export const FlashlightIcon = icon(IconBulb, IconBulbFilled)
export const FlaskIcon = icon(IconFlask, IconFlaskFilled)
export const FolderIcon = icon(IconFolder, IconFolderFilled)
export const FolderOpenIcon = icon(IconFolderSearch)
export const FolderSimpleIcon = icon(IconFolder, IconFolderFilled)
export const FootprintsIcon = icon(IconShoe)
export const ForkKnifeIcon = icon(IconToolsKitchen2, IconToolsKitchen2Filled)
export const FunnelIcon = icon(IconFilter, IconFilterFilled)
export const GameControllerIcon = icon(
  IconDeviceGamepad2,
  IconDeviceGamepad2Filled
)
export const GearIcon = icon(IconSettings, IconSettingsFilled)
export const GearSixIcon = icon(IconSettings, IconSettingsFilled)
export const GitBranchIcon = icon(IconGitBranch)
export const GitCommitIcon = icon(IconGitCommit)
export const GlobeIcon = icon(IconWorld, IconWorldFilled)
export const HandbagIcon = icon(IconShoppingBag)
export const HeadphonesIcon = icon(IconHeadphones, IconHeadphonesFilled)
export const HeartIcon = icon(IconHeart, IconHeartFilled)
export const HourglassIcon = icon(IconHourglass, IconHourglassFilled)
export const HouseIcon = icon(IconHome, IconHomeFilled)
export const ImageIcon = icon(IconPhoto, IconPhotoFilled)
export const InfoIcon = icon(IconInfoCircle, IconInfoCircleFilled)
export const KeyIcon = icon(IconKey, IconKeyFilled)
export const KeyboardIcon = icon(IconKeyboard, IconKeyboardFilled)
export const LaptopIcon = icon(IconDeviceLaptop)
export const LinkIcon = icon(IconLink, IconLinkFilled)
export const ListIcon = icon(IconMenu2, IconMenu2Filled)
export const ListChecksIcon = icon(IconListCheck, IconListCheckFilled)
export const ListDashesIcon = icon(IconListDetails, IconListDetailsFilled)
export const ListPlusIcon = icon(IconPlaylistAdd)
export const LockIcon = icon(IconLock, IconLockFilled)
export const LockSimpleIcon = icon(IconLock, IconLockFilled)
export const MagnifyingGlassIcon = icon(IconSearch, IconSearchFilled)
export const MapPinIcon = icon(IconMapPin, IconMapPinFilled)
export const MapTrifoldIcon = icon(IconMap)
export const MicrophoneIcon = icon(IconMicrophone, IconMicrophoneFilled)
export const MinusIcon = icon(IconMinus)
export const MoonIcon = icon(IconMoon, IconMoonFilled)
export const MusicNoteIcon = icon(IconMusic)
export const MusicNotesIcon = icon(IconMusic)
export const NavigationArrowIcon = icon(IconNavigation, IconNavigationFilled)
export const NewspaperIcon = icon(IconNews)
export const NotePencilIcon = icon(IconEdit, IconEditFilled)
export const PackageIcon = icon(IconPackage)
export const PaletteIcon = icon(IconPalette, IconPaletteFilled)
export const PaperPlaneTiltIcon = icon(IconSend, IconSendFilled)
export const PathIcon = icon(IconRoute)
export const PauseIcon = icon(IconPlayerPause, IconPlayerPauseFilled)
export const PencilSimpleIcon = icon(IconPencil, IconPencilFilled)
export const PlayIcon = icon(IconPlayerPlay, IconPlayerPlayFilled)
export const PlugIcon = icon(IconPlug)
export const PlusIcon = icon(IconPlus, IconPlusFilled)
export const PushPinIcon = icon(IconPin, IconPinFilled)
export const QrCodeIcon = icon(IconQrcode)
export const RecordIcon = icon(IconCircleDot, IconCircleDotFilled)
export const RobotIcon = icon(IconRobot)
export const ScanSmileyIcon = icon(IconFaceId)
export const ScissorsIcon = icon(IconCut)
export const SealCheckIcon = icon(
  IconRosetteDiscountCheck,
  IconRosetteDiscountCheckFilled
)
export const ShareIcon = icon(IconShare2)
export const ShareNetworkIcon = icon(IconShare)
export const ShieldIcon = icon(IconShield, IconShieldFilled)
export const ShieldCheckIcon = icon(IconShieldCheck, IconShieldCheckFilled)
export const ShieldWarningIcon = icon(IconShieldExclamation)
export const SignOutIcon = icon(IconLogout)
export const SparkleIcon = icon(IconSparkles, IconSparklesFilled)
export const SpeakerHighIcon = icon(IconVolume)
export const SquaresFourIcon = icon(IconLayoutGrid, IconLayoutGridFilled)
export const StarIcon = icon(IconStar, IconStarFilled)
export const StorefrontIcon = icon(IconBuildingStore)
export const SunIcon = icon(IconSun, IconSunFilled)
export const TagIcon = icon(IconTag, IconTagFilled)
export const TelevisionIcon = icon(IconDeviceTv, IconDeviceTvFilled)
export const TerminalIcon = icon(IconTerminal)
export const TextAlignCenterIcon = icon(IconAlignCenter)
export const TextAlignLeftIcon = icon(IconAlignLeft)
export const TextAlignRightIcon = icon(IconAlignRight)
export const TextBIcon = icon(IconBold)
export const TextItalicIcon = icon(IconItalic)
export const TextUnderlineIcon = icon(IconUnderline)
export const ThumbsDownIcon = icon(IconThumbDown, IconThumbDownFilled)
export const ThumbsUpIcon = icon(IconThumbUp, IconThumbUpFilled)
export const TimerIcon = icon(IconHourglassHigh)
export const TrashIcon = icon(IconTrash, IconTrashFilled)
export const TrayIcon = icon(IconInbox)
export const UploadSimpleIcon = icon(IconUpload)
export const UserIcon = icon(IconUser, IconUserFilled)
export const UserCircleMinusIcon = icon(IconUserMinus)
export const UserFocusIcon = icon(IconFaceId)
export const UserPlusIcon = icon(IconUserPlus)
export const UsersIcon = icon(IconUsers)
export const VideoCameraIcon = icon(IconVideo, IconVideoFilled)
export const WalletIcon = icon(IconWallet)
export const WarningIcon = icon(IconAlertTriangle, IconAlertTriangleFilled)
export const WarningCircleIcon = icon(IconAlertCircle, IconAlertCircleFilled)
export const WatchIcon = icon(IconDeviceWatch, IconDeviceWatchFilled)
export const WifiHighIcon = icon(IconWifi)
export const WifiSlashIcon = icon(IconWifiOff)
export const XIcon = icon(IconX, IconXFilled)
export const XCircleIcon = icon(IconCircleX, IconCircleXFilled)

export type { Icon, IconProps, IconWeight }
