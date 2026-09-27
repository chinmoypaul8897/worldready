# Bob task 4593193355a8c601be89e9368f417114

- Title: # WorldReady — Task 01: i18n plan (Plan mode + document understanding)- **Mode:** Plan- **Date:** 2026-09-27- **Bobcoin budget:** 0.8 (stop and ask if you would exceed it)- **Context to attach:** `@docs/glossary.xlsx` `@docs/style-guide.pdf` `@src`## TaskYou are planning how to internationalize this existing **English-only React + TypeScript** app(Galaxium Travels) into English, French (fr-CA) and Arabic (RTL) using **react-i18next** and the**`Intl`** APIs. **Do not change any product code in this task** — only produce a written plan.**First**, use an **Explore subagent** to map the codebase (components, pages, data, utils) so theplan reflects the real file tree. Then read the attached glossary and style guide.Write the plan to **`plans/i18n-plan.md`**. It must cover:1. **Key naming convention and namespaces.** Use these five namespaces: `pages`, `flights`,   `bookings`, `common`, `destinations`. Give the key-naming rule (e.g. dot-nested, lowerCamel   leaf keys) and one worked example per namespace.2. **File-ownership map for 5 parallel workers**, so five people can extract strings at once with   **no merge conflicts**. Exactly one namespace JSON per worker:   | Worker | Owns (source files) | Namespace JSON |   |---|---|---|   | 1 | `src/pages/` | `pages` |   | 2 | `src/components/flights/` | `flights` |   | 3 | `src/components/bookings/` | `bookings` |   | 4 | `src/components/layout/`, `src/components/common/`, `src/components/user/` | `common` |   | 5 | `src/data/destinations.ts` | `destinations` |   List the actual files each worker touches (from the Explore pass).3. **i18next runtime setup**: `src/i18n/index.ts` (init with the three languages, namespaces,   fallback `en`, interpolation), wiring in `src/main.tsx`, and a `LanguageSwitcher` component.4. **The `Intl` approach**: numbers, currency, dates, and relative time formatted through `Intl`   (and date-fns locales where helpful), **keyed by `i18n.language`**, centralized in   `src/utils/formatters.ts`.5. **The RTL approach**: `<html lang dir>` driven by the active language, Tailwind **logical**   utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`, `text-start`/`text-end`) instead of physical   left/right, and mirrored directional icons.6. **The data rule**: any value used as a **filter key or URL/route value keeps its English   value**; translate only the visible label (look up the label by a stable English slug/id).## Acceptance checks- `plans/i18n-plan.md` exists and covers all six points above.- The ownership map assigns every worker exactly one namespace and lists real files.- The plan references the glossary's do-not-translate brand terms (e.g. Galaxium) and the planet  label-vs-value rule.Push back directly if any of this is wrong or if you would exceed the budget.
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.575822
- Context tokens: 34596
- Created: 2026-09-27 05:24:40

**User:**

# WorldReady — Task 01: i18n plan (Plan mode + document understanding)- **Mode:** Plan- **Date:** 2026-09-27- **Bobcoin budget:** 0.8 (stop and ask if you would exceed it)- **Context to attach:** `@docs/glossary.xlsx` `@docs/style-guide.pdf` `@src`## TaskYou are planning how to internationalize this existing **English-only React + TypeScript** app(Galaxium Travels) into English, French (fr-CA) and Arabic (RTL) using **react-i18next** and the**`Intl`** APIs. **Do not change any product code in this task** — only produce a written plan.**First**, use an **Explore subagent** to map the codebase (components, pages, data, utils) so theplan reflects the real file tree. Then read the attached glossary and style guide.Write the plan to **`plans/i18n-plan.md`**. It must cover:1. **Key naming convention and namespaces.** Use these five namespaces: `pages`, `flights`,   `bookings`, `common`, `destinations`. Give the key-naming rule (e.g. dot-nested, lowerCamel   leaf keys) and one worked example per namespace.2. **File-ownership map for 5 parallel workers**, so five people can extract strings at once with   **no merge conflicts**. Exactly one namespace JSON per worker:   | Worker | Owns (source files) | Namespace JSON |   |---|---|---|   | 1 | `src/pages/` | `pages` |   | 2 | `src/components/flights/` | `flights` |   | 3 | `src/components/bookings/` | `bookings` |   | 4 | `src/components/layout/`, `src/components/common/`, `src/components/user/` | `common` |   | 5 | `src/data/destinations.ts` | `destinations` |   List the actual files each worker touches (from the Explore pass).3. **i18next runtime setup**: `src/i18n/index.ts` (init with the three languages, namespaces,   fallback `en`, interpolation), wiring in `src/main.tsx`, and a `LanguageSwitcher` component.4. **The `Intl` approach**: numbers, currency, dates, and relative time formatted through `Intl`   (and date-fns locales where helpful), **keyed by `i18n.language`**, centralized in   `src/utils/formatters.ts`.5. **The RTL approach**: `<html lang dir>` driven by the active language, Tailwind **logical**   utilities (`ms-*`/`me-*`/`ps-*`/`pe-*`, `text-start`/`text-end`) instead of physical   left/right, and mirrored directional icons.6. **The data rule**: any value used as a **filter key or URL/route value keeps its English   value**; translate only the visible label (look up the label by a stable English slug/id).## Acceptance checks- `plans/i18n-plan.md` exists and covers all six points above.- The ownership map assigns every worker exactly one namespace and lists real files.- The plan references the glossary's do-not-translate brand terms (e.g. Galaxium) and the planet  label-vs-value rule.Push back directly if any of this is wrong or if you would exceed the budget.

**Assistant:**



_spend: {'cost': 0.024274, 'contextTokens': 12137}_

**Tool:**

# Create Plan

Follow this structured workflow to produce a high-quality, actionable plan.

## Step 1 — Gather Requirements

Ask the user clarifying questions to fully understand the task:
- What is the goal and expected outcome?
- Are there constraints, preferences, or non-goals?
- Which parts of the codebase are likely involved?
- Any related issues or requirement documents?

