// In-memory demo backend for WorldReady.
//
// Active only when `import.meta.env.VITE_DEMO === '1'`. It lets the Galaxium
// frontend run with no Python/Java backend, so it can be published to a static
// host (GitHub Pages) for the "before" and "after" internationalization demos.
//
// Data is seeded from the upstream backend's seed.py (IBM/galaxium-travels,
// booking_system_backend/seed.py). Read-only fixtures — flights, destinations,
// the bookings list, and user lookup/registration — come first; the
// quote → hold → confirm booking flow is also implemented in memory.
//
// Timestamps for seeded fixtures are deterministic (a fixed demo "now"), so the
// same data renders on every load. Mutations (registrations, bookings, holds)
// persist to localStorage within a browser session.
//
// This is Claude Code plumbing, not product code. Bob owns i18n; it must not
// edit this file or ../services/api.ts.

import type {
  Flight,
  Booking,
  User,
  BookingRequest,
  UserRegistration,
  ErrorResponse,
  Quote,
  Hold,
  SeatClass,
} from '../types';
import type { FlightFilters, CreateQuoteRequest } from './api';

// A fixed "now" so seeded booking timestamps never change between loads.
const DEMO_NOW_ISO = '2026-09-27T12:00:00Z';
const DEMO_NOW_MS = Date.parse(DEMO_NOW_ISO);

const STORAGE_KEY = 'worldready_demo_v1';

// ==================== Seed data (from booking_system_backend/seed.py) ====================

const SEED_USERS: ReadonlyArray<{ name: string; email: string }> = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Charlie', email: 'charlie@galaxium.com' },
  { name: 'Diana', email: 'diana@moonmail.com' },
  { name: 'Eve', email: 'eve@marsmail.com' },
  { name: 'Frank', email: 'frank@venusmail.com' },
  { name: 'Grace', email: 'grace@jupiter.com' },
  { name: 'Heidi', email: 'heidi@europa.com' },
  { name: 'Ivan', email: 'ivan@asteroidbelt.com' },
  { name: 'Judy', email: 'judy@pluto.com' },
];

// [origin, destination, departure, arrival, base_price, total_seats]
const SEED_FLIGHTS: ReadonlyArray<
  [string, string, string, string, number, number]
> = [
  ['Earth', 'Mars', '2099-01-01T09:00:00Z', '2099-01-01T17:00:00Z', 1000000, 10],
  ['Earth', 'Moon', '2099-01-02T10:00:00Z', '2099-01-02T14:00:00Z', 500000, 10],
  ['Mars', 'Earth', '2099-01-03T12:00:00Z', '2099-01-03T20:00:00Z', 950000, 10],
  ['Venus', 'Earth', '2099-01-04T08:00:00Z', '2099-01-04T18:00:00Z', 1200000, 10],
  ['Jupiter', 'Europa', '2099-01-05T15:00:00Z', '2099-01-05T19:00:00Z', 2000000, 10],
  ['Earth', 'Venus', '2099-01-06T07:00:00Z', '2099-01-06T15:00:00Z', 1100000, 10],
  ['Moon', 'Mars', '2099-01-07T11:00:00Z', '2099-01-07T19:00:00Z', 800000, 10],
  ['Mars', 'Jupiter', '2099-01-08T13:00:00Z', '2099-01-08T23:00:00Z', 2500000, 10],
  ['Europa', 'Earth', '2099-01-09T09:00:00Z', '2099-01-09T21:00:00Z', 3000000, 10],
  ['Earth', 'Pluto', '2099-01-10T06:00:00Z', '2099-01-11T06:00:00Z', 5000000, 10],
];

// Deterministic stand-in for seed.py's 20 random bookings.
// [user_id, flight_id, status, seat_class, days_before_demo_now]
const SEED_BOOKINGS: ReadonlyArray<
  [number, number, Booking['status'], SeatClass, number]
> = [
  [1, 1, 'booked', 'business', 3],
  [1, 2, 'booked', 'economy', 9],
  [1, 5, 'completed', 'galaxium', 21],
  [1, 3, 'cancelled', 'economy', 15],
  [2, 4, 'booked', 'economy', 2],
  [2, 8, 'completed', 'business', 18],
  [3, 6, 'booked', 'galaxium', 5],
  [3, 1, 'cancelled', 'business', 12],
  [4, 2, 'booked', 'economy', 7],
  [4, 9, 'completed', 'economy', 25],
  [5, 7, 'booked', 'business', 4],
  [5, 5, 'cancelled', 'economy', 20],
  [6, 10, 'booked', 'galaxium', 1],
  [6, 3, 'completed', 'economy', 28],
  [7, 4, 'booked', 'economy', 6],
  [8, 6, 'completed', 'business', 16],
  [8, 8, 'booked', 'economy', 10],
  [9, 2, 'cancelled', 'economy', 22],
  [9, 7, 'booked', 'galaxium', 8],
  [10, 9, 'completed', 'economy', 30],
];

