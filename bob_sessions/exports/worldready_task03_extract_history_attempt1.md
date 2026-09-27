# Bob task 6c737be2080596919ed163e271c92965

- Title: 
- Workspace: file:c:\Users\chinm\bob-hackathon-app
- Bobcoins: 0.329712
- Context tokens: 54635
- Created: 2026-09-27 06:07:36

**User:**

# WorldReady — Task 03: parallel i18n extraction (5 subagents)- **Mode:** 🌍 i18n Extractor- **Date:** 2026-09-27- **Bobcoin budget:** 5.0 (stop and tell me if you would exceed it)Follow `plans/i18n-plan.md` and the **i18n-extract skill**, with the path/languageoverrides in this prompt (they win over the plan).## What to do**Spawn 5 general subagents in parallel — one per group in the ownership map below.**Each subagent moves **every user-visible English string** in *its own files* into itsnamespace file and replaces it in the component with a `t()` call (or `<Trans>` when thestring wraps inline markup), using `useTranslation('<namespace>')`."User-visible string" means: JSX text, **and** the values of `aria-label`, `alt`, `title`,and `placeholder` attributes, **and** the literal message passed to `toast(...)` /`toast.success/error(...)`, **and** user-facing label strings inside data objects.### Path & language overrides (IMPORTANT — these differ from the plan text)- Locale files go in **`src/locales/en/<namespace>.json`** — NOT `public/locales`, and NOT  `i18next-http-backend`. The runtime bundles `src/locales` directly (a separate task wires  it up). One JSON file per namespace.- The English language code is **`en`** (folder `src/locales/en/`).- **Create only the English (`en`) locale files in this task.** Do not create `fr`, `ar`,  or `pseudo` — later tasks own those.### Ownership map — one subagent per row (no file is touched by two subagents)| Subagent | Namespace file (create) | Source files it edits ||---|---|---|| 1 | `src/locales/en/pages.json` | `src/pages/Home.tsx`, `src/pages/Flights.tsx`, `src/pages/MyBookings.tsx`, `src/pages/DestinationDetail.tsx` || 2 | `src/locales/en/flights.json` | `src/components/flights/FlightCard.tsx`, `src/components/flights/FlightFilters.tsx` || 3 | `src/locales/en/bookings.json` | `src/components/bookings/BookingCard.tsx`, `src/components/bookings/BookingModal.tsx`, `src/components/bookings/HoldCard.tsx` || 4 | `src/locales/en/common.json` | `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/common/Modal.tsx`, `src/components/common/LoadingSpinner.tsx`, `src/components/user/UserIdentification.tsx` || 5 | `src/locales/en/destinations.json` | `src/data/destinations.ts` (+ update its callers only if the caller is in this same file; do not edit page components — subagent 1 owns those) |`Layout.tsx`, `Button.tsx`, `Card.tsx`, `Starfield.tsx`, `Input.tsx`, `index.ts` have nouser-visible strings (or only a stray one); leave them unless a subagent finds a realuser-visible literal in its own file.### Rules every subagent must follow (from the i18n-extract skill)1. **Keep the English output identical.** The rendered English text must not change at all.2. **Never concatenate** translated fragments — one key with interpolation   (`t('k', { name })`), never string joins.3. **Plurals go through i18next `count`** — any countable string (e.g. a seats-left / results   count) uses `t('key', { count })` with `_one` / `_other` forms in English; never append   an "s" in code.4. **Externalize `aria-label`, `alt`, `title`, `placeholder`** too — they are user-visible.5. **Values used as a filter key, URL/route segment, or API query parameter keep their English   value.** Translate only the visible label, looked up by a stable English slug/id. In   particular: destination `slug` values (`earth`, `mars`, `moon`, `venus`, `jupiter`,   `europa`, `pluto`) and seat-class values (`economy`, `business`, `galaxium`) stay English;   only their display labels move to `t()`.6. **Brand terms stay verbatim in every language:** `Galaxium`, `Galaxium Travels`,   `Galaxium Class`, `WorldReady`, `Bob`.7. **Key convention:** `<namespace>.<context>.<leafKey>`, all `lowerCamelCase`, max depth 3,   never use the English text itself as the key.8. **Each subagent writes only its own namespace JSON and its own source files.**### Hard boundaries (all subagents)- **Do not edit files outside your row.** Do not touch: `scripts/**`,  `src/services/api.ts`, `src/services/demoApi.ts`, `src/i18n/**`, `src/utils/formatters.ts`,  `src/main.tsx`, `src/App.tsx`, `src/components/common/index.ts`, `vite.config.ts`,  `package.json`, `.github/**`, `docs/**`, `evidence/**`. A **parallel task** is creating the  i18n runtime, the `LanguageSwitcher`, and the formatters at the same time — leave those to it.- **Do not run `npm install` and do not run the build.** The parallel task installs the  packages; the build runs afterward. Add the `import { useTranslation } from 'react-i18next'`  lines even though the package may not be installed yet — that is expected.- **Do not commit.** I handle commits.### When doneReport, per namespace: the count of keys added and a one-line confirmation that the Englishrendering is unchanged for those files. Then stop.Push back directly if any of this is wrong.

**Assistant:**



_spend: {'cost': 0.025672, 'contextTokens': 12836}_

**Tool:**

---
name: i18n-extract
description: Externalize hard-coded UI strings into i18next keys with locale-aware formatting and RTL-safe layout. Use when internationalizing an existing React/TypeScript app.
---

When internationalizing React components, follow these rules:

1. **Never concatenate translated fragments.** Build one key with interpolation
   (`t('key', { name })`) instead of joining strings; word order differs per language.

2. **Use i18next `count` for plurals.** Let i18next pick the plural form
   (`t('seats', { count })` with `_zero/_one/_two/_few/_many/_other` as the language needs);
   never append an "s" in code.

3. **Externalize accessibility and form text too**: `aria-label`, `alt`, `title`, and
   `placeholder` values are user-visible and must go through `t()`.

4. **Format dates, numbers and money only through `Intl`** (or date-fns), keyed by
   `i18n.language` — never hand-format with string templates or hard-coded symbols.

5. **Values used as a filter key or a URL/route value keep their English value.** Translate
   only the visible label, looked up by a stable English slug or id.

6. **Each worker writes only its own namespace file**, so parallel extraction never conflicts.

Return the list of keys you added and confirm English rendering is unchanged.

**Assistant:**



_spend: {'cost': 0.026552, 'contextTokens': 13276}_

**Tool:**

To do list updated: 3 items total.

Next to do item inprogress: Read all source files before spawning subagents

**Assistant:**

Let me read all the source files first so I can pass their exact content to the subagents.

_spend: {'cost': 0.027066, 'contextTokens': 13533}_

**Tool:**

Contents of file src/pages/Home.tsx:

1 | import { Link } from 'react-router-dom';
2 | import { Button } from '../components/common';
3 | import { Rocket, Globe, Shield, Zap } from 'lucide-react';
4 | import { motion } from 'framer-motion';
5 | import { ALL_DESTINATIONS } from '../data/destinations';
6 | 
7 | export const Home = () => {
8 |   const features = [
9 |     {
10 |       icon: <Rocket size={32} />,
11 |       title: 'Interplanetary Travel',
12 |       description: 'Explore destinations across the solar system with our state-of-the-art spacecraft.',
13 |     },
14 |     {
15 |       icon: <Globe size={32} />,
16 |       title: 'Multiple Destinations',
17 |       description: 'From Mars to Europa, discover new worlds and book your journey today.',
18 |     },
19 |     {
20 |       icon: <Shield size={32} />,
21 |       title: 'Safe & Secure',
22 |       description: 'Your safety is our priority with advanced navigation and life support systems.',
23 |     },
24 |     {
25 |       icon: <Zap size={32} />,
26 |       title: 'Instant Booking',
27 |       description: 'Book your flight in seconds and receive instant confirmation.',
28 |     },
29 |   ];
30 | 
31 |   return (
32 |     <div className="space-y-20">
33 |       {/* Hero Section */}
34 |       <motion.section
35 |         initial={{ opacity: 0, y: 20 }}
36 |         animate={{ opacity: 1, y: 0 }}
37 |         transition={{ duration: 0.8 }}
38 |         className="text-center py-20"
39 |       >
40 |         <motion.div
41 |           initial={{ scale: 0.9 }}
42 |           animate={{ scale: 1 }}
43 |           transition={{ duration: 0.5, delay: 0.2 }}
44 |         >
45 |           <h1 className="text-5xl md:text-7xl font-bold mb-6">
46 |             <span className="bg-cosmic-gradient bg-clip-text text-transparent">
47 |               Journey Beyond
48 |             </span>
49 |             <br />
50 |             <span className="text-star-white">The Stars</span>
51 |           </h1>
52 |         </motion.div>
53 | 
54 |         <motion.p
55 |           initial={{ opacity: 0 }}
56 |           animate={{ opacity: 1 }}
57 |           transition={{ delay: 0.4 }}
58 |           className="text-xl text-star-white/80 mb-8 max-w-2xl mx-auto"
59 |         >
60 |           Experience the future of space travel with Galaxium. Book your
61 |           interplanetary flight and explore the wonders of our solar system.
62 |         </motion.p>
63 | 
64 |         <motion.div
65 |           initial={{ opacity: 0, y: 20 }}
66 |           animate={{ opacity: 1, y: 0 }}
67 |           transition={{ delay: 0.6 }}
68 |           className="flex flex-col sm:flex-row gap-4 justify-center"
69 |         >
70 |           <Link to="/flights">
71 |             <Button size="lg" className="w-full sm:w-auto">
72 |               Explore Flights
73 |             </Button>
74 |           </Link>
75 |           <Button variant="secondary" size="lg" className="w-full sm:w-auto">
76 |             Learn More
77 |           </Button>
78 |         </motion.div>
79 |       </motion.section>
80 | 
81 |       {/* Features Section */}
82 |       <section>
83 |         <motion.h2
84 |           initial={{ opacity: 0 }}
85 |           whileInView={{ opacity: 1 }}
86 |           viewport={{ once: true }}
87 |           className="text-3xl md:text-4xl font-bold text-center mb-12 text-star-white"
88 |         >
89 |           Why Choose Galaxium?
90 |         </motion.h2>
91 | 
92 |         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
93 |           {features.map((feature, index) => (
94 |             <motion.div
95 |               key={index}
96 |               initial={{ opacity: 0, y: 20 }}
97 |               whileInView={{ opacity: 1, y: 0 }}
98 |               viewport={{ once: true }}
99 |               transition={{ delay: index * 0.1 }}
100 |               className="glass-card p-6 text-center hover:bg-white/10 transition-all duration-300"
101 |             >
102 |               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cosmic-gradient mb-4">
103 |                 <div className="text-white">{feature.icon}</div>
104 |               </div>
105 |               <h3 className="text-xl font-semibold text-star-white mb-2">
106 |                 {feature.title}
107 |               </h3>
108 |               <p className="text-star-white/70">{feature.description}</p>
109 |             </motion.div>
110 |           ))}
111 |         </div>
112 |       </section>
113 | 
114 |       {/* Explore Destinations Section */}
115 |       <section>
116 |         <motion.h2
117 |           initial={{ opacity: 0 }}
118 |           whileInView={{ opacity: 1 }}
119 |           viewport={{ once: true }}
120 |           className="text-3xl md:text-4xl font-bold text-center mb-12 text-star-white"
121 |         >
122 |           Explore Our Destinations
123 |         </motion.h2>
124 | 
125 |         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
126 |           {ALL_DESTINATIONS.map((dest, index) => (
127 |             <motion.div
128 |               key={dest.slug}
129 |               initial={{ opacity: 0, y: 20 }}
130 |               whileInView={{ opacity: 1, y: 0 }}
131 |               viewport={{ once: true }}
132 |               transition={{ delay: index * 0.07 }}
133 |             >
134 |               <Link to={`/destinations/${dest.slug}`} className="block h-full">
135 |                 <div className={`glass-card p-5 h-full hover:bg-white/10 transition-all duration-300 border ${dest.borderAccent}`}>
136 |                   <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 ${dest.bgAccent} ${dest.accentColor} border ${dest.borderAccent}`}>
137 |                     Destination
138 |                   </span>
139 |                   <h3 className="text-lg font-bold text-star-white mb-1">{dest.name}</h3>
140 |                   <p className="text-star-white/60 text-sm leading-snug">{dest.tagline}</p>
141 |                 </div>
142 |               </Link>
143 |             </motion.div>
144 |           ))}
145 |         </div>
146 |       </section>
147 | 
148 |       {/* CTA Section */}
149 |       <motion.section
150 |         initial={{ opacity: 0 }}
151 |         whileInView={{ opacity: 1 }}
152 |         viewport={{ once: true }}
153 |         className="glass-card p-12 text-center bg-cosmic-gradient"
154 |       >
155 |         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
156 |           Ready for Your Space Adventure?
157 |         </h2>
158 |         <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
159 |           Join thousands of space travelers who have already booked their
160 |           journey to the stars. Your adventure awaits!
161 |         </p>
162 |         <Link to="/flights">
163 |           <Button variant="secondary" size="lg">
164 |             Book Your Flight Now
165 |           </Button>
166 |         </Link>
167 |       </motion.section>
168 |     </div>
169 |   );
170 | };
171 | 
172 | // Made with Bob
173 |

**Tool:**

Contents of file src/pages/Flights.tsx:

1 | import { useState, useEffect, useCallback } from 'react';
2 | import type { Flight, ErrorResponse } from '../types';
3 | import { LoadingSpinner } from '../components/common';
4 | import { FlightCard } from '../components/flights/FlightCard';
5 | import { FlightFilters } from '../components/flights/FlightFilters';
6 | import { UserIdentification } from '../components/user/UserIdentification';
7 | import { BookingModal } from '../components/bookings/BookingModal';
8 | import { getFlights } from '../services/api';
9 | import type { FlightFilters as FlightFiltersType } from '../services/api';
10 | import { useUser } from '../hooks/useUserContext';
11 | import { Search } from 'lucide-react';
12 | import toast from 'react-hot-toast';
13 | import { motion } from 'framer-motion';
14 | 
15 | export const Flights = () => {
16 |   const { user } = useUser();
17 |   const [flights, setFlights] = useState<Flight[]>([]);
18 |   const [isLoading, setIsLoading] = useState(true);
19 |   const [searchTerm, setSearchTerm] = useState('');
20 |   const [filters, setFilters] = useState<FlightFiltersType>({});
21 |   const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
22 |   const [showUserModal, setShowUserModal] = useState(false);
23 |   const [showBookingModal, setShowBookingModal] = useState(false);
24 | 
25 |   const loadFlights = useCallback(async (retryCount = 0) => {
26 |     const MAX_RETRIES = 3;
27 |     const RETRY_DELAY = 1000; // 1 second
28 | 
29 |     setIsLoading(true);
30 |     try {
31 |       const data = await getFlights(filters);
32 |       setFlights(data);
33 |     } catch (err) {
34 |       const error = err as ErrorResponse;
35 |       if (retryCount < MAX_RETRIES) {
36 |         toast.error(`Failed to load flights. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
37 |         console.warn(`Retry attempt ${retryCount + 1} after error:`, error);
38 |         
39 |         // Wait before retrying
40 |         await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
41 |         
42 |         // Retry with incremented count
43 |         return loadFlights(retryCount + 1);
44 |       } else {
45 |         toast.error('Failed to load flights after multiple attempts');
46 |         console.error('Max retries reached:', error);
47 |       }
48 |     } finally {
49 |       setIsLoading(false);
50 |     }
51 |   }, [filters]);
52 | 
53 |   // Fetch flights when filters change
54 |   useEffect(() => {
55 |     loadFlights();
56 |   }, [loadFlights]);
57 | 
58 |   const handleBookFlight = (flight: Flight) => {
59 |     setSelectedFlight(flight);
60 |     
61 |     if (!user) {
62 |       // Show user identification modal first
63 |       setShowUserModal(true);
64 |     } else {
65 |       // Show booking confirmation modal
66 |       setShowBookingModal(true);
67 |     }
68 |   };
69 | 
70 |   const handleUserIdentified = () => {
71 |     // After user signs in, show booking modal
72 |     setShowBookingModal(true);
73 |   };
74 | 
75 |   const handleBookingSuccess = () => {
76 |     // Reload flights to get updated seat availability
77 |     loadFlights();
78 |   };
79 | 
80 |   const handleResetFilters = () => {
81 |     setFilters({});
82 |     setSearchTerm('');
83 |   };
84 | 
85 |   // Client-side search filter (applied after backend filters)
86 |   const displayFlights = searchTerm.trim()
87 |     ? flights.filter(
88 |         (flight) =>
89 |           flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
90 |           flight.destination.toLowerCase().includes(searchTerm.toLowerCase())
91 |       )
92 |     : flights;
93 | 
94 |   return (
95 |     <div className="space-y-8">
96 |       {/* Header */}
97 |       <motion.div
98 |         initial={{ opacity: 0, y: 20 }}
99 |         animate={{ opacity: 1, y: 0 }}
100 |         className="text-center"
101 |       >
102 |         <h1 className="text-4xl md:text-5xl font-bold text-star-white mb-4">
103 |           Available <span className="bg-cosmic-gradient bg-clip-text text-transparent">Flights</span>
104 |         </h1>
105 |         <p className="text-star-white/70 text-lg">
106 |           Choose your destination and embark on an interplanetary adventure
107 |         </p>
108 |       </motion.div>
109 | 
110 |       {/* Search Bar */}
111 |       <motion.div
112 |         initial={{ opacity: 0, y: 20 }}
113 |         animate={{ opacity: 1, y: 0 }}
114 |         transition={{ delay: 0.1 }}
115 |         className="glass-card p-6"
116 |       >
117 |         <div className="relative">
118 |           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-star-white/50" size={20} />
119 |           <input
120 |             type="text"
121 |             placeholder="Search by origin or destination..."
122 |             value={searchTerm}
123 |             onChange={(e) => setSearchTerm(e.target.value)}
124 |             className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-star-white placeholder-star-white/50 focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
125 |           />
126 |         </div>
127 |       </motion.div>
128 | 
129 |       {/* Filters */}
130 |       <motion.div
131 |         initial={{ opacity: 0, y: 20 }}
132 |         animate={{ opacity: 1, y: 0 }}
133 |         transition={{ delay: 0.2 }}
134 |       >
135 |         <FlightFilters filters={filters} onFiltersChange={setFilters} onReset={handleResetFilters} />
136 |       </motion.div>
137 | 
138 |       {/* Results Count */}
139 |       <div className="text-center text-star-white/70">
140 |         Showing {displayFlights.length} flight{displayFlights.length !== 1 ? 's' : ''}
141 |       </div>
142 | 
143 |       {/* Flights Grid */}
144 |       {isLoading ? (
145 |         <LoadingSpinner size="lg" text="Loading flights..." />
146 |       ) : displayFlights.length === 0 ? (
147 |         <motion.div
148 |           initial={{ opacity: 0 }}
149 |           animate={{ opacity: 1 }}
150 |           className="text-center py-12"
151 |         >
152 |           <p className="text-star-white/70 text-lg">
153 |             No flights found matching your criteria
154 |           </p>
155 |         </motion.div>
156 |       ) : (
157 |         <motion.div
158 |           initial={{ opacity: 0 }}
159 |           animate={{ opacity: 1 }}
160 |           transition={{ delay: 0.3 }}
161 |           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
162 |         >
163 |           {displayFlights.map((flight) => (
164 |             <FlightCard
165 |               key={flight.flight_id}
166 |               flight={flight}
167 |               onBook={handleBookFlight}
168 |             />
169 |           ))}
170 |         </motion.div>
171 |       )}
172 | 
173 |       {/* User Identification Modal */}
174 |       <UserIdentification
175 |         isOpen={showUserModal}
176 |         onClose={() => setShowUserModal(false)}
177 |         onSuccess={handleUserIdentified}
178 |       />
179 | 
180 |       {/* Booking Confirmation Modal */}
181 |       <BookingModal
182 |         isOpen={showBookingModal}
183 |         onClose={() => setShowBookingModal(false)}
184 |         flight={selectedFlight}
185 |         onSuccess={handleBookingSuccess}
186 |       />
187 |     </div>
188 |   );
189 | };
190 | 
191 | // Made with Bob

