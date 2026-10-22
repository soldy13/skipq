# SkipQ — Prototype Brief for Claude Code

> **Read this whole file before writing code.** It is the single source of truth for the SkipQ clickable prototype. Design tokens live in `tokens.css` (same folder). Visual reference: the "SkipQ Design System" canvas (export the boards as PNGs into `/design` if you want Claude Code to see them).

---

## 1. What we are building

**SkipQ** lets VŠE students order coffee from a vending machine (Rajská budova) that has **30 lockable boxes**. You order and pay in the app, pick a 15‑minute pickup slot (or *Now*), the coffee is brewed just in time, and you unlock your box with your phone.

**Context:** CEMS course *Entrepreneurship & New Ventures*. The goal is a **fully functional mockup for user testing and the pitch** — not a production app.

**Hard requirements**
- No backend, no real payments, no real machine. **Everything is simulated client-side** and persisted in `localStorage`.
- Every feature and flow below must be **clickable end to end**, including edge cases (full slots, limit reached, expired pickup, expired gift code).
- A **Demo panel** (section 8) lets a tester fast-forward time and force states, so a 5-minute test session can show the whole product.
- Mobile-first. On desktop, render inside a centered 390 × 844 phone frame.

---

## 2. Tech stack (recommended)

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Routing | `react-router-dom` (hash router — easy static hosting) |
| State | Zustand with `persist` middleware → `localStorage` key `skipq-v1` |
| Styling | Plain CSS / CSS Modules using **only** the variables in `tokens.css`. No hard-coded hex values in components. |
| Fonts | Google Fonts: Instrument Serif (400, italic), DM Sans (400/500/600/700), DM Mono (400/500) |
| i18n | Small custom `t()` hook + `en.ts` / `cs.ts` dictionaries (section 9) |
| Icons | Inline SVG components, 24 px grid, 1.75 stroke, round caps/joins (see canvas board 02) |
| Hosting | Static build (Vercel / Netlify / GitHub Pages) so testers open a URL on their phone |

Folder suggestion:
```
src/
  app/ (router, layout, PhoneFrame)
  components/ (design-system components, section 10)
  features/ home, order, pickup, plans, gift, board, me, onboarding, demo
  store/ (zustand slices + simulation engine)
  data/ (dummy data, section 6)
  i18n/ (en.ts, cs.ts, useT.ts)
  styles/ tokens.css, base.css
```

---

## 3. Information architecture

Bottom tab bar (5 tabs): **Home · Plans · Gift · Board · Me**

| Screen | Route | Notes |
|---|---|---|
| Onboarding | `/welcome` | First launch only: nickname → plan choice (or skip) |
| Home | `/` | Greeting, daily counter, free boxes, active order banner, **Your usuals** (top 3) with one-tap order, "Browse all drinks" |
| Menu | `/menu` | All drinks, each with "i" info button |
| Order (drink + slot) | `/order/:drinkId` | Milk choice, bean add-ons, slot grid, payment method, CTA |
| Checkout sheet | modal | Simulated payment for singles / packs / plans |
| Order status / Pickup | `/order/status/:orderId` | Scheduled → Brewing → Ready (unlock) → Picked up / Expired |
| Drink info sheet | modal | Comparison table (section 6.1) |
| Plans | `/plans` | Plan picker (type × allowance), add-ons, packs, current plan |
| Gift | `/gift` | Two segments: **Send** and **Redeem**; list of sent codes with status |
| Board | `/board` | Monthly leaderboard, toggle Coffees / Caffeine, equivalents, link to personal stats |
| Me | `/me` | Personal stats, Apple Health "Coming soon", plan management, language override, order history, nickname |

---

## 4. Business rules

### 4.1 Pricing (all CZK, VAT incl.)
| Product | Price | Notes |
|---|---|---|
| Single coffee | **29 Kč** | Any drink. Not limited per day. |
| Pack 10 / 30 / 50 | **269 / 749 / 1 199 Kč** | Prepaid credits, any drink, no daily cap, no expiry (assumption) |
| Milk plan · 1 a day | **119 Kč / week** | All drinks, max 1/day |
| Milk plan · up to 3 a day | **229 Kč / week** | All drinks, max 3/day |
| Black plan · 1 a day | **89 Kč / week** | Black drinks only, max 1/day |
| Black plan · up to 3 a day | **179 Kč / week** | Black drinks only, max 3/day |
| Add-on: Premium beans | 29 Kč / month | Toggle; unlocks "Premium beans" option on any drink |
| Add-on: Adaptogenic coffee | 29 Kč / month | Toggle; unlocks "Adaptogenic" bean option |
| Add-on: Alternative milk | 29 Kč / month | Toggle; unlocks Oat / Soy for plan orders |

