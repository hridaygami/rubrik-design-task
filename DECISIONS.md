# Rubrik Resources — decision record

Every decision behind the Resources page, grouped as design, interaction and UX,
and development. Each entry gives the choice and the reason for it.

`system.md` is the short, living design-system reference. This file is the full
record, including what we tried and dropped. Exact values live in code: tokens
in `src/index.css` and component classes in `src/components/`.

---

## Context

- **Brief:** build the Resources page from the Rubrik Task Figma file (node
  37-951) into the existing Vite + React + Tailwind app.
- **Source:** the Figma connector couldn't authenticate, so the page was built
  from screenshots of the frame and matched by measurement at 1440px. Later
  rounds were driven by written and screenshot feedback.
- **Scope:** one page: a sticky header, "Fresh off the press" featured cards, a
  "Find your next insight" hero, a search and filter bar, and a library list.

---

## 1. Design decisions

### Colour

| Token | Value | Role |
|---|---|---|
| `brand` / `brand-hover` | #004D4C / #0F2424 | Logo, primary button, checked boxes, count badges, focus ring, cursor |
| `secondary` / `secondary-hover` | #7B5E7B / #5C475C | "Fresh off the press" label, featured card links |
| `accent` | #21A179 | Defined, unused |
| `grey` | #D7DEDC | Dividers, page rails, header border |
| `light-grey` | #F4F6F5 | Defined, unused since hovers moved to `hover-grey` |
| `hover-grey` | #E6EAE9 | Hover on cards and filter buttons; open filter button |
| `faint-grey` | #FAFBFA | Tag fill |
| `mid-grey` | #B4BEBB | Tag outline |
| `muted` | #626262 | Secondary text: nav, subtitle, result count |
| `black` / `white` | #000 / #FFF | Text and page background |

- **The palette came from the brief; four greys and `muted` were added to it.**
  Each fills a gap the palette couldn't:
  - **`muted`:** no palette grey reaches 4.5:1 for text on white.
  - **`hover-grey`:** `light-grey` was too faint to read as a hover state. Full
    `grey` was tried next, but it matched the dividers, so a hovered row lost its
    edges. The midpoint reads as a state and keeps the edges.
  - **`faint-grey` and `mid-grey`:** tags sit on rows that hover. A near-white fill
    with a darker outline keeps them visible on both white and `hover-grey`.
- **`accent` is about 3.3:1 on white,** so it's reserved for icons, borders, large
  text or fills behind black text, never body text.
- **The search bar and filters have black borders; everything else uses `grey`.**
  The bar is the page's main control, so it gets the strongest edge. An open
  filter dropdown continues the black outline on all sides, including the line
  between it and the bar.

### Typography

- **Host Grotesk, weights 400 and 500, from Google Fonts.** It replaced the
  starting font at the brief's request and matches the design's letter widths.
- **A named rem scale instead of pixels or Tailwind's default sizes:** `display`
  (72px), `display-md` (60px), `display-sm` (48px), `lead`, `lead-sm`, `title`,
  `title-sm`, `body`, `label`. Rem respects the user's browser font size.
- **Smaller steps by width:** headline and lead step down below 768px, card titles
  below 1024px. `display-md` was added because 72px felt too large on tablets.
- **The headline is regular weight (400),** a feedback change from medium.
  Medium (500) is kept for links, tags, labels and buttons.
- **Tags and labels are uppercase, 12px, medium, with 0.1–0.12em tracking.**

### Layout

- **The page is a bordered frame capped at 1440px,** with two grey rails running
  the full height. The rails are part of the visual identity, so they stay on
  phones too.
- **Rails sit 16px from the screen edge below 640px and 24px from 640px up.**
- **Content padding is 16px in cards and rows, and 24px in the hero and header**
  from 640px up.
- **The header is full-bleed.** Its bar and border span the viewport, while its
  content follows the 1440px frame so the logo lines up with the page.
- **Breakpoints are 640 (`sm`), 768 (`md`) and 1024 (`lg`).** 1024 is the
  behaviour switch: below it, the hamburger menu, stacked cards, the filter
  bottom sheet and a search field on its own row; from it up, the inline nav,
  row cards, filter popovers and a single search-and-filter row.
- **Section spacing is tighter on tablets (640–1023px),** so the whole search bar
  fits on the first screen of a 768×1024 portrait tablet.