**Tool:**

Contents of file src/pages/MyBookings.tsx:

1 | import { useState, useEffect, useCallback } from 'react';
2 | import { useNavigate } from 'react-router-dom';
3 | import type { Booking, Flight, StoredHold, ErrorResponse } from '../types';
4 | import { LoadingSpinner, Modal, Button } from '../components/common';
5 | import { BookingCard } from '../components/bookings/BookingCard';
6 | import { HoldCard } from '../components/bookings/HoldCard';
7 | import { getUserBookings, getFlights, cancelBooking, getHold, isErrorResponse } from '../services/api';
8 | import { getStoredHolds, removeHold } from '../utils/holdStorage';
9 | import { useUser } from '../hooks/useUserContext';
10 | import { AlertCircle } from 'lucide-react';
11 | import toast from 'react-hot-toast';
12 | import { motion } from 'framer-motion';
13 | 
14 | export const MyBookings = () => {
15 |   const { user } = useUser();
16 |   const navigate = useNavigate();
17 |   const [bookings, setBookings] = useState<Booking[]>([]);
18 |   const [flights, setFlights] = useState<Flight[]>([]);
19 |   const [activeHolds, setActiveHolds] = useState<StoredHold[]>([]);
20 |   const [isLoading, setIsLoading] = useState(true);
21 |   const [cancellingId, setCancellingId] = useState<number | null>(null);
22 |   const [showCancelModal, setShowCancelModal] = useState(false);
23 |   const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
24 | 
25 |   const loadHolds = useCallback(async () => {
26 |     if (!user) return;
27 | 
28 |     const stored = getStoredHolds(user.user_id);
29 |     if (stored.length === 0) {
30 |       setActiveHolds([]);
31 |       return;
32 |     }
33 | 
34 |     // Verify each hold's current status from the API, remove stale ones
35 |     const stillActive: StoredHold[] = [];
36 |     const isLocallyExpired = (sh: StoredHold) => {
37 |       const expiryTime = new Date(sh.reservedUntil).getTime();
38 |       return isNaN(expiryTime) || expiryTime < Date.now();
39 |     };
40 |     await Promise.all(
41 |       stored.map(async (sh) => {
42 |         try {
43 |           const hold = await getHold(sh.holdId);
44 |           if (hold.status === 'HELD' && !isLocallyExpired(sh)) {
45 |             stillActive.push(sh);
46 |           } else {
47 |             // Hold is no longer active (confirmed, released, expired, or locally timed out)
48 |             removeHold(user.user_id, sh.holdId);
49 |           }
50 |         } catch {
51 |           // API unavailable — fall back to local expiry check
52 |           if (!isLocallyExpired(sh)) {
53 |             stillActive.push(sh);
54 |           } else {
55 |             removeHold(user.user_id, sh.holdId);
56 |           }
57 |         }
58 |       })
59 |     );
60 | 
61 |     setActiveHolds(stillActive);
62 |   }, [user]);
63 | 
64 |   const loadData = useCallback(async () => {
65 |     if (!user) return;
66 | 
67 |     setIsLoading(true);
68 |     try {
69 |       const [bookingsData, flightsData] = await Promise.all([
70 |         getUserBookings(user.user_id),
71 |         getFlights(),
72 |       ]);
73 |       setBookings(bookingsData);
74 |       setFlights(flightsData);
75 |       await loadHolds();
76 |     } catch (err) {
77 |       toast.error('Failed to load bookings');
78 |       console.error(err);
79 |     } finally {
80 |       setIsLoading(false);
81 |     }
82 |   }, [user, loadHolds]);
83 | 
84 |   useEffect(() => {
85 |     if (!user) {
86 |       navigate('/flights');
87 |       return;
88 |     }
89 |     loadData();
90 |   }, [user, navigate, loadData]);
91 | 
92 |   const handleCancelClick = (bookingId: number) => {
93 |     setBookingToCancel(bookingId);
94 |     setShowCancelModal(true);
95 |   };
96 | 
97 |   const handleConfirmCancel = async () => {
98 |     if (!bookingToCancel) return;
99 | 
100 |     setCancellingId(bookingToCancel);
101 |     setShowCancelModal(false);
102 | 
103 |     try {
104 |       const result = await cancelBooking(bookingToCancel);
105 | 
106 |       if (isErrorResponse(result)) {
107 |         toast.error(result.details || result.error);
108 |         return;
109 |       }
110 | 
111 |       toast.success('Booking cancelled successfully');
112 |       loadData();
113 |     } catch (err) {
114 |       const error = err as ErrorResponse;
115 |       toast.error(error.details || error.error || 'Failed to cancel booking');
116 |     } finally {
117 |       setCancellingId(null);
118 |       setBookingToCancel(null);
119 |     }
120 |   };
121 | 
122 |   const getFlightForBooking = (booking: Booking): Flight | undefined => {
123 |     return flights.find((f) => f.flight_id === booking.flight_id);
124 |   };
125 | 
126 |   const getFlightForHold = (hold: StoredHold): Flight | undefined => {
127 |     return flights.find((f) => f.flight_id === hold.flightId);
128 |   };
129 | 
130 |   const activeBookings = bookings.filter((b) => b.status === 'booked');
131 |   const pastBookings = bookings.filter((b) => b.status !== 'booked');
132 | 
133 |   if (!user) {
134 |     return null;
135 |   }
136 | 
137 |   return (
138 |     <div className="space-y-8">
139 |       {/* Header */}
140 |       <motion.div
141 |         initial={{ opacity: 0, y: 20 }}
142 |         animate={{ opacity: 1, y: 0 }}
143 |         className="text-center"
144 |       >
145 |         <h1 className="text-4xl md:text-5xl font-bold text-star-white mb-4">
146 |           My <span className="bg-cosmic-gradient bg-clip-text text-transparent">Bookings</span>
147 |         </h1>
148 |         <p className="text-star-white/70 text-lg">
149 |           Manage your space travel reservations
150 |         </p>
151 |       </motion.div>
152 | 
153 |       {isLoading ? (
154 |         <LoadingSpinner size="lg" text="Loading your bookings..." />
155 |       ) : (
156 |         <div className="space-y-8">
157 |           {/* Pending Holds */}
158 |           {activeHolds.length > 0 && (
159 |             <motion.div
160 |               initial={{ opacity: 0, y: 20 }}
161 |               animate={{ opacity: 1, y: 0 }}
162 |               transition={{ delay: 0.05 }}
163 |             >
164 |               <div className="flex items-center gap-3 mb-4">
165 |                 <h2 className="text-2xl font-bold text-solar-orange">
166 |                   Pending Holds ({activeHolds.length})
167 |                 </h2>
168 |                 <span className="text-xs text-star-white/50 bg-solar-orange/10 border border-solar-orange/30 px-2 py-1 rounded-full">
169 |                   Confirm before time runs out
170 |                 </span>
171 |               </div>
172 |               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
173 |                 {activeHolds.map((hold) => (
174 |                   <HoldCard
175 |                     key={hold.holdId}
176 |                     storedHold={hold}
177 |                     flight={getFlightForHold(hold)}
178 |                     onAction={loadData}
179 |                   />
180 |                 ))}
181 |               </div>
182 |             </motion.div>
183 |           )}
184 | 
185 |           {/* No content at all */}
186 |           {bookings.length === 0 && activeHolds.length === 0 && (
187 |             <motion.div
188 |               initial={{ opacity: 0 }}
189 |               animate={{ opacity: 1 }}
190 |               className="glass-card p-12 text-center"
191 |             >
192 |               <AlertCircle className="mx-auto mb-4 text-star-white/50" size={48} />
193 |               <h3 className="text-xl font-semibold text-star-white mb-2">
194 |                 No bookings yet
195 |               </h3>
196 |               <p className="text-star-white/70 mb-6">
197 |                 Start your space adventure by booking your first flight!
198 |               </p>
199 |               <Button onClick={() => navigate('/flights')}>Browse Flights</Button>
200 |             </motion.div>
201 |           )}
202 | 
203 |           {/* Active Bookings */}
204 |           {activeBookings.length > 0 && (
205 |             <motion.div
206 |               initial={{ opacity: 0, y: 20 }}
207 |               animate={{ opacity: 1, y: 0 }}
208 |               transition={{ delay: 0.1 }}
209 |             >
210 |               <h2 className="text-2xl font-bold text-star-white mb-4">
211 |                 Active Bookings ({activeBookings.length})
212 |               </h2>
213 |               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
214 |                 {activeBookings.map((booking) => (
215 |                   <BookingCard
216 |                     key={booking.booking_id}
217 |                     booking={booking}
218 |                     flight={getFlightForBooking(booking)}
219 |                     onCancel={handleCancelClick}
220 |                     isCancelling={cancellingId === booking.booking_id}
221 |                   />
222 |                 ))}
223 |               </div>
224 |             </motion.div>
225 |           )}
226 | 
227 |           {/* Past Bookings */}
228 |           {pastBookings.length > 0 && (
229 |             <motion.div
230 |               initial={{ opacity: 0, y: 20 }}
231 |               animate={{ opacity: 1, y: 0 }}
232 |               transition={{ delay: 0.2 }}
233 |             >
234 |               <h2 className="text-2xl font-bold text-star-white mb-4">
235 |                 Past Bookings ({pastBookings.length})
236 |               </h2>
237 |               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
238 |                 {pastBookings.map((booking) => (
239 |                   <BookingCard
240 |                     key={booking.booking_id}
241 |                     booking={booking}
242 |                     flight={getFlightForBooking(booking)}
243 |                     onCancel={handleCancelClick}
244 |                   />
245 |                 ))}
246 |               </div>
247 |             </motion.div>
248 |           )}
249 |         </div>
250 |       )}
251 | 
252 |       {/* Cancel Confirmation Modal */}
253 |       <Modal
254 |         isOpen={showCancelModal}
255 |         onClose={() => setShowCancelModal(false)}
256 |         title="Cancel Booking"
257 |         size="sm"
258 |       >
259 |         <div className="space-y-4">
260 |           <p className="text-star-white/70">
261 |             Are you sure you want to cancel this booking? This action cannot be undone.
262 |           </p>
263 |           <div className="flex gap-3">
264 |             <Button
265 |               variant="secondary"
266 |               onClick={() => setShowCancelModal(false)}
267 |               className="flex-1"
268 |             >
269 |               Keep Booking
270 |             </Button>
271 |             <Button variant="danger" onClick={handleConfirmCancel} className="flex-1">
272 |               Cancel Booking
273 |             </Button>
274 |           </div>
275 |         </div>
276 |       </Modal>
277 |     </div>
278 |   );
279 | };
280 | 
281 | // Made with Bob
282 |

