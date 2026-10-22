export type DrinkId = 'espresso' | 'lungo' | 'americano' | 'flatwhite' | 'cappuccino' | 'latte';
export type DrinkType = 'black' | 'milk';
export type Milk = 'cow' | 'oat' | 'soy';
export type Bean = 'standard' | 'premium' | 'adaptogenic';
export type Lang = 'en' | 'cs';
export type LangPref = 'auto' | Lang;

export interface Drink {
  id: DrinkId;
  type: DrinkType;
  name: Record<Lang, string>;
  sizeMl: number;
  caffeineMg: number;
  /** Display string, e.g. "0", "~2/3". */
  milkShare: string;
  /** 1–5 dots. */
  strength: number;
}

export interface DrinkConfig {
  drinkId: DrinkId;
  /** null for black drinks. */
  milk: Milk | null;
  bean: Bean;
}

export type PlanType = 'milk' | 'black';
export type PlanTier = 1 | 3;
export interface Plan {
  type: PlanType;
  perDay: PlanTier;
}

export type AddonId = 'premium' | 'adaptogenic' | 'altMilk';
export type Addons = Record<AddonId, boolean>;

/** plan = daily allowance, pack = prepaid credit, giftCredit = returned gift, single = 29 Kč, gift = redeemed code. */
export type PaymentMethod = 'plan' | 'pack' | 'giftCredit' | 'single' | 'gift';

export interface Order {
  id: string;
  config: DrinkConfig;
  machineId: string;
  boxId: number;
  paidAt: number;
  /** Slot start, or null for "Now". */
  slotStart: number | null;
  readyAt: number;
  holdUntil: number;
  extended: boolean;
  payment: PaymentMethod;
  /** Kč actually charged (singles only). */
  pricePaid: number;
  pickedUpAt: number | null;
  cancelledAt: number | null;
}

export type OrderStatus = 'scheduled' | 'brewing' | 'ready' | 'pickedUp' | 'expired' | 'cancelled';

/** A box reservation. Own orders derive one; anonymous traffic is stored directly. */
export interface Booking {
  id: string;
  boxId: number;
  /** Payment time: the box counts as taken from here. */
  bookedAt: number;
  /** Coffee ready: the box is physically needed from here. */
  needFrom: number;
  /** Hold end. */
  until: number;
  /** Pickup / cancel time, if known. */
  releasedAt: number | null;
}

export interface GiftCode {
  code: string;
  config: DrinkConfig;
  fromNickname: string;
  createdAt: number;
  expiresAt: number;
  payment: PaymentMethod;
  redeemedBy: string | null;
  redeemedAt: number | null;
  /** Set when an unredeemed code expired and the coffee went back to the giver as a credit. */
  returnedAt: number | null;
}

export type GiftStatus = 'pending' | 'redeemed' | 'returned';

export type PersonaId = 'frederika' | 'tomas' | 'new';

export interface Profile {
  nickname: string | null;
  /** First name for greetings; falls back to nickname. */
  displayName: string | null;
  language: LangPref;
  onboarded: boolean;
}

export interface Wallet {
  packCredits: number;
  /** Returned gifts: work like pack credits, any drink, no daily cap. */
  giftCredits: number;
}

/** Everything the simulation persists about one demo world. */
export interface World {
  persona: PersonaId;
  profile: Profile;
  plan: Plan | null;
  addons: Addons;
  wallet: Wallet;
  orders: Order[];
  /** Anonymous orders from other students. */
  traffic: Booking[];
  /** Every gift code the "server" knows, the user's own included. */
  gifts: GiftCode[];
  /** Demo "reset today's limit". */
  limitResetAt: number | null;
}
