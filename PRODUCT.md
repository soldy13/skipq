# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18 + Vite + TypeScript, `react-router-dom` hash router, Zustand with `persist` (localStorage key `skipq-v1`), plain CSS using only the variables in `tokens.css`, small custom `t()` i18n. Static build for Vercel / Netlify / GitHub Pages so testers open a URL on their phone. (Source: SKIPQ_BRIEF.md §2.)

## Users

VŠE (Prague University of Economics and Business) students who want coffee from the vending machine in the Rajská budova without queueing between lectures. They are on their phone, usually walking between classes, often in a hurry, and they repeat the same order most days.

Secondary audiences: user-test participants running a five-minute scripted session, and the CEMS *Entrepreneurship & New Ventures* pitch audience watching the prototype on a projector or a phone.

## Product Purpose

SkipQ lets a student order and pay in the app, pick a 15-minute pickup slot (or Now), have the coffee brewed just in time, and unlock one of 30 lockable boxes with their phone.

This deliverable is a **fully clickable mockup for user testing and the pitch**, not a production app. Success means every flow in SKIPQ_BRIEF.md §5 (F1–F17), edge cases included, can be clicked end to end, and a tester can see the whole product in five minutes using the Demo panel.

## Positioning

Coffee from a vending machine that waits for you: the box is reserved at payment, brewing is timed to the pickup slot, and the phone is the key. Weekly plans with a daily allowance make it a habit, not a one-off purchase.

## Operating Context

- One machine, "VŠE · Rajská budova", 30 boxes, Mon–Fri 07:30–19:00 (config, more machines later).
- 15-minute slots, a "Now" option (≈2 min brew), a hold until the end of the slot, at most one extension.
- Orders are paid by plan allowance, pack credit, gift credit, or as a single coffee (29 Kč).
- Gifts are shared as `SKQ-XXXX` codes, valid for 5 days, and go back to the giver if nobody redeems them.
- There's a monthly leaderboard by nickname only (coffees or caffeine) plus personal stats.
- Everything runs client-side on a simulated clock that testers can fast-forward from the Demo panel.

## Capabilities and Constraints

- No backend, no real payments, no real machine. Everything is simulated and stored in localStorage. Never collect card data.
- Mobile-first. On desktop the app renders inside a centred 390 × 844 phone frame.
- English by default, Czech when `navigator.language` starts with `cs`, with a manual override. Informal "ty" in Czech.
- All time-based behaviour reads the simulated clock, never `Date.now()` in features.
- Pricing, plans, add-ons and packs are fixed in SKIPQ_BRIEF.md §4.1.
- Open decisions (configurable, don't block on them; SKIPQ_BRIEF.md §12):
  1. Opening hours Mon–Fri 07:30–19:00.
  2. Max 1 extension per order.
  3. An expired pickup counts as used, with no refund.
  4. Alternative milk is free on singles and packs; on plans it needs the add-on.
  5. Packs and returned gift credits never expire.
  6. A gift receiver can change the milk but not the drink.
  7. Drink caffeine and size values are typical café values until the supplier's spec sheet arrives.

## Brand Commitments

- Name: **SkipQ**.
- Design tokens in `tokens.css` are binding: Coffee / Vanilla / Foam / Espresso palette, Instrument Serif + DM Sans + DM Mono, a 4 px spacing scale, radii 8 / 14 / 22 / pill, and the motion tokens. Components use no hex values outside `tokens.css`.
- Voice: short, warm, slightly cheeky, never pushy. No fake urgency. Plain drink names. Examples: "Morning, Frederika.", "Box 14 is yours.", "That's today's three."
- Limits are never shown in red. Status always shows an icon, a word and a colour.

## Evidence on Hand

- `SKIPQ_BRIEF.md`: the full prototype spec, including dummy data (menu, machine, personas, gift codes, leaderboard).
- `tokens.css`: design tokens v0.1.
- The "SkipQ Design System" canvas exists but isn't in the repo; components are built from tokens and the brief.
- All personas, nicknames, leaderboard counts and gift codes are synthetic demo data. There are no real users, testimonials or sales figures, and none should be invented.

## Product Principles

1. **One tap for the usual.** Ordering a repeat coffee should take a single tap from Home.
2. **The box is the promise.** Show the reserved box, the time it's ready and how long it's held, plainly and everywhere it matters.
3. **Honest limits.** Allowances, credits and expiry are always visible and phrased neutrally. Never guilt the user, never invent urgency.
4. **Everything demoable.** Every state a tester might need can be reached in seconds from the Demo panel.

## Accessibility & Inclusion

- Real `<button>`/`<a>` elements, an `aria-label` on every icon button, switches as `role="switch"`.
- Contrast ≥ 4.5:1 (Stone text never on Vanilla) and a visible focus ring (2 px Coffee plus a 4 px Coffee-100 halo).
- Touch targets at least 44 × 44, 52 for primary actions, 64 for unlock. Key actions sit in the bottom third.
- Respect `prefers-reduced-motion`.
- Czech runs about 25 % longer, so no fixed-width buttons or chips.