Do not proceed until you have enough context to scope the work, be critical of vague intent or requirements.

## Step 2 — Code Search via Sub-Agent

Spawn a `spawn_subagent` of type `"explore"` to research the codebase. The sub-agent should:
- Locate relevant files, symbols, and patterns related to the task
- Identify existing utilities or abstractions that should be reused
- Identify existing design patterns
- Surface any constraints or conventions (e.g. patterns in similar files)

Use the sub-agent's findings to ground your plan in the actual code.

## Step 3 — Clarify Design Intention

Based on the requirements and code research:
- Always confirm your understanding of the intended design with the user
- Raise any open questions or trade-offs that need a decision
- Adjust scope if the code research revealed complexity or simplifications

Do not begin writing the plan document until design intent is confirmed.

## Step 4 — Write the Plan File

Write a structured plan to a markdown file (e.g. `{short-plan-name}-plan.md`). The plan must NOT go into low-level code detail — focus on *what* needs to happen and *why*.

The plan file must include:

### Top-Level Overview
A concise summary of the goal, scope, and approach.

### Sub-Tasks
Break the work into sub-tasks. Each sub-task must have:
- **Intent** — what this sub-task achieves and why
- **Expected Outcomes** — observable results when this sub-task is complete
- **Todo List** — ordered, specific steps to achieve the outcome
- **Relevant Context** — pointers to relevant files, symbols, or patterns
- **Status** — `[ ] pending` (updated to `[x] done` after completion)

Design each sub-task to be processed independently, one at a time, so changes stay focused and reviewable.

## Step 5 — Plan Validation

Before moving to implementation, ensure that the user has fully read the plan. Always ask the user targeted questions to verify the plan is correct and complete:
- Does this plan capture the full scope of the task?
- Are the sub-task boundaries and ordering correct?
- Is any context missing that would be needed during implementation?

Use Mermaid diagrams in chat responses where they clarify architecture or workflow, but do not place Mermaid diagrams directly in the plan file. Avoid double quotes and parentheses inside square brackets in Mermaid syntax.

Refine the plan file based on the user's answers.

## Step 6 — Implementation

Only after the user confirms the plan, recommend implementation by calling the `switch_mode` tool to `agent`.

When explaining how to implement the plan in agent mode:
- Using the `start_subtask` tool, create a new task for each subtask in the <plan-file>.
- In the prompt for the subtask make sure it reads the plan-file to gain the full context around the task.
- After each sub task is complete update the task status in the <plan-file>
- Add any context needed for the next subtask in the <plan-file>
- Wait for the user to check and ok the changes before moving on to the next subtask.

## Reminders

- Ask questions always using the "ask_followup_question" tool
- Never include information without evidence
- Don't include time estimates

**Assistant:**

Good. Now let me explore the codebase and read the attached documents in parallel.

_spend: {'cost': 0.02675, 'contextTokens': 13375}_

**Tool:**

<task_result>
Perfect! Now I have all the information needed. Let me compile the comprehensive codebase map.

---

## **GALAXIUM TRAVELS — COMPLETE CODEBASE MAP**

### **PROJECT OVERVIEW**
- **App Name**: Galaxium Travels (fictional interplanetary booking system)
- **Stack**: React 19.2.0 + TypeScript 5.9.3 + Vite 7.2.4 + Tailwind CSS 3.4.19
- **Entry Point**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router DOM v7.12.0 (HashRouter for static hosting)
- **State Management**: React Context (UserProvider)
- **API Mode**: Supports both real backend and in-memory demo mode (`VITE_DEMO=1`)

---

## **1. ROOT-LEVEL FILES & CONFIG**

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: axios, date-fns, framer-motion, lucide-react, react-hot-toast, react-router-dom. ESLint plugin for i18n. |
| `tsconfig.app.json` | TypeScript strict mode, ES2022 target, JSX react-jsx |
| `tailwind.config.js` | Custom colors (space-dark, cosmic-purple, solar-orange, alien-green, star-white); gradients; animations (float, twinkle) |
| `vite.config.ts` | React plugin; proxy to `/api` → `http://localhost:8001`; configurable base path for GitHub Pages; HashRouter-compatible |
| `eslint.i18n.config.mjs` | i18next ESLint plugin (jsx-only mode) — flags hard-coded strings in JSX text and `{placeholder, alt, title, aria-label}` attributes only |
| `index.html` | Entry point; loads React root at `#root` |
| `postcss.config.js` | Tailwind/Autoprefixer integration |
| `eslint.config.js` | Main ESLint config (not i18n-specific) |

---

## **2. DOCUMENTATION FILES** ✓

| File | Status | Contents |
|------|--------|----------|
| `docs/glossary.xlsx` | **EXISTS** | 33 rows, 6 cols. Glossary + Legend sheets. Terms & translations. |
| `docs/style-guide.pdf` | **EXISTS** | Style guide document. |

---

## **3. SRC/ DIRECTORY STRUCTURE**

