"use client"

import {
  CaretLeftIcon,
  CaretRightIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useDirection } from "@/components/ui/direction"

type CarouselApi = UseEmblaCarouselType[1]

const STEP_KEYS = {
  vertical: ["ArrowUp", "ArrowDown"],
  ltr: ["ArrowLeft", "ArrowRight"],
  rtl: ["ArrowRight", "ArrowLeft"],
} as const
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  autoplay?: boolean | number
}

type CarouselAutoplay = {
  enabled: boolean
  delay: number
  playing: boolean
  running: boolean
  setPlaying: (playing: boolean) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  autoplay: CarouselAutoplay
} & Omit<CarouselProps, "autoplay">

const CarouselContext = React.createContext<CarouselContextProps | null>(null)
const CarouselOrientationContext = React.createContext<
  "horizontal" | "vertical"
>("horizontal")

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function keepControlFocus(
  root: HTMLDivElement | null,
  api: NonNullable<CarouselApi>
) {
  const active = document.activeElement
  if (!root || !(active instanceof HTMLElement) || !root.contains(active)) {
    return
  }
  const slot = active.dataset.slot
  const stranded =
    (slot === "carousel-previous" && !api.canScrollPrev()) ||
    (slot === "carousel-next" && !api.canScrollNext())
  if (!stranded) return
  const other = root.querySelector<HTMLButtonElement>(
    slot === "carousel-next"
      ? "[data-slot=carousel-previous]"
      : "[data-slot=carousel-next]"
  )
  if (other && !other.disabled) other.focus()
  else root.focus()
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  autoplay = false,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const direction = useDirection()
  const [carouselRef, api] = useEmblaCarousel(
    {
      direction,
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [playing, setPlaying] = React.useState(Boolean(autoplay))
  const [hovered, setHovered] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const delay = typeof autoplay === "number" ? autoplay : 5000
  const running =
    Boolean(autoplay) && playing && !hovered && !focused && !hidden

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    keepControlFocus(rootRef.current, api)
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const [back, forward] =
        STEP_KEYS[orientation === "vertical" ? "vertical" : direction]
      if (event.key === back) {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === forward) {
        event.preventDefault()
        scrollNext()
      }
    },
    [direction, orientation, scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!autoplay) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false)
    }
    const update = () => setHidden(document.visibilityState === "hidden")
    update()
    document.addEventListener("visibilitychange", update)
    return () => document.removeEventListener("visibilitychange", update)
  }, [autoplay])

  const remaining = React.useRef({ index: 0, time: delay })

  React.useEffect(() => {
    if (!api || !running) return
    const index = selectedIndex
    if (remaining.current.index !== index) {
      remaining.current = { index, time: delay }
    }
    const start = performance.now()
    const timer = window.setTimeout(() => {
      if (api.selectedScrollSnap() !== index) return
      remaining.current = { index: -1, time: delay }
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, remaining.current.time)
    return () => {
      window.clearTimeout(timer)
      if (remaining.current.index === index) {
        remaining.current.time = Math.max(
          0,
          remaining.current.time - (performance.now() - start)
        )
      }
    }
  }, [api, running, selectedIndex, delay])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
      api?.off("reInit", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        autoplay: {
          enabled: Boolean(autoplay),
          delay,
          playing,
          running,
          setPlaying,
        },
      }}
    >
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === "function") return ref(node)
          if (ref) ref.current = node
        }}
        tabIndex={-1}
        onKeyDownCapture={handleKeyDown}
        className={cn("relative outline-none", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        data-playing={running ? "" : undefined}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setHovered(true)
          onPointerEnter?.(event)
        }}
        onPointerLeave={(event) => {
          setHovered(false)
          onPointerLeave?.(event)
        }}
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false)
          }
          onBlur?.(event)
        }}
        {...props}
      >
        <CarouselOrientationContext.Provider
          value={orientation === "vertical" ? "vertical" : "horizontal"}
        >
          {children}
        </CarouselOrientationContext.Provider>
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ms-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const orientation = React.useContext(CarouselOrientationContext)

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "ps-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "secondary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full in-data-[slot=carousel-controls]:static in-data-[slot=carousel-controls]:m-0 in-data-[slot=carousel-controls]:translate-x-0 in-data-[slot=carousel-controls]:rotate-0",
        orientation === "horizontal"
          ? "inset-y-0 -inset-s-12 my-auto"
          : "-top-12 inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <CaretLeftIcon className="rtl:rotate-180" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "secondary",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full in-data-[slot=carousel-controls]:static in-data-[slot=carousel-controls]:m-0 in-data-[slot=carousel-controls]:translate-x-0 in-data-[slot=carousel-controls]:rotate-0",
        orientation === "horizontal"
          ? "inset-y-0 -inset-e-12 my-auto"
          : "-bottom-12 inset-s-1/2 -translate-x-1/2 rtl:translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <CaretRightIcon className="rtl:rotate-180" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