**Tool:**

Contents of file src/pages/DestinationDetail.tsx:

1 | import { useState, useEffect } from 'react';
2 | import { useParams, Link } from 'react-router-dom';
3 | import { motion } from 'framer-motion';
4 | import { AlertTriangle, ArrowLeft, Rocket } from 'lucide-react';
5 | import toast from 'react-hot-toast';
6 | import { getDestinationBySlug } from '../data/destinations';
7 | import type { DestinationData } from '../data/destinations';
8 | import { getFlights } from '../services/api';
9 | import type { Flight } from '../types';
10 | import { LoadingSpinner } from '../components/common/LoadingSpinner';
11 | import { formatTime, formatDate, formatCurrency } from '../utils/formatters';
12 | 
13 | // Animated section wrapper — staggered entrance matching site-wide style
14 | const Section = ({
15 |   children,
16 |   delay = 0,
17 |   className = '',
18 | }: {
19 |   children: React.ReactNode;
20 |   delay?: number;
21 |   className?: string;
22 | }) => (
23 |   <motion.div
24 |     initial={{ opacity: 0, y: 20 }}
25 |     animate={{ opacity: 1, y: 0 }}
26 |     transition={{ delay }}
27 |     className={className}
28 |   >
29 |     {children}
30 |   </motion.div>
31 | );
32 | 
33 | // Label used inside the facts grid
34 | const FactTile = ({ label, value }: { label: string; value: string }) => (
35 |   <div className="glass-card p-4">
36 |     <p className="text-xs text-star-white/50 uppercase tracking-wider mb-1">{label}</p>
37 |     <p className="text-star-white font-semibold">{value}</p>
38 |   </div>
39 | );
40 | 
41 | export const DestinationDetail = () => {
42 |   const { slug = '' } = useParams<{ slug: string }>();
43 |   const destination: DestinationData | null = getDestinationBySlug(slug);
44 | 
45 |   const [flights, setFlights] = useState<Flight[]>([]);
46 |   const [flightsLoading, setFlightsLoading] = useState(true);
47 | 
48 |   useEffect(() => {
49 |     if (!destination) {
50 |       setFlightsLoading(false);
51 |       return;
52 |     }
53 | 
54 |     const loadFlights = async () => {
55 |       setFlightsLoading(true);
56 |       try {
57 |         const data = await getFlights({ destination: destination.name });
58 |         // Guard against ilike over-matching (e.g. "Moon" matching "Moon → Mars")
59 |         setFlights(data.filter((f) => f.destination === destination.name).slice(0, 5));
60 |       } catch {
61 |         toast.error('Could not load departing flights');
62 |       } finally {
63 |         setFlightsLoading(false);
64 |       }
65 |     };
66 | 
67 |     loadFlights();
68 |   }, [destination]);
69 | 
70 |   // ── Unknown slug ─────────────────────────────────────────────────────────────
71 |   if (!destination) {
72 |     return (
73 |       <div className="flex flex-col items-center justify-center py-32 text-center">
74 |         <motion.div
75 |           initial={{ opacity: 0, scale: 0.9 }}
76 |           animate={{ opacity: 1, scale: 1 }}
77 |           className="glass-card p-12 max-w-md"
78 |         >
79 |           <Rocket size={48} className="mx-auto mb-6 text-cosmic-purple" />
80 |           <h1 className="text-3xl font-bold text-star-white mb-4">
81 |             We haven't charted this world yet
82 |           </h1>
83 |           <p className="text-star-white/70 mb-8">
84 |             The destination <span className="font-mono text-cosmic-purple">/{slug}</span> doesn't exist in our star charts.
85 |           </p>
86 |           <Link to="/">
87 |             <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cosmic-gradient text-white font-semibold hover:opacity-90 transition-opacity">
88 |               <ArrowLeft size={18} />
89 |               Back to Home
90 |             </button>
91 |           </Link>
92 |         </motion.div>
93 |       </div>
94 |     );
95 |   }
96 | 
97 |   const { name, tagline, description, facts, hazards, gallery, accentColor, bgAccent, borderAccent } = destination;
98 | 
99 |   return (
100 |     <div className="space-y-12">
101 |       {/* Back link */}
102 |       <Section delay={0}>
103 |         <Link
104 |           to="/"
105 |           className="inline-flex items-center gap-2 text-star-white/60 hover:text-star-white transition-colors text-sm"
106 |         >
107 |           <ArrowLeft size={16} />
108 |           All Destinations
109 |         </Link>
110 |       </Section>
111 | 
112 |       {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
113 |       <Section delay={0.05}>
114 |         <div className={`glass-card p-10 ${bgAccent} border ${borderAccent}`}>
115 |           <div className="flex flex-wrap items-center gap-3 mb-4">
116 |             <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${bgAccent} border ${borderAccent} ${accentColor}`}>
117 |               Destination
118 |             </span>
119 |           </div>
120 |           <h1 className="text-5xl md:text-6xl font-bold text-star-white mb-3">{name}</h1>
121 |           <p className={`text-xl font-medium mb-4 ${accentColor}`}>{tagline}</p>
122 |           <p className="text-star-white/80 max-w-3xl leading-relaxed">{description}</p>
123 |         </div>
124 |       </Section>
125 | 
126 |       {/* ── 2. Facts ────────────────────────────────────────────────────────── */}
127 |       <Section delay={0.1}>
128 |         <h2 className="text-2xl font-bold text-star-white mb-6">Quick Facts</h2>
129 |         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
130 |           <FactTile label="Gravity" value={facts.gravity} />
131 |           <FactTile label="Distance from Earth" value={facts.distanceFromEarth} />
132 |           <FactTile label="Typical Transit Time" value={facts.typicalTransitTime} />
133 |           <FactTile label="Surface Temperature" value={facts.surfaceTemp} />
134 |           <FactTile label="Moons" value={facts.moons} />
135 |           <FactTile label="Atmosphere" value={facts.atmosphere} />
136 |         </div>
137 |       </Section>
138 | 
139 |       {/* ── 3. Hazards ──────────────────────────────────────────────────────── */}
140 |       <Section delay={0.2}>
141 |         <div className="glass-card p-6 border border-solar-orange/30 bg-solar-orange/5">
142 |           <div className="flex items-center gap-3 mb-5">
143 |             <AlertTriangle size={22} className="text-solar-orange flex-shrink-0" />
144 |             <h2 className="text-2xl font-bold text-star-white">Hazard Advisory</h2>
145 |           </div>
146 |           <ul className="space-y-3">
147 |             {hazards.map((hazard, i) => (
148 |               <li key={i} className="flex items-start gap-3">
149 |                 <span className="mt-1 w-2 h-2 rounded-full bg-solar-orange flex-shrink-0" />
150 |                 <span className="text-star-white/80">{hazard}</span>
151 |               </li>
152 |             ))}
153 |           </ul>
154 |         </div>
155 |       </Section>
156 | 
157 |       {/* ── 4. Gallery ──────────────────────────────────────────────────────── */}
158 |       <Section delay={0.3}>
159 |         <h2 className="text-2xl font-bold text-star-white mb-6">Gallery</h2>
160 |         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
161 |           {gallery.map((item, i) => (
162 |             <div
163 |               key={i}
164 |               className={`glass-card p-0 overflow-hidden border ${borderAccent}`}
165 |             >
166 |               {/* Placeholder tile — CSS only, no external images */}
167 |               <div className={`h-36 ${item.colorClass} flex items-end`} aria-label={item.alt}>
168 |                 <div className="w-full px-4 py-2 bg-space-dark/60 backdrop-blur-sm">
169 |                   <p className="text-xs text-star-white/70">{item.alt}</p>
170 |                 </div>
171 |               </div>
172 |               <div className="p-4">
173 |                 <p className="text-sm text-star-white/80">{item.description}</p>
174 |               </div>
175 |             </div>
176 |           ))}
177 |         </div>
178 |       </Section>
179 | 
180 |       {/* ── 5. Flights departing soon ───────────────────────────────────────── */}
181 |       <Section delay={0.4}>
182 |         <div className="glass-card p-6">
183 |           <h2 className="text-2xl font-bold text-star-white mb-2">Flights Departing Soon</h2>
184 |           <p className="text-star-white/60 text-sm mb-6">
185 |             Live availability — up to 5 upcoming departures to {name}
186 |           </p>
187 | 
188 |           {flightsLoading ? (
189 |             <LoadingSpinner size="sm" text="Checking flight schedules…" />
190 |           ) : flights.length === 0 ? (
191 |             <div className="text-center py-10">
192 |               <Rocket size={36} className="mx-auto mb-3 text-star-white/30" />
193 |               <p className="text-star-white/60">No upcoming flights to {name} right now.</p>
194 |               <p className="text-star-white/40 text-sm mt-1">
195 |                 Check back soon — new routes are added regularly.
196 |               </p>
197 |             </div>
198 |           ) : (
199 |             <div className="space-y-3">
200 |               {flights.map((flight) => (
201 |                 <div
202 |                   key={flight.flight_id}
203 |                   className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border ${borderAccent} ${bgAccent}`}
204 |                 >
205 |                   <div>
206 |                     <p className="text-star-white font-semibold">
207 |                       {flight.origin} → {flight.destination}
208 |                     </p>
209 |                     <p className="text-star-white/60 text-sm">
210 |                       {formatDate(flight.departure_time, 'MMM dd, yyyy')} · {formatTime(flight.departure_time)}
211 |                     </p>
212 |                   </div>
213 |                   <div className="flex items-center gap-4">
214 |                     <div className="text-right">
215 |                       <p className="text-xs text-star-white/50">From</p>
216 |                       <p className={`font-bold ${accentColor}`}>{formatCurrency(flight.economy_price)}</p>
217 |                     </div>
218 |                     <Link
219 |                       to={`/flights?destination=${encodeURIComponent(name)}`}
220 |                       className="px-4 py-2 rounded-lg bg-cosmic-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
221 |                     >
222 |                       Book
223 |                     </Link>
224 |                   </div>
225 |                 </div>
226 |               ))}
227 |             </div>
228 |           )}
229 |         </div>
230 |       </Section>
231 |     </div>
232 |   );
233 | };
234 | 
235 | // Made with Bob
236 |

**Assistant:**



_spend: {'cost': 0.052464, 'contextTokens': 26232}_

**Tool:**

Contents of file src/components/flights/FlightCard.tsx:

