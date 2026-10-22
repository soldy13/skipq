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
    typography: "{typography.button}"
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
  code-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.espresso}"
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
- **Roasted Coffee** (coffee): primary actions, the active tab, links, the "used" allowance pips, a switch that is on, and the selected-radio fill. Hover and pressed states step down to **Dark Roast** (coffee-700), which is also the text colour on tonal Coffee fills.
- **Steamed Milk** (coffee-100): tonal fills. The secondary button, the segmented track, the active-tab icon lozenge, badges, the work-in-progress note, the focus halo, and the desktop stage behind the phone.
- **Latte** (coffee-200): boxes in use on the locker and strip, empty allowance pip outlines, the scrollbar thumb.
- **Caramel Line** (coffee-400): meter accents and the hover border on chips, slots and plan cards.
- **Bean** (coffee-900): text on Vanilla. It replaces Stone wherever the background is Vanilla.

### Secondary
- **Vanilla Plate** (vanilla): the colour of ownership. Selected chips, selected slots, a selected plan, your door on the locker and strip, the box plate, gift moments, text selection, and the Undo action and timer on the Espresso toast.

### Neutral
- **Foam** (foam): the app ground behind every screen. It is also the text colour on Espresso.
- **Espresso** (espresso): primary text and icons, the locker frame, the Unlock button, toasts, the Demo pill, the dark Demo sheet, and the 10 px desktop phone bezel. Derived in code: Espresso Raised (Espresso 88 % mixed with Foam) for hover on dark, and a 44 % Espresso scrim.
- **Surface** (surface): cards, sheets, inputs, the tab bar, free boxes.
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
- **Wordmark** (italic 400, 32 px, line-height 1): the "SkipQ" mark, used on the desktop aside.
- **Display** (400, 40/44, -0.01em, balanced): the Home greeting ("Morning, Frederika."). One per screen.
- **Title** (400, 28/32): screen titles, bottom-sheet titles, the ready line on the order card, and text values in stat tiles.
- **Heading** (DM Sans 600, 20/26): section titles ("On its way"), drink names on the order card, plan names.
- **Body** (400, 16/24): default text and tile values such as "2 of 3 used" (set at 600).
- **Button** (600, 16/24): all button labels and the toast action.
- **Body Small** (400, 14/20): secondary lines, dates, hints, sheet subtitles, chip labels (at 500).
- **Caption** (500, 12/16): tab labels, pill text (at 600), badges, legends.
- **Overline** (600, 12/16, +0.08em, uppercase): the label naming a data tile ("Today", "Boxes at Rajská") and the group titles inside the Demo panel. Nowhere else.
- **Numeric** (DM Mono 500, 28/32, tabular): big counters, stat values, the Demo clock. The `.sq-mono` utility sets DM Mono with tabular figures on any inline number.

### Named Rules
**The Serif Floor Rule.** Instrument Serif never goes below 24 px. It's for greetings, titles and the ready moment, never for UI labels.

**The Mono Numbers Rule.** Times, box numbers, codes, counters, ml/mg values and prices go in DM Mono with tabular figures. Units beside them stay in DM Sans (the Amount helper sets the unit at 0.62 em, with a 12 px minimum).

## Layout

The app is mobile-first. Below 600 px it fills the viewport (100dvh), with a scrolling screen above a fixed 64 px tab bar that is padded for the bottom safe area. From 600 px, it renders inside a centred 390 x 844 phone (capped at the viewport height minus 2 x 24 px, minimum 560 px), with 48 px rounded corners, a 10 px Espresso bezel and the large shadow, on a Steamed Milk stage. From 1040 px, a 260 px aside with the wordmark and notes sits to the left of the phone across a 56 px column gap.

Screens are a single grid column. The top padding is the safe area plus 32 px, the gutter is 20 px left and right, blocks are 24 px apart, and there is 56 px at the bottom so the Demo pill clears the content. Data tiles pair up in a two-column grid with a 12 px gap. Stacks inside a block use 12 px. Spacing sits on a 4 px base (4, 8, 12, 16, 20, 24, 32, 40, 56).

Touch targets are at least 44 x 44. Primary buttons are 52 px tall, slots 56 px, and the Unlock button and code input 64 px. Key actions sit in the bottom third. Nothing has a fixed width, because Czech runs about 25 % longer: chips wrap, and tab labels step down to 11 px in narrow containers rather than truncate.

Layering uses named z-levels: tab bar 10, Demo pill 20, sheet 40, toast 50, push banner 60.

## Elevation & Depth

The system is flat by default. Depth comes from a Foam ground under white Surface cards with a 1 px Line border, so most cards carry no shadow. There are two shadows, both tinted Espresso.