function CarouselControls({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="carousel-controls"
      className={cn("mt-6 flex items-center gap-3", className)}
      {...props}
    />
  )
}

function CarouselDots({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "plain" }) {
  const { api, selectedIndex, autoplay } = useCarousel()
  const [count, setCount] = React.useState(0)
  const [fill, setFill] = React.useState<HTMLSpanElement | null>(null)
  const [progress, setProgress] = React.useState<Animation | null>(null)

  React.useEffect(() => {
    if (!api) return
    const update = () => setCount(api.scrollSnapList().length)
    update()
    api.on("reInit", update)
    return () => {
      api.off("reInit", update)
    }
  }, [api])

  React.useEffect(() => {
    if (!fill || !autoplay.enabled) return
    if (!autoplay.playing) {
      fill.style.transform = "scaleX(1)"
      setProgress(null)
      return
    }
    fill.style.transform = ""
    const animation = fill.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { duration: autoplay.delay, easing: "linear", fill: "forwards" }
    )
    setProgress(animation)
    return () => animation.cancel()
  }, [fill, autoplay.enabled, autoplay.playing, autoplay.delay])

  React.useEffect(() => {
    if (
      !progress ||
      (progress.playState !== "running" && progress.playState !== "paused")
    )
      return
    if (autoplay.running) progress.play()
    else progress.pause()
  }, [progress, autoplay.running])

  return (
    <div
      data-slot="carousel-dots"
      data-variant={variant}
      data-autoplay={autoplay.enabled ? "" : undefined}
      className={cn(
        "group/carousel-dots flex h-9 items-center gap-4 rounded-full bg-control px-4 backdrop-blur-xl data-[variant=plain]:bg-transparent data-[variant=plain]:px-0 data-[variant=plain]:backdrop-blur-none",
        className
      )}
      {...props}
    >
      {Array.from({ length: count }, (_, position) => position).map((index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === selectedIndex ? "true" : undefined}
          data-active={index === selectedIndex ? "" : undefined}
          onClick={() => api?.scrollTo(index)}
          className="relative h-2 w-2 shrink-0 cursor-pointer rounded-full bg-label-tertiary transition-[width,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] outline-none after:absolute after:-inset-2 after:content-[''] hover:bg-label-secondary focus-visible:focus-ring data-active:w-6 data-active:bg-label group-data-autoplay/carousel-dots:data-active:bg-label-tertiary motion-reduce:transition-none"
        >
          {index === selectedIndex && autoplay.enabled && (
            <span
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden rounded-full"
            >
              <span
                ref={setFill}
                className="absolute inset-0 origin-left rounded-full bg-label rtl:origin-right"
              />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

function CarouselPlayButton({
  className,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { autoplay } = useCarousel()
  if (!autoplay.enabled) return null

  return (
    <Button
      data-slot="carousel-play-button"
      variant={variant}
      size={size}
      aria-label={autoplay.playing ? "Pause slideshow" : "Play slideshow"}
      className={cn("touch-manipulation rounded-full", className)}
      onClick={() => autoplay.setPlaying(!autoplay.playing)}
      {...props}
    >
      {autoplay.playing ? (
        <PauseIcon weight="fill" />
      ) : (
        <PlayIcon weight="fill" />
      )}
    </Button>
  )
}

export {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
  CarouselPrevious,
  useCarousel,
}