```
src/
├── main.tsx                          # React root render (imports App)
├── App.tsx                           # Router + UserProvider wrapper
├── App.css                           # Legacy CSS (minimal; mostly Tailwind)
├── index.css                         # Base styles
├── vite-env.d.ts                     # Vite environment types
│
├── pages/
│   ├── Home.tsx                      # Hero, features, destinations grid
│   ├── Flights.tsx                   # Flight search, filters, results
│   ├── MyBookings.tsx                # User bookings + holds display
│   └── DestinationDetail.tsx         # Single destination details, flights to that destination
│
├── components/
│   ├── common/
│   │   ├── index.ts                  # Re-exports: Button, Card, Input, Modal, LoadingSpinner, Starfield
│   │   ├── Button.tsx                # Polymorphic button (size, variant props)
│   │   ├── Card.tsx                  # Glass-card wrapper
│   │   ├── Input.tsx                 # Text input field
│   │   ├── Modal.tsx                 # Dialog wrapper
│   │   ├── LoadingSpinner.tsx        # Loading indicator
│   │   └── Starfield.tsx             # Animated starfield background
│   │
│   ├── layout/
│   │   ├── Header.tsx                # Navigation bar + user menu
│   │   ├── Footer.tsx                # Footer
│   │   └── Layout.tsx                # Wrapper (Header + children + Footer)
│   │
│   ├── flights/
│   │   ├── FlightCard.tsx            # Single flight display (origin → dest, 3 seat classes)
│   │   └── FlightFilters.tsx         # Filter controls (origin, dest, price, etc.)
│   │
│   ├── bookings/
│   │   ├── BookingCard.tsx           # Display confirmed booking
│   │   ├── BookingModal.tsx          # Quote → Hold → Confirm flow
│   │   └── HoldCard.tsx              # Display pending hold
│   │
│   └── user/
│       └── UserIdentification.tsx    # Login/register modal
│
├── data/
│   └── destinations.ts               # DestinationData interface + 7 destination objects (Earth, Mars, Moon, Venus, Jupiter, Europa, Pluto)
│                                       # Lookup functions: getDestinationBySlug(), getDestinationByName(), ALL_DESTINATIONS
│
├── services/
│   ├── api.ts                        # Axios client; Flight, Booking, User, Quote, Hold endpoints
│   │                                  # FlightFilters interface; demoApi integration
│   └── demoApi.ts                    # In-memory backend (seeded data; quote→hold→confirm flow)
│
├── hooks/
│   ├── useUser.tsx                   # UserProvider + user state/localStorage sync
│   └── useUserContext.ts             # createContext + useUser hook
│
├── types/
│   └── index.ts                      # All TS interfaces: Flight, Booking, User, Quote, Hold, StoredHold, SeatClass, etc.
│
├── utils/
│   ├── formatters.ts                 # date-fns wrappers (formatDate, formatTime, formatCurrency, calculateDuration, getRelativeTime)
│   └── holdStorage.ts                # localStorage persistence for holds (getStoredHolds, storeHold, removeHold)
│
└── assets/
    └── react.svg                     # React logo
```

---

## **4. KEY FILES — CONTENT SUMMARY**

### **src/main.tsx**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
)
```
- **Imports**: `App.tsx`
- **Renders**: `<App />` into `#root`
- **No i18n setup here**

---

### **src/App.tsx**
```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Flights } from './pages/Flights';
import { MyBookings } from './pages/MyBookings';
import { DestinationDetail } from './pages/DestinationDetail';

function App() {
  return (
    <HashRouter>
      <UserProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/destinations/:slug" element={<DestinationDetail />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </UserProvider>
    </HashRouter>
  );
}

export default App;
```
- **Component exports**: Home, Flights, MyBookings, DestinationDetail
- **Route structure**: 4 pages + wildcard fallback
- **Providers**: UserProvider wraps all routes
- **Routing**: HashRouter (static hosting compatible)

---

### **src/data/destinations.ts**
```tsx
export interface DestinationData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  facts: { gravity, distanceFromEarth, typicalTransitTime, surfaceTemp, moons, atmosphere };
  hazards: string[];
  gallery: { alt, description, colorClass }[];
  accentColor: string;
  bgAccent: string;
  borderAccent: string;
}

const destinations: DestinationData[] = [
  { slug: 'earth', name: 'Earth', tagline: 'The cradle of humanity...', ... },
  { slug: 'mars', name: 'Mars', tagline: 'Rust-red horizons...', ... },
  { slug: 'moon', name: 'Moon', tagline: 'Humanity\'s first step...', ... },
  { slug: 'venus', name: 'Venus', tagline: 'Hellscape below, paradise above...', ... },
  { slug: 'jupiter', name: 'Jupiter', tagline: 'King of planets...', ... },
  { slug: 'europa', name: 'Europa', tagline: 'Beneath the ice...', ... },
  { slug: 'pluto', name: 'Pluto', tagline: 'The edge of the known...', ... },
];

export const getDestinationBySlug = (slug: string): DestinationData | null => {...}
export const getDestinationByName = (name: string): DestinationData | null => {...}
export const ALL_DESTINATIONS: ReadonlyArray<DestinationData> = destinations;
```
- **7 destinations** with full descriptions, facts, hazards, gallery, accent colors
- **All strings are hard-coded English** (no i18n keys yet)
- **Export functions**: slug lookup, name lookup, all destinations array

---

### **src/pages/Home.tsx**
```tsx
export const Home = () => {
  const features = [
    { icon: <Rocket />, title: 'Interplanetary Travel', description: '...' },
    { icon: <Globe />, title: 'Multiple Destinations', description: '...' },
    { icon: <Shield />, title: 'Safe & Secure', description: '...' },
    { icon: <Zap />, title: 'Instant Booking', description: '...' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <h1>Journey Beyond The Stars</h1>
      <p>Experience the future of space travel...</p>
      <Link to="/flights"><Button>Explore Flights</Button></Link>
      
      {/* Features Section */}
      <h2>Why Choose Galaxium?</h2>
      {/* Feature cards with icons */}
      
      {/* Explore Destinations Section */}
      <h2>Explore Our Destinations</h2>
      {ALL_DESTINATIONS.map(...)} {/* 7 destination cards */}
      
      {/* CTA Section */}
      <h2>Ready for Your Space Adventure?</h2>
      <Button>Book Your Flight Now</Button>
    </div>
  );
};
```
- **Hard-coded strings**: "Journey Beyond", "The Stars", "Why Choose Galaxium?", feature titles & descriptions, CTA text
- **Components used**: Button, Link, motion (framer-motion), icons (lucide-react)
- **Uses**: ALL_DESTINATIONS from data/destinations.ts

---

### **src/pages/Flights.tsx** (excerpt)
- **Exports**: `Flights` component
- **State**: flights[], searchTerm, filters, selectedFlight, modals
- **Hard-coded**: "Explore Flights", filter labels
- **Uses**: FlightCard, FlightFilters, BookingModal, UserIdentification, getFlights from api.ts

---