### Components

- **Header:** sticky, 96px tall from 768px up and 80px below. The logo is 48px
  tall at every width. "Get in touch" is a fixed-width brand button; on phones
  it moves into the menu. On tablets the gap between it and the menu button was
  cut from 48px to 12px, so the two sit together.
- **Logo:** one SVG used as a CSS mask filled with `brand`, so it can darken to
  `brand-hover` on hover without a second file.
- **Featured cards:** title, tag and link in one row from 1024px; tag, title and
  link stacked below. Links and tags never wrap; the title takes the squeeze.
- **Library rows:** one link per row, with the tag above the title and a separate
  arrow cell with its own divider.
- **Tags:** one shared component, so featured and library tags always match.
- **Section label:** "Fresh off the press" is a solid `secondary` chip in white
  uppercase, as in the design.
- **Every list keeps a bottom border on its last row,** so the list reads as
  closed.

### Iconography

- **Lucide (`lucide-react`) only,** so every icon shares one stroke style. This
  includes the menu, close, search, chevron, check and arrow icons.
- **Sizes:** 16px for inline arrows and chevrons, 20px for search and list
  arrows, 24px for menu and close.

### Brand assets

- **Favicon:** the logomark alone, black in light mode and white in dark mode, so
  it stays visible on either browser chrome.
- **Open Graph card:** the brand-green logo centred on a white 1200×630 card, plus
  title, description and large-card tags for share previews.

---

## 2. Interaction and UX decisions

### Navigation

- **Below 1024px the menu is an overlay, not a push-down.** Pushing content down
  makes the page jump; an overlay keeps the user's place.
  - It slides out from under the header bar over a 50% black scrim.
  - It closes on a scrim tap, Escape, choosing a link, or the window growing past
    1024px, and locks page scroll while open.
  - Escape returns focus to the menu button.
- **The current page ("Resources") is marked with `aria-current`.**

### Hover and feedback

- **Featured cards and library rows share one hover:** white by default,
  `hover-grey` on hover. One behaviour for both lists makes them feel like one
  system.
- **Hover comes in fast (150ms) and fades out slowly (800ms).** The quick response
  feels direct; the slow fade feels relaxed rather than twitchy.
- **Featured links also underline and darken to `secondary-hover`** on hover. The
  underline makes the link obvious; the darker colour adds contrast on grey.
- **The library arrow nudges up and right on hover.**
- **Filter buttons use the same `hover-grey`,** and keep it while their dropdown is
  open, so the open filter is easy to spot.

### Search and filters

- **Search matches titles as you type;** there's no submit step.
- **Content type, Use cases and Workload are multi-select checkbox groups.** Real
  resource libraries need several options per filter.
- **Matching is OR within a filter and AND across filters,** which is what people
  expect from faceted search.
- **Each filter button shows a count badge** of its ticked options, so active
  filters are visible while closed.
- **"Showing N of 10 resources" updates live** and is announced to screen
  readers.
- **Empty results show a plain message** ("No resources match your filters")
  rather than an empty list.
- **From 1024px up, a filter opens a popover** the full width of the bar, with
  options in three columns.
  - It closes on an outside click, Escape (focus returns to the button), tabbing
    out of the bar, or opening another filter.
  - A "Clear" link appears once something is ticked.
  - It's a disclosure (a button plus a panel of checkboxes), not an ARIA menu or
    listbox, because the options are checkboxes.
- **Below 1024px, a filter opens a modal bottom sheet.** Popovers are too cramped
  on small screens, and a sheet is a familiar mobile pattern.
  - Selections apply immediately; "Show N results" updates live and just closes
    the sheet.
  - Clear empties that filter and keeps the sheet open.
  - It closes on Escape, a tap on the backdrop, Close or "Show N results", and
    returns focus to the filter button.
- **A filter open in one layout closes when the window crosses 1024px,** rather
  than turning a popover into a modal sheet mid-use.
- **Focusing the search field scrolls the section up, so results update in
  view.**
  - From 640px up, "Find your next insight" lands 32px under the header.
  - On phones the search bar itself moves to just under the header, because the
    keyboard leaves no room for the heading as well.
  - The results area always keeps at least a screen of height below the search
    bar. Otherwise a short result list makes the page shorter than the screen and
    the browser pulls the section back down.