const SEAT_CLASS_MULTIPLIERS: Record<SeatClass, number> = {
  economy: 1.0,
  business: 2.5,
  galaxium: 5.0,
};

function priceFor(basePrice: number, seatClass: SeatClass): number {
  if (seatClass === 'business') return Math.trunc(basePrice * 2.5);
  if (seatClass === 'galaxium') return basePrice * 5;
  return basePrice;
}

function seatsFor(totalSeats: number): {
  economy: number;
  business: number;
  galaxium: number;
} {
  // 60% economy, 30% business, 10% galaxium, mirroring seed.py.
  let economy = Math.trunc(totalSeats * 0.6);
  let business = Math.trunc(totalSeats * 0.3);
  let galaxium = Math.trunc(totalSeats * 0.1);
  if (totalSeats >= 3) {
    if (economy === 0) economy = 1;
    if (business === 0) business = 1;
    if (galaxium === 0) galaxium = 1;
  }
  return { economy, business, galaxium };
}

// ==================== State ====================

interface DemoState {
  users: User[];
  flights: Flight[];
  bookings: Booking[];
  quotes: Quote[];
  holds: Hold[];
  nextUserId: number;
  nextBookingId: number;
  counter: number;
}

function buildSeedState(): DemoState {
  const users: User[] = SEED_USERS.map((u, i) => ({
    user_id: i + 1,
    name: u.name,
    email: u.email.toLowerCase(),
  }));

  const flights: Flight[] = SEED_FLIGHTS.map(
    ([origin, destination, departure, arrival, basePrice, totalSeats], i) => {
      const seats = seatsFor(totalSeats);
      return {
        flight_id: i + 1,
        origin,
        destination,
        departure_time: departure,
        arrival_time: arrival,
        base_price: basePrice,
        economy_seats_available: seats.economy,
        business_seats_available: seats.business,
        galaxium_seats_available: seats.galaxium,
        economy_price: priceFor(basePrice, 'economy'),
        business_price: priceFor(basePrice, 'business'),
        galaxium_price: priceFor(basePrice, 'galaxium'),
      };
    }
  );

  const bookings: Booking[] = SEED_BOOKINGS.map(
    ([userId, flightId, status, seatClass, daysAgo], i) => {
      const flight = flights[flightId - 1];
      return {
        booking_id: i + 1,
        user_id: userId,
        flight_id: flightId,
        status,
        booking_time: new Date(DEMO_NOW_MS - daysAgo * 86400000).toISOString(),
        seat_class: seatClass,
        price_paid: priceFor(flight.base_price, seatClass),
      };
    }
  );

  return {
    users,
    flights,
    bookings,
    quotes: [],
    holds: [],
    nextUserId: users.length + 1,
    nextBookingId: bookings.length + 1,
    counter: 1,
  };
}

let state: DemoState | null = null;

function load(): DemoState {
  if (state) return state;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      state = JSON.parse(raw) as DemoState;
      return state;
    }
  } catch {
    // ignore corrupt state, fall through to reseed
  }
  state = buildSeedState();
  save();
  return state;
}

function save(): void {
  if (!state) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable (private mode) — keep in-memory copy
  }
}

// Small artificial latency so loading states are exercised, but short enough
// to stay reliable under automated verification.
const delay = (ms = 80) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function hoursBetween(departure: string, arrival: string): number {
  const dep = Date.parse(departure);
  const arr = Date.parse(arrival);
  if (isNaN(dep) || isNaN(arr)) return 0;
  return (arr - dep) / 3600000;
}

const ROUTE_CATEGORIES: Record<string, string[]> = {
  inner_planets: ['Earth', 'Mars', 'Venus', 'Mercury'],
  outer_planets: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
  moons: ['Titan', 'Europa', 'Ganymede', 'Callisto', 'Io', 'Enceladus'],
};

// ==================== Flight endpoint ====================

