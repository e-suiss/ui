import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
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
    (Story) => (
      <div className="mx-12 w-72">
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
