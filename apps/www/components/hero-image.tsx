import { getImageProps } from "next/image"
import { preload } from "react-dom"

const DESKTOP_QUERY = "(min-width: 768px)"
const MOBILE_QUERY = "(max-width: 767px)"

export function HeroImage() {
  const common = {
    alt: "",
    sizes: "100vw",
    quality: 70,
    loading: "eager",
    fetchPriority: "high",
  } as const
  const {
    props: { srcSet: mobile, src: mobileSrc },
  } = getImageProps({
    ...common,
    src: "/images/hero/halo-mobile.jpg",
    width: 780,
    height: 1324,
  })
  const {
    props: { srcSet: desktop, ...image },
  } = getImageProps({
    ...common,
    src: "/images/hero/halo-desktop.jpg",
    width: 2880,
    height: 1600,
  })

  preload(mobileSrc, {
    as: "image",
    imageSrcSet: mobile,
    imageSizes: common.sizes,
    fetchPriority: "high",
    media: MOBILE_QUERY,
  })
  preload(image.src, {
    as: "image",
    imageSrcSet: desktop,
    imageSizes: common.sizes,
    fetchPriority: "high",
    media: DESKTOP_QUERY,
  })

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(120%_90%_at_20%_30%,#ff5005_0%,#dbba95_45%,#d0bce1_100%)]"
    >
      <picture>
        <source media={DESKTOP_QUERY} srcSet={desktop} />
        <source srcSet={mobile} />
        <img
          {...image}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
    </div>
  )
}
