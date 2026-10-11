import { Image, Pressable, ScrollView, View } from "react-native"
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

function CarouselPageIndicator() {
  const { scrollSnaps, selectedIndex, scrollTo } = useCarousel()
  return (
    <PageIndicator
      accessibilityLabel="Latest products"
      count={scrollSnaps.length}
      index={selectedIndex}
      onIndexChange={(index) => scrollTo(index)}
      className="self-center"
    />
  )
}

function GridCarousel({
  onSelectProduct,
}: {
  onSelectProduct?: (name: string) => void
}) {
  return (
    <Screen variant="secondary">
      <ScrollView contentContainerClassName="gap-[1.375rem] pt-10 pb-5">
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          className="px-5"
        >
          <Text role="heading" className="text-3xl font-semibold">
            The latest.{" "}
            <Text className="text-3xl font-semibold text-label-secondary">
              Fresh favorites of the season.
            </Text>
          </Text>
        </AnimatedView>
        <Carousel
          opts={{ align: "center" }}
          accessibilityLabel="Latest products"
          className="gap-2"
        >
          <CarouselContent
            className="ms-0"
            contentContainerClassName="gap-4 px-5 pt-2 pb-6"
          >
            {PRODUCTS.map((product) => (
              <CarouselItem key={product.name} basis={0.86} className="ps-0">
                <Pressable
                  role="link"
                  accessibilityLabel={`${product.kicker ? `${product.kicker}, ` : ""}${product.name}. ${product.tagline} From ${product.price}`}
                  onPress={() => onSelectProduct?.(product.name)}
                  className="h-[27.5rem] rounded-[1.125rem] bg-surface shadow-md active:opacity-80"
                >
                  <View className="gap-1 px-7 pt-7">
                    {product.kicker ? (
                      <Text className="text-xs font-semibold text-orange uppercase">
                        {product.kicker}
                      </Text>
                    ) : null}
                    <Text className="text-3xl font-semibold">
                      {product.name}
                    </Text>
                    <Text className="text-lg">{product.tagline}</Text>
                    <Text className="mt-1.5 text-sm text-label-secondary">
                      From {product.price}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: product.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    accessibilityLabel={product.alt}
                    className="m-5 min-h-0 flex-1 rounded-xl bg-control"
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