### Motion

- **Easing is a smooth ease-out with no bounce;** movement is short and quiet.
- **Page entrance:** a staggered rise and fade (12px of travel). The headline
  comes first, then the subtitle, the featured cards one by one, then the search
  bar.
- **Overlays (menu, scrim, filter sheet) run at 250ms.** 300ms and slower felt
  lazy.
- **Under `prefers-reduced-motion`,** entrances, slides and the search scroll
  animation are turned off. Content still appears; it just doesn't move.

### Custom cursor

- **On mouse and trackpad devices, the native cursor becomes a small brand-green
  diamond.** It's a 12px square turned 45° with 2px rounded corners, echoing the
  diamond shapes in the Rubrik logo. Touch devices keep their native behaviour.
- **It tracks the pointer exactly.** An easing lag was tried for a relaxed feel
  and removed: a trailing cursor is harder to aim, especially for people with
  motor impairments.
- **It turns `grey` over dark surfaces,** detected automatically, so new dark
  sections need no setup.
- **The native cursor returns while a modal dialog is open,** since dialogs
  render above the custom cursor.

### Accessibility

- **One `h1` per page,** visually hidden ("Resources"), because the first visible
  heading comes before the hero. "Fresh off the press" and "Find your next
  insight" are `h2`s.
- **Every card and row is one whole link.** In reading order its name is title,
  then tag, then link text; the tag sits above the title visually through CSS
  order only.
- **Every overlay returns focus to whatever opened it.**
- **A visible focus ring** (2px `brand` outline) on every interactive element.
  Inside bordered controls it's inset, so it isn't clipped.
- **Contrast:** body and secondary text are at least 4.5:1, including link text in
  its hover state.
- **Tap targets** for the menu and close buttons are 44px.

---

## 3. Development decisions

### Stack and setup

- **Vite 8, React 19, TypeScript and Tailwind v4,** the app's existing stack.
  The Helix design-system workflow was skipped at the user's request; the repo
  has no `helix.config.ts`.
- **Tailwind v4's CSS-first `@theme`** holds all tokens in `src/index.css`.
  Components use only named tokens, so a colour or type change happens in one
  place.
- **`lucide-react` is the only UI dependency added.** `@resvg/resvg-js` is a dev
  dependency, used only at build time.
- **Code style:** no semicolons, single quotes, 100-character lines, matching the
  existing files.

### CSS over JavaScript

Platform CSS features handle states that would otherwise need React state or
effects:

- `starting:` for entry transitions (popover fade-in, sheet slide-up).
- `open:`, `backdrop:` and `transition-discrete` to animate the native
  `<dialog>` in and out.
- `aria-expanded:` and `data-*` variants, so styles follow the accessible state
  rather than duplicate class logic.
- `:has(dialog:modal)` on `html` to lock page scroll and bring back the native
  cursor while the sheet is open.
- `scroll-padding-top` matching the header height, so focused and scrolled-to
  content clears the sticky header.

### Entrance animation

- **A custom `rise` utility** (keyframes plus `@utility`), with each element
  setting its own `--rise-delay`.
- **The delay lives in the utility, not in a theme `--animate-*` token.** Theme
  tokens resolve at `:root`, where the per-element delay doesn't exist, so every
  delay came out as zero.
- **The reduced-motion opt-out is built into the utility,** so no caller can
  forget it.

### Components and state

- **`App` owns all filter state** in one `Filters` object (query plus three
  facets). `ResourceFilters` is fully controlled and filtering is a `useMemo`.
- **The open filter remembers which layout it was opened in.** If the window
  crosses 1024px, the stored layout no longer matches, so it closes without an
  effect.
- **`useMediaQuery` is built on `useSyncExternalStore`,** so React reads the
  media query consistently during render, with no effect or flash.
- **The bottom sheet is a native `<dialog>` opened with `showModal()`.** That
  gives a focus trap, Escape, an inert page and top-layer stacking for free.
  - It keeps the last facet rendered while it slides away, using state set during
    render, so the content doesn't vanish mid-animation.
  - Focus is returned to the trigger explicitly, because not every browser
    restores it (after a tap, for instance).
- **Popover dismissal listeners** (outside pointerdown, Escape) are attached only
  while a popover is open. Tab-out uses `relatedTarget` on blur.
