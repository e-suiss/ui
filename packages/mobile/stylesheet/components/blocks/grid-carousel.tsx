import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel"
import { PageIndicator } from "@/components/ui/page-indicator"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  radius,
  shadow,
  useTheme,
} from "@/components/ui/theme"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`

const PRODUCTS: {
  kicker?: string
  name: string
  tagline: string
  price: string
  image: string
  alt: string
}[] = [
  {
    kicker: "New",
    name: "Phone Pro",
    tagline: "Pro through and through.",
    price: "$999",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    kicker: "New",
    name: "Book Air",
    tagline: "Supercharged by S5.",
    price: "$1,099",
    image: photo("1644792863360-40fa85ea52e7"),
    alt: "A laptop on a wooden sideboard",
  },
  {
    name: "Watch Series 11",
    tagline: "Your best health companion.",
    price: "$399",
    image: photo("1696688713460-de12ac76ebc6"),
    alt: "A black smartwatch on a dark fabric",
  },
  {
    kicker: "New",
    name: "Phone Air",
    tagline: "The thinnest phone ever.",
    price: "$899",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
  },
  {
    name: "Phone",
    tagline: "More colors. More power.",
    price: "$799",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
  },
  {
    name: "Pods Studio",
    tagline: "Active Noise Cancellation.",
    price: "$549",
    image: photo("1599669454699-248893623440"),
    alt: "Black over-ear headphones on a dark background",
  },
]

const styles = StyleSheet.create({
  content: { gap: 22, paddingTop: 40, paddingBottom: 20 },
  title: { paddingHorizontal: 20 },
  heading: { ...fontSize["3xl"], fontWeight: "600" },
  carousel: { gap: 8 },
  track: { marginStart: 0 },
  trackContent: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  item: { paddingStart: 0 },
  card: { height: 440, borderRadius: 18 },
  text: { gap: 4, paddingHorizontal: 28, paddingTop: 28 },
  kicker: { ...fontSize.xs, fontWeight: "600", textTransform: "uppercase" },
  name: { ...fontSize["3xl"], fontWeight: "600" },
  tagline: { ...fontSize.lg },
  price: { ...fontSize.sm, marginTop: 6 },
  image: { margin: 20, minHeight: 0, flex: 1, borderRadius: radius.xl },
  indicator: { alignSelf: "center" },
})

function CarouselPageIndicator() {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  return (
    <PageIndicator
      accessibilityLabel="Latest products"
      count={scrollSnaps.length}
      index={selectedIndex}
      onIndexChange={(index) => scrollTo(index)}
      style={styles.indicator}
    />
  )
}

function GridCarousel({
  onSelectProduct,
}: {
  onSelectProduct?: (name: string) => void
}) {
  const { colors } = useTheme()
  return (
    <Screen variant="secondary">
      <ScrollView contentContainerStyle={styles.content}>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          style={styles.title}
        >
          <Text role="heading" style={styles.heading}>
            The latest.{" "}
            <Text style={[styles.heading, { color: colors.mutedForeground }]}>
              Fresh favorites of the season.
            </Text>
          </Text>
        </AnimatedView>
        <Carousel
          opts={{ align: "center" }}
          accessibilityLabel="Latest products"
          style={styles.carousel}
        >
          <CarouselContent
            style={styles.track}
            contentContainerStyle={styles.trackContent}
          >
            {PRODUCTS.map((product) => (
              <CarouselItem key={product.name} basis={0.86} style={styles.item}>
                <Pressable
                  role="link"
                  accessibilityLabel={`${product.kicker ? `${product.kicker}, ` : ""}${product.name}. ${product.tagline} From ${product.price}`}
                  onPress={() => onSelectProduct?.(product.name)}
                  style={({ pressed }) => [
                    styles.card,
                    shadow.md,
                    { backgroundColor: colors.background },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <View style={styles.text}>
                    {product.kicker ? (
                      <Text
                        style={[styles.kicker, { color: palette.orange500 }]}
                      >
                        {product.kicker}
                      </Text>
                    ) : null}
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.tagline}>{product.tagline}</Text>
                    <Text
                      style={[styles.price, { color: colors.mutedForeground }]}
                    >
                      From {product.price}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: product.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    accessibilityLabel={product.alt}
                    style={[
                      styles.image,
                      { backgroundColor: colors.secondary },
                    ]}
                  />
                </Pressable>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPageIndicator />
        </Carousel>
      </ScrollView>
    </Screen>
  )
}

export { GridCarousel }