### Shadow Vocabulary
- **Lift** (e1): the live order card on Home, the Unlock button, the checked segment of a segmented control, and the Demo pill. It means "this one is current" or "this sits on top".
- **Float** (e2): bottom sheets, toasts, the push banner, and the desktop phone. It is for things that float above the screen.
- **Focus ring** (`--sq-focus`, a 2 px Coffee ring plus a 4 px Steamed Milk halo outside it): every focusable element. It is drawn as a box-shadow, with a transparent 2 px outline so it stays visible in forced-colours mode.

### Named Rules
**The Flat-Card Rule.** Cards are flat, with a Surface fill and a Line border. Only the one live order card on a screen gets Lift.

## Shapes

Corners are soft and graded by scale: 8 px for small plates, badges and toast actions; 14 px for buttons, slots, inputs, segmented tracks and toasts; 22 px for cards, tiles and the Unlock button; 28 px for the top corners of bottom sheets; pill for chips, status pills, icon buttons, the tab lozenge and the Demo pill. A segment inside a track takes the track radius minus its 4 px inset.

Borders are 1 px Line, or 1.5 px on inputs. A selected card or slot adds a 1 px inset Coffee ring on top of its Coffee border, which makes 2 px of Coffee.

The machine has its own small geometry because it draws a physical object. The locker frame is 14 px, or 8 px when mini. Doors are 5 px (3 px mini) with an aspect ratio of 1 : 1.08, and each door has a slim vertical handle on its right edge. The 30-door strip is a 5 px rail of 1.5 px doors. Allowance pips are cup-shaped (4 px corners at the top, 9 px at the bottom).

## Components

### Buttons
Tactile and plain. They shrink to 0.98 when pressed, and colour changes take 150 ms.
- **Shape:** gently rounded (14 px). Unlock is rounder (22 px).
- **Primary:** Coffee fill with white text, 52 px tall, 24 px horizontal padding. Hover darkens to Dark Roast. While loading it holds Dark Roast and shows the Spinner.
- **Secondary:** tonal. Steamed Milk fill with Dark Roast text, 44 px tall. It sits beside a primary without competing.
- **Tertiary:** a Coffee link that is a button. 1 px underline, thickening to 2 px on hover.
- **Unlock:** the one Espresso button. 64 px tall, Foam text at 18 px, with Lift. Hover goes to Espresso Raised.
- **Icon:** a 44 px circle with its label in `aria-label`. Comes in plain (Steamed Milk on hover), filled (Steamed Milk), and on-dark variants.
- **Disabled:** Spent Cup fill, Stone text, no shadow.

### Chips
- **Style:** pill-shaped, 44 px tall, Surface fill with a Line border, Body Small at 500. Hover changes the border to Caramel Line.
- **Selected:** Vanilla fill, Coffee border, Bean text. An optional count badge switches from Steamed Milk to Surface.
- **Locked / Disabled:** Stone text. Disabled also uses a Spent Cup fill and border.

### Slot Chip and Slot Grid
- A 56 px rounded-rectangle (14 px) with the time in mono 16/20 over a caption sub-line, laid out in a grid.
- **Few boxes left (3 or fewer):** the sub-line turns amber at 600. Never red.
- **Selected:** Vanilla with a 2 px Coffee edge.
- **Full:** stays in the grid, filled Spent Cup, the time struck through, not selectable.

### Cards / Containers
- **Corner Style:** 22 px.
- **Background:** Surface on Foam. Selected plan cards turn Vanilla.
- **Shadow Strategy:** flat. Only the live order card takes Lift (see Elevation & Depth).
- **Border:** 1 px Line. Hover on interactive cards changes it to Caramel Line. A ready order card blends 30 % Ready into its border.
- **Internal Padding:** 16 px, or 16 / 16 / 16 / 20 on the order card.
- **Notes:** the work-in-progress note is a borderless Steamed Milk block with Bean text and a link.

### Inputs / Fields
- **Code input:** 64 px tall, Surface fill, 1.5 px Line border, 14 px corners. The text is DM Mono at 26 px, uppercase, +0.1em, auto-formatted to `SKQ-XXXX`.
- **Focus:** the border turns Coffee, with a 4 px Steamed Milk halo.
- **Complete:** a Ready border and a Ready check mark.
- **Invalid:** an Expired border, a 4 px Expired-tint halo, and an inline error with an icon in Expired.
- **Switch:** a 52 x 32 track inside a 44 px target, with a 28 px white thumb. Pewter when off, Coffee when on. Uses `role="switch"`.
- **Segmented:** a Steamed Milk track with a 4 px inset. The checked option is Surface with Lift. Unavailable options are struck through in Stone, with the reasons listed below the control. A dark variant for the Demo panel uses Espresso Raised, with a Foam checked option.

