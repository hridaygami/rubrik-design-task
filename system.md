# Rubrik Resources — design system

The decisions behind the Resources page: what we chose and why. Exact values
live in code: tokens in `src/index.css`, timings as named constants in the
components. This file records the reasoning a reader of the code couldn't
recover, so update or delete a row when the decision changes rather than
adding a new one.

**Source of truth for visuals:** the Rubrik Task Figma file (node 37-951),
built from screenshots because the Figma connector couldn't authenticate.
Spacing was matched by measurement at a 1440px frame.

---

## Foundations

### Colour

| Token | Value | Role |
|---|---|---|
| `brand` / `brand-hover` | #004D4C / #0F2424 | Logo, primary buttons, checked state, focus ring |
| `secondary` / `secondary-hover` | #7B5E7B / #5C475C | Section label, card links |
| `accent` | #21A179 | Defined, unused so far |
| `grey` | #D7DEDC | All dividers, rails and tag outlines |
| `light-grey` | #F4F6F5 | Row hover, open filter button |
| `faint-grey` | #FAFBFA | Tag fill |
| `mid-grey` | #B4BEBB | Tag outline |
| `black` / `white` | #000 / #FFF | Text and page background |
| `muted` | #626262 | Secondary text (nav, subtitle, counts) |

- **`muted` is outside the palette.** `grey` is too light for text on white, and secondary text needs at least 4.5:1 contrast.
- **`faint-grey` and `mid-grey` are outside the palette.** Tags sit on rows that hover to `light-grey`. A fill halfway to white plus a darker outline keeps them visible in both states.
- **`accent` is about 3.3:1 on white.** Use it for icons, borders, large text or as a fill behind black text, never for body text.
- **Search and filter borders are black.** Everything else uses `grey`. The search bar is the page's main control, so it gets the strongest edge.
  - The bar's black sides sit on top of the grey page rails, so its box reads as closed.
  - An open filter dropdown continues the black sides and bottom, but a grey line separates it from the bar.

### Typography

- **Host Grotesk at 400 and 500, from Google Fonts.** It matches the design's letter widths almost exactly.
- **A named rem scale, never pixels:** `display`, `lead`, `title`, `body`, `label`. The `-sm` steps apply below 768px for the display and lead sizes, and below 1024px for card titles. `display-md` (60px) covers tablets, 768–1023px, where the full 72px headline felt too large.
- **The headline is regular weight (400).** Medium is for links, tags, labels and buttons only.
- **Tags and labels are uppercase 12px medium with 0.1–0.12em tracking.**

### Layout

- **The page is a bordered frame capped at 1440px.** Two vertical rails run the full page height.
- **Rails sit 16px from the screen edge below 640px and 24px from 640px up.** The rails are part of the visual identity, so they stay visible on phones too.
- **Content padding inside the frame is 16px on cards and rows, and 24px on the hero and header from 640px up.**
- **The header is full-bleed.** Its white bar and bottom border span the viewport, while its content follows the same 1440px frame so the logo lines up with the page below.
- **Breakpoints:** 640 (`sm`), 768 (`md`), 1024 (`lg`). 1024 is the behaviour switch: hamburger menu, stacked cards, filter bottom sheet and the search field on its own row below it; inline nav, row cards, filter popovers and a single search-and-filter row at and above it.

### Iconography

- **Lucide (`lucide-react`) only.** No hand-drawn SVGs, so icons share one stroke style.
- **Sizes:** 16px for inline arrows and chevrons, 20px for search and list arrows, 24px for menu and close.

---

## Components

### Header

- **Sticky, with a 96px bar from 768px up and 80px below.** The logo is 48px tall at every width, with 16px above and below on narrow screens.
- **The logo is drawn as a CSS mask filled with `brand`.** That lets it darken to `brand-hover` on hover without a second asset.
- **Below 1024px the menu is an overlay, not a push-down.**
  - It slides in from under the header bar over a 50% black scrim.
  - It closes on a scrim tap, Escape or choosing a link, and locks page scroll while open.

### Fresh off the press (featured cards)

