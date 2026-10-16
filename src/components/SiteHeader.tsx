import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Logo } from './Logo'

const navItems = ['Products', 'Solutions', 'Resources', 'About', 'Partners']

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const root = document.documentElement
    root.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    // The overlay is mobile-only; close it if the viewport grows past it.
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onDesktop = () => desktop.matches && setMenuOpen(false)

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onDesktop)
    return () => {
      root.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onDesktop)
    }
  }, [menuOpen])

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-0 z-30 bg-black/50 transition-[opacity,visibility] duration-250 ease-out motion-reduce:transition-none lg:hidden ${
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <header className="sticky top-0 z-40 border-b border-grey bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="relative border-x border-grey">
            <div className="flex items-center justify-between gap-6 px-4 py-4 sm:px-6 md:py-6 lg:gap-12">
              <a href="/" aria-label="Rubrik home" className="group shrink-0">
                <Logo />
              </a>

              <nav aria-label="Main" className="ml-auto hidden lg:block">
                <ul className="flex items-center gap-12">
                  {navItems.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        aria-current={item === 'Resources' ? 'page' : undefined}
                        className="text-body text-muted transition-colors hover:text-black"
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
                  className="hidden h-12 w-40 items-center justify-center bg-brand text-body text-white transition-colors hover:bg-brand-hover sm:inline-flex"
                >
                  Get in touch
                </a>
                <button
                  ref={menuButton}
                  type="button"
                  className="-mr-2 inline-flex size-11 items-center justify-center text-black lg:hidden"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
                  {menuOpen ? (
                    <X size={24} strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Menu size={24} strokeWidth={1.75} aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {/* Clips the panel so it slides out from under the header bar. */}
            <div className="pointer-events-none absolute inset-x-0 top-full overflow-hidden lg:hidden">
              <nav
                id="mobile-menu"
                aria-label="Main"
                className={`pointer-events-auto border-y border-grey bg-white transition-[translate,visibility] duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                  menuOpen ? 'visible translate-y-0' : 'invisible -translate-y-full'
                }`}
              >
                <ul className="flex flex-col py-2">
                  {navItems.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        aria-current={item === 'Resources' ? 'page' : undefined}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-4 text-body text-muted hover:text-black sm:px-6"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                  <li className="px-4 pt-2 pb-3 sm:hidden">
                    <a
                      href="#"
                      onClick={() => setMenuOpen(false)}
                      className="flex h-12 items-center justify-center bg-brand text-body text-white hover:bg-brand-hover"
                    >
                      Get in touch
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