### Navigation
- **Tab bar:** five equal columns, 64 px tall, Surface with a Line top border. Inactive tabs are a Stone icon with a caption label. The active tab is Coffee, with a 48 x 30 Steamed Milk lozenge behind the icon and the label at 600. Focus is shown as an inset ring.

### Status Pill
- A pill with icon plus word plus colour, in sm (28 px) and md (34 px) sizes, using the status text/tint pairs. The Brewing icon drifts 1 px like steam on an 1.8 s loop, which stops under reduced motion.

### Locker Plate (BoxTag), the signature
- The box number is always set as a Vanilla door plate: a 1 px inset Coffee hairline at 22 %, Bean text, an uppercase DM Sans "BOX" word (+0.06em), and a mono numeral. Comes in three sizes: sm (8 px corners), md, and lg (14 px corners, 36 px numeral) for the live order card.

### Locker Grid and Box Meter, the machine
- **Locker grid:** an Espresso frame around 6 x 5 doors. Free doors are Surface with Stone numbers, doors in use are Latte, and your door is Vanilla with a 2 px Coffee inset and a Vanilla outer ring. Your door settles in from 0.86 scale on the reward curve. A legend sits below in caption Stone.
- **Box meter:** a data tile with an overline label, a mono count ("12 of 30 free"), and a 20 px Espresso rail of 30 doors in the same colours. Your door is Vanilla and slightly taller. When few doors are free, the count goes amber.

### Daily Limit
- A data tile with one cup-shaped pip per coffee in the allowance: Coffee when used, a Latte outline when left. Below that is a neutral "2 of 3 used" line. It never turns red. A banner variant puts the pips and the counter on one line.

### Toast and Bottom Sheet
- **Toast:** Espresso, 14 px corners, Float shadow, rising in on the reward curve. An optional Vanilla Undo action, with a 3 px Vanilla bar that drains linearly across the undo window.
- **Bottom sheet:** Surface, with 28 px top corners, a Float shadow, and a 44 % Espresso scrim. It slides up at the base speed. A 36 x 5 Line handle sits at the top, the title is set in serif Title, and the footer has a Line top border. The Demo panel uses the dark Espresso variant.

### Demo Pill and Demo Panel
- Tester tooling is Espresso so it reads as an instrument, not as part of the product. The pill sits bottom-left above the tab bar: 32 px tall, with a 44 px hit area, 92 % opacity, the word "DEMO" in bold (+0.1em), and the mono clock. A Vanilla fast-forward badge appears while time is fast-forwarding.

### Push Banner
- A simulated OS notification. It drops in from the top, with Surface at 94 % behind a 16 px backdrop blur, 22 px corners, a Line border and Float. The app mark is a Vanilla locker door on a Coffee tile.

## Do's and Don'ts

### Do:
- **Do** take every colour, size, radius and duration from `tokens.css`. Derive new values only by `color-mix()` of tokens.
- **Do** set every box number as the Vanilla locker plate with a mono numeral.
- **Do** draw the machine as an Espresso frame of handled doors (6 x 5, or the 30-door strip), with your door in Vanilla.
- **Do** keep one Coffee-filled primary per screen. Use the Espresso 64 px Unlock as the only exception.
- **Do** show status as icon plus word plus colour, using the status text/tint pairs.
- **Do** use the motion tokens: 150 ms ease-out for state changes, 240 ms base for sheets and fills, and 420 ms reward (with overshoot) only for arrivals such as unlock, order placed, your box settling, and toasts. Reduced motion collapses all three to 150 ms.
- **Do** keep touch targets at 44 px or more (52 for primary, 64 for unlock), and let labels wrap or step down instead of fixing widths.

### Don't:
- **Don't** use a hex value outside `tokens.css`.
- **Don't** show any limit, allowance or "few left" state in red. Use amber or neutral.
- **Don't** put Stone text on Vanilla. Use Bean.
- **Don't** set Instrument Serif below 24 px or use it for UI labels.
- **Don't** use the overline style as a kicker or eyebrow above a heading or section. It only names a data tile or a Demo panel group.
- **Don't** add shadows to ordinary cards. Lift is for the one live card and for controls that sit on top.
- **Don't** use product-photo menus, loyalty-card gamification, or urgency devices such as countdown badges and red dots.
- **Don't** use glyph or emoji icons. Icons are the 24 px, 1.75-stroke line set.