async function getFlights(filters?: FlightFilters): Promise<Flight[]> {
  await delay();
  const s = load();
  let result = s.flights.slice();
  const f = filters ?? {};

  if (f.origin) {
    const q = f.origin.toLowerCase();
    result = result.filter((x) => x.origin.toLowerCase().includes(q));
  }
  if (f.destination) {
    const q = f.destination.toLowerCase();
    result = result.filter((x) => x.destination.toLowerCase().includes(q));
  }
  if (f.departure_date_from) {
    const from = f.departure_date_from.slice(0, 10);
    result = result.filter((x) => x.departure_time.slice(0, 10) >= from);
  }
  if (f.departure_date_to) {
    const to = f.departure_date_to.slice(0, 10);
    result = result.filter((x) => x.departure_time.slice(0, 10) <= to);
  }
  if (f.min_price != null) result = result.filter((x) => x.base_price >= f.min_price!);
  if (f.max_price != null) result = result.filter((x) => x.base_price <= f.max_price!);
  if (f.has_economy) result = result.filter((x) => x.economy_seats_available > 0);
  if (f.has_business) result = result.filter((x) => x.business_seats_available > 0);
  if (f.has_galaxium) result = result.filter((x) => x.galaxium_seats_available > 0);
  if (f.seat_class) {
    result = result.filter((x) => {
      if (f.seat_class === 'economy') return x.economy_seats_available > 0;
      if (f.seat_class === 'business') return x.business_seats_available > 0;
      if (f.seat_class === 'galaxium') return x.galaxium_seats_available > 0;
      return true;
    });
  }
  if (f.departure_time_period) {
    result = result.filter((x) => {
      const hour = new Date(x.departure_time).getUTCHours();
      switch (f.departure_time_period) {
        case 'morning':
          return hour >= 6 && hour < 12;
        case 'afternoon':
          return hour >= 12 && hour < 18;
        case 'evening':
          return hour >= 18 && hour < 22;
        case 'night':
          return hour >= 22 || hour < 6;
        default:
          return true;
      }
    });
  }
  if (f.min_seats_available != null) {
    result = result.filter(
      (x) =>
        x.economy_seats_available +
          x.business_seats_available +
          x.galaxium_seats_available >=
        f.min_seats_available!
    );
  }
  if (f.min_duration != null) {
    result = result.filter(
      (x) => hoursBetween(x.departure_time, x.arrival_time) >= f.min_duration!
    );
  }
  if (f.max_duration != null) {
    result = result.filter(
      (x) => hoursBetween(x.departure_time, x.arrival_time) <= f.max_duration!
    );
  }
  if (f.route_category && ROUTE_CATEGORIES[f.route_category]) {
    const dests = ROUTE_CATEGORIES[f.route_category];
    result = result.filter((x) => dests.includes(x.destination));
  }

  const sortBy = f.sort_by || f.sort;
  if (sortBy) {
    const order = f.sort_order || f.order || 'asc';
    const reverse = order === 'desc' ? -1 : 1;
    result.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      switch (sortBy) {
        case 'base_price':
        case 'price':
          av = a.base_price;
          bv = b.base_price;
          break;
        case 'duration':
          av = hoursBetween(a.departure_time, a.arrival_time);
          bv = hoursBetween(b.departure_time, b.arrival_time);
          break;
        case 'seats_available':
          av =
            a.economy_seats_available +
            a.business_seats_available +
            a.galaxium_seats_available;
          bv =
            b.economy_seats_available +
            b.business_seats_available +
            b.galaxium_seats_available;
          break;
        case 'departure_time':
        default:
          av = a.departure_time;
          bv = b.departure_time;
          break;
      }
      if (av < bv) return -1 * reverse;
      if (av > bv) return 1 * reverse;
      return 0;
    });
  }

  return result;
}

// ==================== User endpoints ====================

async function registerUser(data: UserRegistration): Promise<User | ErrorResponse> {
  await delay();
  const s = load();
  const email = data.email.toLowerCase();
  if (!isValidEmail(email)) {
    return {
      success: false,
      error: 'Invalid email format',
      error_code: 'INVALID_EMAIL',
      details: `Email '${email}' is not a valid email address. Please provide a valid email in the format: example@domain.com`,
    };
  }
  if (s.users.some((u) => u.email === email)) {
    return {
      success: false,
      error: 'Email already registered',
      error_code: 'EMAIL_EXISTS',
      details: `Email '${email}' is already registered.`,
    };
  }
  const user: User = { user_id: s.nextUserId++, name: data.name, email };
  s.users.push(user);
  save();
  return user;
}

