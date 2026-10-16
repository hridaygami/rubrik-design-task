import { useState } from 'react'
import { CloseIcon, MenuIcon } from './icons'
import { Logo } from './Logo'

const navItems = ['Products', 'Solutions', 'Resources', 'About', 'Partners']

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-grey">
      <div className="flex h-24 items-center justify-between gap-6 px-4 lg:gap-12 sm:px-6">
        <a href="/" aria-label="Rubrik home" className="shrink-0">
          <Logo />
        </a>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-12">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  aria-current={item === 'Resources' ? 'page' : undefined}
                  className="text-base text-muted transition-colors hover:text-black"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-12">
          <a
            href="#"
            className="hidden h-12 w-40 items-center justify-center bg-brand text-base text-white transition-colors hover:bg-brand-hover sm:inline-flex"
          >
            Get in touch
          </a>
          <button
            type="button"
            className="-mr-2 inline-flex size-11 items-center justify-center text-black lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-grey lg:hidden"
      >
        <ul className="flex flex-col py-2">
          {navItems.map((item) => (
            <li key={item}>
              <a
                href="#"
                aria-current={item === 'Resources' ? 'page' : undefined}
                className="block px-4 py-3 text-base text-muted hover:text-black sm:px-6"
              >
                {item}
              </a>
            </li>
          ))}
          <li className="px-4 pt-2 pb-3 sm:hidden">
            <a
              href="#"
              className="flex h-12 items-center justify-center bg-brand text-base text-white hover:bg-brand-hover"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
