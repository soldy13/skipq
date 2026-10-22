---
version: 1
slug: "src-app-app-tsx"
primary_target: "src/app/App.tsx"
related_targets: ["src/features/styleguide/Styleguide.tsx"]
---

## Scope

SkipQ clickable prototype, mobile web app shell and `/styleguide` (milestone 1 of SKIPQ_BRIEF.md §11). Mode: **Operate**. The visitor is a VŠE student on a phone between lectures, or a user-test participant in a 5-minute scripted session.

## Task and states

Order coffee for a pickup slot and collect it from a numbered locker box. Milestone 1 ships the foundation: the simulated clock and store, seed data for the three personas, i18n (EN/CS), the phone frame, the tab bar, the Demo panel, and every §10 component in its states on `/styleguide`. Home is live (greeting, daily allowance, box meter, active order status). Other tabs are honest placeholders that name the milestone they land in.

## Constraints

The visual world is pinned by the brief and `tokens.css`: Coffee / Vanilla / Foam / Espresso, Instrument Serif + DM Sans + DM Mono, radii 8/14/22/pill, the motion tokens. There was no direction roll, because the brief pins the direction. No hex outside tokens. Limits are never red. Status is always icon + word + colour. There is one Coffee-filled primary per screen, and Unlock is the Espresso 64 px exception.

## Direction contract

THESIS: The box is the promise. Every surface shows *which* door holds your coffee and *until when*, plainly. The interface refuses the coffee-app default of a product-photo menu and loyalty-card gamification.

OWN-WORLD: Foam ground, white Surface cards with a 1 px Line border, Coffee actions, Vanilla for anything that is yours (selected chips, your box, your board row, gift tickets). Espresso marks the machine itself and the demo tooling. The serif is kept for greetings, titles and the ready moment. DM Mono is for times, codes and counters.

STORY: The student opens the app, sees today's allowance and how many boxes are free, taps a usual, gets a box number, and later unlocks that box. The tester can reach any state from the Demo pill in seconds.

FIRST VIEWPORT: The date in Stone, then "Morning, Frederika." in Instrument Serif 40. Below that, two tiles side by side: Today (cup-shaped pips plus "2 of 3 used") and Boxes at Rajská (a big mono "12 of 30 free" over a 30-segment door strip, your door in Vanilla). Then the active order card: a status pill, the drink, "Ready at 10:15", and a large Vanilla **BOX 14** plate on the right. The tab bar sits at the bottom, with the Demo pill bottom-left above it.

FORM: Brief-pinned world, not rolled. Signature move: the **locker plate**. The box number is always set as a Vanilla door plate (BoxTag), and the machine is always drawn as an Espresso frame of 6 × 5 doors with handles (LockerGrid, BoxMeter strip). seed: none — brief-pinned direction; no concept roll was run

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Caffeine seed: the brief's "31 coffees / 2 000 mg" for Frederika is impossible with her usuals mix (flat white is 130 mg). The derived value is about 2 990 mg.
- The `--sq-reward` token uses an overshoot curve, which the detector flags as an advisory. It's kept because the tokens are binding.