### **src/pages/MyBookings.tsx** (excerpt)
- **Exports**: `MyBookings` component
- **State**: bookings[], activeHolds[], modals
- **Uses**: BookingCard, HoldCard, holdStorage.ts, api.ts

---

### **src/pages/DestinationDetail.tsx** (excerpt)
- **Exports**: `DestinationDetail` component
- **Route params**: slug
- **Hard-coded**: labels in FactTile component
- **Uses**: getDestinationBySlug from data/destinations.ts, getFlights from api.ts

---

### **src/utils/formatters.ts**
```tsx
export const formatDate = (dateString: string, formatString = 'MMM dd, yyyy HH:mm'): string
export const formatDateShort = (dateString: string): string
export const formatTime = (dateString: string): string
export const formatCurrency = (amount: number): string  // USD, no decimals
export const formatNumber = (num: number): string
export const getRelativeTime = (dateString: string): string  // "2 hours ago"
export const calculateDuration = (departureTime: string, arrivalTime: string): string  // "5h 30m"
```
- **All formatters use date-fns and Intl APIs** (no i18n-aware locales yet)
- **Currency always USD** (`en-US` hard-coded)
- **All hard-coded unit strings**: "min", "h", "m", "just now", "minutes ago", "hours ago", "days ago"

---

### **src/utils/holdStorage.ts**
```tsx
const KEY_PREFIX = 'galaxium_holds_';

export const getStoredHolds = (userId: number): StoredHold[] => {...}
export const storeHold = (userId: number, hold: StoredHold): void => {...}
export const removeHold = (userId: number, holdId: string): void => {...}
```
- **localStorage persistence** for booking holds
- **No translatable strings**

---

### **src/types/index.ts**
```tsx
export type SeatClass = 'economy' | 'business' | 'galaxium';

export interface Flight {
  flight_id: number;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  economy_seats_available: number;
  business_seats_available: number;
  galaxium_seats_available: number;
  economy_price: number;
  business_price: number;
  galaxium_price: number;
}

export interface Booking { ... }
export interface User { ... }
export interface Quote { ... }
export interface Hold { ... }
export interface StoredHold { ... }
export interface BookingRequest { ... }
export interface UserRegistration { ... }
export interface ErrorResponse { ... }
export interface FlightFilters { ... }
export interface UserContextType { ... }
```
- **All API data models** (matching backend schemas)
- **No translatable strings** (all TS types)

---

### **src/services/api.ts** (excerpt)
```tsx
const DEMO = import.meta.env.VITE_DEMO === '1';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface FlightFilters { ... } // 15+ filter options
export const getFlights = async (filters?: FlightFilters): Promise<Flight[]>
export const getUserBookings = async (userId: number): Promise<Booking[]>
export const getUserByEmail = async (email: string): Promise<User | ErrorResponse>
export const registerUser = async (data: UserRegistration): Promise<User | ErrorResponse>
export const cancelBooking = async (bookingId: number): Promise<boolean | ErrorResponse>
export const createQuote = async (request: CreateQuoteRequest): Promise<Quote | ErrorResponse>
export const createHold = async (quoteId: string): Promise<Hold | ErrorResponse>
export const confirmHold = async (holdId: string): Promise<Booking | ErrorResponse>
export const releaseHold = async (holdId: string): Promise<boolean | ErrorResponse>
export const getHold = async (holdId: string): Promise<Hold | ErrorResponse>
```
- **Switches to demoApi if `VITE_DEMO === '1'`**
- **Supports multiple filter styles** (main branch + feature branch variants)
- **No user-visible strings in api.ts**

---

### **src/services/demoApi.ts** (excerpt)
```tsx
// In-memory demo backend; seeded data; quote→hold→confirm flow
// Data persists to localStorage within session
const DEMO_NOW_ISO = '2026-09-27T12:00:00Z';
const STORAGE_KEY = 'worldready_demo_v1';

const SEED_USERS = [
  { name: 'Alice', email: 'alice@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  // ... 8 more
];
```
- **Comment header**: "This is Claude Code plumbing, not product code. Bob owns i18n; it must not edit this file"
- **Demo mode only** (no i18n)

---

### **src/hooks/useUser.tsx**
```tsx
const USER_STORAGE_KEY = 'galaxium_user';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const logout = () => { setUser(null); };

  return <UserContext.Provider value={{ user, setUser, logout }}>{children}</UserContext.Provider>;
};
```
- **Provides**: user state + setUser + logout
- **Persists** to localStorage (key: `'galaxium_user'`)
- **No translatable strings**

---

### **src/hooks/useUserContext.ts**
```tsx
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
```
- **Context definition + hook**
- **Error message**: "useUser must be used within a UserProvider" (hard-coded)

---

### **src/components/layout/Header.tsx** (excerpt)
```tsx
export const Header = () => {
  const { user, logout } = useUser();
  const [showUserModal, setShowUserModal] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 glass-card border-b border-white/10">
      {/* Logo: Rocket icon + "Galaxium Travels" */}
      <Link to="/" className="flex items-center gap-2 group">
        <Rocket className="text-cosmic-purple" size={32} />
        <span className="text-2xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
          Galaxium Travels
        </span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/">Home</Link>
        <Link to="/flights">Flights</Link>
        <Link to="/bookings">My Bookings</Link>
      </nav>

      {/* User menu / Login button */}
      {user ? (
        <>
          <span className="text-star-white">{user.name}</span>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Button onClick={() => setShowUserModal(true)}>Login</Button>
      )}

      <UserIdentification isOpen={showUserModal} onClose={...} />
    </header>
  );
};
```
- **Hard-coded text**: "Galaxium Travels", "Home", "Flights", "My Bookings", "Login", "Logout"
- **Uses**: UserIdentification modal, useUser hook

---

### **src/components/layout/Layout.tsx**
```tsx
export const Layout = ({ children }: { children: ReactNode }) => (
  <>
    <Header />
    <main className="pt-20 pb-20">
      {children}
    </main>
    <Footer />
  </>
);
```
- **Wrapper**: Header + main (with padding) + Footer