1 | import type { Flight, SeatClass } from '../../types';
2 | import { Card, Button } from '../common';
3 | import { Plane, Clock, Users, Crown, Rocket } from 'lucide-react';
4 | import { formatCurrency, formatDate, formatTime, calculateDuration } from '../../utils/formatters';
5 | import { motion } from 'framer-motion';
6 | import { Link } from 'react-router-dom';
7 | import { getDestinationByName } from '../../data/destinations';
8 | 
9 | interface FlightCardProps {
10 |   flight: Flight;
11 |   onBook: (flight: Flight) => void;
12 | }
13 | 
14 | export const FlightCard = ({ flight, onBook }: FlightCardProps) => {
15 |   const totalSeats = flight.economy_seats_available + flight.business_seats_available + flight.galaxium_seats_available;
16 |   const isSoldOut = totalSeats === 0;
17 |   const destData = getDestinationByName(flight.destination);
18 |   const destLabel = destData ? (
19 |     <Link
20 |       to={`/destinations/${destData.slug}`}
21 |       className="hover:text-cosmic-purple underline-offset-2 hover:underline transition-colors"
22 |       onClick={(e) => e.stopPropagation()}
23 |     >
24 |       {flight.destination}
25 |     </Link>
26 |   ) : (
27 |     <span>{flight.destination}</span>
28 |   );
29 | 
30 |   const seatClasses = [
31 |     {
32 |       name: 'Economy',
33 |       class: 'economy' as SeatClass,
34 |       price: flight.economy_price,
35 |       seats: flight.economy_seats_available,
36 |       icon: Plane,
37 |       color: 'text-blue-400',
38 |       bgColor: 'bg-blue-500/10',
39 |       borderColor: 'border-blue-500/30',
40 |     },
41 |     {
42 |       name: 'Business',
43 |       class: 'business' as SeatClass,
44 |       price: flight.business_price,
45 |       seats: flight.business_seats_available,
46 |       icon: Crown,
47 |       color: 'text-purple-400',
48 |       bgColor: 'bg-purple-500/10',
49 |       borderColor: 'border-purple-500/30',
50 |     },
51 |     {
52 |       name: 'Galaxium Class',
53 |       class: 'galaxium' as SeatClass,
54 |       price: flight.galaxium_price,
55 |       seats: flight.galaxium_seats_available,
56 |       icon: Rocket,
57 |       color: 'text-alien-green',
58 |       bgColor: 'bg-alien-green/10',
59 |       borderColor: 'border-alien-green/30',
60 |     },
61 |   ];
62 | 
63 |   return (
64 |     <motion.div
65 |       initial={{ opacity: 0, y: 20 }}
66 |       animate={{ opacity: 1, y: 0 }}
67 |       whileHover={{ y: -4 }}
68 |       transition={{ duration: 0.3 }}
69 |     >
70 |       <Card className="h-full flex flex-col">
71 |         {/* Route Header */}
72 |         <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
73 |           <div className="flex items-center gap-3">
74 |             <div className="p-2 rounded-lg bg-cosmic-gradient">
75 |               <Plane className="text-white" size={24} />
76 |             </div>
77 |             <div>
78 |               <h3 className="text-xl font-bold text-star-white">
79 |                 {flight.origin} → {destLabel}
80 |               </h3>
81 |               <p className="text-sm text-star-white/60">
82 |                 Flight #{flight.flight_id}
83 |               </p>
84 |             </div>
85 |           </div>
86 |         </div>
87 | 
88 |         {/* Flight Details */}
89 |         <div className="space-y-4 mb-6 flex-1">
90 |           {/* Departure & Arrival */}
91 |           <div className="grid grid-cols-2 gap-4">
92 |             <div>
93 |               <p className="text-xs text-star-white/60 mb-1">Departure</p>
94 |               <p className="text-sm font-medium text-star-white">
95 |                 {formatDate(flight.departure_time, 'MMM dd, yyyy')}
96 |               </p>
97 |               <p className="text-lg font-bold text-cosmic-purple">
98 |                 {formatTime(flight.departure_time)}
99 |               </p>
100 |             </div>
101 |             <div>
102 |               <p className="text-xs text-star-white/60 mb-1">Arrival</p>
103 |               <p className="text-sm font-medium text-star-white">
104 |                 {formatDate(flight.arrival_time, 'MMM dd, yyyy')}
105 |               </p>
106 |               <p className="text-lg font-bold text-cosmic-purple">
107 |                 {formatTime(flight.arrival_time)}
108 |               </p>
109 |             </div>
110 |           </div>
111 | 
112 |           {/* Duration */}
113 |           <div className="flex items-center gap-2 text-star-white/70">
114 |             <Clock size={16} />
115 |             <span className="text-sm">
116 |               Duration: {calculateDuration(flight.departure_time, flight.arrival_time)}
117 |             </span>
118 |           </div>
119 | 
120 |           {/* Seat Classes */}
121 |           <div className="space-y-2">
122 |             <p className="text-xs text-star-white/60 mb-2">Available Seat Classes</p>
123 |             {seatClasses.map((seatClass) => {
124 |               const Icon = seatClass.icon;
125 |               const isClassSoldOut = seatClass.seats === 0;
126 |               const isLowSeats = seatClass.seats <= 2 && seatClass.seats > 0;
127 |               
128 |               return (
129 |                 <div
130 |                   key={seatClass.class}
131 |                   className={`p-3 rounded-lg border ${seatClass.borderColor} ${seatClass.bgColor} ${
132 |                     isClassSoldOut ? 'opacity-50' : ''
133 |                   }`}
134 |                 >
135 |                   <div className="flex items-center justify-between">
136 |                     <div className="flex items-center gap-2">
137 |                       <Icon size={18} className={seatClass.color} />
138 |                       <span className="font-medium text-star-white">{seatClass.name}</span>
139 |                     </div>
140 |                     <div className="text-right">
141 |                       <div className={`text-lg font-bold ${seatClass.color}`}>
142 |                         {formatCurrency(seatClass.price)}
143 |                       </div>
144 |                       <div className="flex items-center gap-1 text-xs">
145 |                         <Users size={12} className={isLowSeats ? 'text-solar-orange' : 'text-star-white/60'} />
146 |                         <span className={isLowSeats ? 'text-solar-orange font-semibold' : 'text-star-white/60'}>
147 |                           {isClassSoldOut ? 'Sold Out' : `${seatClass.seats} left`}
148 |                         </span>
149 |                       </div>
150 |                     </div>
151 |                   </div>
152 |                 </div>
153 |               );
154 |             })}
155 |           </div>
156 |         </div>
157 | 
158 |         {/* Book Button */}
159 |         <Button
160 |           onClick={() => onBook(flight)}
161 |           disabled={isSoldOut}
162 |           className="w-full"
163 |         >
164 |           {isSoldOut ? 'All Classes Sold Out' : 'Select Seat Class'}
165 |         </Button>
166 |       </Card>
167 |     </motion.div>
168 |   );
169 | };
170 | 
171 | // Made with Bob
172 |

**Tool:**

Contents of file src/components/bookings/BookingCard.tsx:

1 | import type { Booking, Flight } from '../../types';
2 | import { Card, Button } from '../common';
3 | import { Plane, Calendar, CheckCircle, XCircle, Clock, Crown, Rocket } from 'lucide-react';
4 | import { formatDate, formatCurrency } from '../../utils/formatters';
5 | import { motion } from 'framer-motion';
6 | 
7 | interface BookingCardProps {
8 |   booking: Booking;
9 |   flight?: Flight;
10 |   onCancel: (bookingId: number) => void;
11 |   isCancelling?: boolean;
12 | }
13 | 
14 | export const BookingCard = ({ booking, flight, onCancel, isCancelling }: BookingCardProps) => {
15 |   const getSeatClassIcon = () => {
16 |     switch (booking.seat_class) {
17 |       case 'business':
18 |         return <Crown className="text-purple-400" size={16} />;
19 |       case 'galaxium':
20 |         return <Rocket className="text-alien-green" size={16} />;
21 |       default:
22 |         return <Plane className="text-blue-400" size={16} />;
23 |     }
24 |   };
25 | 
26 |   const getSeatClassName = () => {
27 |     switch (booking.seat_class) {
28 |       case 'business':
29 |         return 'Business';
30 |       case 'galaxium':
31 |         return 'Galaxium Class';
32 |       default:
33 |         return 'Economy';
34 |     }
35 |   };
36 | 
37 |   const getSeatClassColor = () => {
38 |     switch (booking.seat_class) {
39 |       case 'business':
40 |         return 'text-purple-400';
41 |       case 'galaxium':
42 |         return 'text-alien-green';
43 |       default:
44 |         return 'text-blue-400';
45 |     }
46 |   };
47 |   const getStatusIcon = () => {
48 |     switch (booking.status) {
49 |       case 'booked':
50 |         return <CheckCircle className="text-alien-green" size={20} />;
51 |       case 'cancelled':
52 |         return <XCircle className="text-red-500" size={20} />;
53 |       case 'completed':
54 |         return <CheckCircle className="text-blue-500" size={20} />;
55 |       default:
56 |         return <Clock className="text-star-white/50" size={20} />;
57 |     }
58 |   };
59 | 
60 |   const getStatusColor = () => {
61 |     switch (booking.status) {
62 |       case 'booked':
63 |         return 'text-alien-green';
64 |       case 'cancelled':
65 |         return 'text-red-500';
66 |       case 'completed':
67 |         return 'text-blue-500';
68 |       default:
69 |         return 'text-star-white/50';
70 |     }
71 |   };
72 | 
73 |   const canCancel = booking.status === 'booked';
74 | 
75 |   return (
76 |     <motion.div
77 |       initial={{ opacity: 0, y: 20 }}
78 |       animate={{ opacity: 1, y: 0 }}
79 |       whileHover={{ y: -2 }}
80 |       transition={{ duration: 0.2 }}
81 |     >
82 |       <Card>
83 |         {/* Header */}
84 |         <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
85 |           <div className="flex items-center gap-3">
86 |             <div className="p-2 rounded-lg bg-cosmic-gradient">
87 |               <Plane className="text-white" size={20} />
88 |             </div>
89 |             <div>
90 |               <p className="text-sm text-star-white/60">Booking #{booking.booking_id}</p>
91 |               <div className="flex items-center gap-2 mt-1">
92 |                 {getStatusIcon()}
93 |                 <span className={`text-sm font-semibold capitalize ${getStatusColor()}`}>
94 |                   {booking.status}
95 |                 </span>
96 |               </div>
97 |             </div>
98 |           </div>
99 |         </div>
100 | 
101 |         {/* Flight Details */}
102 |         {flight ? (
103 |           <div className="space-y-3 mb-4">
104 |             <div>
105 |               <h3 className="text-xl font-bold text-star-white mb-1">
106 |                 {flight.origin} → {flight.destination}
107 |               </h3>
108 |               <p className="text-sm text-star-white/60">Flight #{flight.flight_id}</p>
109 |             </div>
110 | 
111 |             <div className="grid grid-cols-2 gap-4">
112 |               <div>
113 |                 <p className="text-xs text-star-white/60 mb-1">Departure</p>
114 |                 <p className="text-sm text-star-white font-medium">
115 |                   {formatDate(flight.departure_time)}
116 |                 </p>
117 |               </div>
118 |               <div>
119 |                 <p className="text-xs text-star-white/60 mb-1">Arrival</p>
120 |                 <p className="text-sm text-star-white font-medium">
121 |                   {formatDate(flight.arrival_time)}
122 |                 </p>
123 |               </div>
124 |             </div>
125 | 
126 |             <div className="space-y-2 pt-3 border-t border-white/10">
127 |               <div className="flex items-center justify-between">
128 |                 <span className="text-sm text-star-white/60">Seat Class</span>
129 |                 <div className="flex items-center gap-2">
130 |                   {getSeatClassIcon()}
131 |                   <span className={`text-sm font-semibold ${getSeatClassColor()}`}>
132 |                     {getSeatClassName()}
133 |                   </span>
134 |                 </div>
135 |               </div>
136 |               <div className="flex items-center justify-between">
137 |                 <span className="text-sm text-star-white/60">Price Paid</span>
138 |                 <span className="text-lg font-bold text-star-white">
139 |                   {formatCurrency(booking.price_paid)}
140 |                 </span>
141 |               </div>
142 |             </div>
143 |           </div>
144 |         ) : (
145 |           <div className="mb-4">
146 |             <p className="text-sm text-star-white/60">Flight ID: {booking.flight_id}</p>
147 |           </div>
148 |         )}
149 | 
150 |         {/* Booking Time */}
151 |         <div className="flex items-center gap-2 text-sm text-star-white/60 mb-4">
152 |           <Calendar size={16} />
153 |           <span>Booked on {formatDate(booking.booking_time)}</span>
154 |         </div>
155 | 
156 |         {/* Cancel Button */}
157 |         {canCancel && (
158 |           <Button
159 |             variant="danger"
160 |             size="sm"
161 |             onClick={() => onCancel(booking.booking_id)}
162 |             isLoading={isCancelling}
163 |             className="w-full"
164 |           >
165 |             Cancel Booking
166 |           </Button>
167 |         )}
168 |       </Card>
169 |     </motion.div>
170 |   );
171 | };
172 | 
173 | // Made with Bob
174 |

**Tool:**

Contents of file src/components/flights/FlightFilters.tsx:

