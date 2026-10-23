---
name: SkipQ
description: Coffee from a vending machine that waits for you; the box is reserved at payment and the phone is the key.
colors:
  coffee: "#874F38"
  coffee-100: "#F3E7E0"
  coffee-200: "#E2C6B6"
  coffee-400: "#B9826A"
  coffee-700: "#6E3E2B"
  coffee-900: "#3B2117"
  vanilla: "#F0D8BE"
  foam: "#FAF3EA"
  espresso: "#14100E"
  surface: "#FFFFFF"
  line: "#E7E1D8"
  disabled-bg: "#F4F1EC"
  gray: "#A5A9A8"
  stone: "#5E6261"
  on-dark-2: "#C9BFB4"
  ready: "#2E6B4A"
  ready-bg: "#E3F0E8"
  brewing: "#8A5A00"
  brewing-bg: "#FBEBCB"
  expired: "#A3271F"
  expired-bg: "#F7E1DE"
typography:
  wordmark:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "32px"
    fontWeight: 400
    lineHeight: 1
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "40px"
    fontWeight: 400
    lineHeight: "44px"
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "28px"
    fontWeight: 400
    lineHeight: "32px"
  heading:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "26px"
  heading-sm:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  button:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body-sm:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  caption:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
  overline:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.08em"
  numeric:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: "32px"
    fontFeature: "tnum"
  numeric-md:
    fontFamily: "DM Mono, ui-monospace, monospace"
    fontSize: "26px"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  sm: "8px"
  md: "14px"
  lg: "22px"
  xl: "28px"
  pill: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "14": "56px"
  gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.coffee}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 24px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.coffee-700}"
  button-secondary:
    backgroundColor: "{colors.coffee-100}"
    textColor: "{colors.coffee-700}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 20px"
    height: "44px"
  button-tertiary:
    textColor: "{colors.coffee}"
    typography: "{typography.button}"
    padding: "8px 8px"
    height: "44px"
  button-unlock:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.foam}"
    typography: "{typography.heading-sm}"
    rounded: "{rounded.lg}"
    padding: "8px 24px"
    height: "64px"
  button-disabled:
    backgroundColor: "{colors.disabled-bg}"
    textColor: "{colors.stone}"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
  slot-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.md}"
    padding: "4px 8px"
    height: "56px"
  slot-chip-selected:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
  slot-chip-full:
    backgroundColor: "{colors.disabled-bg}"
    textColor: "{colors.stone}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.lg}"
    padding: "16px"
  status-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.lg}"
    padding: "20px"
  plan-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.heading}"
    rounded: "{rounded.lg}"
    padding: "16px"
  plan-card-selected:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
  pack-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.lg}"
    padding: "16px 12px"
  pack-tile-selected:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
  addon-row:
    textColor: "{colors.espresso}"
    typography: "{typography.body}"
    padding: "16px 0"
  usual-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.heading-sm}"
    rounded: "{rounded.lg}"
    padding: "8px 12px 8px 8px"
  drink-row:
    textColor: "{colors.espresso}"
    typography: "{typography.heading-sm}"
    padding: "12px 32px 12px 0"
    height: "72px"
  box-tag-lg:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  status-pill-scheduled:
    backgroundColor: "{colors.coffee-100}"
    textColor: "{colors.coffee}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px 4px 8px"
    height: "28px"
  status-pill-brewing:
    backgroundColor: "{colors.brewing-bg}"
    textColor: "{colors.brewing}"
  status-pill-ready:
    backgroundColor: "{colors.ready-bg}"
    textColor: "{colors.ready}"
  status-pill-done:
    backgroundColor: "{colors.disabled-bg}"
    textColor: "{colors.stone}"
  status-pill-expired:
    backgroundColor: "{colors.expired-bg}"
    textColor: "{colors.expired}"
  segmented-track:
    backgroundColor: "{colors.coffee-100}"
    textColor: "{colors.coffee-700}"
    rounded: "{rounded.md}"
    padding: "4px"
  segmented-option-checked:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
  segmented-option-disabled:
    textColor: "{colors.stone}"
  code-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.numeric-md}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "64px"
  tab-bar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.stone}"
    typography: "{typography.caption}"
    height: "64px"
  tab-bar-active:
    textColor: "{colors.coffee}"
  bottom-dock:
    backgroundColor: "{colors.foam}"
    padding: "12px 20px 16px"
  toast:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.foam}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: "56px"
  bottom-sheet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
  demo-pill:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.foam}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    height: "32px"
  text-link:
    textColor: "{colors.coffee}"
    typography: "{typography.button}"
    height: "44px"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "52px"
  text-field-label:
    textColor: "{colors.espresso}"
    typography: "{typography.body-sm}"
  progress-segment:
    backgroundColor: "{colors.coffee-400}"
    rounded: "{rounded.pill}"
    width: "12px"
    height: "4px"
  progress-segment-on:
    backgroundColor: "{colors.coffee}"
    width: "24px"
  machine-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.stone}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "20px 16px 16px"
  stats-empty-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "20px 16px 8px"
  stat-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    typography: "{typography.numeric}"
    rounded: "{rounded.lg}"
    padding: "16px"
  week-bars:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.stone}"
    typography: "{typography.caption}"
    rounded: "{rounded.lg}"
    padding: "16px"
  week-bar:
    backgroundColor: "{colors.coffee-400}"
    width: "40px"
    height: "96px"
  week-bar-current:
    backgroundColor: "{colors.coffee}"
  board-row:
    textColor: "{colors.espresso}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "48px"
  board-row-hover:
    backgroundColor: "{colors.coffee-100}"
  board-row-mine:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
  board-you-badge:
    backgroundColor: "{colors.coffee}"
    textColor: "{colors.surface}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "1px 7px"
  gift-ticket:
    backgroundColor: "{colors.vanilla}"
    textColor: "{colors.coffee-900}"
    rounded: "{rounded.lg}"
    padding: "20px"
  gift-ticket-action:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.coffee-700}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "44px"
  gift-row:
    textColor: "{colors.espresso}"
    padding: "12px 0"
  coming-soon-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: SkipQ