---

### **src/components/common/index.ts**
```tsx
export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Modal } from './Modal';
export { LoadingSpinner } from './LoadingSpinner';
export { Starfield } from './Starfield';
```
- **Barrel export** for common components

---

### **src/components/flights/FlightCard.tsx** (excerpt)
```tsx
export const FlightCard = ({ flight, onBook }: FlightCardProps) => {
  const seatClasses = [
    {
      name: 'Economy',
      class: 'economy' as SeatClass,
      price: flight.economy_price,
      seats: flight.economy_seats_available,
      icon: Plane,
      color: 'text-blue-400',
    },
    {
      name: 'Business',
      class: 'business' as SeatClass,
      price: flight.business_price,
      seats: flight.business_seats_available,
      icon: Crown,
      color: 'text-purple-400',
    },
    {
      name: 'Galaxium',
      class: 'galaxium' as SeatClass,
      price: flight.galaxium_price,
      seats: flight.galaxium_seats_available,
      icon: Rocket,
      color: 'text-cosmic-purple',
    },
  ];

  return (
    <Card>
      {/* Flight info: origin → destination */}
      <div>{flight.origin} → {flight.destination}</div>
      {/* Departure/arrival times */}
      {/* 3 seat class buttons */}
      {/* Book button */}
    </Card>
  );
};
```
- **Hard-coded seat class names**: "Economy", "Business", "Galaxium"
- **Uses**: formatters (formatCurrency, formatTime, calculateDuration)

---

### **src/components/bookings/BookingModal.tsx** (excerpt)
```tsx
type Step = 'select' | 'quote' | 'hold';

export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
  const { user } = useUser();
  const [step, setStep] = useState<Step>('select');
  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Step 1: Select seat class
  // Step 2: Display quote (price, expiry)
  // Step 3: Create hold → confirm booking
};
```
- **Hard-coded modal labels**: "Select Seat Class", prices, "Confirm Booking", etc.
- **Uses**: createQuote, createHold, confirmHold, releaseHold from api.ts

---

### **src/components/user/UserIdentification.tsx**
- **Hard-coded**: "Login", "Register", "Email", "Name" labels
- **Uses**: getUserByEmail, registerUser from api.ts

---

### **src/components/common/Button.tsx**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ size = 'md', variant = 'primary', children, ...props }: ButtonProps) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  const variantClasses = {
    primary: 'bg-cosmic-gradient text-white',
    secondary: 'border border-cosmic-purple text-cosmic-purple',
  };
  return <button className={`${sizeClasses[size]} ${variantClasses[variant]}`} {...props}>{children}</button>;
};
```
- **No translatable strings** (component-only)

---

### **src/components/common/Modal.tsx**
```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => (
  isOpen && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md rounded-lg">
        {title && <h2>{title}</h2>}
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  )
);
```
- **Hard-coded text**: "Close" button

---

### **src/index.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .glass-card {
    @apply bg-white/5 backdrop-blur-md rounded-lg border border-white/10;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(to bottom, #030712, #0A1929);
  color: #F9FAFB;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

html {
  scroll-behavior: smooth;
}
```
- **Tailwind directives** + custom `.glass-card` component
- **No translatable strings**

---

## **5. HARD-CODED ENGLISH STRINGS BY LOCATION**

### **Critical User-Visible Strings** (need i18n):

**Pages:**
- Home.tsx: "Journey Beyond", "The Stars", "Explore Flights", "Learn More", "Why Choose Galaxium?", "Explore Our Destinations", "Ready for Your Space Adventure?", "Book Your Flight Now", feature titles (4), feature descriptions (4)
- Flights.tsx: "Explore Flights", filter labels, error messages
- MyBookings.tsx: "My Bookings", "Cancel Booking", modal confirmations
- DestinationDetail.tsx: destination facts labels (gravity, distance, transit time, temp, moons, atmosphere), hazard titles

**Components:**
- Header.tsx: "Home", "Flights", "My Bookings", "Login", "Logout", "Galaxium Travels"
- FlightCard.tsx: "Economy", "Business", "Galaxium", "Book"
- BookingModal.tsx: Step titles, "Confirm Booking", "Release Hold", hold expiry display
- UserIdentification.tsx: "Login", "Register", "Email", "Name"
- Common components: "Close", "Loading...", error messages

**Data:**
- destinations.ts: All 7 destination names, taglines, descriptions, facts, hazards

**Utilities:**
- formatters.ts: "min", "h", "m", "just now", "minutes ago", "hours ago", "days ago"
- Hooks: "useUser must be used within a UserProvider"

---

## **6. CURRENT i18n STATUS**

| Aspect | Status |
|--------|--------|
| **i18n library** | ❌ Not installed (no react-i18next) |
| **Translation files** | ❌ None (.json/.yaml translation files) |
| **i18n setup hook** | ❌ None |
| **ESLint i18n plugin** | ✅ Installed (eslint-plugin-i18next v6.1.5) |
| **ESLint i18n config** | ✅ `eslint.i18n.config.mjs` (jsx-only mode; counts literals) |
| **i18n scripts** | ✅ `scripts/count-literals.mjs`, `key-parity.mjs`, `english-parity.mjs`, `score-traps.mjs`, `pseudo.mjs` |
| **Translation key placeholders** | ❌ No keys in code (all hard-coded strings) |

---

## **7. COMPONENTS INVENTORY**

### **Pages** (4)
1. Home.tsx
2. Flights.tsx
3. MyBookings.tsx
4. DestinationDetail.tsx

### **Layout Components** (3)
1. Header.tsx
2. Footer.tsx
3. Layout.tsx

### **Common UI Components** (6)
1. Button.tsx
2. Card.tsx
3. Input.tsx
4. Modal.tsx
5. LoadingSpinner.tsx
6. Starfield.tsx

### **Flight Components** (2)
1. FlightCard.tsx
2. FlightFilters.tsx

### **Booking Components** (3)
1. BookingCard.tsx
2. BookingModal.tsx
3. HoldCard.tsx

