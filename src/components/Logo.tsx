import logoMask from '../assets/rubrik-logo-black.svg'

// The logo SVG is used as a mask so its colour comes from tokens and can
// change on hover. Decorative: the wrapping home link carries the name.
export function Logo() {
  return (
    <span
      aria-hidden
      className="block aspect-168/48 h-12 bg-brand transition-colors group-hover:bg-brand-hover"
      style={{
        maskImage: `url(${logoMask})`,
        WebkitMaskImage: `url(${logoMask})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
      }}
    />
  )
}
