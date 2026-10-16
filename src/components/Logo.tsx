import logoColour from '../assets/rubrik-logo-colour.svg'

// Decorative: the wrapping home link carries the accessible name.
export function Logo() {
  return <img src={logoColour} width={168} height={48} alt="" className="block" />
}