### **User Components** (1)
1. UserIdentification.tsx

**Total: 18 components** (4 pages + 3 layout + 6 common + 2 flights + 3 bookings + 1 user)

---

## **8. PACKAGE DEPENDENCIES SUMMARY**

### **Core**
- react 19.2.0
- react-dom 19.2.0
- react-router-dom 7.12.0
- typescript 5.9.3

### **UI & Animations**
- tailwindcss 3.4.19
- framer-motion 12.26.1
- lucide-react 0.562.0
- react-hot-toast 2.6.0

### **Data & Utilities**
- axios 1.13.2
- date-fns 4.1.0
- clsx 2.1.1

### **Dev Tools**
- vite 7.2.4
- eslint 9.39.1
- eslint-plugin-i18next 6.1.5 ⭐
- playwright 1.63.0

---

## **9. ENVIRONMENT VARIABLES** (Observed)

```env
VITE_API_URL = /api (default)
VITE_DEMO = '1' (switches to in-memory backend)
VITE_BASE = / (default; configurable for GitHub Pages)
```

---

## **10. LOCAL STORAGE KEYS USED**

| Key | Purpose | Data Model |
|-----|---------|------------|
| `galaxium_user` | Persisted user object | `{ user_id, name, email }` |
| `galaxium_holds_${userId}` | Persisted booking holds | Array of `StoredHold[]` |
| `worldready_demo_v1` | Demo mode in-memory state | Internal (demoApi.ts) |

---

## **SUMMARY FOR INTERNATIONALIZATION PREP**

✅ **Infrastructure Ready:**
- ESLint i18n plugin (eslint-plugin-i18next) installed
- Literal counter scripts in place (scripts/count-literals.mjs, etc.)
- No conflicting i18n setup (clean slate)

❌ **Requires Implementation:**
- Install react-i18next + i18next
- Create translation namespaces (common, pages, components, errors, formatters)
- Replace all hard-coded strings with `useTranslation()` hooks or `<Trans>` components
- Add locale switcher UI
- Create translation JSON files for target languages
- Configure i18n initialization (i18n.ts / i18n.js)

**Estimated String Count:** 100–150+ user-visible English strings across pages, components, data, and utilities.
</task_result>

_spend: {'cost': 0.17952799999999997, 'contextTokens': 36853}_

**Assistant:**

Now let me read the glossary and style guide in parallel:

_spend: {'cost': 0.043274, 'contextTokens': 21637}_

**Tool:**

=== Sheet: Glossary ===
[/Glossary/row[1]] A1=Term (English)	B1=Part of speech	C1=French (fr-CA)	D1=Arabic (ar)	E1=Do not translate	F1=Notes
[/Glossary/row[2]] A2=Galaxium	B2=proper noun	C2=Galaxium	D2=Galaxium	E2=YES	F2=Brand name. Never translate or transliterate; keep Latin script even in Arabic (allow-listed in the scan).
[/Glossary/row[3]] A3=Galaxium Travels	B3=proper noun	C3=Galaxium Travels	D3=Galaxium Travels	E3=YES	F3=Company / app name. Use as the <title> and header brand.
[/Glossary/row[4]] A4=Galaxium Class	B4=noun (seat class)	C4=Galaxium Class	D4=Galaxium Class	E4=YES	F4=Premium seat class. Brand term — keep English in all languages.
[/Glossary/row[5]] A5=WorldReady	B5=proper noun	C5=WorldReady	D5=WorldReady	E5=YES	F5=Our product name. Never translate.
[/Glossary/row[6]] A6=Bob	B6=proper noun	C6=Bob	D6=Bob	E6=YES	F6=IBM Bob (the IDE that built the app). Keep verbatim.
[/Glossary/row[7]] A7=flight	B7=noun	C7=vol	D7=رحلة	E7=NO	F7=The core travel unit.
[/Glossary/row[8]] A8=booking	B8=noun	C8=réservation	D8=حجز	E8=NO	F8=A confirmed reservation.
[/Glossary/row[9]] A9=hold	B9=noun	C9=réservation temporaire	D9=حجز مؤقت	E9=NO	F9=A temporary 15-minute seat reservation. Do NOT use 'prise' / 'blocage'.
[/Glossary/row[10]] A10=quote	B10=noun	C10=devis	D10=عرض سعر	E10=NO	F10=A price quote, valid 24h.
[/Glossary/row[11]] A11=seat	B11=noun	C11=place	D11=مقعد	E11=NO	F11=Prefer 'place' over 'siège' for availability counts in fr-CA (e.g. '3 places restantes').
[/Glossary/row[12]] A12=destination	B12=noun	C12=destination	D12=وجهة	E12=NO	F12=Planet the flight arrives at.
[/Glossary/row[13]] A13=origin	B13=noun	C13=origine	D13=المنشأ	E13=NO	F13=Departure planet.
[/Glossary/row[14]] A14=departure	B14=noun	C14=départ	D14=المغادرة	E14=NO	F14=
[/Glossary/row[15]] A15=arrival	B15=noun	C15=arrivée	D15=الوصول	E15=NO	F15=
[/Glossary/row[16]] A16=economy	B16=noun (seat class)	C16=économique	D16=الدرجة الاقتصادية	E16=NO	F16=Seat class.
[/Glossary/row[17]] A17=business	B17=noun (seat class)	C17=affaires	D17=درجة رجال الأعمال	E17=NO	F17=Seat class 'Business' -> 'Classe affaires'.
[/Glossary/row[18]] A18=passenger	B18=noun	C18=passager	D18=مسافر	E18=NO	F18=
[/Glossary/row[19]] A19=cancel	B19=verb	C19=annuler	D19=إلغاء	E19=NO	F19=Action on a booking.
[/Glossary/row[20]] A20=confirm	B20=verb	C20=confirmer	D20=تأكيد	E20=NO	F20=
[/Glossary/row[21]] A21=release	B21=verb	C21=libérer	D21=إلغاء الحجز المؤقت	E21=NO	F21=Release a temporary hold.
[/Glossary/row[22]] A22=sign in	B22=verb	C22=se connecter	D22=تسجيل الدخول	E22=NO	F22=Use the verb 'se connecter'; avoid the noun 'connexion' for the button.
[/Glossary/row[23]] A23=register	B23=verb	C23=s'inscrire	D23=إنشاء حساب	E23=NO	F23=Create an account.
[/Glossary/row[24]] A24=price	B24=noun	C24=prix	D24=السعر	E24=NO	F24=Format via Intl.NumberFormat keyed to the locale; CAD in fr-CA, not USD.
[/Glossary/row[25]] A25=email	B25=noun	C25=courriel	D25=البريد الإلكتروني	E25=NO	F25=Quebec term: use 'courriel', NOT 'e-mail' or 'mail'.
[/Glossary/row[26]] A26=spaceport	B26=noun	C26=astroport	D26=ميناء فضائي	E26=NO	F26=Departure/arrival facility.
[/Glossary/row[27]] A27=Earth	B27=proper noun (planet)	C27=Terre	D27=الأرض	E27=LABEL ONLY	F27=Translate the display label; keep 'Earth' as the slug/filter value (DestinationDetail filter).
[/Glossary/row[28]] A28=Mars	B28=proper noun (planet)	C28=Mars	D28=المريخ	E28=LABEL ONLY	F28=Label translates only in Arabic; keep 'Mars' as the /flights?destination= value.
[/Glossary/row[29]] A29=Moon	B29=proper noun (planet)	C29=Lune	D29=القمر	E29=LABEL ONLY	F29=Keep 'Moon' as the data value.
[/Glossary/row[30]] A30=Venus	B30=proper noun (planet)	C30=Vénus	D30=الزهرة	E30=LABEL ONLY	F30=Keep 'Venus' as the data value.
[/Glossary/row[31]] A31=Jupiter	B31=proper noun (planet)	C31=Jupiter	D31=المشتري	E31=LABEL ONLY	F31=Keep 'Jupiter' as the data value.
[/Glossary/row[32]] A32=Europa	B32=proper noun (moon)	C32=Europe	D32=أوروبا	E32=LABEL ONLY	F32=The moon Europa -> fr 'Europe' (add context to avoid the continent); keep 'Europa' as the data value.
[/Glossary/row[33]] A33=Pluto	B33=proper noun (planet)	C33=Pluton	D33=بلوتو	E33=LABEL ONLY	F33=Keep 'Pluto' as the data value.

