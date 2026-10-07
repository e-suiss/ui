import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [1, 2, 3, 4, 5]

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div
        className={
          parameters.wide ? "w-[min(56rem,calc(100vw-2rem))]" : "mx-12 w-72"
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-4xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const MultipleItems: Story = {
  args: { opts: { align: "start" } },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <Card size="sm">
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-3xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Loop: Story = {
  ...Default,
  args: { opts: { loop: true } },
}

export const Vertical: Story = {
  args: { orientation: "vertical", opts: { align: "start" } },
  decorators: [
    (Story) => (
      <div className="my-12">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent className="h-64">
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <Card size="sm" className="h-full justify-center">
              <CardContent className="flex items-center justify-center">
                <span className="text-3xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

const features = [
  {
    eyebrow: "Point of sale",
    title: "Take orders at the table.",
    tint: "from-blue to-indigo",
  },
  {
    eyebrow: "Kitchen",
    title: "Every ticket, right on time.",
    tint: "from-orange to-red",
  },
  {
    eyebrow: "Reservations",
    title: "A full room, every night.",
    tint: "from-green to-teal",
  },
  {
    eyebrow: "Analytics",
    title: "Know what sells.",
    tint: "from-purple to-pink",
  },
  {
    eyebrow: "Payments",
    title: "Split the bill in seconds.",
    tint: "from-cyan to-blue",
  },
]

export const Hero: Story = {
  parameters: { wide: true },
  args: { opts: { loop: true } },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.title}>
            <div
              className={`relative isolate flex aspect-video flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl bg-linear-to-br p-8 text-center text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 ${feature.tint}`}
            >
              <p className="text-sm font-semibold">{feature.eyebrow}</p>
              <p className="font-heading text-4xl font-semibold">
                {feature.title}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="justify-center">
        <CarouselDots />
      </CarouselControls>
    </Carousel>
  ),
}

export const Gallery: Story = {
  parameters: { wide: true },
  args: { opts: { align: "start" } },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.title} className="basis-4/5 sm:basis-2/5">
            <div
              className={`relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 ${feature.tint}`}
            >
              <p className="text-sm font-semibold">{feature.eyebrow}</p>
              <p className="font-heading text-2xl font-semibold">
                {feature.title}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="justify-end">
        <CarouselPrevious />
        <CarouselNext />
      </CarouselControls>
    </Carousel>
  ),
}
