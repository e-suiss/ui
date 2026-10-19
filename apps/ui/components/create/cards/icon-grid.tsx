import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function IconGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Icons</CardTitle>
        <CardDescription>Drawn from the selected icon library</CardDescription>
        <CardAction>
          <Badge variant="secondary">24</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2">
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="HouseIcon"
              tabler="IconHome"
              hugeicons="Home01Icon"
              phosphor="HouseIcon"
              remixicon="RiHomeLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="Notification03Icon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="MailIcon"
              tabler="IconMail"
              hugeicons="Mail01Icon"
              phosphor="EnvelopeIcon"
              remixicon="RiMailLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar01Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="Settings01Icon"
              phosphor="GearIcon"
              remixicon="RiSettingsLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="HeartIcon"
              tabler="IconHeart"
              hugeicons="FavouriteIcon"
              phosphor="HeartIcon"
              remixicon="RiHeartLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="StarIcon"
              tabler="IconStar"
              hugeicons="StarIcon"
              phosphor="StarIcon"
              remixicon="RiStarLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="BookmarkIcon"
              tabler="IconBookmark"
              hugeicons="Bookmark01Icon"
              phosphor="BookmarkSimpleIcon"
              remixicon="RiBookmarkLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="MessageCircleIcon"
              tabler="IconMessageCircle"
              hugeicons="BubbleChatIcon"
              phosphor="ChatCircleIcon"
              remixicon="RiChat1Line"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="SendIcon"
              tabler="IconSend"
              hugeicons="SentIcon"
              phosphor="PaperPlaneTiltIcon"
              remixicon="RiSendPlaneLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="MusicIcon"
              tabler="IconMusic"
              hugeicons="MusicNote01Icon"
              phosphor="MusicNoteIcon"
              remixicon="RiMusic2Line"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="PlayIcon"
              tabler="IconPlayerPlay"
              hugeicons="PlayIcon"
              phosphor="PlayIcon"
              remixicon="RiPlayLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="SunIcon"
              tabler="IconSun"
              hugeicons="Sun03Icon"
              phosphor="SunIcon"
              remixicon="RiSunLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="MoonIcon"
              tabler="IconMoon"
              hugeicons="MoonIcon"
              phosphor="MoonIcon"
              remixicon="RiMoonLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="CloudIcon"
              tabler="IconCloud"
              hugeicons="CloudIcon"
              phosphor="CloudIcon"
              remixicon="RiCloudLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="LockIcon"
              tabler="IconLock"
              hugeicons="SquareLock02Icon"
              phosphor="LockSimpleIcon"
              remixicon="RiLockLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="ShieldCheckIcon"
              tabler="IconShieldCheck"
              hugeicons="SecurityCheckIcon"
              phosphor="ShieldCheckIcon"
              remixicon="RiShieldCheckLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="WalletIcon"
              tabler="IconWallet"
              hugeicons="Wallet01Icon"
              phosphor="WalletIcon"
              remixicon="RiWalletLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="CreditCardIcon"
              tabler="IconCreditCard"
              hugeicons="CreditCardIcon"
              phosphor="CreditCardIcon"
              remixicon="RiBankCardLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="Folder01Icon"
              phosphor="FolderIcon"
              remixicon="RiFolderLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
              className="size-5"
            />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <IconPlaceholder
              lucide="DownloadIcon"
              tabler="IconDownload"
              hugeicons="Download01Icon"
              phosphor="DownloadSimpleIcon"
              remixicon="RiDownloadLine"
              className="size-5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