## Overview

**Creative North Star: "The Box Is the Promise"**

SkipQ is a warm, plain-spoken phone app for a coffee locker. The whole system exists to answer two questions at a glance: which door holds your coffee, and until when. The ground is Foam, a café-paper off-white; content sits on white Surface cards edged with a 1 px Line border; actions are Coffee; anything that is *yours* (your chosen chip, your slot, your box, your board row, your gift ticket) turns Vanilla. Espresso is reserved for the machine itself and for the tester's instruments: the locker frame, the Unlock button, toasts, the Demo pill and Demo panel.

Density is phone-native and calm: one column inside a 20 px gutter, 24 px between blocks, cards that hold one thing each. Three families split the work cleanly. Instrument Serif speaks in greetings, titles and the ready moment. DM Sans runs the interface. DM Mono carries every number a student has to read against a clock: times, box numbers, codes, counters, prices. Icons are drawn line icons (24 px grid, 1.75 stroke, round caps), never glyphs or emoji.

The world refuses the coffee-app defaults it was briefed against: no product-photo menu, no loyalty-card gamification, no fake urgency. Limits are honest and neutral, so nothing about a limit is ever red.

**Key Characteristics:**
- Foam ground, white bordered cards, Coffee actions, Vanilla for "yours", Espresso for the machine and the demo tooling.
- The locker plate: the box number is always a Vanilla door plate with a mono numeral.
- The machine is always drawn as an Espresso frame of 6 x 5 doors with handles, at full size or as a 30-door strip.
- Serif only at 24 px and above, for greetings, titles and the ready moment.
- Status is always icon plus word plus colour.
- Mostly flat; a shadow means "floating" or "this one is live".

## Colors

A warm coffee-house palette, one brand hue in six steps plus a cream accent, over warm neutrals, with three status pairs that each come as text-on-tint.

### Primary
- **Roasted Coffee** (coffee): primary actions, the active tab, links, the "used" allowance pips, a switch that is on, the selected-radio fill, the current week's bar, the board's "you" badge and podium ranks (1 to 3), the 16 px stat-tile icons, the onboarding wordmark, and the done and current segments of the onboarding progress track. Hover and pressed states step down to **Dark Roast** (coffee-700), which is also the text colour on tonal Coffee fills.
- **Steamed Milk** (coffee-100): tonal fills. The secondary button, the segmented track, the active-tab icon lozenge, badges, the focus halo, the hover on board rows (and at 50 % on gift-list rows), the icon square on the Apple Health tile, and the desktop stage behind the phone.
- **Latte** (coffee-200): boxes in use on the locker and strip, empty allowance pip outlines, the scrollbar thumb.
- **Caramel Line** (coffee-400): meter accents, the past weeks' bars in the week chart, the next-step segment of the onboarding progress track (Latte nearly vanishes on Foam), and the hover border on chips, slots, plan cards and the Apple Health tile.
- **Bean** (coffee-900): text on Vanilla. It replaces Stone wherever the background is Vanilla.

### Secondary
- **Vanilla Plate** (vanilla): the colour of ownership. Selected chips, selected slots, a selected plan, your door on the locker and strip, the box plate, your row on the board, the gift ticket, text selection, and the Undo action and timer on the Espresso toast.

### Neutral
- **Foam** (foam): the app ground behind every screen. It is also the text colour on Espresso.
- **Espresso** (espresso): primary text and icons, the locker frame, the Unlock button, toasts, the Demo pill, the dark Demo sheet, and the 10 px desktop phone bezel. Derived in code: Espresso Raised (Espresso 88 % mixed with Foam) for hover on dark, and a 44 % Espresso scrim.
- **Surface** (surface): cards, sheets, inputs, the tab bar, free boxes, and the Copy and Share buttons sitting on the Vanilla ticket.
- **Line** (line): every 1 px border and divider, plus the sheet handle. On dark, the equivalent is Foam at 16 %.
- **Spent Cup** (disabled-bg): full slots, disabled buttons and chips, the picked-up status tint.
- **Pewter** (gray): disabled icons and the inactive switch track. Never text.
- **Stone** (stone): secondary text, dates, captions, inactive tabs. Never on Vanilla.
- **Crema Grey** (on-dark-2): secondary text on Espresso.

### Status (text / tint pairs)
- **Ready** (ready on ready-bg): green, collected-now.
- **Brewing** (brewing on brewing-bg): amber. It doubles as the "only a few left" warning on slots and on the box meter.
- **Expired** (expired on expired-bg): red, reserved for a missed pickup and for invalid input such as a bad gift code.
- **Scheduled** reuses Coffee on Steamed Milk. **Picked up** reuses Stone on Spent Cup.

### Named Rules
**The Tokens-Only Rule.** Every colour comes from `tokens.css`. App-level derivatives in `base.css` are `color-mix()` of tokens, never a new hex. The client's hand-off file is binding.

**The Vanilla Means Yours Rule.** Vanilla marks the user's own selection or possession and nothing else. If an element isn't the user's choice, box, row or gift, it isn't Vanilla.

**The Never-Red Limit Rule.** Allowances, credits, and "few boxes left" read neutral or amber. Red is for an expired order or an input error, never for a limit.

**The One Coffee Fill Rule.** There is one Coffee-filled primary button per screen. The Espresso 64 px Unlock button is the only exception.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif)
**Body Font:** DM Sans (with system-ui, sans-serif)
**Label/Mono Font:** DM Mono (with ui-monospace, monospace), tabular figures

