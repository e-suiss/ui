import { cn } from "cn"
import {
  CaretRightIcon,
  CheckIcon,
  CloudIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  KeyIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"

const ITEMS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "personal", label: "Personal Information", icon: UserIcon },
  { value: "security", label: "Sign-In & Security", icon: KeyIcon },
  { value: "payment", label: "Payment & Shipping", icon: CreditCardIcon },
  { value: "subscriptions", label: "Subscriptions", icon: CloudIcon },
  { value: "family", label: "Family Sharing", icon: UsersIcon },
  { value: "devices", label: "Devices", icon: DeviceMobileIcon },
  { value: "privacy", label: "Privacy", icon: ShieldIcon },
]

const CARD_CLASS = "rounded-[1.125rem] bg-muted px-5 py-[1.125rem]"

type Editable = "email" | "phone"

function EditableCard({
  title,
  value,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  title: string
  value: string
  editing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: (value: string) => void
}) {
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    if (editing) setDraft(value)
  }, [editing, value])

  return (
    <View className={CARD_CLASS}>
      <View className="flex-row items-center gap-3">
        <View className="flex-1 gap-[0.1875rem]">
          <Text role="heading" className="text-lg font-semibold">
            {title}
          </Text>
          {editing ? null : (
            <Text className="text-base text-muted-foreground">{value}</Text>
          )}
        </View>
        {editing ? null : (
          <Pressable
            role="button"
            hitSlop={8}
            onPress={onEdit}
            accessibilityLabel={`Edit ${title.toLowerCase()}`}
            className="active:opacity-60"
          >
            <Text className="text-base text-primary">Edit ›</Text>
          </Pressable>
        )}
      </View>
      {editing ? (
        <AnimatedView
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          className="gap-3 pt-3.5"
        >
          <Input
            autoFocus
            value={draft}
            onChangeText={setDraft}
            accessibilityLabel={title}
            returnKeyType="done"
            onSubmitEditing={() => onSave(draft)}
            className={(state) =>
              cn(
                "h-12 rounded-xl bg-background text-[18px]",
                state.focused ? "border-ring ring ring-ring-50" : "border-input"
              )
            }
          />
          <View className="flex-row gap-2.5">
            <Button size="sm" onPress={() => onSave(draft)}>
              <Text>Save</Text>
            </Button>
            <Button size="sm" variant="outline" onPress={onCancel}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </AnimatedView>
      ) : null}
    </View>
  )
}

function Security({
  onSave,
}: {
  onSave?: (field: Editable, value: string) => void
}) {
  const [values, setValues] = React.useState<Record<Editable, string>>({
    email: "jamie@suiss.com",
    phone: "+1 (415) 555-0142",
  })
  const [editing, setEditing] = React.useState<Editable | null>(null)
  const [passkeys, setPasskeys] = React.useState(true)
  const [saved, setSaved] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(null), 2200)
    return () => clearTimeout(timer)
  }, [saved])

  const cards: { field: Editable; title: string }[] = [
    { field: "email", title: "Email & phone" },
    { field: "phone", title: "Trusted phone number" },
  ]

  return (
    <View className="gap-3.5">
      {cards.map((card) => (
        <EditableCard
          key={card.field}
          title={card.title}
          value={values[card.field]}
          editing={editing === card.field}
          onEdit={() => setEditing(card.field)}
          onCancel={() => setEditing(null)}
          onSave={(value) => {
            onSave?.(card.field, value)
            setValues((current) => ({ ...current, [card.field]: value }))
            setEditing(null)
            setSaved(card.title)
          }}
        />
      ))}
      <View className={cn(CARD_CLASS, "flex-row items-center gap-3")}>
        <View className="flex-1 gap-[0.1875rem]">
          <Text
            nativeID="settings-account-passkeys"
            className="text-lg font-semibold"
          >
            Passkeys
          </Text>
          <Text className="text-base text-muted-foreground">
            {passkeys ? "On for 3 devices" : "Off"}
          </Text>
        </View>
        <Switch
          checked={passkeys}
          onCheckedChange={setPasskeys}
          accessibilityLabelledBy="settings-account-passkeys"
        />
      </View>
      <View className={cn(CARD_CLASS, "flex-row items-center gap-3")}>
        <View className="flex-1 gap-[0.1875rem]">
          <Text role="heading" className="text-lg font-semibold">
            Two-factor authentication
          </Text>
          <Text className="text-base text-muted-foreground">
            Codes are sent to your trusted devices.
          </Text>
        </View>
        <Text className="text-sm font-semibold text-green-600 dark:text-green-400">
          On
        </Text>
      </View>
      <View
        accessibilityLiveRegion="polite"
        className="min-h-6 flex-row items-center"
      >
        {saved ? (
          <AnimatedView
            entering={FadeInDown.duration(400).reduceMotion(
              ReduceMotion.System
            )}
            className="flex-row items-center gap-1.5"
          >
            <Icon
              as={CheckIcon}
              weight="bold"
              className="size-4 text-green-600 dark:text-green-400"
            />
            <Text className="text-sm">{saved} saved.</Text>
          </AnimatedView>
        ) : null}
      </View>
    </View>
  )
}