=== Sheet: Legend ===
[/Legend/row[1]] A1=WorldReady glossary — legend
[/Legend/row[2]] A2=
[/Legend/row[3]] A3=Do not translate = YES        Keep the English/brand term verbatim in every language.
[/Legend/row[4]] A4=Do not translate = NO         Translate normally into French (fr-CA) and Arabic.
[/Legend/row[5]] A5=Do not translate = LABEL ONLY Translate the on-screen label, but keep the ENGLISH value
[/Legend/row[6]] A6=                              as the data / URL / filter value (planet names double as
[/Legend/row[7]] A7=                              flight-search filters, so the value must stay English).
[/Legend/row[8]] A8=
[/Legend/row[9]] A9=French is Quebec French (fr-CA): 'vous', CAD currency, 'courriel' for email.
[/Legend/row[10]] A10=Arabic is right-to-left with Western digits; brand names stay in Latin script.
[/Legend/row[11]] A11=
[/Legend/row[12]] A12=Authored by Claude Code (worker P03) — original content, no copied proprietary text.

**Assistant:**



_spend: {'cost': 0.04796, 'contextTokens': 23980}_

**Tool:**

Contents of file docs/style-guide.pdf:

1 | 
2 | 
3 | WorldReady — Localization Style Guide
4 | Galaxium Travels · English → French (Quebec) + Arabic (RTL) · authored by Claude Code (P03)
5 | 1 · French for Quebec (fr-CA)
6 | Register: address the user with « vous », never « tu ». Keep it professional and concise.
7 | Currency: format money as Canadian dollars (CAD) in fr-CA, e.g. 1 200,00 $ CA — comma decimal, space
8 | thousands, symbol after the number. Use Intl.NumberFormat('fr-CA', { style:'currency', currency:'CAD' });
9 | never hard-code en-US/USD.
10 | Dates & numbers: day-month-year (1 juin 2025), 24-hour clock, comma decimal, space as thousands separator.
11 | Localize month names via a date-fns fr locale — never English month abbreviations.
12 | Quebec terminology: use courriel (not « e-mail »), clavardage (chat), téléverser (upload). See the glossary for
13 | domain terms (vol, réservation, place, devis).
14 | Spacing: French uses a non-breaking space before : ; ! ? and inside « guillemets ».
15 | Why it matters: Quebec's Bill 96 / Law 14 has required French commercial web content since 1 June 2025, with fines
16 | of $3,000–$30,000 per violation.
17 | 3 · Engineering rules (all languages)
18 | Never concatenate translated fragments
19 | ✗ "Showing " + n + " flight" + (n!==1?"s":"") — word order and plurals differ per language.
20 | ✓ t('flights.count', { count: n }) with i18next plural keys (_one, _other, and for Arabic
21 | _zero/_two/_few/_many).
22 | Keep placeholders & markup intact
23 | Preserve every {{name}} / {{count}} and <0>...</0> tag exactly — do not translate, reorder-break, or delete them.
24 | Translators may move a placeholder within the sentence but must keep it verbatim.
25 | Numbers, dates and currency come from Intl keyed to the active language — not from the translation string.
26 | String length limits
27 | Translations run up to ~30% longer than English (French especially). Keep button/label copy tight; test with the
28 | pseudo-locale (⟦...⟧, +30%) to catch clipping before shipping.
29 | Respect the max length column in the translator spreadsheet for constrained UI (buttons, chips, nav).
30 | WorldReady localization style guide — page 1 of 2
31 | 
32 | 2 · Arabic (ar) — right-to-left
33 | Direction: the whole UI mirrors. Set <html dir="rtl" lang="ar"> (via document.documentElement.dir =
34 | i18n.dir()) and use logical CSS: ms-/me-, ps-/pe-, start-/end- instead of ml-/mr-, pl-/pr-,
35 | left-/right-.
36 | Mirrored icons: directional icons (back arrows, chevrons, progress) must flip: rtl:-scale-x-100 or swap
37 | ArrowLeft↔ArrowRight. Non-directional icons (rocket, user, clock) stay as-is.
38 | Digits: use Western/Latin digits (0-9), not Eastern-Arabic (٩-٠), for prices and counts — match the product's market
39 | convention via Intl.NumberFormat('ar', { numberingSystem:'latn' }).
40 | Currency & dates: format through Intl keyed to ar; keep the currency the market expects (USD/CAD per
41 | business rule). Localize month names with a date-fns Arabic locale.
42 | Plurals: Arabic has six plural forms — zero, one, two, few, many, other. Every countable string needs all six
43 | i18next keys; the key-parity checker enforces this.
44 | Brand names & planet values: keep Galaxium and other brand terms in Latin script (allow-listed). Translate planet
45 | labels (المر يخ) but keep the English value (Mars) as the search/filter value.
46 | Punctuation: use Arabic comma (،) and question mark (؟) where natural.
47 | Quality note: machine drafts are for native review. This guide governs structure, formatting, placeholders and layout
48 | — not literary polish. Flag anything a native reviewer must confirm in the translator spreadsheet's reviewer note
49 | column.
50 | Example (RTL)
51 | EnglishArabic (label)
52 | Available Flightsالرحلات المتاحة
53 | {{count}} seats left{{ مقاعد متبقيةcount}} 
54 | Book a Flightاحجز رحلة
55 | WorldReady localization style guide — page 2 of 2 · © Galaxium demo content authored by Claude Code (P03)