**Character:** A narrow, slightly theatrical editorial serif for the human moments, set against a friendly geometric sans that does the work. Mono numerals make times and box numbers read like a ticket.

### Hierarchy
- **Wordmark** (italic 400, 32 px, line-height 1): the "SkipQ" mark, used on the desktop aside and, in Coffee, at the top left of the first onboarding step.
- **Display** (400, 40/44, -0.01em, balanced): the Home greeting ("Morning, Frederika.") and the onboarding welcome ("Coffee without the queue.", "Káva bez fronty."). One per screen.
- **Title** (400, 28/32): screen titles (on Me, the user's name or, without one, the nickname; the onboarding payment step's "How will you pay?"), bottom-sheet titles, the ready line on the order card, and text values in stat tiles (the Favourite drink).
- **Heading** (DM Sans 600, 20/26): section titles ("On its way", "This month", "Plan"), drink names on the order card, plan names, and the visible option headings on the order screen ("Milk", "Beans", "Pickup time", "Pay with").
- **Heading Small** (DM Sans 600, 18/24): drink names on usual cards and menu rows, and the Unlock label.
- **Body** (400, 16/24): default text and tile values such as "2 of 3 used" (set at 600).
- **Button** (600, 16/24): all button labels and the toast action.
- **Body Small** (400, 14/20): secondary lines, dates, hints, sheet subtitles, chip labels (at 500), and text-field labels (at 600).
- **Caption** (500, 12/16): tab labels, pill text (at 600), badges, legends, stat-tile labels (beside a 16 px Coffee icon), and the week chart's title and axis labels (at 400; the current week at 600 Espresso).
- **Overline** (600, 12/16, +0.08em, uppercase): the label naming a data tile ("Today", "Boxes at Rajská") and the group titles inside the Demo panel. Nowhere else.
- **Numeric** (DM Mono 500, 28/32, tabular): big counters, stat values, the Demo clock, the pickup countdown. The `.sq-mono` utility sets DM Mono with tabular figures on any inline number.
- **Numeric Medium** (DM Mono 500, 26 px, tabular): the gift-code input and plan prices.

Lettering drawn on the machine is object detail, not a step of the ramp: the 9 px numerals on mini locker doors and the 10–11 px "BOX" word on small and medium plates belong to the drawn object and never set interface text.

Mono is for figures a student reads against a clock or a count, never decoration. Names stay in the text faces: on Me the first name is serif Title and the nickname sits under it in DM Sans 14 px Stone; without a first name, the nickname itself is the serif Title and nothing repeats under it. On the board, nicknames are Body at 500.

A label reused inside a sentence is lower-cased at its first letter ("Your plan: Milk plan, up to 3 a day", "Až 3 denně" becoming "až 3 denně"); on its own, as a segment, chip or card line, it keeps sentence case.

Headings follow the document outline, not the type ramp. Each screen has one h1 (Display or Title); every section and tile title under it is an h2, whatever style it wears: visible chip group labels, the Slot Grid title, the payment heading, the Daily Limit and Box Meter tile titles (in Overline), and the Me and Plans section Headings. No level is skipped. Where a section needs a title it does not show (the plan choices on the onboarding payment step), the h2 is for screen readers only.

### Named Rules
**The Serif Floor Rule.** Instrument Serif never goes below 24 px. It's for greetings, titles and the ready moment, never for UI labels.

**The Struck Means Full Rule.** Strike-through means one thing: a Full slot. Nothing else is struck through, including disabled segments and locked options, which mute to Stone instead.

**The Mono Numbers Rule.** Times, box numbers, codes, counters, ml/mg values and prices go in DM Mono with tabular figures. Units beside them stay in DM Sans (the Amount helper sets the unit at 0.62 em, with a 12 px minimum).

**The Thin Space Rule.** Thousands are grouped with a thin space glued by word joiners (U+2060 U+2009 U+2060), so a number reads "1 199 Kč" or "2 990 mg" everywhere, in both languages, and never "1199". U+202F is not used, because DM Sans draws it almost invisibly. Haléře appear only in per-coffee comparisons ("26.90 Kč", "26,90 Kč"), ungrouped.

**The Bound Phrase Rule.** A no-break space keeps together what must never split at a line end: a price with its unit ("229 Kč / week"), a tier label ("Up to 3 a day", "Až 3 denně"), a count with its noun ("7 credits left"), a brand name ("Red Bull"), and every em dash with the word before it. In Czech, the one-letter prepositions and conjunctions (a, i, k, o, s, u, v, z) bind to the next word with a no-break space ("v Rajské", "a balíčky"). Ranges are glued with word joiners around the en dash (U+2060 – U+2060), so "3–16", "a–z" and "0–9" never break, in both languages. The middle dot binds to what follows: every " · " in both dictionaries and every dot that code puts between parts is `DOT_SEP` (a space, the dot, then a no-break space), so a wrapped pair starts its new line with "·" and a line never ends on a dangling dot.

## Layout

The app is mobile-first. Below 600 px it fills the viewport (100dvh), with a scrolling screen above a fixed 64 px tab bar that is padded for the bottom safe area. From 600 px, it renders inside a centred 390 x 844 phone (capped at the viewport height minus 2 x 24 px, minimum 560 px), with 48 px rounded corners, a 10 px Espresso bezel and the large shadow, on a Steamed Milk stage. From 1040 px, a 260 px aside with the wordmark and notes sits to the left of the phone across a 56 px column gap.

Screens are a single grid column. The top padding is the safe area plus 32 px, the gutter is 20 px left and right, blocks are 24 px apart, and there is 56 px at the bottom so the Demo pill clears the content. Data tiles pair up in a two-column grid with a 12 px gap. Stacks inside a block use 12 px. Spacing sits on a 4 px base (4, 8, 12, 16, 20, 24, 32, 40, 56).