1 | import { useState } from 'react';
2 | import type { FlightFilters as FlightFiltersType } from '../../services/api';
3 | import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
4 | import { motion, AnimatePresence } from 'framer-motion';
5 | 
6 | interface FlightFiltersProps {
7 |   filters: FlightFiltersType;
8 |   onFiltersChange: (filters: FlightFiltersType) => void;
9 |   onReset: () => void;
10 | }
11 | 
12 | export const FlightFilters = ({ filters, onFiltersChange, onReset }: FlightFiltersProps) => {
13 |   const [isExpanded, setIsExpanded] = useState(false);
14 | 
15 |   const updateFilter = (key: keyof FlightFiltersType, value: FlightFiltersType[typeof key]) => {
16 |     onFiltersChange({ ...filters, [key]: value });
17 |   };
18 | 
19 |   const removeFilter = (key: keyof FlightFiltersType) => {
20 |     const newFilters = { ...filters };
21 |     delete newFilters[key];
22 |     onFiltersChange(newFilters);
23 |   };
24 | 
25 |   const activeFilterCount = Object.keys(filters).length;
26 | 
27 |   return (
28 |     <div className="glass-card p-6 space-y-4">
29 |       {/* Header */}
30 |       <div className="flex items-center justify-between">
31 |         <button
32 |           onClick={() => setIsExpanded(!isExpanded)}
33 |           className="flex items-center gap-2 text-star-white hover:text-cosmic-purple transition-colors"
34 |         >
35 |           <Filter size={20} />
36 |           <span className="font-semibold">Filters</span>
37 |           {activeFilterCount > 0 && (
38 |             <span className="px-2 py-0.5 bg-cosmic-purple/20 text-cosmic-purple text-xs rounded-full">
39 |               {activeFilterCount}
40 |             </span>
41 |           )}
42 |           {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
43 |         </button>
44 | 
45 |         {activeFilterCount > 0 && (
46 |           <button
47 |             onClick={onReset}
48 |             className="text-sm text-star-white/70 hover:text-star-white transition-colors"
49 |           >
50 |             Reset All
51 |           </button>
52 |         )}
53 |       </div>
54 | 
55 |       {/* Filter Content */}
56 |       <AnimatePresence>
57 |         {isExpanded && (
58 |           <motion.div
59 |             initial={{ height: 0, opacity: 0 }}
60 |             animate={{ height: 'auto', opacity: 1 }}
61 |             exit={{ height: 0, opacity: 0 }}
62 |             transition={{ duration: 0.2 }}
63 |             className="space-y-6 overflow-hidden"
64 |           >
65 |             {/* Phase 1: Sort */}
66 |             <div className="space-y-2">
67 |               <label className="text-sm font-medium text-star-white">Sort By</label>
68 |               <div className="grid grid-cols-2 gap-2">
69 |                 <select
70 |                   value={filters.sort_by || 'departure_time'}
71 |                   onChange={(e) => updateFilter('sort_by', e.target.value)}
72 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
73 |                 >
74 |                   <option value="departure_time">Departure Time</option>
75 |                   <option value="base_price">Price</option>
76 |                   <option value="duration">Duration</option>
77 |                   <option value="seats_available">Availability</option>
78 |                 </select>
79 |                 <select
80 |                   value={filters.sort_order || 'asc'}
81 |                   onChange={(e) => updateFilter('sort_order', e.target.value)}
82 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
83 |                 >
84 |                   <option value="asc">Ascending</option>
85 |                   <option value="desc">Descending</option>
86 |                 </select>
87 |               </div>
88 |             </div>
89 | 
90 |             {/* Phase 1: Date Range */}
91 |             <div className="space-y-2">
92 |               <label className="text-sm font-medium text-star-white">Departure Date</label>
93 |               <div className="grid grid-cols-2 gap-2">
94 |                 <div>
95 |                   <input
96 |                     type="date"
97 |                     value={filters.departure_date_from || ''}
98 |                     onChange={(e) => updateFilter('departure_date_from', e.target.value)}
99 |                     className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
100 |                   />
101 |                   <span className="text-xs text-star-white/50 mt-1">From</span>
102 |                 </div>
103 |                 <div>
104 |                   <input
105 |                     type="date"
106 |                     value={filters.departure_date_to || ''}
107 |                     onChange={(e) => updateFilter('departure_date_to', e.target.value)}
108 |                     className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
109 |                   />
110 |                   <span className="text-xs text-star-white/50 mt-1">To</span>
111 |                 </div>
112 |               </div>
113 |             </div>
114 | 
115 |             {/* Phase 1: Price Range */}
116 |             <div className="space-y-2">
117 |               <label className="text-sm font-medium text-star-white">Price Range (Credits)</label>
118 |               <div className="grid grid-cols-2 gap-2">
119 |                 <input
120 |                   type="number"
121 |                   placeholder="Min"
122 |                   value={filters.min_price || ''}
123 |                   onChange={(e) => updateFilter('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
124 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
125 |                 />
126 |                 <input
127 |                   type="number"
128 |                   placeholder="Max"
129 |                   value={filters.max_price || ''}
130 |                   onChange={(e) => updateFilter('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
131 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
132 |                 />
133 |               </div>
134 |             </div>
135 | 
136 |             {/* Phase 1: Seat Class */}
137 |             <div className="space-y-2">
138 |               <label className="text-sm font-medium text-star-white">Seat Class</label>
139 |               <div className="flex gap-2">
140 |                 {['economy', 'business', 'galaxium'].map((seatClass) => (
141 |                   <button
142 |                     key={seatClass}
143 |                     onClick={() => updateFilter('seat_class', filters.seat_class === seatClass ? undefined : seatClass)}
144 |                     className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
145 |                       filters.seat_class === seatClass
146 |                         ? 'bg-cosmic-purple text-white'
147 |                         : 'bg-white/5 text-star-white/70 hover:bg-white/10'
148 |                     }`}
149 |                   >
150 |                     {seatClass.charAt(0).toUpperCase() + seatClass.slice(1)}
151 |                   </button>
152 |                 ))}
153 |               </div>
154 |             </div>
155 | 
156 |             {/* Phase 2: Time of Day */}
157 |             <div className="space-y-2">
158 |               <label className="text-sm font-medium text-star-white">Time of Day</label>
159 |               <div className="grid grid-cols-2 gap-2">
160 |                 {[
161 |                   { value: 'morning', label: 'Morning (6-12)' },
162 |                   { value: 'afternoon', label: 'Afternoon (12-18)' },
163 |                   { value: 'evening', label: 'Evening (18-22)' },
164 |                   { value: 'night', label: 'Night (22-6)' },
165 |                 ].map((period) => (
166 |                   <button
167 |                     key={period.value}
168 |                     onClick={() =>
169 |                       updateFilter(
170 |                         'departure_time_period',
171 |                         filters.departure_time_period === period.value ? undefined : period.value
172 |                       )
173 |                     }
174 |                     className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
175 |                       filters.departure_time_period === period.value
176 |                         ? 'bg-cosmic-purple text-white'
177 |                         : 'bg-white/5 text-star-white/70 hover:bg-white/10'
178 |                     }`}
179 |                   >
180 |                     {period.label}
181 |                   </button>
182 |                 ))}
183 |               </div>
184 |             </div>
185 | 
186 |             {/* Phase 2: Duration */}
187 |             <div className="space-y-2">
188 |               <label className="text-sm font-medium text-star-white">Flight Duration (hours)</label>
189 |               <div className="grid grid-cols-2 gap-2">
190 |                 <input
191 |                   type="number"
192 |                   placeholder="Min"
193 |                   value={filters.min_duration || ''}
194 |                   onChange={(e) => updateFilter('min_duration', e.target.value ? parseInt(e.target.value) : undefined)}
195 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
196 |                 />
197 |                 <input
198 |                   type="number"
199 |                   placeholder="Max"
200 |                   value={filters.max_duration || ''}
201 |                   onChange={(e) => updateFilter('max_duration', e.target.value ? parseInt(e.target.value) : undefined)}
202 |                   className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
203 |                 />
204 |               </div>
205 |             </div>
206 | 
207 |             {/* Phase 2: Minimum Seats */}
208 |             <div className="space-y-2">
209 |               <label className="text-sm font-medium text-star-white">Minimum Seats Available</label>
210 |               <input
211 |                 type="number"
212 |                 placeholder="e.g., 2"
213 |                 value={filters.min_seats_available || ''}
214 |                 onChange={(e) =>
215 |                   updateFilter('min_seats_available', e.target.value ? parseInt(e.target.value) : undefined)
216 |                 }
217 |                 className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
218 |               />
219 |             </div>
220 | 
221 |             {/* Phase 3: Route Categories */}
222 |             <div className="space-y-2">
223 |               <label className="text-sm font-medium text-star-white">Route Category</label>
224 |               <div className="flex gap-2">
225 |                 {[
226 |                   { value: 'inner_planets', label: 'Inner Planets' },
227 |                   { value: 'outer_planets', label: 'Outer Planets' },
228 |                   { value: 'moons', label: 'Moons' },
229 |                 ].map((category) => (
230 |                   <button
231 |                     key={category.value}
232 |                     onClick={() =>
233 |                       updateFilter('route_category', filters.route_category === category.value ? undefined : category.value)
234 |                     }
235 |                     className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
236 |                       filters.route_category === category.value
237 |                         ? 'bg-cosmic-purple text-white'
238 |                         : 'bg-white/5 text-star-white/70 hover:bg-white/10'
239 |                     }`}
240 |                   >
241 |                     {category.label}
242 |                   </button>
243 |                 ))}
244 |               </div>
245 |             </div>
246 |           </motion.div>
247 |         )}
248 |       </AnimatePresence>
249 | 
250 |       {/* Active Filters */}
251 |       {activeFilterCount > 0 && (
252 |         <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
253 |           {Object.entries(filters).map(([key, value]) => (
254 |             <div
255 |               key={key}
256 |               className="flex items-center gap-1 px-3 py-1 bg-cosmic-purple/20 text-cosmic-purple text-sm rounded-full"
257 |             >
258 |               <span>
259 |                 {key.replace(/_/g, ' ')}: {String(value)}
260 |               </span>
261 |               <button
262 |                 onClick={() => removeFilter(key as keyof FlightFiltersType)}
263 |                 className="hover:text-white transition-colors"
264 |               >
265 |                 <X size={14} />
266 |               </button>
267 |             </div>
268 |           ))}
269 |         </div>
270 |       )}
271 |     </div>
272 |   );
273 | };
274 | 
275 | // Made with Bob

**Tool:**

Contents of file src/components/bookings/BookingModal.tsx:

1 | import { useState, useEffect } from 'react';
2 | import type { Flight, SeatClass, Quote, Hold } from '../../types';
3 | import { Modal, Button } from '../common';
4 | import {
5 |   Plane,
6 |   DollarSign,
7 |   Crown,
8 |   Rocket,
9 |   Check,
10 |   ArrowLeft,
11 |   Tag,
12 |   Timer,
13 |   Zap,
14 | } from 'lucide-react';
15 | import { formatCurrency, formatDate, calculateDuration } from '../../utils/formatters';
16 | import { createQuote, createHold, confirmHold, releaseHold } from '../../services/api';
17 | import { storeHold, removeHold } from '../../utils/holdStorage';
18 | import { useUser } from '../../hooks/useUserContext';
19 | import toast from 'react-hot-toast';
20 | 
21 | type Step = 'select' | 'quote' | 'hold';
22 | 
23 | interface BookingModalProps {
24 |   isOpen: boolean;
25 |   onClose: () => void;
26 |   flight: Flight | null;
27 |   onSuccess: () => void;
28 | }
29 | 
30 | export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
31 |   const { user } = useUser();
32 |   const [step, setStep] = useState<Step>('select');
33 |   const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
34 |   const [isLoading, setIsLoading] = useState(false);
35 |   const [quote, setQuote] = useState<Quote | null>(null);
36 |   const [hold, setHold] = useState<Hold | null>(null);
37 |   const [timeLeft, setTimeLeft] = useState(0);
38 | 
39 |   // Reset state when modal opens
40 |   useEffect(() => {
41 |     if (isOpen) {
42 |       setStep('select');
43 |       setSelectedClass('economy');
44 |       setQuote(null);
45 |       setHold(null);
46 |       setTimeLeft(0);
47 |     }
48 |   }, [isOpen]);
49 | 
50 |   // Countdown timer
51 |   useEffect(() => {
52 |     if (!hold || step !== 'hold') return;
53 | 
54 |     const update = () => {
55 |       const remaining = new Date(hold.reservedUntil).getTime() - Date.now();
56 |       setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
57 |     };
58 | 
59 |     update();
60 |     const interval = setInterval(update, 1000);
61 |     return () => clearInterval(interval);
62 |   }, [hold, step]);
63 | 
64 |   if (!flight) return null;
65 | 
66 |   const seatClasses = [
67 |     {
68 |       name: 'Economy',
69 |       class: 'economy' as SeatClass,
70 |       price: flight.economy_price,
71 |       seats: flight.economy_seats_available,
72 |       icon: Plane,
73 |       color: 'text-blue-400',
74 |       bgColor: 'bg-blue-500/10',
75 |       borderColor: 'border-blue-500/30',
76 |       features: ['Standard seating', 'In-flight entertainment', 'Complimentary snacks'],
77 |     },
78 |     {
79 |       name: 'Business',
80 |       class: 'business' as SeatClass,
81 |       price: flight.business_price,
82 |       seats: flight.business_seats_available,
83 |       icon: Crown,
84 |       color: 'text-purple-400',
85 |       bgColor: 'bg-purple-500/10',
86 |       borderColor: 'border-purple-500/30',
87 |       features: ['Premium seating', 'Priority boarding', 'Gourmet meals', 'Extra legroom'],
88 |     },
89 |     {
90 |       name: 'Galaxium Class',
91 |       class: 'galaxium' as SeatClass,
92 |       price: flight.galaxium_price,
93 |       seats: flight.galaxium_seats_available,
94 |       icon: Rocket,
95 |       color: 'text-alien-green',
96 |       bgColor: 'bg-alien-green/10',
97 |       borderColor: 'border-alien-green/30',
98 |       features: ['Luxury pods', 'VIP lounge access', 'Personal concierge', 'Zero-G experience'],
99 |     },
100 |   ];
101 | 
102 |   const selectedClassData = seatClasses.find((sc) => sc.class === selectedClass);
103 | 
104 |   const minutes = Math.floor(timeLeft / 60000);
105 |   const seconds = Math.floor((timeLeft % 60000) / 1000);
106 |   const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
107 |   const isExpired = hold !== null && timeLeft === 0;
108 | 
109 |   const flightSummary = (
110 |     <div className="glass-card p-4 bg-white/5">
111 |       <div className="flex items-center gap-3 mb-3">
112 |         <div className="p-2 rounded-lg bg-cosmic-gradient">
113 |           <Plane className="text-white" size={20} />
114 |         </div>
115 |         <div>
116 |           <h3 className="text-lg font-bold text-star-white">
117 |             {flight.origin} → {flight.destination}
118 |           </h3>
119 |           <p className="text-xs text-star-white/60">Flight #{flight.flight_id}</p>
120 |         </div>
121 |       </div>
122 |       <div className="grid grid-cols-3 gap-3 text-sm">
123 |         <div>
124 |           <p className="text-xs text-star-white/60 mb-1">Departure</p>
125 |           <p className="text-star-white font-medium">
126 |             {formatDate(flight.departure_time, 'MMM dd')}
127 |           </p>
128 |         </div>
129 |         <div>
130 |           <p className="text-xs text-star-white/60 mb-1">Arrival</p>
131 |           <p className="text-star-white font-medium">
132 |             {formatDate(flight.arrival_time, 'MMM dd')}
133 |           </p>
134 |         </div>
135 |         <div>
136 |           <p className="text-xs text-star-white/60 mb-1">Duration</p>
137 |           <p className="text-star-white font-medium">
138 |             {calculateDuration(flight.departure_time, flight.arrival_time)}
139 |           </p>
140 |         </div>
141 |       </div>
142 |     </div>
143 |   );
144 | 
145 |   const handleGetQuote = async () => {
146 |     if (!user) {
147 |       toast.error('Please sign in to get a quote');
148 |       return;
149 |     }
150 | 
151 |     setIsLoading(true);
152 |     try {
153 |       const newQuote = await createQuote({
154 |         flightId: flight.flight_id,
155 |         seatClass: selectedClass,
156 |         quantity: 1,
157 |         travelerId: user.user_id,
158 |         travelerName: user.name,
159 |       });
160 |       setQuote(newQuote);
161 |       setStep('quote');
162 |     } catch {
163 |       toast.error('Failed to get quote. Make sure the inventory service is running.');
164 |     } finally {
165 |       setIsLoading(false);
166 |     }
167 |   };
168 | 
169 |   const handlePlaceHold = async () => {
170 |     if (!quote) return;
171 | 
172 |     setIsLoading(true);
173 |     try {
174 |       const newHold = await createHold(quote.quoteId);
175 |       setHold(newHold);
176 |       setStep('hold');
177 | 
178 |       if (user) {
179 |         storeHold(user.user_id, {
180 |           holdId: newHold.holdId,
181 |           quoteId: quote.quoteId,
182 |           flightId: flight.flight_id,
183 |           seatClass: selectedClass,
184 |           pricePerSeat: quote.pricePerSeat,
185 |           totalPrice: quote.totalPrice,
186 |           reservedUntil: newHold.reservedUntil,
187 |         });
188 |       }
189 | 
190 |       toast.success('Seat held! You have 15 minutes to confirm.');
191 |     } catch {
192 |       toast.error('Failed to place hold');
193 |     } finally {
194 |       setIsLoading(false);
195 |     }
196 |   };
197 | 
198 |   const handleConfirmHold = async () => {
199 |     if (!hold || !user) return;
200 | 
201 |     setIsLoading(true);
202 |     try {
203 |       const confirmed = await confirmHold(hold.holdId);
204 |       removeHold(user.user_id, hold.holdId);
205 |       toast.success(
206 |         `Booking confirmed! Reference: #${confirmed.externalBookingReference}`
207 |       );
208 |       onSuccess();
209 |       onClose();
210 |     } catch {
211 |       toast.error('Failed to confirm booking');
212 |     } finally {
213 |       setIsLoading(false);
214 |     }
215 |   };
216 | 
217 |   const handleReleaseHold = async () => {
218 |     if (!hold || !user) return;
219 | 
220 |     setIsLoading(true);
221 |     try {
222 |       await releaseHold(hold.holdId);
223 |       removeHold(user.user_id, hold.holdId);
224 |       toast.success('Hold released');
225 |       onClose();
226 |     } catch {
227 |       toast.error('Failed to release hold');
228 |     } finally {
229 |       setIsLoading(false);
230 |     }
231 |   };
232 | 
233 |   const getModalTitle = () => {
234 |     switch (step) {
235 |       case 'select':
236 |         return 'Book Your Flight';
237 |       case 'quote':
238 |         return 'Your Price Quote';
239 |       case 'hold':
240 |         return 'Seat Reserved';
241 |     }
242 |   };
243 | 
244 |   // Step 1: Seat class selection
245 |   const renderSelectStep = () => (
246 |     <div className="space-y-6">
247 |       {flightSummary}
248 | 
249 |       <div>
250 |         <h4 className="text-sm font-semibold text-star-white mb-3">Select Seat Class</h4>
251 |         <div className="space-y-3">
252 |           {seatClasses.map((sc) => {
253 |             const Icon = sc.icon;
254 |             const isSelected = selectedClass === sc.class;
255 |             const isSoldOut = sc.seats === 0;
256 | 
257 |             return (
258 |               <button
259 |                 key={sc.class}
260 |                 onClick={() => !isSoldOut && setSelectedClass(sc.class)}
261 |                 disabled={isSoldOut}
262 |                 className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
263 |                   isSelected
264 |                     ? `${sc.borderColor} ${sc.bgColor}`
265 |                     : 'border-white/10 bg-white/5 hover:border-white/20'
266 |                 } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
267 |               >
268 |                 <div className="flex items-start justify-between mb-2">
269 |                   <div className="flex items-center gap-2">
270 |                     <Icon size={20} className={sc.color} />
271 |                     <span className="font-semibold text-star-white">{sc.name}</span>
272 |                     {isSelected && <Check size={18} className={sc.color} />}
273 |                   </div>
274 |                   <div className="text-right">
275 |                     <div className={`text-lg font-bold ${sc.color}`}>
276 |                       {formatCurrency(sc.price)}
277 |                     </div>
278 |                     <div className="text-xs text-star-white/60">
279 |                       {isSoldOut ? 'Sold Out' : `${sc.seats} left`}
280 |                     </div>
281 |                   </div>
282 |                 </div>
283 |                 <ul className="text-xs text-star-white/70 space-y-1">
284 |                   {sc.features.map((f, i) => (
285 |                     <li key={i}>• {f}</li>
286 |                   ))}
287 |                 </ul>
288 |               </button>
289 |             );
290 |           })}
291 |         </div>
292 |       </div>
293 | 
294 |       {user && (
295 |         <div className="glass-card p-4 bg-white/5">
296 |           <h4 className="text-sm font-semibold text-star-white mb-2">Passenger</h4>
297 |           <p className="text-star-white">{user.name}</p>
298 |           <p className="text-star-white/60 text-sm">{user.email}</p>
299 |         </div>
300 |       )}
301 | 
302 |       <div className="flex gap-3">
303 |         <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
304 |           Cancel
305 |         </Button>
306 |         <Button onClick={handleGetQuote} isLoading={isLoading} className="flex-1">
307 |           Get Quote →
308 |         </Button>
309 |       </div>
310 |     </div>
311 |   );
312 | 
313 |   // Step 2: Quote review
314 |   const renderQuoteStep = () => {
315 |     const Icon = selectedClassData?.icon || Plane;
316 |     return (
317 |       <div className="space-y-6">
318 |         <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/30">
319 |           <Tag size={16} className="text-cosmic-purple" />
320 |           <span className="text-xs text-star-white/60">Quote ID</span>
321 |           <span className="font-mono font-bold text-cosmic-purple ml-auto">{quote?.quoteId}</span>
322 |         </div>
323 | 
324 |         {flightSummary}
325 | 
326 |         <div className="glass-card p-4 bg-white/5 space-y-3">
327 |           <h4 className="text-sm font-semibold text-star-white">Price Breakdown</h4>
328 |           <div className="flex items-center justify-between">
329 |             <div className="flex items-center gap-2">
330 |               <Icon size={16} className={selectedClassData?.color} />
331 |               <span className="text-sm text-star-white/70">{selectedClassData?.name} × 1</span>
332 |             </div>
333 |             <span className="text-star-white font-medium">
334 |               {formatCurrency(quote?.pricePerSeat || 0)}
335 |             </span>
336 |           </div>
337 |           <div className="border-t border-white/10 pt-3 flex items-center justify-between">
338 |             <span className="font-semibold text-star-white">Total</span>
339 |             <span className="text-xl font-bold text-alien-green">
340 |               {formatCurrency(quote?.totalPrice || 0)}
341 |             </span>
342 |           </div>
343 |           <p className="text-xs text-star-white/50">
344 |             Quote valid for 24 hours · Price calculated by inventory service
345 |           </p>
346 |         </div>
347 | 
348 |         <div className="flex gap-3">
349 |           <Button
350 |             variant="secondary"
351 |             onClick={() => setStep('select')}
352 |             disabled={isLoading}
353 |             className="flex-1"
354 |           >
355 |             <ArrowLeft size={16} /> Back
356 |           </Button>
357 |           <Button onClick={handlePlaceHold} isLoading={isLoading} className="flex-1">
358 |             <Timer size={16} /> Place Hold →
359 |           </Button>
360 |         </div>
361 |       </div>
362 |     );
363 |   };
364 | 
365 |   // Step 3: Hold active with countdown
366 |   const renderHoldStep = () => (
367 |     <div className="space-y-6">
368 |       <div className="flex items-center gap-2 p-3 rounded-lg bg-alien-green/10 border border-alien-green/30">
369 |         <Zap size={16} className="text-alien-green" />
370 |         <span className="text-xs text-star-white/60">Hold ID</span>
371 |         <span className="font-mono font-bold text-alien-green ml-auto">{hold?.holdId}</span>
372 |       </div>
373 | 
374 |       {/* Countdown timer */}
375 |       <div
376 |         className={`p-6 text-center rounded-xl border-2 ${
377 |           isExpired
378 |             ? 'border-red-500/50 bg-red-500/5'
379 |             : 'border-solar-orange/50 bg-solar-orange/5'
380 |         }`}
381 |       >
382 |         <p className="text-xs text-star-white/60 mb-2 uppercase tracking-widest">
383 |           {isExpired ? 'Hold Expired' : 'Time to Confirm'}
384 |         </p>
385 |         <div
386 |           className={`text-5xl font-mono font-bold tabular-nums ${
387 |             isExpired ? 'text-red-500' : 'text-solar-orange'
388 |           }`}
389 |         >
390 |           {isExpired ? 'EXPIRED' : timerDisplay}
391 |         </div>
392 |         {!isExpired && (
393 |           <p className="text-xs text-star-white/50 mt-2">
394 |             Seat is reserved — confirm before time runs out
395 |           </p>
396 |         )}
397 |       </div>
398 | 
399 |       {flightSummary}
400 | 
401 |       <div className="flex items-center justify-between p-4 rounded-xl bg-cosmic-gradient">
402 |         <div className="flex items-center gap-2">
403 |           <DollarSign className="text-white" size={20} />
404 |           <span className="text-white font-semibold">Total</span>
405 |         </div>
406 |         <span className="text-xl font-bold text-white">
407 |           {formatCurrency(quote?.totalPrice || 0)}
408 |         </span>
409 |       </div>
410 | 
411 |       {isExpired ? (
412 |         <Button variant="secondary" onClick={onClose} className="w-full">
413 |           Close
414 |         </Button>
415 |       ) : (
416 |         <>
417 |           <div className="flex gap-3">
418 |             <Button
419 |               variant="danger"
420 |               onClick={handleReleaseHold}
421 |               isLoading={isLoading}
422 |               className="flex-1"
423 |             >
424 |               Release Hold
425 |             </Button>
426 |             <Button onClick={handleConfirmHold} isLoading={isLoading} className="flex-1">
427 |               Confirm Booking
428 |             </Button>
429 |           </div>
430 |           <p className="text-xs text-star-white/50 text-center">
431 |             Closing keeps your hold active — find it in My Bookings
432 |           </p>
433 |         </>
434 |       )}
435 |     </div>
436 |   );
437 | 
438 |   return (
439 |     <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
440 |       {step === 'select' && renderSelectStep()}
441 |       {step === 'quote' && renderQuoteStep()}
442 |       {step === 'hold' && renderHoldStep()}
443 |     </Modal>
444 |   );
445 | };
446 | 
447 | // Made with Bob
448 |

**Tool:**

Contents of file src/components/bookings/HoldCard.tsx:

1 | import { useState, useEffect } from 'react';
2 | import type { Flight, StoredHold } from '../../types';
3 | import { Card, Button } from '../common';
4 | import { Zap, Plane, Crown, Rocket, Timer, CheckCircle, XCircle } from 'lucide-react';
5 | import { formatCurrency } from '../../utils/formatters';
6 | import { confirmHold, releaseHold } from '../../services/api';
7 | import { removeHold } from '../../utils/holdStorage';
8 | import { useUser } from '../../hooks/useUserContext';
9 | import toast from 'react-hot-toast';
10 | import { motion } from 'framer-motion';
11 | 
12 | interface HoldCardProps {
13 |   storedHold: StoredHold;
14 |   flight?: Flight;
15 |   onAction: () => void; // called after confirm or release to refresh parent
16 | }
17 | 
18 | export const HoldCard = ({ storedHold, flight, onAction }: HoldCardProps) => {
19 |   const { user } = useUser();
20 |   const [timeLeft, setTimeLeft] = useState(0);
21 |   const [isConfirming, setIsConfirming] = useState(false);
22 |   const [isReleasing, setIsReleasing] = useState(false);
23 | 
24 |   useEffect(() => {
25 |     const update = () => {
26 |       const remaining = new Date(storedHold.reservedUntil).getTime() - Date.now();
27 |       setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
28 |     };
29 | 
30 |     update();
31 |     const interval = setInterval(update, 1000);
32 |     return () => clearInterval(interval);
33 |   }, [storedHold.reservedUntil]);
34 | 
35 |   const minutes = Math.floor(timeLeft / 60000);
36 |   const seconds = Math.floor((timeLeft % 60000) / 1000);
37 |   const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
38 |   const isExpired = timeLeft === 0;
39 | 
40 |   const isLoading = isConfirming || isReleasing;
41 | 
42 |   const getSeatIcon = () => {
43 |     switch (storedHold.seatClass) {
44 |       case 'business':
45 |         return <Crown size={16} className="text-purple-400" />;
46 |       case 'galaxium':
47 |         return <Rocket size={16} className="text-alien-green" />;
48 |       default:
49 |         return <Plane size={16} className="text-blue-400" />;
50 |     }
51 |   };
52 | 
53 |   const getSeatClassName = () => {
54 |     switch (storedHold.seatClass) {
55 |       case 'business':
56 |         return 'Business';
57 |       case 'galaxium':
58 |         return 'Galaxium Class';
59 |       default:
60 |         return 'Economy';
61 |     }
62 |   };
63 | 
64 |   const handleConfirm = async () => {
65 |     if (!user) return;
66 |     setIsConfirming(true);
67 |     try {
68 |       const confirmed = await confirmHold(storedHold.holdId);
69 |       removeHold(user.user_id, storedHold.holdId);
70 |       toast.success(`Booking confirmed! Reference: #${confirmed.externalBookingReference}`);
71 |       onAction();
72 |     } catch {
73 |       toast.error('Failed to confirm booking');
74 |     } finally {
75 |       setIsConfirming(false);
76 |     }
77 |   };
78 | 
79 |   const handleRelease = async () => {
80 |     if (!user) return;
81 |     setIsReleasing(true);
82 |     try {
83 |       await releaseHold(storedHold.holdId);
84 |       removeHold(user.user_id, storedHold.holdId);
85 |       toast.success('Hold released');
86 |       onAction();
87 |     } catch {
88 |       toast.error('Failed to release hold');
89 |     } finally {
90 |       setIsReleasing(false);
91 |     }
92 |   };
93 | 
94 |   return (
95 |     <motion.div
96 |       initial={{ opacity: 0, y: 20 }}
97 |       animate={{ opacity: 1, y: 0 }}
98 |       whileHover={{ y: -2 }}
99 |       transition={{ duration: 0.2 }}
100 |     >
101 |       <Card className={`border ${isExpired ? 'border-red-500/30' : 'border-solar-orange/30'}`}>
102 |         {/* Header */}
103 |         <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
104 |           <div className="flex items-center gap-3">
105 |             <div
106 |               className={`p-2 rounded-lg ${
107 |                 isExpired ? 'bg-red-500/20' : 'bg-solar-orange/20'
108 |               }`}
109 |             >
110 |               <Zap
111 |                 className={isExpired ? 'text-red-400' : 'text-solar-orange'}
112 |                 size={20}
113 |               />
114 |             </div>
115 |             <div>
116 |               <p className="text-xs text-star-white/60 font-mono">{storedHold.holdId}</p>
117 |               <div className="flex items-center gap-2 mt-1">
118 |                 {isExpired ? (
119 |                   <>
120 |                     <XCircle className="text-red-500" size={16} />
121 |                     <span className="text-sm font-semibold text-red-500">Expired</span>
122 |                   </>
123 |                 ) : (
124 |                   <>
125 |                     <Timer className="text-solar-orange" size={16} />
126 |                     <span className="text-sm font-semibold text-solar-orange">
127 |                       Held · {timerDisplay}
128 |                     </span>
129 |                   </>
130 |                 )}
131 |               </div>
132 |             </div>
133 |           </div>
134 |         </div>
135 | 
136 |         {/* Flight details */}
137 |         <div className="space-y-3 mb-4">
138 |           {flight ? (
139 |             <div>
140 |               <h3 className="text-xl font-bold text-star-white mb-1">
141 |                 {flight.origin} → {flight.destination}
142 |               </h3>
143 |               <p className="text-sm text-star-white/60">Flight #{flight.flight_id}</p>
144 |             </div>
145 |           ) : (
146 |             <p className="text-sm text-star-white/60">Flight #{storedHold.flightId}</p>
147 |           )}
148 | 
149 |           <div className="flex items-center justify-between pt-2 border-t border-white/10">
150 |             <div className="flex items-center gap-2">
151 |               {getSeatIcon()}
152 |               <span className="text-sm text-star-white/70">{getSeatClassName()}</span>
153 |             </div>
154 |             <span className="text-lg font-bold text-star-white">
155 |               {storedHold.totalPrice != null && !isNaN(storedHold.totalPrice)
156 |                 ? formatCurrency(storedHold.totalPrice)
157 |                 : '—'}
158 |             </span>
159 |           </div>
160 |         </div>
161 | 
162 |         {/* Actions */}
163 |         {!isExpired && (
164 |           <div className="flex gap-2">
165 |             <Button
166 |               variant="danger"
167 |               size="sm"
168 |               onClick={handleRelease}
169 |               isLoading={isReleasing}
170 |               disabled={isLoading}
171 |               className="flex-1"
172 |             >
173 |               Release
174 |             </Button>
175 |             <Button
176 |               size="sm"
177 |               onClick={handleConfirm}
178 |               isLoading={isConfirming}
179 |               disabled={isLoading}
180 |               className="flex-1"
181 |             >
182 |               <CheckCircle size={14} /> Confirm
183 |             </Button>
184 |           </div>
185 |         )}
186 | 
187 |         {isExpired && (
188 |           <Button
189 |             variant="secondary"
190 |             size="sm"
191 |             onClick={() => {
192 |               if (user) removeHold(user.user_id, storedHold.holdId);
193 |               onAction();
194 |             }}
195 |             className="w-full"
196 |           >
197 |             Dismiss
198 |           </Button>
199 |         )}
200 |       </Card>
201 |     </motion.div>
202 |   );
203 | };
204 | 
205 | // Made with Bob
206 |

**Assistant:**



_spend: {'cost': 0.088688, 'contextTokens': 44344}_

**Tool:**

Contents of file src/components/layout/Header.tsx:

1 | import { useState } from 'react';
2 | import { Link, useLocation } from 'react-router-dom';
3 | import { Rocket, User, LogOut } from 'lucide-react';
4 | import { useUser } from '../../hooks/useUserContext';
5 | import { Button } from '../common';
6 | import { UserIdentification } from '../user/UserIdentification';
7 | import { motion } from 'framer-motion';
8 | 
9 | export const Header = () => {
10 |   const location = useLocation();
11 |   const { user, logout } = useUser();
12 |   const [showUserModal, setShowUserModal] = useState(false);
13 | 
14 |   const isActive = (path: string) => location.pathname === path;
15 | 
16 |   return (
17 |     <>
18 |     <header className="fixed top-0 left-0 right-0 z-30 glass-card border-b border-white/10">
19 |       <div className="container mx-auto px-4 py-4">
20 |         <div className="flex items-center justify-between">
21 |           {/* Logo */}
22 |           <Link to="/" className="flex items-center gap-2 group">
23 |             <motion.div
24 |               whileHover={{ rotate: 15 }}
25 |               transition={{ duration: 0.3 }}
26 |             >
27 |               <Rocket className="text-cosmic-purple" size={32} />
28 |             </motion.div>
29 |             <span className="text-2xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
30 |               Galaxium Travels
31 |             </span>
32 |           </Link>
33 | 
34 |           {/* Navigation */}
35 |           <nav className="hidden md:flex items-center gap-6">
36 |             <Link
37 |               to="/"
38 |               className={`text-sm font-medium transition-colors ${
39 |                 isActive('/')
40 |                   ? 'text-cosmic-purple'
41 |                   : 'text-star-white/70 hover:text-star-white'
42 |               }`}
43 |             >
44 |               Home
45 |             </Link>
46 |             <Link
47 |               to="/flights"
48 |               className={`text-sm font-medium transition-colors ${
49 |                 isActive('/flights')
50 |                   ? 'text-cosmic-purple'
51 |                   : 'text-star-white/70 hover:text-star-white'
52 |               }`}
53 |             >
54 |               Flights
55 |             </Link>
56 |             {user && (
57 |               <Link
58 |                 to="/bookings"
59 |                 className={`text-sm font-medium transition-colors ${
60 |                   isActive('/bookings')
61 |                     ? 'text-cosmic-purple'
62 |                     : 'text-star-white/70 hover:text-star-white'
63 |                 }`}
64 |               >
65 |                 My Bookings
66 |               </Link>
67 |             )}
68 |           </nav>
69 | 
70 |           {/* User Section */}
71 |           <div className="flex items-center gap-4">
72 |             {user ? (
73 |               <div className="flex items-center gap-3">
74 |                 <div className="hidden md:flex items-center gap-2 text-sm">
75 |                   <User size={16} className="text-cosmic-purple" />
76 |                   <span className="text-star-white">{user.name}</span>
77 |                 </div>
78 |                 <Button
79 |                   variant="secondary"
80 |                   size="sm"
81 |                   onClick={logout}
82 |                   className="flex items-center gap-2"
83 |                 >
84 |                   <LogOut size={16} />
85 |                   <span className="hidden md:inline">Logout</span>
86 |                 </Button>
87 |               </div>
88 |             ) : (
89 |               <>
90 |                 {location.pathname === '/' ? (
91 |                   <Link to="/flights">
92 |                     <Button size="sm">Book a Flight</Button>
93 |                   </Link>
94 |                 ) : (
95 |                   <Button
96 |                     size="sm"
97 |                     onClick={() => setShowUserModal(true)}
98 |                   >
99 |                     Login
100 |                   </Button>
101 |                 )}
102 |               </>
103 |             )}
104 |           </div>
105 |         </div>
106 | 
107 |         {/* Mobile Navigation */}
108 |         <nav className="md:hidden flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
109 |           <Link
110 |             to="/"
111 |             className={`text-sm font-medium transition-colors ${
112 |               isActive('/')
113 |                 ? 'text-cosmic-purple'
114 |                 : 'text-star-white/70 hover:text-star-white'
115 |             }`}
116 |           >
117 |             Home
118 |           </Link>
119 |           <Link
120 |             to="/flights"
121 |             className={`text-sm font-medium transition-colors ${
122 |               isActive('/flights')
123 |                 ? 'text-cosmic-purple'
124 |                 : 'text-star-white/70 hover:text-star-white'
125 |             }`}
126 |           >
127 |             Flights
128 |           </Link>
129 |           {user && (
130 |             <Link
131 |               to="/bookings"
132 |               className={`text-sm font-medium transition-colors ${
133 |                 isActive('/bookings')
134 |                   ? 'text-cosmic-purple'
135 |                   : 'text-star-white/70 hover:text-star-white'
136 |               }`}
137 |             >
138 |               My Bookings
139 |             </Link>
140 |           )}
141 |         </nav>
142 |       </div>
143 |     </header>
144 |     
145 |     {/* User Identification Modal - Outside header for proper z-index */}
146 |     <UserIdentification
147 |       isOpen={showUserModal}
148 |       onClose={() => setShowUserModal(false)}
149 |       onSuccess={() => {
150 |         setShowUserModal(false);
151 |       }}
152 |     />
153 |     </>
154 |   );
155 | };
156 | 
157 | // Made with Bob
158 |

**Tool:**

Contents of file src/components/common/Modal.tsx:

1 | import type { ReactNode } from 'react';
2 | import { motion, AnimatePresence } from 'framer-motion';
3 | import { X } from 'lucide-react';
4 | import { useEffect } from 'react';
5 | 
6 | interface ModalProps {
7 |   isOpen: boolean;
8 |   onClose: () => void;
9 |   title?: string;
10 |   children: ReactNode;
11 |   size?: 'sm' | 'md' | 'lg';
12 | }
13 | 
14 | export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
15 |   const sizeClasses = {
16 |     sm: 'max-w-md',
17 |     md: 'max-w-2xl',
18 |     lg: 'max-w-4xl',
19 |   };
20 | 
21 |   // Close on escape key
22 |   useEffect(() => {
23 |     const handleEscape = (e: KeyboardEvent) => {
24 |       if (e.key === 'Escape') onClose();
25 |     };
26 |     
27 |     if (isOpen) {
28 |       document.addEventListener('keydown', handleEscape);
29 |       document.body.style.overflow = 'hidden';
30 |     }
31 |     
32 |     return () => {
33 |       document.removeEventListener('keydown', handleEscape);
34 |       document.body.style.overflow = 'unset';
35 |     };
36 |   }, [isOpen, onClose]);
37 | 
38 |   return (
39 |     <AnimatePresence>
40 |       {isOpen && (
41 |         <>
42 |           {/* Backdrop */}
43 |           <motion.div
44 |             initial={{ opacity: 0 }}
45 |             animate={{ opacity: 1 }}
46 |             exit={{ opacity: 0 }}
47 |             onClick={onClose}
48 |             className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
49 |           />
50 |           
51 |           {/* Modal */}
52 |           <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 overflow-y-auto">
53 |             <motion.div
54 |               initial={{ opacity: 0, scale: 0.95, y: 20 }}
55 |               animate={{ opacity: 1, scale: 1, y: 0 }}
56 |               exit={{ opacity: 0, scale: 0.95, y: 20 }}
57 |               className={`bg-space-dark/95 backdrop-blur-xl border-2 border-cosmic-purple/30 rounded-2xl shadow-2xl shadow-cosmic-purple/20 w-full ${sizeClasses[size]} my-8 p-6`}
58 |               role="dialog"
59 |               aria-modal="true"
60 |             >
61 |               {/* Header */}
62 |               {title && (
63 |                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-cosmic-purple/20">
64 |                   <h2 className="text-2xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">{title}</h2>
65 |                   <button
66 |                     onClick={onClose}
67 |                     className="text-star-white/70 hover:text-cosmic-purple transition-colors p-1 hover:bg-white/5 rounded-lg"
68 |                     aria-label="Close modal"
69 |                   >
70 |                     <X size={24} />
71 |                   </button>
72 |                 </div>
73 |               )}
74 |               
75 |               {/* Content */}
76 |               <div>{children}</div>
77 |             </motion.div>
78 |           </div>
79 |         </>
80 |       )}
81 |     </AnimatePresence>
82 |   );
83 | };
84 | 
85 | // Made with Bob
86 |

**Tool:**

Contents of file src/components/user/UserIdentification.tsx:

1 | import { useState } from 'react';
2 | import { Modal, Input, Button } from '../common';
3 | import type { ErrorResponse } from '../../types';
4 | import { getUserByCredentials, registerUser, isErrorResponse } from '../../services/api';
5 | import { useUser } from '../../hooks/useUserContext';
6 | import toast from 'react-hot-toast';
7 | 
8 | interface UserIdentificationProps {
9 |   isOpen: boolean;
10 |   onClose: () => void;
11 |   onSuccess: () => void;
12 | }
13 | 
14 | export const UserIdentification = ({ isOpen, onClose, onSuccess }: UserIdentificationProps) => {
15 |   const { setUser } = useUser();
16 |   const [name, setName] = useState('');
17 |   const [email, setEmail] = useState('');
18 |   const [isLoading, setIsLoading] = useState(false);
19 |   const [isNewUser, setIsNewUser] = useState(false);
20 |   
21 |   //validate email addresses
22 |   const validateEmail = (email: string): boolean => {
23 |     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
24 |     return re.test(email);
25 |   };
26 | 
27 |   const handleSubmit = async (e: React.FormEvent) => {
28 |     e.preventDefault();
29 |     
30 |     if (!name.trim() || !email.trim()) {
31 |       toast.error('Please fill in all fields');
32 |       return;
33 |     }
34 | 
35 |     if (!validateEmail(email.trim())) {
36 |       toast.error('Please enter a valid email address');
37 |       return;
38 |     }
39 | 
40 |     setIsLoading(true);
41 | 
42 |     try {
43 |       if (isNewUser) {
44 |         // Register new user
45 |         const result = await registerUser({ name: name.trim(), email: email.trim() });
46 |         
47 |         if (isErrorResponse(result)) {
48 |           toast.error(result.details || result.error);
49 |           return;
50 |         }
51 |         
52 |         setUser(result);
53 |         toast.success('Account created successfully!');
54 |         onSuccess();
55 |         onClose();
56 |       } else {
57 |         // Try to find existing user
58 |         const result = await getUserByCredentials(name.trim(), email.trim());
59 |         
60 |         if (isErrorResponse(result)) {
61 |           // User not found, suggest registration
62 |           toast.error('User not found. Please register or check your credentials.');
63 |           setIsNewUser(true);
64 |           return;
65 |         }
66 |         
67 |         setUser(result);
68 |         toast.success(`Welcome back, ${result.name}!`);
69 |         onSuccess();
70 |         onClose();
71 |       }
72 |     } catch (err) {
73 |       const error = err as ErrorResponse;
74 |       toast.error(error.details || error.error || 'An error occurred');
75 |     } finally {
76 |       setIsLoading(false);
77 |     }
78 |   };
79 | 
80 |   const handleClose = () => {
81 |     setName('');
82 |     setEmail('');
83 |     setIsNewUser(false);
84 |     onClose();
85 |   };
86 | 
87 |   return (
88 |     <Modal
89 |       isOpen={isOpen}
90 |       onClose={handleClose}
91 |       title={isNewUser ? 'Create Account' : 'Sign In'}
92 |       size="sm"
93 |     >
94 |       <form onSubmit={handleSubmit} className="space-y-4">
95 |         <p className="text-star-white/70 text-sm mb-4">
96 |           {isNewUser
97 |             ? 'Create an account to book your flight'
98 |             : 'Enter your name and email to continue'}
99 |         </p>
100 | 
101 |         <Input
102 |           label="Name"
103 |           type="text"
104 |           placeholder="John Doe"
105 |           value={name}
106 |           onChange={(e) => setName(e.target.value)}
107 |           required
108 |         />
109 | 
110 |         <Input
111 |           label="Email"
112 |           type="email"
113 |           placeholder="john@example.com"
114 |           value={email}
115 |           onChange={(e) => setEmail(e.target.value)}
116 |           required
117 |         />
118 | 
119 |         <div className="flex flex-col gap-3 pt-4">
120 |           <Button type="submit" isLoading={isLoading} className="w-full">
121 |             {isNewUser ? 'Create Account' : 'Continue'}
122 |           </Button>
123 | 
124 |           <button
125 |             type="button"
126 |             onClick={() => setIsNewUser(!isNewUser)}
127 |             className="text-sm text-cosmic-purple hover:text-nebula-pink transition-colors"
128 |           >
129 |             {isNewUser
130 |               ? 'Already have an account? Sign in'
131 |               : "Don't have an account? Register"}
132 |           </button>
133 |         </div>
134 |       </form>
135 |     </Modal>
136 |   );
137 | };
138 | 
139 | // Made with Bob
140 |

**Tool:**

Contents of file src/components/layout/Footer.tsx:

1 | import { Github, Heart } from 'lucide-react';
2 | 
3 | export const Footer = () => {
4 |   const currentYear = new Date().getFullYear();
5 | 
6 |   return (
7 |     <footer className="relative z-10 mt-auto border-t border-white/10 bg-space-dark/50 backdrop-blur-sm">
8 |       <div className="container mx-auto px-4 py-8">
9 |         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
10 |           {/* Copyright */}
11 |           <div className="text-star-white/70 text-sm">
12 |             © {currentYear} Galaxium Travels. All rights reserved.
13 |           </div>
14 | 
15 |           {/* Made with love */}
16 |           <div className="flex items-center gap-2 text-star-white/70 text-sm">
17 |             <span>Made with</span>
18 |             <Heart size={16} className="text-nebula-pink fill-nebula-pink" />
19 |             <span>for space travelers</span>
20 |           </div>
21 | 
22 |           {/* Links */}
23 |           <div className="flex items-center gap-4">
24 |             <a
25 |               href="https://github.com"
26 |               target="_blank"
27 |               rel="noopener noreferrer"
28 |               className="text-star-white/70 hover:text-cosmic-purple transition-colors"
29 |             >
30 |               <Github size={20} />
31 |             </a>
32 |           </div>
33 |         </div>
34 |       </div>
35 |     </footer>
36 |   );
37 | };
38 | 
39 | // Made with Bob
40 |

**Tool:**

Contents of file src/data/destinations.ts:

1 | export interface DestinationData {
2 |   slug: string;
3 |   name: string;
4 |   tagline: string;
5 |   description: string;
6 |   facts: {
7 |     gravity: string;
8 |     distanceFromEarth: string;
9 |     typicalTransitTime: string;
10 |     surfaceTemp: string;
11 |     moons: string;
12 |     atmosphere: string;
13 |   };
14 |   hazards: string[];
15 |   gallery: {
16 |     alt: string;
17 |     description: string;
18 |     colorClass: string;
19 |   }[];
20 |   accentColor: string;
21 |   bgAccent: string;
22 |   borderAccent: string;
23 | }
24 | 
25 | const destinations: DestinationData[] = [
26 |   {
27 |     slug: 'earth',
28 |     name: 'Earth',
29 |     tagline: 'The cradle of humanity — and the perfect place to return to.',
30 |     description:
31 |       'Earth remains the most habitable world in the known solar system, with a breathable nitrogen-oxygen atmosphere, liquid water oceans, and a magnetic field that shields surface life from solar radiation. Whether you\'re departing or arriving, orbital approach offers unrivalled views of swirling cloud systems and turquoise seas.',
32 |     facts: {
33 |       gravity: '9.81 m/s²',
34 |       distanceFromEarth: '0 km',
35 |       typicalTransitTime: 'Home port',
36 |       surfaceTemp: '-89 °C to +57 °C',
37 |       moons: '1 (Luna)',
38 |       atmosphere: 'Nitrogen 78 %, Oxygen 21 %',
39 |     },
40 |     hazards: [
41 |       'Dense air traffic in low-Earth orbit — strict approach corridors enforced',
42 |       'Electromagnetic interference from surface networks may disrupt navigation',
43 |       'Weather re-entry delays are common at equatorial spaceports',
44 |       'Customs and biosecurity screening required for all interplanetary arrivals',
45 |     ],
46 |     gallery: [
47 |       { alt: 'Blue Marble view', description: 'Blue Marble — Atlantic from orbit', colorClass: 'bg-blue-500/20' },
48 |       { alt: 'Coastal landing strip', description: 'Cape Canaveral approach corridor', colorClass: 'bg-cyan-500/20' },
49 |       { alt: 'Night lights', description: 'City grid illumination, night side', colorClass: 'bg-indigo-500/20' },
50 |     ],
51 |     accentColor: 'text-space-blue',
52 |     bgAccent: 'bg-blue-500/10',
53 |     borderAccent: 'border-blue-500/30',
54 |   },
55 |   {
56 |     slug: 'mars',
57 |     name: 'Mars',
58 |     tagline: 'Rust-red horizons and the promise of a second home.',
59 |     description:
60 |       'Mars is humanity\'s boldest frontier — a terrestrial planet with a thin carbon dioxide atmosphere, polar ice caps, and the largest volcano in the solar system. Olympus Base offers pressurised habitats, rover excursions across Valles Marineris, and spectacular iron-oxide sunsets.',
61 |     facts: {
62 |       gravity: '3.72 m/s²',
63 |       distanceFromEarth: '~225 million km (avg)',
64 |       typicalTransitTime: '8 h',
65 |       surfaceTemp: '-125 °C to +20 °C',
66 |       moons: '2 (Phobos, Deimos)',
67 |       atmosphere: 'CO₂ 95 %, thin — unsuitable for breathing',
68 |     },
69 |     hazards: [
70 |       'Dust storms can ground all surface operations for weeks',
71 |       'EVA suit required at all times outside pressurised zones',
72 |       'Radiation exposure ~2× Earth levels — shielding mandatory',
73 |       'Gravity adjustment syndrome affects most travellers for 48–72 h',
74 |       'Perchlorate soil contamination — never remove gloves outdoors',
75 |     ],
76 |     gallery: [
77 |       { alt: 'Olympus Mons', description: 'Olympus Mons caldera at dawn', colorClass: 'bg-orange-600/20' },
78 |       { alt: 'Valles Marineris', description: 'Valles Marineris canyon system', colorClass: 'bg-red-700/20' },
79 |       { alt: 'Polar ice cap', description: 'North polar CO₂ ice cap, summer', colorClass: 'bg-rose-300/20' },
80 |     ],
81 |     accentColor: 'text-solar-orange',
82 |     bgAccent: 'bg-solar-orange/10',
83 |     borderAccent: 'border-solar-orange/30',
84 |   },
85 |   {
86 |     slug: 'moon',
87 |     name: 'Moon',
88 |     tagline: 'Humanity\'s first step — now a bustling gateway world.',
89 |     description:
90 |       'Just 384,000 km from Earth, the Moon is the solar system\'s most accessible off-world destination. Lunar Gateway Station and Artemis Base Camp provide modern amenities, while the stark regolith plains and Earth-rise views make for an unforgettable experience.',
91 |     facts: {
92 |       gravity: '1.62 m/s²',
93 |       distanceFromEarth: '~384,000 km',
94 |       typicalTransitTime: '3 h',
95 |       surfaceTemp: '-173 °C to +127 °C',
96 |       moons: 'N/A — the Moon itself',
97 |       atmosphere: 'Virtually none (exosphere only)',
98 |     },
99 |     hazards: [
100 |       'No atmosphere — space suit required outside at all times',
101 |       'Micro-meteorite impacts are a persistent risk in the regolith zone',
102 |       'Temperature swings exceed 300 °C between day and night',
103 |       'Abrasive lunar dust can damage seals and optical surfaces',
104 |     ],
105 |     gallery: [
106 |       { alt: 'Earthrise', description: 'Earthrise over the Sea of Tranquility', colorClass: 'bg-gray-400/20' },
107 |       { alt: 'Artemis Base', description: 'Artemis Base Camp habitat cluster', colorClass: 'bg-slate-400/20' },
108 |       { alt: 'Crater rim', description: 'Shackleton crater rim, south pole', colorClass: 'bg-zinc-400/20' },
109 |     ],
110 |     accentColor: 'text-star-white',
111 |     bgAccent: 'bg-white/10',
112 |     borderAccent: 'border-white/30',
113 |   },
114 |   {
115 |     slug: 'venus',
116 |     name: 'Venus',
117 |     tagline: 'Hellscape below, paradise above the clouds.',
118 |     description:
119 |       'Venus is the solar system\'s most extreme planet — crushing atmospheric pressure, sulphuric acid clouds, and surface temperatures hot enough to melt lead. Galaxium\'s Cloud City habitats float at 50 km altitude where temperature and pressure are surprisingly Earth-like, offering surreal amber skies and lightning storms below.',
120 |     facts: {
121 |       gravity: '8.87 m/s²',
122 |       distanceFromEarth: '~38 million km (closest)',
123 |       typicalTransitTime: '6 h',
124 |       surfaceTemp: '~465 °C (surface) / 0–30 °C (cloud layer)',
125 |       moons: '0',
126 |       atmosphere: 'CO₂ 96 %, H₂SO₄ clouds — lethal at surface',
127 |     },
128 |     hazards: [
129 |       'Surface descent is strictly prohibited — habitat stays airborne',
130 |       'Sulphuric acid rain can dissolve exposed equipment within hours',
131 |       'Atmospheric turbulence rating 9/10 — expect a rough arrival',
132 |       'Pressurisation failure evacuation time: under 90 seconds',
133 |       'All exterior maintenance requires level-4 acid-resistant suits',
134 |     ],
135 |     gallery: [
136 |       { alt: 'Cloud City', description: 'Aerostat Cloud City at 50 km altitude', colorClass: 'bg-yellow-500/20' },
137 |       { alt: 'Lightning storm', description: 'Sulphuric acid lightning storms below', colorClass: 'bg-amber-600/20' },
138 |       { alt: 'Solar panels', description: 'Solar array wings above the cloud deck', colorClass: 'bg-yellow-300/20' },
139 |     ],
140 |     accentColor: 'text-solar-orange',
141 |     bgAccent: 'bg-yellow-500/10',
142 |     borderAccent: 'border-yellow-500/30',
143 |   },
144 |   {
145 |     slug: 'jupiter',
146 |     name: 'Jupiter',
147 |     tagline: 'King of planets — come for the storms, stay for the scale.',
148 |     description:
149 |       'Jupiter\'s swirling bands of ammonia and hydrogen stretch across a disc 11 times wider than Earth. Galileo Station orbits above the Great Red Spot, offering research suites, observation decks, and the most dramatic sky-scape in the solar system. Not for the faint-hearted.',
150 |     facts: {
151 |       gravity: '24.79 m/s² (at cloud tops)',
152 |       distanceFromEarth: '~628 million km (avg)',
153 |       typicalTransitTime: '18 h',
154 |       surfaceTemp: '-108 °C (cloud tops)',
155 |       moons: '95 known (Io, Europa, Ganymede, Callisto — largest)',
156 |       atmosphere: 'H₂ 90 %, He 10 % — immense pressure at depth',
157 |     },
158 |     hazards: [
159 |       'Radiation belts around Jupiter are among the most intense in the solar system',
160 |       'Magnetic field disrupts electronics — shielded hull required',
161 |       'No solid surface — descent below cloud tops is a one-way journey',
162 |       'Orbital insertion requires precise timing to avoid moon conjunctions',
163 |       'Gravitational tidal stresses can cause hull fatigue on long stays',
164 |     ],
165 |     gallery: [
166 |       { alt: 'Great Red Spot', description: 'Great Red Spot storm system, 350-year duration', colorClass: 'bg-orange-400/20' },
167 |       { alt: 'Galileo Station', description: 'Galileo Station orbital platform', colorClass: 'bg-amber-700/20' },
168 |       { alt: 'Moon transit', description: 'Io transit shadow across the equatorial band', colorClass: 'bg-red-400/20' },
169 |     ],
170 |     accentColor: 'text-solar-orange',
171 |     bgAccent: 'bg-orange-500/10',
172 |     borderAccent: 'border-orange-500/30',
173 |   },
174 |   {
175 |     slug: 'europa',
176 |     name: 'Europa',
177 |     tagline: 'Beneath the ice: the best chance of alien life in our solar system.',
178 |     description:
179 |       'Europa\'s fractured ice shell hides a vast subsurface ocean that may harbour microbial life. Research Station Icebreaker sits at the surface, while deep-drilling missions descend toward the water below. Every visit contributes to one of the most exciting scientific endeavours in human history.',
180 |     facts: {
181 |       gravity: '1.315 m/s²',
182 |       distanceFromEarth: '~628 million km (avg)',
183 |       typicalTransitTime: '19 h',
184 |       surfaceTemp: '-160 °C to -220 °C',
185 |       moons: 'Moon of Jupiter',
186 |       atmosphere: 'Thin oxygen exosphere — not breathable',
187 |     },
188 |     hazards: [
189 |       'Jupiter\'s radiation at Europa\'s orbit is intense — exterior exposure is time-limited to 1 hour',
190 |       'Ice crust seismic "ice-quakes" can crack landing pad anchorings',
191 |       'Cryoventing plumes erupt unpredictably — avoid surface EVA near fracture lines',
192 |       'All samples require level-5 biosafety protocols — no surface material leaves containment',
193 |     ],
194 |     gallery: [
195 |       { alt: 'Ice fractures', description: 'Linea fracture network from orbit', colorClass: 'bg-cyan-400/20' },
196 |       { alt: 'Icebreaker Station', description: 'Icebreaker Station drill array, surface', colorClass: 'bg-teal-400/20' },
197 |       { alt: 'Jupiter in sky', description: 'Jupiter rising over Europa\'s ice plain', colorClass: 'bg-blue-400/20' },
198 |     ],
199 |     accentColor: 'text-alien-green',
200 |     bgAccent: 'bg-alien-green/10',
201 |     borderAccent: 'border-alien-green/30',
202 |   },
203 |   {
204 |     slug: 'pluto',
205 |     name: 'Pluto',
206 |     tagline: 'The edge of the known — for travellers who want more.',
207 |     description:
208 |       'Pluto sits at the outer frontier of our solar system, a nitrogen-ice world with heart-shaped plains, soaring methane mountains, and a hazy blue atmosphere. Sputnik Base is the most remote inhabited outpost in human history, and arrival is a rite of passage for serious space explorers.',
209 |     facts: {
210 |       gravity: '0.62 m/s²',
211 |       distanceFromEarth: '~5.9 billion km (avg)',
212 |       typicalTransitTime: '36 h',
213 |       surfaceTemp: '-233 °C to -223 °C',
214 |       moons: '5 (Charon, Styx, Nix, Kerberos, Hydra)',
215 |       atmosphere: 'N₂, CH₄, CO — thin and seasonal',
216 |     },
217 |     hazards: [
218 |       'Extreme cold requires next-generation cryo-insulated EVA suits',
219 |       'Low gravity increases fall risk — standard locomotion training required',
220 |       'Communication lag to Earth exceeds 4 hours — emergency response is self-reliant',
221 |       'Nitrogen geysers can emerge without warning near Tombaugh Regio',
222 |       'Methane frost on landing pads creates slippery surfaces — approach speed limits enforced',
223 |     ],
224 |     gallery: [
225 |       { alt: 'Tombaugh Regio', description: 'Tombaugh Regio nitrogen ice plains ("The Heart")', colorClass: 'bg-purple-400/20' },
226 |       { alt: 'Charon from surface', description: 'Charon looming over Sputnik Base', colorClass: 'bg-violet-500/20' },
227 |       { alt: 'Blue haze atmosphere', description: 'Blue haze layers in Pluto\'s thin atmosphere', colorClass: 'bg-indigo-400/20' },
228 |     ],
229 |     accentColor: 'text-cosmic-purple',
230 |     bgAccent: 'bg-cosmic-purple/10',
231 |     borderAccent: 'border-cosmic-purple/30',
232 |   },
233 | ];
234 | 
235 | // Lookup by URL slug (case-insensitive)
236 | export const getDestinationBySlug = (slug: string): DestinationData | null =>
237 |   destinations.find((d) => d.slug === slug.toLowerCase()) ?? null;
238 | 
239 | // Lookup by display name (used to linkify destination names in FlightCard)
240 | export const getDestinationByName = (name: string): DestinationData | null =>
241 |   destinations.find((d) => d.name.toLowerCase() === name.toLowerCase()) ?? null;
242 | 
243 | // All destinations for the homepage grid
244 | export const ALL_DESTINATIONS: ReadonlyArray<DestinationData> = destinations;
245 | 
246 | // Made with Bob
247 |

**Tool:**

Contents of file src/components/common/LoadingSpinner.tsx:

1 | import { motion } from 'framer-motion';
2 | 
3 | interface LoadingSpinnerProps {
4 |   size?: 'sm' | 'md' | 'lg';
5 |   text?: string;
6 | }
7 | 
8 | export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
9 |   const sizeClasses = {
10 |     sm: 'h-6 w-6',
11 |     md: 'h-12 w-12',
12 |     lg: 'h-16 w-16',
13 |   };
14 | 
15 |   return (
16 |     <div className="flex flex-col items-center justify-center gap-4 py-8">
17 |       <motion.div
18 |         className={`${sizeClasses[size]} border-4 border-cosmic-purple border-t-transparent rounded-full`}
19 |         animate={{ rotate: 360 }}
20 |         transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
21 |       />
22 |       {text && (
23 |         <p className="text-star-white/70 text-sm">{text}</p>
24 |       )}
25 |     </div>
26 |   );
27 | };
28 | 
29 | // Made with Bob
30 |

**Assistant:**



_spend: {'cost': 0.10927, 'contextTokens': 54635}_

**Tool:**

To do list updated: 3 items total.

Next to do item inprogress: Spawn 5 parallel subagents for i18n extraction
