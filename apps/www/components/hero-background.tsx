const grain = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.4 -0.2"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>'
)}")`

export function HeroBackground() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-[#dbba95] bg-[radial-gradient(circle_at_18%_22%,#ff5005_0%,#dbba95_48%,#d0bce1_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />
    </>
  )
}