function SettingsAccount({
  onSave,
}: {
  onSave?: (field: "email" | "phone", value: string) => void
}) {
  const [section, setSection] = React.useState<string | null>("security")
  const scroll = useHeaderScroll()
  const current = ITEMS.find((item) => item.value === section)

  return (
    <Screen edges={["top", "right", "left"]}>
      <Header scroll={scroll}>
        {current ? (
          <HeaderBack onPress={() => setSection(null)}>Account</HeaderBack>
        ) : null}
        <HeaderTitle>{current ? current.label : "Account"}</HeaderTitle>
      </Header>
      <HeaderScrollView key={section ?? "account"} scroll={scroll}>
        {current ? (
          <>
            <HeaderLargeTitle>{current.label}</HeaderLargeTitle>
            <AnimatedView
              entering={FadeInDown.duration(600).reduceMotion(
                ReduceMotion.System
              )}
              className="px-4 pt-2"
            >
              {current.value === "security" ? (
                <Security onSave={onSave} />
              ) : (
                <Text className="text-lg text-muted-foreground">
                  This section isn't part of the sample. Choose Sign-In &
                  Security.
                </Text>
              )}
            </AnimatedView>
          </>
        ) : (
          <>
            <HeaderLargeTitle className="gap-2 pb-4">
              <Avatar size="xl" className="size-[4.5rem]">
                <AvatarFallback className="bg-indigo-500">JR</AvatarFallback>
              </Avatar>
              <Text role="heading" className="text-2xl font-semibold">
                Jamie Rivera
              </Text>
              <Text className="text-sm text-muted-foreground">
                jamie@suiss.com
              </Text>
            </HeaderLargeTitle>
            <View className="px-4">
              <ItemGroup variant="inset">
                {ITEMS.map((item, index) => (
                  <React.Fragment key={item.value}>
                    {index > 0 ? (
                      <ItemSeparator className="ms-[3.125rem]" />
                    ) : null}
                    <Item
                      size="sm"
                      onPress={() => setSection(item.value)}
                      className="min-h-11 gap-3.5 py-2.5"
                    >
                      <ItemMedia>
                        <Icon as={item.icon} className="size-5 text-primary" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="font-normal">
                          {item.label}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Icon
                          as={CaretRightIcon}
                          weight="bold"
                          className={cn(
                            "size-3.5 text-muted-foreground",
                            I18nManager.isRTL && "rotate-180"
                          )}
                        />
                      </ItemActions>
                    </Item>
                  </React.Fragment>
                ))}
              </ItemGroup>
            </View>
          </>
        )}
        <View className="h-8" />
      </HeaderScrollView>
    </Screen>
  )
}

export { SettingsAccount }