- Prices are always **displayed per week** for plans and **per month** for add-ons (units always visible).
- Plans and add-ons are subscription toggles — switching is instant in the prototype (no proration logic needed; show a toast).
- A milk drink ordered on the Black plan → payment method defaults to Single (29 Kč) and shows "Upgrade to Milk plan" as a tertiary link.
- Alternative milk without the add-on: available on singles/packs at no extra cost; on plan orders the chip shows "Add-on" and opens the add-on toggle. *(Assumption — see section 12.)*

### 4.2 Payment methods at checkout
Order screen segmented control shows only what the user has:
1. **Plan** — "uses 2nd of 3 today" (disabled with reason if limit reached or drink not covered)
2. **Pack** — "27 credits left"
3. **Single** — "29 Kč"

Default = Plan if eligible → Pack if credits → Single. Payment is simulated: a bottom sheet with a fake wallet button ("Pay 29 Kč · simulated") and a 1-second spinner. **Never** collect card data.

### 4.3 Daily limit
- Applies to **plan** orders only: 1 or 3 per day depending on the tier.
- **Gifts sent count toward the sender's daily limit** when paid with the plan.
- Resets at **00:00 local time** (simulated clock).
- Visible everywhere it matters: Home tile ("2 of 3 used"), order payment option, Plans.
- At the limit: neutral (not red) message "That's today's three. New ones from midnight — or buy a single coffee." with Single and Pack as alternatives.

### 4.4 Slots, brewing, boxes
- Machine: **one machine, 30 boxes**, Rajská budova. Config, not hard-coded, so more machines can be added later.
- Opening hours: **Mon–Fri 07:30–19:00** (assumption, config).
- Slots are **15 minutes** long (07:30, 07:45, …). The grid shows the next 2 hours = 8 slots plus **Now**.
- **Now** = brew immediately; ready in **≈ 2 min** (config `brewMinutes = 2`).
- Scheduled slot = brewing starts `brewMinutes` before the slot start, so it is **ready at slot start**.
- **Box assignment:** a box is reserved at payment ("Box 14 reserved"). It is occupied from payment until pickup or expiry.
- **Slot capacity:** a slot is selectable if at least one box is free for that whole window. Show "3 left" (amber) when ≤ 3 boxes free, "Full" (disabled, struck through) at 0. Full slots stay in the grid.
- **Hold:** a ready coffee is held until the **end of its slot** (slot start + 15 min). For *Now*, hold = ready time + 15 min.
- **Extend:** while Ready, if the **next** slot still has capacity, offer "Extend to HH:MM" → hold +15 min. Max **1 extension** per order (assumption, config).
- **Expiry:** not unlocked by hold end → status **Expired**, box released, coffee counted as used (plan allowance / credit not returned). Show it in history with an explanation.

### 4.5 Order state machine
```
DRAFT → PAID(Scheduled) → BREWING → READY → PICKED_UP
                                      ↘ (hold ends) → EXPIRED
READY → (extend) → READY (holdUntil += 15 min, extended = true)
```
- Transitions are driven by the **simulated clock** (section 8), not by real timers.
- On READY: show an in-app **push-style notification banner** ("Your flat white is ready · Box 14 · held until 10:45. Tap to unlock.") — tapping opens the Pickup screen.
- Unlock: big 64 px Espresso button "Unlock box 14" → 1 s "Unlocking…" → success state ("Box 14 is open — enjoy.") → PICKED_UP. Haptics optional via `navigator.vibrate`.
- Undo: right after a one-tap order, a toast with **Undo** for 5 s cancels and refunds (allowance/credit/money).

### 4.6 Quick order ("Your usuals")
- Top 3 drink configurations (drink + milk + bean option) by the user's order count, most frequent first. Ties → most recent.
- Seeded for the demo persona (section 6.3). New users see 3 popular defaults labelled "Popular at VŠE".
- **One tap = order** with the current pickup choice. Home has a "Pickup: Now" chip: tapping it opens the slot picker and changes the default for the one-tap buttons (resets to Now after each order).
- Tapping the card body (not the button) opens the full Order screen pre-filled.