**Assistant:**

Now I have everything I need. Let me write the plan:

_spend: {'cost': 0.05082, 'contextTokens': 25410}_

**Tool:**

To do list updated: 5 items total.

Next to do item inprogress: Write plans/i18n-plan.md

**Assistant:**



_spend: {'cost': 0.066716, 'contextTokens': 33358}_

**Tool:**

Created file: plans/i18n-plan.md

<result>
# i18n Plan — Galaxium Travels (WorldReady Task 01)

**Date:** 2026-09-27  
**Scope:** Internationalize this English-only React + TypeScript app into English (`en`), French Quebec (`fr-CA`), and Arabic (`ar`, RTL) using **react-i18next** and the **`Intl`** APIs.  
**Constraint:** No product-code changes in this task — this document is the deliverable.

...479 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.067308, 'contextTokens': 33654}_

**Tool:**

To do list updated: 5 items total.

To do list completed.

**Assistant:**

[`plans/i18n-plan.md`](plans/i18n-plan.md) is written. Here's a summary of what it covers and a few decisions worth confirming.

---

## What the plan covers

### 1 — Key naming convention
Three-level dot-notation: `namespace.context.leafKey` in `lowerCamelCase`. One worked example per namespace (e.g. `pages.home.heroTitle`, `flights.flightCard.seatEconomy`, `destinations.europa.name`). Plurals use `_one`/`_other`; Arabic requires all six forms.

### 2 — File-ownership map (5 workers, zero conflicts)

```
Worker 1 → pages      → src/pages/ (4 files)
Worker 2 → flights    → src/components/flights/ (2 files)
Worker 3 → bookings   → src/components/bookings/ (3 files)
Worker 4 → common     → src/components/layout/ + common/ + user/ (11 files)
Worker 5 → destinations → src/data/destinations.ts (1 file)
```

Every actual file from the codebase is assigned. No file appears in two workers.

### 3 — i18next runtime setup
`src/i18n/index.ts` (HTTP backend + language detector, three languages, five namespaces, fallback `en`), wired into `src/main.tsx` as a side-effect import, with `<Suspense>` in `App.tsx`. New `LanguageSwitcher` component in `src/components/common/`.

### 4 — `Intl` approach
`src/utils/formatters.ts` updated to accept a `locale` param. Currency: `fr-CA`→CAD (style guide §1), `ar`→USD with `numberingSystem:'latn'`, `en`→USD. Date-fns locales: `enUS`/`frCA`/`arSA`. Relative time via `Intl.RelativeTimeFormat`. Unit strings (`h`/`m`) moved to `common` namespace keys.

### 5 — RTL approach
`document.documentElement.lang/dir` set on init and every language change via `i18n.dir()`. All physical Tailwind directionals (`ml-`, `pl-`, `text-left`, `left-0`) replaced with logical equivalents (`ms-`, `ps-`, `text-start`, `start-0`). Directional icons (`ArrowLeft/Right`, `ChevronLeft/Right`) get `rtl:scale-x-[-1]`; non-directional icons (`Rocket`, `Globe`, `Crown`, etc.) are left alone.

### 6 — Data rule
Slug/filter/route values stay English. Only display labels are translated. The pattern is `<option value="Europa">{t('destinations.europa.name')}</option>`. All seven planet slugs documented; the `Europa`→`"Europe"` fr-CA disambiguation (glossary row 32) is called out explicitly.

---

## Decisions to confirm before implementation

1. **`Europa` → `"Europe"` in fr-CA** — the glossary says translate the label and add context to avoid confusion with the continent. Should the fr-CA key value be `"Europe (lune)"` / `"Europe (Jupiter)"`, or just `"Europe"` with disambiguation left to a translator note?

2. **Currency for Arabic** — the style guide says "keep the currency the market expects (USD/CAD per business rule)" but doesn't specify ar explicitly. The plan defaults `ar` to USD. Is that correct, or should Arabic also use CAD?

3. **`LanguageSwitcher` placement** — the plan puts it in `Header.tsx`. Should it be a dropdown or three visible pill buttons (`EN | FR | AR`)?

_spend: {'cost': 0.069192, 'contextTokens': 34596}_