- **Card anatomy:** title, tag and link in one row from 1024px up; tag, then title, then link below 1024px.
- **Hover matches the library list:** white by default, `light-grey` on hover. The link text also underlines on hover.
  - We tried an image reveal behind the cards (hover on desktop, a scroll sweep on touch) and dropped it. It didn't feel right, and a plain hover keeps the two lists consistent.
- **Links and tags never wrap.** The title absorbs the squeeze.

### Library list

- **Each row is one link:** the tag above the title, plus an arrow cell.
- **Sample content:** ten rows drawn from rubrik.com resource listings.

### Filters

- **Layout:** the search field and the three filters share one row from 1024px up. On tablets, the search field takes a full-width row with the three filters in the row below. On phones, everything stacks.
- **Content type, Use cases and Workload are multi-select checkbox groups,** not single selects. Real resource libraries need several options per filter.
- **Matching:** a row passes if it matches any ticked option within a filter (OR) and every filter (AND).
- **Each filter button shows a count badge of ticked options.**
- **From 1024px up, a filter opens a popover panel** the full width of the filter bar, with three columns of options.
  - It closes on an outside click, Escape (focus returns to the button), tabbing out, or opening another filter.
  - It's a disclosure: a button plus a panel of checkboxes, not an ARIA menu or listbox.
- **Below 1024px, a filter opens a modal bottom sheet built on `<dialog>`.**
  - `<dialog>` supplies the focus trap, Escape and an inert page behind.
  - The footer has Clear and "Show N results", where N updates live.
  - Selections apply immediately; the footer button just closes the sheet.
- **A filter opened in one layout closes when the viewport crosses 1024px,** rather than swapping a popover for a modal sheet mid-use.

---

## Motion

- **Easing is smooth ease-out with no bounce.** Movement is restrained: 12px of travel for entrances, short slides for overlays.
- **Page entrance:** a staggered rise and fade, in this order: headline, subtitle, featured cards one by one, then the search bar.
- **Overlays (menu, scrim, filter sheet) run at 250ms.** Feedback found 300ms or slower "lazy".
- **Card hovers come in fast (150ms) and fade out slowly (800ms),** so the page feels relaxed rather than twitchy.
- **`prefers-reduced-motion` turns off the entrances and slides.** Content still appears; it just doesn't move.

### Cursor

- **On mouse and trackpad devices, the native cursor becomes a 16px `brand` circle that tracks the pointer exactly.** Touch devices keep native behaviour.
  - We tried an easing lag for a relaxed feel and removed it, because a cursor that trails the pointer is harder to aim, especially for people with motor impairments.
- **Over dark surfaces the circle turns `grey`.** It works out whether the background under the pointer is dark, so new dark elements need no extra setup.
- **The native cursor comes back while a modal dialog is open,** because dialogs render above everything, including the circle.

---

## Accessibility

- **One `h1` per page.** It's visually hidden ("Resources"), because the first visible heading ("Fresh off the press") comes before the hero. "Find your next insight" is an `h2`.
- **Every overlay returns focus to its trigger when it closes.**
- **Card and row links are whole-row links.** In source order, each accessible name reads title, then tag, then (on featured cards) the link text. The tag appears above the title visually, through CSS order only.
- **The result count is a live region,** so filter changes are announced.

---

## Content and assets

- **Images are hotlinked by URL and never committed.** Unsplash photos use their `images.unsplash.com` URL with a `srcset`.
- **Links, and each library item's use case and workload, are placeholders** in `src/data/resources.ts`.

---

## Anti-patterns

- Don't commit image files. Host them and reference the URL.
- Don't use the palette `grey` or `accent` for body text.
- Don't use raw pixel font sizes or Tailwind's default type scale; use the named tokens.
- Don't draw borders inside a card where a shared divider already exists.
- Don't add motion without a reduced-motion fallback.

---

## Open questions

- **Logo files:** the Rubrik logo SVGs are committed in `src/assets/`. Should they move to a hosted URL like other imagery, or are logos an exception?
- **Accent colour:** `accent` has no use yet.
- **Unchecked motion:** the motion timings haven't been watched live on a real phone.