Touch targets are at least 44 x 44. Primary buttons are 52 px tall, slots 56 px, and the Unlock button and code input 64 px. Key actions sit in the bottom third. Nothing has a fixed width, because Czech runs about 25 % longer: chips wrap, and tab labels step down to 11 px in narrow containers rather than truncate.

A docked bottom action (the order button, Unlock) sits in a Foam bar at the bottom of the screen, directly on the tab bar, even when the content is short; the screen becomes a flex column and the bar takes the remaining space above it. The bar spans the full width with the 20 px gutter inside, separates from the content with a 1 px Line hairline rather than a shadow, and keeps a 44 px lane above its button where the Demo pill sits, so the pill never covers content. Docked screens drop the 56 px bottom padding.

Onboarding (/welcome) has no tab bar. The shell sets the tab-bar height to 0 px on that route, so the docked commit sits on the bottom edge (above the safe area) and the Demo pill and toasts measure from there; every other rule of the dock holds.

Screens reached from another screen open with a header row: a 44 px filled back button on the left and an optional trailing control on the right (an info button, or the md status pill). The row pulls 16 px into the top padding.

Layering uses named z-levels: tab bar 10, Demo pill 20, sheet 40, toast 50, push banner 60. There is one push banner and one toast slot at a time, and the toast floats above any dock.

**The Docked Action Rule.** A screen's committing action docks at the bottom, on the tab bar (or the bottom edge where there is none), inside the bottom third. Short content never lifts it into the middle of the screen.

## Elevation & Depth

The system is flat by default. Depth comes from a Foam ground under white Surface cards with a 1 px Line border, so most cards carry no shadow. There are two shadows, both tinted Espresso.

### Shadow Vocabulary
- **Lift** (e1): the live order card on Home, the ready card on the order status screen, the Unlock button, the checked segment of a segmented control, and the Demo pill. It means "this one is current" or "this sits on top".
- **Float** (e2): bottom sheets, toasts, the push banner, and the desktop phone. It is for things that float above the screen.
- **Focus ring** (`--sq-focus`, a 2 px Coffee ring plus a 4 px Steamed Milk halo outside it): every focusable element. It is drawn as a box-shadow, with a transparent 2 px outline so it stays visible in forced-colours mode.

### Named Rules
**The Flat-Card Rule.** Cards are flat, with a Surface fill and a Line border. Only the one live order card on a screen gets Lift. Stat tiles, the week chart, the Apple Health tile, board rows and the gift ticket carry no shadow.

## Shapes

Corners are soft and graded by scale: 8 px for small plates, badges and toast actions; 14 px for buttons, slots, inputs, segmented tracks and toasts; 22 px for cards, tiles and the Unlock button; 28 px for the top corners of bottom sheets; pill for chips, status pills, icon buttons, the tab lozenge and the Demo pill. A segment inside a track takes the track radius minus its 4 px inset.

Borders are 1 px Line, or 1.5 px on inputs. A selected card or slot adds a 1 px inset Coffee ring on top of its Coffee border, which makes 2 px of Coffee.

The machine has its own small geometry because it draws a physical object. The locker frame is 14 px, or 8 px when mini. Doors are 5 px (3 px mini) with an aspect ratio of 1 : 1.08, and each door has a slim vertical handle on its right edge. The 30-door strip is a 5 px rail of 1.5 px doors. Allowance pips are cup-shaped (4 px corners at the top, 9 px at the bottom). The push banner's app icon is a 10 px tile around a 4 px door. These 1.5–10 px radii on drawn objects (doors, pips, meter, app icon), like the 48 px corners of the desktop phone frame, are object detail and not steps of the radius scale. Timeline dots and the opened-box mark are full circles. The week chart's bars reuse the pip's cup (4 px top corners, 9 px bottom) and stand on a 1 px Line baseline.

The gift ticket carries the system's only dashed line: a 1.5 px dashed perforation in Coffee at 35 % under its header, which follows the header down when the drink line wraps.

**The One Perforation Rule.** Dashed means "tear here". The gift ticket's perforation is the only dashed line; dividers, empty states and drop zones stay solid 1 px Line.

## Components

### Buttons
Tactile and plain. They shrink to 0.98 when pressed, and colour changes take 150 ms.
- **Shape:** gently rounded (14 px). Unlock is rounder (22 px).
- **Primary:** Coffee fill with white text, 52 px tall, 24 px horizontal padding. Hover darkens to Dark Roast. While loading it holds Dark Roast and shows the Spinner.
- **Secondary:** tonal. Steamed Milk fill with Dark Roast text, 44 px tall. It sits beside a primary without competing.
- **Tertiary:** a Coffee link that is a button. 1 px underline, thickening to 2 px on hover. Standing alone at the start of a column (Cancel plan), it pulls 8 px left so its text sits flush with the gutter while the 44 px hit area stays. It is for actions that change something; moving somewhere uses the text link.
- **Unlock:** the one Espresso button. 64 px tall, Foam text at 18 px (Heading Small), with Lift. Hover goes to Espresso Raised.
- **Icon:** a 44 px circle with its label in `aria-label`. Comes in plain (Steamed Milk on hover), filled (Steamed Milk), and on-dark variants.
- **Disabled:** Spent Cup fill, Stone text, no shadow.