async function getUserByCredentials(
  name: string,
  email: string
): Promise<User | ErrorResponse> {
  await delay();
  const s = load();
  const lower = email.toLowerCase();
  if (!isValidEmail(lower)) {
    return {
      success: false,
      error: 'Invalid email format',
      error_code: 'INVALID_EMAIL',
      details: `Email '${lower}' is not a valid email address.`,
    };
  }
  const user = s.users.find((u) => u.name === name && u.email === lower);
  if (!user) {
    return {
      success: false,
      error: 'User not found',
      error_code: 'USER_NOT_FOUND',
      details: `User not found with name '${name}' and email '${lower}'.`,
    };
  }
  return user;
}

// ==================== Booking endpoints ====================

async function bookFlight(data: BookingRequest): Promise<Booking | ErrorResponse> {
  await delay();
  const s = load();
  const seatClass: SeatClass = data.seat_class ?? 'economy';
  if (!(seatClass in SEAT_CLASS_MULTIPLIERS)) {
    return {
      success: false,
      error: 'Invalid seat class',
      error_code: 'INVALID_SEAT_CLASS',
      details: `Seat class '${seatClass}' is not valid.`,
    };
  }
  const flight = s.flights.find((x) => x.flight_id === data.flight_id);
  if (!flight) {
    return {
      success: false,
      error: 'Flight not found',
      error_code: 'FLIGHT_NOT_FOUND',
      details: `The specified flight_id ${data.flight_id} does not exist.`,
    };
  }
  const seatKey =
    seatClass === 'economy'
      ? 'economy_seats_available'
      : seatClass === 'business'
        ? 'business_seats_available'
        : 'galaxium_seats_available';
  if (flight[seatKey] < 1) {
    return {
      success: false,
      error: `No ${seatClass} seats available`,
      error_code: 'NO_SEATS_AVAILABLE',
      details: `The flight has no available seats in ${seatClass} class.`,
    };
  }
  const user = s.users.find((u) => u.user_id === data.user_id);
  if (!user) {
    return {
      success: false,
      error: 'User not found',
      error_code: 'USER_NOT_FOUND',
      details: `User with ID ${data.user_id} is not registered.`,
    };
  }
  if (user.name !== data.name) {
    return {
      success: false,
      error: 'Name mismatch',
      error_code: 'NAME_MISMATCH',
      details: `User ID ${data.user_id} exists but the name '${data.name}' does not match '${user.name}'.`,
    };
  }
  flight[seatKey] -= 1;
  const booking: Booking = {
    booking_id: s.nextBookingId++,
    user_id: data.user_id,
    flight_id: data.flight_id,
    status: 'booked',
    booking_time: new Date(DEMO_NOW_MS).toISOString(),
    seat_class: seatClass,
    price_paid: priceFor(flight.base_price, seatClass),
  };
  s.bookings.push(booking);
  save();
  return booking;
}

async function getUserBookings(userId: number): Promise<Booking[]> {
  await delay();
  const s = load();
  return s.bookings.filter((b) => b.user_id === userId);
}

async function cancelBooking(bookingId: number): Promise<Booking | ErrorResponse> {
  await delay();
  const s = load();
  const booking = s.bookings.find((b) => b.booking_id === bookingId);
  if (!booking) {
    return {
      success: false,
      error: 'Booking not found',
      error_code: 'BOOKING_NOT_FOUND',
      details: `Booking with ID ${bookingId} not found.`,
    };
  }
  if (booking.status === 'cancelled') {
    return {
      success: false,
      error: 'Booking already cancelled',
      error_code: 'ALREADY_CANCELLED',
      details: `Booking ${bookingId} is already cancelled.`,
    };
  }
  const flight = s.flights.find((x) => x.flight_id === booking.flight_id);
  if (flight) {
    if (booking.seat_class === 'economy') flight.economy_seats_available += 1;
    else if (booking.seat_class === 'business') flight.business_seats_available += 1;
    else if (booking.seat_class === 'galaxium') flight.galaxium_seats_available += 1;
  }
  booking.status = 'cancelled';
  save();
  return booking;
}

// ==================== Quote & Hold (in-memory inventory service) ====================

const HOLD_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const QUOTE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