### 4.7 Gift a coffee
- **Send:** choose drink (same picker as ordering) → pay (Plan / Pack / Single) → get code `SKQ-XXXX` (4 chars from `ABCDEFGHJKMNPQRSTUVWXYZ23456789`, no ambiguous characters) → Copy / Share (Web Share API, fallback copy).
- Code is **valid for 5 days**. Gift list shows: Pending (expires in X d), Redeemed (by nickname), Returned.
- **Expired and not redeemed → the coffee returns to the giver** as **1 gift credit** (works like a pack credit, any drink, no daily cap). Notify: "Your gift to … wasn't redeemed, so the coffee is back with you."
- **Redeem:** Gift → Redeem → enter code (auto-uppercase, dash auto-inserted) → shows the gifted drink → receiver may change milk → choose Now / slot → becomes a normal order (no payment step, does **not** count toward the receiver's daily limit).
- Error states: unknown code, already redeemed, expired, own code ("You can't redeem your own gift — send it to a friend").
- Demo: pre-seed 2 codes (section 6.4) so redeem can be tested on one device.

### 4.8 Leaderboard & stats
- **Monthly** board, resets on the 1st. Users shown by **nickname only**.
- Toggle **Coffees | Caffeine**. Top 10 + the user's own row highlighted in Vanilla (pinned below if outside the top 10).
- Caffeine shown in mg with **equivalents**: Red Bull 250 ml ≈ 80 mg, black tea ≈ 47 mg, espresso ≈ 65 mg. Rotate one fun line under the board, e.g. "That's about 25 cans of Red Bull."
- **Personal stats** (Me tab and from Board): coffees this month, caffeine this month, favourite drink, streak (consecutive **weekdays** with ≥ 1 picked-up coffee), simple bar chart of the last 4 weeks.
- **Apple Health sync:** a tile with a "Coming soon" badge. Tap → sheet explaining what will sync (date, time, caffeine per coffee) and a disabled button "Notify me when it's ready".

### 4.9 Drink info ("i")
- An "i" button next to every drink (menu, order screen) opens a sheet with the drink's facts and a comparison table of all drinks: **size, caffeine, milk share, strength (5 dots)**. Current drink row highlighted.
- Footer note: "Typical values — final values from the machine supplier."

---

## 5. Flows to implement (acceptance = all clickable)

| # | Flow | Steps / expected result |
|---|---|---|
| F1 | **One-tap order** | Home → tap "Order · Now" on a usual → toast "Ordered. Box N reserved." with Undo → active order banner on Home → (sim) Brewing → Ready notification → Pickup |
| F2 | **Custom order with slot** | Home card body or Menu → Order screen → pick milk/bean → pick slot 10:30 → payment method → "Order flat white · 10:30" → Order status (Scheduled) |
| F3 | **Pickup & unlock** | Ready banner/notification → Pickup screen (box shown in locker mini-map, hold countdown) → Unlock → success → Picked up |
| F4 | **Extend** | On Pickup while Ready → "Extend to 11:00" (only if next slot has capacity) → hold updated, button disappears |
| F5 | **Pickup missed** | Demo: jump past hold → Expired state + explanation + "Order again" |
| F6 | **Daily limit reached** | 3rd plan order → counter 3/3 → next order shows Plan disabled with reason, Single/Pack offered |
| F7 | **Slot or machine full** | Demo: fill boxes → slots show "3 left" / "Full"; at 30/30 the order CTA is disabled: "All boxes taken — next free slot 11:15" (pre-selects it on tap) |
| F8 | **Subscribe / change plan** | Plans → toggle 1 a day / Up to 3 a day → choose Milk/Black → checkout sheet → plan active, Home counter updates |
| F9 | **Add-ons** | Plans → toggle add-on → checkout sheet (29 Kč/month) → new options unlocked on Order screen |
| F10 | **Buy pack** | Plans → pack 10/30/50 → checkout → credits shown as payment option |
| F11 | **Send gift** | Gift → Send → drink → pay → code screen → copy/share |
| F12 | **Redeem gift** | Gift → Redeem → enter `SKQ-7M4T` → drink preview → slot → order created (no payment) |
| F13 | **Gift returned** | Demo: advance 5 days → pending gift becomes Returned, +1 gift credit, notification |
| F14 | **Leaderboard** | Board → toggle Coffees/Caffeine → equivalents line → own row highlighted → tap own row → personal stats |
| F15 | **Drink info** | Any "i" → comparison sheet |
| F16 | **Onboarding** | First launch → nickname (validation: 3–16 chars, a–z 0–9 _) → choose plan or "Pay per coffee" → Home |
| F17 | **Language** | System language `cs*` → Czech UI; Me → Language override (Auto / English / Čeština) |

---

## 6. Dummy data

### 6.1 Drink menu (one size per drink)
| id | EN | CS | Type | Size | Caffeine | Milk share | Strength |
|---|---|---|---|---|---|---|---|
| espresso | Espresso | Espresso | black | 40 ml | 65 mg | 0 | 5 |
| lungo | Lungo | Lungo | black | 110 ml | 80 mg | 0 | 4 |
| americano | Americano | Americano | black | 250 ml | 65 mg | 0 | 3 |
| flatwhite | Flat white | Flat white | milk | 160 ml | 130 mg | ~2/3 | 4 |
| cappuccino | Cappuccino | Cappuccino | milk | 180 ml | 65 mg | ~2/3 | 3 |
| latte | Caffè latte | Caffè latte | milk | 250 ml | 65 mg | ~4/5 | 2 |

Milk options for milk drinks: Cow's milk (default), Oat, Soy. Bean options: Standard (default), Premium (add-on), Adaptogenic (add-on).
*(Ignore "Regular/Large" seen on the canvas — one size per drink.)*

### 6.2 Machine
`{ id: "vse-rb-1", name: "VŠE · Rajská budova", boxes: 30, open: "07:30", close: "19:00", days: Mon–Fri, brewMinutes: 2, slotMinutes: 15, maxExtensions: 1 }`
Seed: 17 boxes occupied by other (anonymous) orders spread across the next hour, so Home shows "12 of 30 free" with the demo persona's own order included.

### 6.3 Demo personas (switchable in Demo panel)
| Persona | Plan | Extras | Usuals / history |
|---|---|---|---|
| **Frederika** (`frederika_k`) — default | Milk · up to 3 a day | Premium beans + Alternative milk on | Flat white/oat ×23, Cappuccino/cow ×14, Americano ×9; 2 of 3 used today; 31 coffees this month; streak 6 |
| **Tomáš** (`tomas_lungo`) | none | Pack: 7 credits left | Lungo ×12, Espresso ×5 |
| **New user** | none | — | Empty → onboarding |

### 6.4 Gift codes (seeded)
- `SKQ-7M4T` — Cappuccino from `rajska_raccoon`, pending, expires in 3 days (redeemable by Frederika)
- `SKQ-2KQX` — Latte, already redeemed (to test the error)
- Frederika has one **sent** gift `SKQ-4H7P` (Cappuccino → pending, expires in 1 day) to demo F13.

### 6.5 Leaderboard (current month, 20 users)
Nicknames: espresso_eva, lecture_skipper, rajska_raccoon, deadline_dana, crema_kral, oat_of_office, flatwhite_filip, nova_budova_nina, stat_stepan, latte_lukas, caffeine_kaja, ristretto_radek, bus_from_beroun, cems_coffee, macro_marek, cappu_carla, double_shot_dom, hayek_hana, frederika_k (#12), tomas_lungo.
Generate plausible monthly counts (10–61 coffees) and caffeine as `count × drink caffeine mix`. Frederika: 31 coffees / 2 000 mg.

---

## 7. Design system (summary — full spec on the canvas)

- **Tokens:** use `tokens.css` only. Ground = Foam, cards = Surface + Line border, actions = Coffee, "yours/selected" = Vanilla, text = Espresso / Stone.
- **One Coffee-filled primary action per screen.** The unlock button is the exception: Espresso, 64 px tall.
- **Type:** Instrument Serif for greetings, titles and the "ready" moment (never below 24 px); DM Sans for UI; DM Mono for times, codes, counters, prices in tables.
- **Status = icon + word + color** (Scheduled coffee, Brewing amber, Ready green, Picked up gray, Expired red). Limits are never red.
- **Touch:** min 44 × 44; primary 52; unlock 64; key actions in the bottom third.
- **Radii:** 8 / 14 / 22 / pill. **Motion:** 150 ms quick, 240 ms base, 420 ms reward (unlock, order placed); respect `prefers-reduced-motion`.
- **Accessibility:** real `<button>`/`<a>`, `aria-label` on icon buttons, switches as `role="switch"`, contrast ≥ 4.5:1 (Stone text never on Vanilla), visible focus ring (Coffee 2 px + Coffee‑100 4 px halo).
- **Copy voice:** short, warm, slightly cheeky, never pushy. No fake urgency. Plain drink names. Examples: "Morning, Frederika.", "Box 14 is yours.", "Running late? The next slot is free.", "That's today's three."

---

## 8. Simulation engine & Demo panel (critical)

- A single **simulated clock** in the store: `now` (ms) + `speed` (1× real time, or 30× fast mode). All order transitions, slot availability, daily reset, monthly board and gift expiry are computed from it. **No direct `Date.now()` in features.**
- A `tick()` loop (every 1 s real time) advances the clock and runs transitions.
- **Default demo start:** a Thursday at 09:58 so Now and morning slots look realistic.

**Demo panel** — opened by a small floating "DEMO" pill (bottom-left, above the tab bar), hideable for clean screenshots (`?demo=0` hides it):
- Clock: +2 min, +15 min, +1 h, +1 day, +5 days, set time; speed 1× / 30×
- Orders: make my next order ready now; expire my active order
- Machine: set occupied boxes (0–30 slider); fill next slot; reset machine
- User: switch persona (6.3); reset today's limit; give 10 pack credits
- Gifts: expire all pending gifts now
- Language: Auto / EN / CS
- **Reset everything** (re-seed)

---

## 9. Internationalisation

- Default **English**. If `navigator.language` starts with `cs` → **Czech**. Override in Me → Language (Auto / English / Čeština), stored in the profile.
- All UI strings go through `t('key')`; dates/times via `Intl.DateTimeFormat` (24 h in both); prices formatted as `29 Kč` in both languages (thin space as thousands separator: `1 199 Kč`).
- Czech runs ~25 % longer: buttons and chips size to content, never fixed widths; test every screen in CS.
- Starter strings:

| key | en | cs |
|---|---|---|
| home.greeting.morning | Morning, {name}. | Dobré ráno, {name}. |
| home.usuals | Your usuals | Tvoje klasika |
| home.pickupNow | Pickup: Now | Vyzvednutí: Hned |
| common.now | Now | Hned |
| order.cta | Order {drink} · {time} | Objednat {drink} · {time} |
| limit.counter | {used} of {max} used | {used} z {max} vypito |
| limit.reached | That's today's three. New ones from midnight — or buy a single coffee. | Dnešní tři máš za sebou. Nové od půlnoci — nebo si kup jednu kávu. |
| boxes.free | {free} of 30 free | {free} z 30 volných |
| slot.left | {n} left | Zbývají {n} |
| slot.full | Full | Plno |
| pickup.title | Box {n} is yours. | Box {n} je tvůj. |
| pickup.unlock | Unlock box {n} | Odemknout box {n} |
| pickup.extend | Extend to {time} | Prodloužit do {time} |
| status.scheduled / brewing / ready / pickedUp / expired | Scheduled / Brewing / Ready / Picked up / Expired | Naplánováno / Připravuje se / Hotovo / Vyzvednuto / Propadlo |
| gift.valid | Valid for 5 days. Not redeemed? The coffee comes back to you. | Platí 5 dní. Když ho nikdo nevyzvedne, káva se ti vrátí. |
| health.soon | Coming soon | Již brzy |

(Tone in Czech: informal "ty", friendly, student-y.)

---

## 10. Components to build (names match the canvas)

`Button` (primary / secondary / tertiary / unlock / icon) · `Chip` · `SlotChip` · `SlotGrid` · `Segmented` · `Switch` · `CodeInput` · `StatusPill` · `DailyLimit` · `BoxMeter` · `LockerGrid` (6 × 5, free / in use / yours) · `TabBar` · `PushBanner` · `Toast` (with Undo) · `BottomSheet` · `UsualCard` · `DrinkRow` · `DrinkCompare` · `PlanCard` · `AddOnRow` · `PackTile` · `GiftCode` · `BoardRow` · `StatTile` · `ComingSoonTile` · `PhoneFrame` · `DemoPanel`

Build a hidden `/styleguide` route that renders every component in all states — it doubles as a visual test against the canvas.

---

## 11. Suggested build order

1. **Foundation:** Vite + TS setup, `tokens.css`, fonts, PhoneFrame, router, TabBar, i18n hook, store skeleton, simulated clock, seed data, `/styleguide` with core components.
2. **Core loop:** Home, Menu, Order screen, SlotGrid, checkout sheet, order state machine, Pickup/unlock, push banner, Demo panel basics. → F1–F5 working.
3. **Money:** Plans, add-ons, packs, payment-method logic, daily limit. → F6–F10.
4. **Social:** Gift send/redeem/return, Leaderboard, stats, Apple Health tile, drink info. → F11–F15.
5. **Polish:** Onboarding, Czech strings, empty/error states, motion, reduced motion, accessibility pass, `?demo=0`, deploy.

After each milestone: run through the related flows in section 5 at 390 px width in both EN and CS.

---

## 12. Assumptions to confirm with the team (configurable — don't block on them)

1. Opening hours Mon–Fri 07:30–19:00.
2. Max 1 extension per order.
3. Expired pickup = coffee counts as used, nothing refunded.
4. Alternative milk is free on singles/packs; on plans it needs the add-on.
5. Packs and returned gift credits never expire.
6. Receiver of a gift can change milk but not the drink.
7. Drink caffeine/size values are typical café values until the supplier's spec sheet arrives.