### Chips
- **Style:** pill-shaped, 44 px tall, Surface fill with a Line border, Body Small at 500. Hover changes the border to Caramel Line.
- **Selected:** Vanilla fill, Coffee border, Bean text. An optional count badge switches from Steamed Milk to Surface.
- **Locked / Disabled:** Stone text. Disabled also uses a Spent Cup fill and border.
- **Group heading:** a chip group can print its label as a visible Heading above the chips (the order screen's option groups); otherwise the label is for screen readers only.
- **Pickup chip:** on Home, a chip with a clock icon ("Pickup: Now") sets the pickup time for the usuals and opens the pickup sheet.

### Slot Chip and Slot Grid
- A 56 px rounded-rectangle (14 px) with the time in mono 16/20 over a caption sub-line, laid out in a grid.
- **Few boxes left (3 or fewer):** the sub-line turns amber at 600. Never red.
- **Selected:** Vanilla with a 2 px Coffee edge.
- **Full:** stays in the grid, filled Spent Cup, the time struck through, not selectable. This is the only strike-through in the system.
- Inside a sheet whose title already names it (the pickup sheet), the grid drops its own title.
- **Machine full:** Now stays the pickup, struck through as Full, and the docked primary gives way to a Secondary "All boxes taken — next free slot 10:30" that selects that slot when pressed. Only when the machine is closed does the screen pick the first open slot by itself.

### Cards / Containers
- **Corner Style:** 22 px.
- **Background:** Surface on Foam. Selected plan cards and pack tiles turn Vanilla.
- **Shadow Strategy:** flat. Only the live order card takes Lift (see Elevation & Depth).
- **Border:** 1 px Line. Hover on interactive cards changes it to Caramel Line. A ready order card blends 30 % Ready into its border.
- **Internal Padding:** 16 px, or 16 / 16 / 16 / 20 on the order card.
- **Ready order card:** when the order is ready, the card names the box in serif Title on the reward curve, and the drink steps down to Body at 600.

### Usual Card and Drink Row
- **Usual card:** a 22 px Surface card holding the drink as a pressable 14 px inner area (Steamed Milk at 55 % on hover, a Stone chevron) and a compact Secondary "Order · Now" button for the one-tap order. Name in Heading Small, the milk summary in Body Small Espresso, and "Ordered 23×" in caption Stone. One-tap is tonal, so Home keeps no Coffee fill.
- **Drink row:** menu rows at least 72 px tall in a list with Line dividers (a Line top border on the list, a Line bottom border on each row). The name is Heading Small and turns Coffee on hover, with the type in caption Stone beside it. Size and caffeine share one meta line in Body Small Stone, and strength sits on its own line, so every row keeps the same rhythm in both languages. An optional caption note is in Coffee, and an info icon button sits at the end.
- **Strength dots:** five 7 px dots, Coffee when on and a Latte ring when off. Beside a caffeine figure they carry the visible word "Strength", so they never read as a caffeine rating.

### Order Status
- **Plate card:** from Scheduled onwards, the box shows as the large Vanilla plate beside a right-aligned Body Small Stone hold line, over the mini locker map (at most 220 px wide, centred). The card is a 22 px Surface card with 20 px padding and 16 px gaps. While brewing, an Espresso Body Small line gives the minutes left.
- **Ready card:** the same card with Lift and a border blended 30 % Ready. It adds the hold time and a mono Numeric countdown ("12:54 left"), and an optional Secondary "Extend" button. The screen title moves up to Display on the reward curve.
- **Timeline:** a Surface card of three 52 px steps (brewing starts, ready in box N, held until), divided by Line. Each step has a 12 px dot, a Latte ring until reached and filled Coffee after, the label in Body, and the time in mono 16 at 500.
- **Opened moment:** a 64 px Ready-tint circle with a Ready check beside the large plate, arriving on the reward curve.

**The Reserved at Payment Rule.** The box is reserved at payment, so from Scheduled onwards the status screen shows it as the Vanilla plate plus the mini locker map. A box number never waits for Ready to appear.

### Inputs / Fields
- **Code input:** 64 px tall, Surface fill, 1.5 px Line border, 14 px corners. The text is DM Mono at 26 px, uppercase, +0.1em, auto-formatted to `SKQ-XXXX`.
- **Focus:** the border turns Coffee, with a 4 px Steamed Milk halo.
- **Complete:** a Ready border and a Ready check mark.
- **Invalid:** an Expired border, a 4 px Expired-tint halo, and an inline error with an icon in Expired. Every message names a next step ("Check the letters?", "Ask the sender for a new one.").
- **Text field:** 52 px tall, Surface fill, 1.5 px Line border, 14 px corners, Body text, a Stone placeholder; focus turns the border Coffee with the 4 px Steamed Milk halo. The gift recipient's name is labelled by a visible Heading with a Body Small Stone hint below.
- **TextField (component):** the labelled field with message states, built on the Code input's anatomy. The label sits above in Body Small at 600, 8 px between label, field and message. It has no placeholder: the hint under the field carries the rules, so they stay visible while you type. Its message line is one of three, in Body Small:
  - **Hint:** Stone, at rest ("It's all the board shows of you. 3–16 characters: a–z, 0–9 and _.").
  - **Error:** an Expired border with the 4 px Expired-tint halo (focused or not), and an 18 px Expired icon plus words in Expired, announced as an alert. An optional action slot under the message holds a one-tap fix, a Tertiary "Use espresso_eva_2", pulled 8 px left so its text lines up with the message.
  - **Success:** a Ready border, a Ready check inside the field at its end, and a Ready line ("crema_new is available.").
- **Feedback timing:** success shows as soon as the value is valid; problems wait for a blur or a submit, then update as you type.
**The Named Fix Rule.** Every input error names its fix ("Add a number or pick another.", "Use _ instead.", "Check the letters?"); when a valid value is close, the fix is offered as a one-tap Tertiary "Use …" under the message.

- **Switch:** a 52 x 32 track inside a 44 px target, with a 28 px white thumb. Pewter when off, Coffee when on. Uses `role="switch"`.
- **Segmented:** a Steamed Milk track with a 4 px inset. The checked option is Surface with Lift. Unavailable options are muted to Stone with no strike-through, because strike-through means Full. Each reason is listed below the control: the option name in Espresso 600, a middle dot, then the neutral reason in Body Small Stone. A dark variant for the Demo panel uses Espresso Raised, with a Foam checked option.

### Navigation
- **Tab bar:** five equal columns, 64 px tall, Surface with a Line top border. Inactive tabs are a Stone icon with a caption label. The active tab is Coffee, with a 48 x 30 Steamed Milk lozenge behind the icon and the label at 600. Focus is shown as an inset ring.

### Status Pill
- A pill with icon plus word plus colour, in sm (28 px) and md (34 px) sizes, using the status text/tint pairs. The Brewing icon drifts 1 px like steam on an 1.8 s loop, which stops under reduced motion.
- **Gift statuses** use the sm pill: Pending is the Scheduled pair with an hourglass ("Pending · expires in 1 day"), Redeemed the Ready pair, Returned the Picked-up pair with a return arrow.

### Locker Plate (BoxTag), the signature
- The box number is always set as a Vanilla door plate: a 1 px inset Coffee hairline at 22 %, Bean text, an uppercase DM Sans "BOX" word (+0.06em), and a mono numeral. Comes in three sizes: sm (8 px corners), md, and lg (14 px corners, 36 px numeral) for the live order card.

### Locker Grid and Box Meter, the machine
- **Locker grid:** an Espresso frame around 6 x 5 doors. Free doors are Surface with Stone numbers, doors in use are Latte, and your door is Vanilla with a 2 px Coffee inset and a Vanilla outer ring. Your door settles in from 0.86 scale on the reward curve. A legend sits below in caption Stone.
- **Box meter:** a data tile with an overline label, a mono count ("12 of 30 free"), and a 20 px Espresso rail of 30 doors in the same colours. Your door is Vanilla and slightly taller. When few doors are free, the count goes amber.

### Daily Limit
- A data tile with one cup-shaped pip per coffee in the allowance: Coffee when used, a Latte outline when left. Below that is a neutral "2 of 3 used" line. It never turns red. A banner variant puts the pips and the counter on one line.

### Plans: Plan Card, Add-on Row and Pack Tile
- **Plans screen:** a Title, then a Body Stone summary line naming the plan, tier and weekly price (or the per-coffee price, or the pack credits, when there is no plan). With a plan, the Today allowance banner follows. Three sections (Weekly plan, Add-ons, Packs) each open with a Heading, with an optional Body Small Stone note 4 px below; a section stacks at 12 px.
- **Plan picker:** a tier Segmented ("1 a day" / "Up to 3 a day"), then the Milk and Black plan cards 12 px apart, then the screen's one Coffee primary ("Subscribe · 229 Kč / week", "Switch · …", or disabled "This is your plan"), a Body Small Stone note, and a flush Tertiary "Cancel plan". Cancelling is instant and offers Undo on the toast.
- **Plan card:** a full-width pressable 22 px card with 16 px padding. The head row holds the name in Heading, which wraps when long (Czech), with an optional "Your plan" badge (caption on a Steamed Milk pill, Dark Roast text) that never breaks, and a 24 px radio that always stays top-right: a 1.5 px Latte ring when empty, a Coffee disc with a white check when selected. Below are "Up to 3 a day · All drinks" in Body Small Stone and the price in Numeric Medium with a Stone "/ week". Selected: Vanilla fill, Coffee border plus a 1 px inset Coffee ring, Bean secondary text, and a Surface badge.
- **Add-on row:** a list row with Line dividers (a Line top border on the list, a Line bottom border on each row) and 16 px vertical padding. The name is Body at 600, the description Body Small Stone, and the price a mono 14 px Espresso amount at 500 followed by a caption Stone "/ month". The Switch sits at the end, labelled by the name and described by the description. Switching on goes through the checkout sheet; switching off is instant, confirmed by a toast.
- **Pack tile:** three tiles across with an 8 px gap. A pressable 22 px tile with 16 / 12 padding: the count in DM Mono 500 at 32/36, the unit word in Body Small Stone, the price in mono 16/20 at 500 (never wrapping) 12 px lower, and the per-coffee price in caption Stone. Selected is the same as a plan card. Below the grid, a block Secondary "Buy 30 coffees · 749 Kč" buys the chosen pack, because the screen's one Coffee fill belongs to the plan picker.
- **Credits line:** when credits remain, a Body Small Espresso line at 600 under the Packs note, with the count in mono ("7 credits left"). It is Espresso, not Coffee, because it reports status and is not a link.

### Toast and Bottom Sheet
- **Toast:** Espresso, 14 px corners, Float shadow, rising in on the reward curve. An optional Vanilla undo-style action (Undo for a one-tap order, Undo to restore a cancelled plan), offered for 5 s, with a 3 px Vanilla bar that drains linearly across those 5 s. A toast without an action clears after 3 s. It sits 12 px above the tab bar, or above the dock when one is present.
- **Bottom sheet:** Surface, with 28 px top corners, a Float shadow, and a 44 % Espresso scrim. It slides up at the base speed. A 36 x 5 Line handle sits at the top, the title is set in serif Title, and the footer has a Line top border. The Demo panel uses the dark Espresso variant.
- **Checkout sheet:** line items as label and value rows in Body, the label in Stone and the value at 500 right-aligned, divided by Line. The total row has an Espresso 600 label and a 20 px amount. The footer holds the Coffee "Pay N Kč · simulated" button with a centred caption Stone note under it. Payment is simulated with a one-second Spinner and never asks for card data.

### Demo Pill and Demo Panel
- Tester tooling is Espresso so it reads as an instrument, not as part of the product. The pill sits bottom-left above the tab bar: 32 px tall, with a 44 px hit area, 92 % opacity, the word "DEMO" in bold (+0.1em), and the mono clock. A Vanilla fast-forward badge appears while time is fast-forwarding. When a dock mounts, the pill moves into the dock's 44 px lane: one transition carries its bottom offset at the base speed and its opacity at the quick speed. With no tab bar (onboarding), it measures from the bottom edge.

### Push Banner
- A simulated OS notification. It drops in from the top, with Surface at 94 % behind a 16 px backdrop blur, 22 px corners, a Line border and Float. The app mark is a Vanilla locker door on a Coffee tile.
- A gift nobody redeemed fires the same banner (the "giftReturned" notice: the coffee is back as one credit) and opens the Gift tab.

### Text Link
- The one navigation idiom: Coffee, DM Sans 600 (the Button style), no underline until hover (then underlined, offset 0.22 em), at least 44 px tall, sitting flush at the start of its column with a trailing 18 px chevron and a 4 px gap. The chevron says what happens: › opens another screen ("Your stats ›", "Manage plan ›"), ⌄ shows more in place ("Show all 46 ⌄").

**The Chevron Link Rule.** Going somewhere is a text link with a trailing chevron; changing something is a button. The Tertiary button never navigates, and a text link never commits.

### Stat Tile and Week Bars
- **Stat tile:** a flat 22 px Surface card with a Line border and 16 px padding, paired two across at a 12 px gap (Me shows a 2 x 2 under the "This month" Heading). The label is caption Stone led by a 16 px Coffee line icon; the value is Numeric with its unit in Sans (Mono Numbers), or serif Title when the value is a word (the Favourite drink, with a star icon); an optional Body Small Stone line explains it ("12th on the board", "That's about 37 cans of Red Bull.", "weekdays in a row"). Board places are ordinals: "12th" in English, "12." in Czech.
- **Before the first pickup:** there is nothing to count, so the "This month" Heading sits over one flat 22 px Surface card with a Line border (20 / 16 / 8 padding, 8 px gap) instead of the tiles and the week bars: a Body sentence that names what will appear ("Your stats start with your first pickup: coffees, caffeine, your favourite and your streak.") and a "Browse all drinks ›" text link to the menu. Never a grid of zeros.
- **Week bars:** coffees per calendar week (Monday first) for the last four weeks, oldest on the left, in a flat 22 px Surface card with 16 px padding. It is one series, so there is no legend: a caption Stone title names it ("Last 4 weeks") and each bar carries its value above it in mono 14 px at 500 Espresso. Bars sit in four equal columns 12 px apart, at most 40 px wide in a 96 px plot, in Caramel Line with the pip's cup corners, standing on a 1 px Line baseline; heights grow at the base speed. The current week is full Coffee and its axis label is a word ("This week", "Tento týden") at 600 Espresso instead of a date, so it is never marked by colour alone. Past weeks are labelled by their Monday in caption Stone.

### Board Row
- **Board:** a monthly ranking by nickname only. Under the Title, the month in Body Stone, then a Coffees / Caffeine Segmented, then the top ten as rows 2 px apart directly on Foam (no card). When you are outside the top ten, a Stone "···" gap (+0.2em, 24 px inset) separates your row pinned below. A Body Small Stone line gives your month's caffeine (the figure in DM Mono, per the Mono Numbers Rule), followed by one equivalent in Espresso at 500 (Red Bull cans, cups of black tea, espressos) that changes every 6 s with a fade at the base speed, announced politely. A "Your stats ›" text link closes the screen.
- **Row:** at least 48 px, 14 px corners, 8 / 12 padding, three columns: the rank right-aligned in a 32 px mono 14 px Stone column (Coffee at 500 for ranks 1 to 3), the nickname in Body at 500, and the value in mono at 500 with its unit in Sans on the caffeine board.
- **Your row:** Vanilla with Bean text and rank, a "you" badge (caption on a Coffee pill, white text), and a Bean chevron; it opens your stats. Hover blends Vanilla 80 % with Latte. Pressable rows otherwise hover Steamed Milk.

### Gift Ticket
- **Ticket:** the gift is a Vanilla ticket with 22 px corners, 20 px padding, 12 px gaps, no border and no shadow; text is Bean. The header holds a 20 px gift icon, the drink and its configuration ("Cappuccino · Cow's milk") in Body at 600, and the sm gift status pill, wrapping as needed, and ends in the dashed perforation (see Shapes). Below it, the code in DM Mono 500 at 40/48, +0.06em, in Espresso. While the gift is pending, a Body Small line states who it is for and the real expiry date ("For Ondra · Expires Fri 23 Oct. Not redeemed? It comes back to you."); once redeemed or returned, the line is left out. Copy and Share are compact Secondary buttons (44 px, 16 px inset, 20 px icons) filled Surface on the Vanilla, hovering to Foam; Copy reads "Copied" for 2 s.
- **Row variant:** for the "Your gifts" list, a row with a Line bottom border on a list with a Line top border, 12 px vertical padding: the code in mono 17 px at 500 (+0.04em) over the drink in Body Small Stone, with the status pill right-aligned. The whole row opens the ticket and hovers Steamed Milk at 50 %.
- **Gift flow:** the Gift tab is a Title over a Send / Redeem Segmented. Send states the policy in a Body Small Stone note ("Valid for 5 days. Not redeemed? The coffee comes back to you."), offers the screen's Coffee primary, and lists your gifts. Giving is pick a drink (menu rows), then configure, name the recipient and pay, with the commit docked; the code screen follows (Title, lead, ticket, a block Secondary "Done"). Redeem is the code input with a block primary disabled until the code is complete. Redeeming picks a slot from the Slot Grid and docks "Redeem · 10:15"; the result is a normal order, so its box plate shows from the moment it is placed (Reserved at Payment).

### Coming Soon Tile
- A pressable flat 22 px Surface card with a solid 1 px Line border (Caramel Line on hover), 16 px padding: a 40 px Steamed Milk square with a Coffee icon, the title in Body at 600 beside a caption "Coming soon" badge (the Steamed Milk badge style: Steamed Milk pill, Dark Roast text, like "Your plan"), a Body Small Stone description, and a Stone chevron. It opens a sheet that explains the feature and offers a disabled primary "Notify me when it’s ready".
- The heart icon belongs to Apple Health alone. "Apple Health" is a brand and stays untranslated in Czech, where the app itself is "Zdraví".

### Onboarding
First launch, at /welcome: a nickname, then how to pay, then Home. Nothing is saved until the last step.
- **Shell:** no tab bar (see Layout). Both steps are docked screens: a full-height column with no bottom padding and one docked Coffee commit. The step body enters with a 12 px slide from the right and a fade at the base speed.
- **Step header:** a 44 px row. On the left, the Coffee wordmark on step 1, or the filled Back icon button on step 2. On the right, the progress track: one 4 px tall pill segment per step, 4 px apart. Done and current steps are 24 px long in Coffee; the next is 12 px in Caramel Line, so length carries the state as well as colour, with "Step n of 2" for screen readers only. On a step change, focus moves to the new step's h1.
- **Step 1, the nickname:** a Display title and a Body Stone lead (at most 34 ch). Then the machine as proof: a flat 22 px Surface card with a Line border (20 / 16 / 16 padding) holding the live, full-size Locker Grid without its legend, capped at 264 px wide and hidden from screen readers, over a centred Body Small Stone caption with the free count in DM Mono 500 Espresso ("13 of 30 boxes free right now"). Then the nickname TextField and a docked "Continue".
- **Nickname:** 3–16 characters of a–z, 0–9 and _, lowercased as typed; a name already on the board is refused. The one-tap fix drops accents, turns spaces, dots and dashes into _, cuts to 16, or appends _2 when the name is taken. A failed Continue focuses the input without scrolling, then scrolls the form to the nearest edge; the form keeps a bottom scroll margin of the dock height plus 16 px, so the message and its fix land above the dock.
- **Step 2, how to pay:** a Title and a Body Stone lead, then the tier Segmented ("1 a day" / "Up to 3 a day") over one group of three Plan Cards 12 px apart: Milk plan, Black plan, and Pay per coffee ("No commitment · Any drink", the per-coffee price "/ coffee"). The docked commit is "Subscribe · 229 Kč / week", which opens the Checkout sheet, or "Continue without a plan". Both end on Home with a toast ("Milk plan is on — up to 3 a day.", or "You're in, {name}. Pick your first coffee.").

**The Progress Is Not a Pip Rule.** Steps are thin pill segments, never the cup pip. The cup shape belongs to the allowance, so filling steps never reads as coffees used up.

## Do's and Don'ts

### Do:
- **Do** take every colour, size, radius and duration from `tokens.css`. Derive new values only by `color-mix()` of tokens.
- **Do** set every box number as the Vanilla locker plate with a mono numeral.
- **Do** draw the machine as an Espresso frame of handled doors (6 x 5, or the 30-door strip), with your door in Vanilla.
- **Do** keep one Coffee-filled primary per screen. Use the Espresso 64 px Unlock as the only exception.
- **Do** show status as icon plus word plus colour, using the status text/tint pairs.
- **Do** use the motion tokens: 150 ms ease-out for state changes, 240 ms base for sheets and fills, and 420 ms reward (with overshoot) only for arrivals such as unlock, order placed, your box settling, and toasts. Reduced motion collapses all three to 150 ms.
- **Do** dock a screen's committing action (order, unlock) at the bottom on the tab bar, with the Demo pill lane above it, and float the toast above the dock.
- **Do** show the box as the Vanilla plate plus the mini locker map from Scheduled onwards.
- **Do** keep touch targets at 44 px or more (52 for primary, 64 for unlock), and let labels wrap or step down instead of fixing widths.
- **Do** group thousands with the glued thin space ("1 199 Kč"), and bind prices to units, tier labels, counts to nouns, brand names, and em dashes to the word before them with no-break spaces; in Czech, bind one-letter prepositions to the next word, and glue ranges ("3–16") with word joiners around the en dash.
- **Do** join parts with `DOT_SEP` (" ·" plus a no-break space), so a wrapped line starts with the dot.
- **Do** navigate with the Coffee text link and its chevron (› for another screen, ⌄ for more in place), and keep the Tertiary button for actions that change something.
- **Do** mark the current item in a chart with a word as well as a colour ("This week" in Espresso 600 under the full Coffee bar).
- **Do** name the fix in every input error, and offer a close valid value as a one-tap Tertiary "Use …".
- **Do** make every section and tile title an h2 under the screen's one h1, whatever its visual style.
- **Do** show one sentence and a way in (a text link) where a data view has nothing to count yet.

### Don't:
- **Don't** use a hex value outside `tokens.css`.
- **Don't** show any limit, allowance or "few left" state in red. Use amber or neutral.
- **Don't** put Stone text on Vanilla. Use Bean.
- **Don't** set Instrument Serif below 24 px or use it for UI labels.
- **Don't** use the overline style as a kicker or eyebrow above a heading or section. It only names a data tile or a Demo panel group.
- **Don't** strike through anything except a Full slot. Disabled options mute to Stone.
- **Don't** add shadows to ordinary cards. Lift is for the one live card and for controls that sit on top.
- **Don't** use product-photo menus, loyalty-card gamification, or urgency devices such as countdown badges and red dots.
- **Don't** use glyph or emoji icons. Icons are the 24 px, 1.75-stroke line set.
- **Don't** write a four-digit number without its thin space ("1199 Kč"), and don't use U+202F for it.
- **Don't** draw a dashed line anywhere except the gift ticket's perforation.
- **Don't** set names or nicknames in DM Mono. Mono is for figures, not decoration.
- **Don't** draw step progress with cup pips. Pips are the allowance; steps are thin pill segments.