async function createQuote(data: CreateQuoteRequest): Promise<Quote> {
  await delay();
  const s = load();
  const flight = s.flights.find((x) => x.flight_id === data.flightId);
  if (!flight) {
    throw new Error('Failed to create quote: flight not found in demo data');
  }
  const seatClass = data.seatClass as SeatClass;
  const pricePerSeat = priceFor(flight.base_price, seatClass);
  const quantity = data.quantity || 1;
  // Hold expiry uses real wall-clock so the countdown timer behaves naturally.
  const now = Date.now();
  const quote: Quote = {
    quoteId: `Q-${s.counter++}`,
    flightId: data.flightId,
    seatClass: data.seatClass,
    quantity,
    travelerId: data.travelerId,
    travelerName: data.travelerName,
    pricePerSeat,
    totalPrice: pricePerSeat * quantity,
    expiresAt: new Date(now + QUOTE_WINDOW_MS).toISOString(),
    status: 'CREATED',
    createdAt: new Date(now).toISOString(),
  };
  s.quotes.push(quote);
  save();
  return quote;
}

async function getQuote(quoteId: string): Promise<Quote> {
  await delay();
  const s = load();
  const quote = s.quotes.find((q) => q.quoteId === quoteId);
  if (!quote) throw new Error('Failed to get quote: not found in demo data');
  return quote;
}

async function createHold(quoteId: string): Promise<Hold> {
  await delay();
  const s = load();
  const quote = s.quotes.find((q) => q.quoteId === quoteId);
  if (!quote) throw new Error('Failed to create hold: quote not found in demo data');
  const now = Date.now();
  const hold: Hold = {
    holdId: `H-${s.counter++}`,
    quoteId,
    status: 'HELD',
    reservedUntil: new Date(now + HOLD_WINDOW_MS).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
  };
  s.holds.push(hold);
  save();
  return hold;
}

async function getHold(holdId: string): Promise<Hold> {
  await delay();
  const s = load();
  const hold = s.holds.find((h) => h.holdId === holdId);
  if (!hold) throw new Error('Failed to get hold: not found in demo data');
  if (hold.status === 'HELD' && Date.parse(hold.reservedUntil) < Date.now()) {
    hold.status = 'EXPIRED';
    hold.updatedAt = new Date().toISOString();
    save();
  }
  return hold;
}

async function confirmHold(holdId: string): Promise<Hold> {
  await delay();
  const s = load();
  const hold = s.holds.find((h) => h.holdId === holdId);
  if (!hold) throw new Error('Failed to confirm hold: not found in demo data');
  const quote = s.quotes.find((q) => q.quoteId === hold.quoteId);
  if (quote) {
    // Materialize a booking so it appears under My Bookings, mirroring the
    // Java hold service confirming through the Python backend.
    const flight = s.flights.find((x) => x.flight_id === quote.flightId);
    const seatClass = quote.seatClass as SeatClass;
    if (flight) {
      const seatKey =
        seatClass === 'economy'
          ? 'economy_seats_available'
          : seatClass === 'business'
            ? 'business_seats_available'
            : 'galaxium_seats_available';
      if (flight[seatKey] > 0) flight[seatKey] -= 1;
      s.bookings.push({
        booking_id: s.nextBookingId++,
        user_id: quote.travelerId,
        flight_id: quote.flightId,
        status: 'booked',
        booking_time: new Date().toISOString(),
        seat_class: seatClass,
        price_paid: quote.pricePerSeat,
      });
    }
  }
  hold.status = 'CONFIRMED';
  hold.externalBookingReference = `GLX-${1000 + s.counter++}`;
  hold.updatedAt = new Date().toISOString();
  save();
  return hold;
}

async function releaseHold(holdId: string): Promise<Hold> {
  await delay();
  const s = load();
  const hold = s.holds.find((h) => h.holdId === holdId);
  if (!hold) throw new Error('Failed to release hold: not found in demo data');
  hold.status = 'RELEASED';
  hold.updatedAt = new Date().toISOString();
  save();
  return hold;
}

// ==================== Health ====================

async function healthCheck(): Promise<{ status: string }> {
  await delay(10);
  return { status: 'OK (demo)' };
}

export const demoApi = {
  getFlights,
  registerUser,
  getUserByCredentials,
  bookFlight,
  getUserBookings,
  cancelBooking,
  createQuote,
  getQuote,
  createHold,
  getHold,
  confirmHold,
  releaseHold,
  healthCheck,
};

// Made with Bob