- **The header menu** sits inside a clipping wrapper so it slides out from under
  the bar. Scroll lock sets `overflow` on `html`, and a `matchMedia` listener
  closes it at 1024px.

### Search scroll

- **`scrollIntoView` on focus,** aimed at the heading from 640px up and the search
  bar on phones, plus a small scroll margin for breathing room.
- **Smooth by default, instant under reduced motion.** `scrollIntoView` ignores
  the CSS `scroll-behavior`, so the code checks the media query itself.
- **The results wrapper has a minimum height of `100lvh` minus 22rem.** The
  large-viewport unit doesn't shrink when a mobile browser's address bar shows.
  The 22rem offset leaves just enough height for phones, the tightest case, and
  adds only a little spare space elsewhere.

### Custom cursor

- **Position is written straight to the element's style on `mousemove`,** with no
  React state, so moving the mouse never re-renders the app.
- **Dark-surface detection:** `elementFromPoint` finds the element under the
  pointer, then the code walks up to the first painted background. Translucent
  colours are blended over white, and relative luminance below 0.25 counts as
  dark.
- **Colours are converted through a 1×1 canvas,** because Tailwind v4 outputs
  modern colour formats (such as oklab) that are hard to parse by hand.
- **It's enabled only for `(hover: hover) and (pointer: fine)`,** so touch devices
  never get it.

### Assets and metadata

- **No raster images in the repo.** Images are hotlinked by URL; the page uses
  none right now.
- **Logo:** the two Rubrik SVGs supplied are in `src/assets/`; only the black one
  is used, as the mask.
- **Favicon:** one SVG built from the logomark paths, with an embedded
  `prefers-color-scheme` rule that switches black to white.
- **Open Graph image:** share previews don't accept SVG, and PNGs stay out of the
  repo, so a small Vite plugin in `vite.config.ts` renders the card with resvg.
  - The build writes `og-image.png`; the dev server serves it on the fly.
  - It injects the `og:image` tags. `SITE_URL` must be set at build time, because
    crawlers need an absolute image URL.
  - Title, description and the large-card tag are static in `index.html`.
- **Content:** typed placeholder data in `src/data/resources.ts`. Featured titles
  come from the Figma frame; library titles, types and filter options come from
  rubrik.com. Links and each item's use case and workload are stand-ins.

### Verification and workflow

- **Every change was checked in the browser** by measuring the DOM at 375, 640,
  768, 1024+, 1440 and 1920px widths, rather than by eye.
- **The preview pane throttles animation while hidden,** so motion was checked by
  end state (transitions off, instant scroll) and the timings still need a live
  look.
- **Each commit passes `npm run build` (type-check plus bundle) and `npm run
  lint`.**
- **Work lives on the `claude/helix-skills-design-4e4132` branch** with a draft
  PR. Commits happen only when asked, and the PR description is updated with
  each push.

---

## Tried and dropped

| Tried | Why it was dropped |
|---|---|
| An image revealed behind the featured cards on hover, then a timed sweep, with a 15% scrim over a teal texture | It didn't feel right, and it made the two lists behave differently |
| A scroll-driven sweep across the featured cards on touch devices | Dropped with the reveal |
| `light-grey` (#F4F6F5) as the hover colour | Too faint to read as a state |
| `grey` (#D7DEDC) as the hover colour | Matched the dividers, so hovered rows lost their edges; it also needed a darker link to pass contrast |
| A 16px brand circle as the cursor | Replaced by the diamond, which ties the cursor to the logo |
| An easing lag on the cursor | Harder to aim; an accessibility problem |
| A push-down mobile menu | The page jumped; replaced by an overlay |
| 300ms and slower overlay timings | Felt lazy; settled on 250ms |
| Scrolling to the heading on phones when search is focused | The keyboard hid the results; phones scroll to the search bar instead |

---

## Open questions

- **Logo files:** the logo SVGs and favicon are committed. Should they move to a
  hosted URL like other imagery, or are logos an exception to the no-images rule?
- **Unused colours:** `accent` and `light-grey` have no use yet.
- **Unchecked on real devices:** the motion timings and the search-focus scroll
  haven't been seen live on a phone. On iPhone, Safari also scrolls the field
  into view when the keyboard opens, and the two scrolls may clash.
- **Real data:** links, use cases and workloads are placeholders.
