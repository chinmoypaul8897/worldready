# Bob task 090ce6865907faf00e558d448673a5ff

- Title: Internationalize `baseline-app/src/components/bookings/` with react-i18next (English strings into a JSON file, components use t()).
- Workspace: file:c:\Users\chinm\bob-hackathon-tools\bob-sandbox
- Bobcoins: 1.0638319999999999
- Context tokens: 52335
- Created: 2026-09-27 05:49:23

**User:**

Internationalize `baseline-app/src/components/bookings/` with react-i18next (English strings into a JSON file, components use t()).

**Assistant:**



_spend: {'cost': 0.028798, 'contextTokens': 14399}_

**Tool:**

Directory listing for baseline-app/src:

baseline-app\src\App.css
baseline-app\src\App.tsx
baseline-app\src\assets\
baseline-app\src\components\
baseline-app\src\data\
baseline-app\src\hooks\
baseline-app\src\index.css
baseline-app\src\main.tsx
baseline-app\src\pages\
baseline-app\src\services\
baseline-app\src\types\
baseline-app\src\utils\
baseline-app\src\vite-env.d.ts

**Tool:**

Directory listing for baseline-app/src/components/bookings:

baseline-app\src\components\bookings\BookingCard.tsx
baseline-app\src\components\bookings\BookingModal.tsx
baseline-app\src\components\bookings\HoldCard.tsx

**Assistant:**



_spend: {'cost': 0.029666, 'contextTokens': 14833}_

**Tool:**

Contents of file baseline-app/src/components/bookings/BookingCard.tsx:

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

Contents of file baseline-app/src/components/bookings/HoldCard.tsx:

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

**Tool:**

Contents of file baseline-app/src/components/bookings/BookingModal.tsx:

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

**Assistant:**

Now let me check whether react-i18next is already installed and if there's an existing i18n setup:

_spend: {'cost': 0.05194, 'contextTokens': 25970}_

**Tool:**

Contents of file baseline-app/package.json:

1 | {
2 |   "name": "booking_system_frontend",
3 |   "private": true,
4 |   "version": "0.0.0",
5 |   "type": "module",
6 |   "scripts": {
7 |     "dev": "vite",
8 |     "build": "tsc -b && vite build",
9 |     "lint": "eslint .",
10 |     "preview": "vite preview"
11 |   },
12 |   "dependencies": {
13 |     "axios": "^1.13.2",
14 |     "clsx": "^2.1.1",
15 |     "date-fns": "^4.1.0",
16 |     "framer-motion": "^12.26.1",
17 |     "lucide-react": "^0.562.0",
18 |     "react": "^19.2.0",
19 |     "react-dom": "^19.2.0",
20 |     "react-hot-toast": "^2.6.0",
21 |     "react-router-dom": "^7.12.0"
22 |   },
23 |   "devDependencies": {
24 |     "@eslint/js": "^9.39.1",
25 |     "@types/node": "^24.10.1",
26 |     "@types/react": "^19.2.5",
27 |     "@types/react-dom": "^19.2.3",
28 |     "@vitejs/plugin-react": "^5.1.1",
29 |     "autoprefixer": "^10.4.23",
30 |     "eslint": "^9.39.1",
31 |     "eslint-plugin-react-hooks": "^7.0.1",
32 |     "eslint-plugin-react-refresh": "^0.4.24",
33 |     "globals": "^16.5.0",
34 |     "postcss": "^8.5.6",
35 |     "tailwindcss": "^3.4.19",
36 |     "typescript": "~5.9.3",
37 |     "typescript-eslint": "^8.46.4",
38 |     "vite": "^7.2.4"
39 |   }
40 | }
41 |

**Tool:**

No files found

**Assistant:**

No i18n setup exists yet. Let me also check `main.tsx` to understand the app entry point:

_spend: {'cost': 0.05349, 'contextTokens': 26745}_

**Tool:**

Contents of file baseline-app/src/main.tsx:

1 | import { StrictMode } from 'react'
2 | import { createRoot } from 'react-dom/client'
3 | import './index.css'
4 | import App from './App.tsx'
5 | 
6 | createRoot(document.getElementById('root')!).render(
7 |   <StrictMode>
8 |     <App />
9 |   </StrictMode>,
10 | )
11 |

**Assistant:**

Now I have everything I need. Let me set up the plan:

_spend: {'cost': 0.054104, 'contextTokens': 27052}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Install react-i18next and i18next packages

**Assistant:**



_spend: {'cost': 0.054394, 'contextTokens': 27197}_

**Tool:**

added 281 packages, and audited 282 packages in 25s

72 packages are looking for funding
  run `npm fund` for details

20 vulnerabilities (2 low, 4 moderate, 14 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

**Assistant:**



_spend: {'cost': 0.054876, 'contextTokens': 27438}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Create English translation JSON for bookings namespace

**Assistant:**



_spend: {'cost': 0.05712, 'contextTokens': 28560}_

**Tool:**

Created file: baseline-app/public/locales/en/bookings.json

<result>
{
  "bookingCard": {
    "bookingNumber": "Booking #{{id}}",
    "flightNumber": "Flight #{{id}}",
    "flightIdFallback": "Flight ID: {{id}}",

...92 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**



_spend: {'cost': 0.057696, 'contextTokens': 28848}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Create i18n initialisation module (src/i18n.ts)

**Assistant:**



_spend: {'cost': 0.058338, 'contextTokens': 29169}_

**Tool:**

Created file: baseline-app/src/i18n.ts

<result>
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n

...17 lines truncated. You do not need to re-read the file. The complete file was written successfully. Use read_file if you need to see the full contents.
</result>

**Assistant:**

I need `i18next-http-backend` too:

_spend: {'cost': 0.058812, 'contextTokens': 29406}_

**Tool:**

added 1 package, and audited 283 packages in 3s

72 packages are looking for funding
  run `npm fund` for details

20 vulnerabilities (2 low, 4 moderate, 14 high)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.

**Assistant:**



_spend: {'cost': 0.059298, 'contextTokens': 29649}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Wire i18n init into main.tsx

**Assistant:**



_spend: {'cost': 0.059768, 'contextTokens': 29884}_

**Tool:**

Edited file: baseline-app/src/main.tsx

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -1,7 +1,8 @@
 import { StrictMode } from 'react'
 import { createRoot } from 'react-dom/client'
 import './index.css'
+import './i18n'
 import App from './App.tsx'
 
 createRoot(document.getElementById('root')!).render(
   <StrictMode>

</patch>

Making multiple related changes in a single apply_diff is more efficient. If other changes are needed in this file, please include them as additional SEARCH/REPLACE blocks.

**Assistant:**



_spend: {'cost': 0.06053, 'contextTokens': 30265}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Internationalize BookingCard.tsx

**Assistant:**



_spend: {'cost': 0.064476, 'contextTokens': 32238}_

**Tool:**

Edited file: baseline-app/src/components/bookings/BookingCard.tsx

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -1,173 +1,182 @@
-import type { Booking, Flight } from '../../types';
-import { Card, Button } from '../common';
-import { Plane, Calendar, CheckCircle, XCircle, Clock, Crown, Rocket } from 'lucide-react';
-import { formatDate, formatCurrency } from '../../utils/formatters';
-import { motion } from 'framer-motion';
-
-interface BookingCardProps {
-  booking: Booking;
-  flight?: Flight;
-  onCancel: (bookingId: number) => void;
-  isCancelling?: boolean;
-}
-
-export const BookingCard = ({ booking, flight, onCancel, isCancelling }: BookingCardProps) => {
-  const getSeatClassIcon = () => {
-    switch (booking.seat_class) {
-      case 'business':
-        return <Crown className="text-purple-400" size={16} />;
-      case 'galaxium':
-        return <Rocket className="text-alien-green" size={16} />;
-      default:
-        return <Plane className="text-blue-400" size={16} />;
-    }
-  };
-
-  const getSeatClassName = () => {
-    switch (booking.seat_class) {
-      case 'business':
-        return 'Business';
-      case 'galaxium':
-        return 'Galaxium Class';
-      default:
-        return 'Economy';
-    }
-  };
-
-  const getSeatClassColor = () => {
-    switch (booking.seat_class) {
-      case 'business':
-        return 'text-purple-400';
-      case 'galaxium':
-        return 'text-alien-green';
-      default:
-        return 'text-blue-400';
-    }
-  };
-  const getStatusIcon = () => {
-    switch (booking.status) {
-      case 'booked':
-        return <CheckCircle className="text-alien-green" size={20} />;
-      case 'cancelled':
-        return <XCircle className="text-red-500" size={20} />;
-      case 'completed':
-        return <CheckCircle className="text-blue-500" size={20} />;
-      default:
-        return <Clock className="text-star-white/50" size={20} />;
-    }
-  };
-
-  const getStatusColor = () => {
-    switch (booking.status) {
-      case 'booked':
-        return 'text-alien-green';
-      case 'cancelled':
-        return 'text-red-500';
-      case 'completed':
-        return 'text-blue-500';
-      default:
-        return 'text-star-white/50';
-    }
-  };
-
-  const canCancel = booking.status === 'booked';
-
-  return (
-    <motion.div
-      initial={{ opacity: 0, y: 20 }}
-      animate={{ opacity: 1, y: 0 }}
-      whileHover={{ y: -2 }}
-      transition={{ duration: 0.2 }}
-    >
-      <Card>
-        {/* Header */}
-        <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
-          <div className="flex items-center gap-3">
-            <div className="p-2 rounded-lg bg-cosmic-gradient">
-              <Plane className="text-white" size={20} />
-            </div>
-            <div>
-              <p className="text-sm text-star-white/60">Booking #{booking.booking_id}</p>
-              <div className="flex items-center gap-2 mt-1">
-                {getStatusIcon()}
-                <span className={`text-sm font-semibold capitalize ${getStatusColor()}`}>
-                  {booking.status}
-                </span>
-              </div>
-            </div>
-          </div>
-        </div>
-
-        {/* Flight Details */}
-        {flight ? (
-          <div className="space-y-3 mb-4">
-            <div>
-              <h3 className="text-xl font-bold text-star-white mb-1">
-                {flight.origin} → {flight.destination}
-              </h3>
-              <p className="text-sm text-star-white/60">Flight #{flight.flight_id}</p>
-            </div>
-
-            <div className="grid grid-cols-2 gap-4">
-              <div>
-                <p className="text-xs text-star-white/60 mb-1">Departure</p>
-                <p className="text-sm text-star-white font-medium">
-                  {formatDate(flight.departure_time)}
-                </p>
-              </div>
-              <div>
-                <p className="text-xs text-star-white/60 mb-1">Arrival</p>
-                <p className="text-sm text-star-white font-medium">
-                  {formatDate(flight.arrival_time)}
-                </p>
-              </div>
-            </div>
-
-            <div className="space-y-2 pt-3 border-t border-white/10">
-              <div className="flex items-center justify-between">
-                <span className="text-sm text-star-white/60">Seat Class</span>
-                <div className="flex items-center gap-2">
-                  {getSeatClassIcon()}
-                  <span className={`text-sm font-semibold ${getSeatClassColor()}`}>
-                    {getSeatClassName()}
-                  </span>
-                </div>
-              </div>
-              <div className="flex items-center justify-between">
-                <span className="text-sm text-star-white/60">Price Paid</span>
-                <span className="text-lg font-bold text-star-white">
-                  {formatCurrency(booking.price_paid)}
-                </span>
-              </div>
-            </div>
-          </div>
-        ) : (
-          <div className="mb-4">
-            <p className="text-sm text-star-white/60">Flight ID: {booking.flight_id}</p>
-          </div>
-        )}
-
-        {/* Booking Time */}
-        <div className="flex items-center gap-2 text-sm text-star-white/60 mb-4">
-          <Calendar size={16} />
-          <span>Booked on {formatDate(booking.booking_time)}</span>
-        </div>
-
-        {/* Cancel Button */}
-        {canCancel && (
-          <Button
-            variant="danger"
-            size="sm"
-            onClick={() => onCancel(booking.booking_id)}
-            isLoading={isCancelling}
-            className="w-full"
-          >
-            Cancel Booking
-          </Button>
-        )}
-      </Card>
-    </motion.div>
-  );
-};
-
-// Made with Bob
+import { useTranslation } from 'react-i18next';
+import type { Booking, Flight } from '../../types';
+import { Card, Button } from '../common';
+import { Plane, Calendar, CheckCircle, XCircle, Clock, Crown, Rocket } from 'lucide-react';
+import { formatDate, formatCurrency } from '../../utils/formatters';
+import { motion } from 'framer-motion';
+
+interface BookingCardProps {
+  booking: Booking;
+  flight?: Flight;
+  onCancel: (bookingId: number) => void;
+  isCancelling?: boolean;
+}
+
+export const BookingCard = ({ booking, flight, onCancel, isCancelling }: BookingCardProps) => {
+  const { t } = useTranslation('bookings');
+
+  const getSeatClassIcon = () => {
+    switch (booking.seat_class) {
+      case 'business':
+        return <Crown className="text-purple-400" size={16} />;
+      case 'galaxium':
+        return <Rocket className="text-alien-green" size={16} />;
+      default:
+        return <Plane className="text-blue-400" size={16} />;
+    }
+  };
+
+  const getSeatClassName = () => {
+    switch (booking.seat_class) {
+      case 'business':
+        return t('bookingCard.seatClassName.business');
+      case 'galaxium':
+        return t('bookingCard.seatClassName.galaxium');
+      default:
+        return t('bookingCard.seatClassName.economy');
+    }
+  };
+
+  const getSeatClassColor = () => {
+    switch (booking.seat_class) {
+      case 'business':
+        return 'text-purple-400';
+      case 'galaxium':
+        return 'text-alien-green';
+      default:
+        return 'text-blue-400';
+    }
+  };
+  const getStatusIcon = () => {
+    switch (booking.status) {
+      case 'booked':
+        return <CheckCircle className="text-alien-green" size={20} />;
+      case 'cancelled':
+        return <XCircle className="text-red-500" size={20} />;
+      case 'completed':
+        return <CheckCircle className="text-blue-500" size={20} />;
+      default:
+        return <Clock className="text-star-white/50" size={20} />;
+    }
+  };
+
+  const getStatusColor = () => {
+    switch (booking.status) {
+      case 'booked':
+        return 'text-alien-green';
+      case 'cancelled':
+        return 'text-red-500';
+      case 'completed':
+        return 'text-blue-500';
+      default:
+        return 'text-star-white/50';
+    }
+  };
+
+  const canCancel = booking.status === 'booked';
+
+  return (
+    <motion.div
+      initial={{ opacity: 0, y: 20 }}
+      animate={{ opacity: 1, y: 0 }}
+      whileHover={{ y: -2 }}
+      transition={{ duration: 0.2 }}
+    >
+      <Card>
+        {/* Header */}
+        <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
+          <div className="flex items-center gap-3">
+            <div className="p-2 rounded-lg bg-cosmic-gradient">
+              <Plane className="text-white" size={20} />
+            </div>
+            <div>
+              <p className="text-sm text-star-white/60">
+                {t('bookingCard.bookingNumber', { id: booking.booking_id })}
+              </p>
+              <div className="flex items-center gap-2 mt-1">
+                {getStatusIcon()}
+                <span className={`text-sm font-semibold capitalize ${getStatusColor()}`}>
+                  {booking.status}
+                </span>
+              </div>
+            </div>
+          </div>
+        </div>
+
+        {/* Flight Details */}
+        {flight ? (
+          <div className="space-y-3 mb-4">
+            <div>
+              <h3 className="text-xl font-bold text-star-white mb-1">
+                {flight.origin} → {flight.destination}
+              </h3>
+              <p className="text-sm text-star-white/60">
+                {t('bookingCard.flightNumber', { id: flight.flight_id })}
+              </p>
+            </div>
+
+            <div className="grid grid-cols-2 gap-4">
+              <div>
+                <p className="text-xs text-star-white/60 mb-1">{t('bookingCard.departure')}</p>
+                <p className="text-sm text-star-white font-medium">
+                  {formatDate(flight.departure_time)}
+                </p>
+              </div>
+              <div>
+                <p className="text-xs text-star-white/60 mb-1">{t('bookingCard.arrival')}</p>
+                <p className="text-sm text-star-white font-medium">
+                  {formatDate(flight.arrival_time)}
+                </p>
+              </div>
+            </div>
+
+            <div className="space-y-2 pt-3 border-t border-white/10">
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-star-white/60">{t('bookingCard.seatClass')}</span>
+                <div className="flex items-center gap-2">
+                  {getSeatClassIcon()}
+                  <span className={`text-sm font-semibold ${getSeatClassColor()}`}>
+                    {getSeatClassName()}
+                  </span>
+                </div>
+              </div>
+              <div className="flex items-center justify-between">
+                <span className="text-sm text-star-white/60">{t('bookingCard.pricePaid')}</span>
+                <span className="text-lg font-bold text-star-white">
+                  {formatCurrency(booking.price_paid)}
+                </span>
+              </div>
+            </div>
+          </div>
+        ) : (
+          <div className="mb-4">
+            <p className="text-sm text-star-white/60">
+              {t('bookingCard.flightIdFallback', { id: booking.flight_id })}
+            </p>
+          </div>
+        )}
+
+        {/* Booking Time */}
+        <div className="flex items-center gap-2 text-sm text-star-white/60 mb-4">
+          <Calendar size={16} />
+          <span>{t('bookingCard.bookedOn', { date: formatDate(booking.booking_time) })}</span>
+        </div>
+
+        {/* Cancel Button */}
+        {canCancel && (
+          <Button
+            variant="danger"
+            size="sm"
+            onClick={() => onCancel(booking.booking_id)}
+            isLoading={isCancelling}
+            className="w-full"
+          >
+            {t('bookingCard.cancelBooking')}
+          </Button>
+        )}
+      </Card>
+    </motion.div>
+  );
+};
+
+// Made with Bob

</patch>

**Assistant:**



_spend: {'cost': 0.07279, 'contextTokens': 36395}_

**Tool:**

To do list updated: 8 items total.

Next to do item inprogress: Internationalize BookingModal.tsx

**Assistant:**



_spend: {'cost': 0.083066, 'contextTokens': 41533}_

**Tool:**

Edited file: baseline-app/src/components/bookings/BookingModal.tsx

You do not need to re-read the file, as you have seen all changes.
Proceed with the task using these changes as the new baseline.

If the user's edits have addressed part of the task or changed the requirements, adjust your approach accordingly.

Patch of edit:

<patch>
@@ -1,447 +1,469 @@
-import { useState, useEffect } from 'react';
-import type { Flight, SeatClass, Quote, Hold } from '../../types';
-import { Modal, Button } from '../common';
-import {
-  Plane,
-  DollarSign,
-  Crown,
-  Rocket,
-  Check,
-  ArrowLeft,
-  Tag,
-  Timer,
-  Zap,
-} from 'lucide-react';
-import { formatCurrency, formatDate, calculateDuration } from '../../utils/formatters';
-import { createQuote, createHold, confirmHold, releaseHold } from '../../services/api';
-import { storeHold, removeHold } from '../../utils/holdStorage';
-import { useUser } from '../../hooks/useUserContext';
-import toast from 'react-hot-toast';
-
-type Step = 'select' | 'quote' | 'hold';
-
-interface BookingModalProps {
-  isOpen: boolean;
-  onClose: () => void;
-  flight: Flight | null;
-  onSuccess: () => void;
-}
-
-export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
-  const { user } = useUser();
-  const [step, setStep] = useState<Step>('select');
-  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
-  const [isLoading, setIsLoading] = useState(false);
-  const [quote, setQuote] = useState<Quote | null>(null);
-  const [hold, setHold] = useState<Hold | null>(null);
-  const [timeLeft, setTimeLeft] = useState(0);
-
-  // Reset state when modal opens
-  useEffect(() => {
-    if (isOpen) {
-      setStep('select');
-      setSelectedClass('economy');
-      setQuote(null);
-      setHold(null);
-      setTimeLeft(0);
-    }
-  }, [isOpen]);
-
-  // Countdown timer
-  useEffect(() => {
-    if (!hold || step !== 'hold') return;
-
-    const update = () => {
-      const remaining = new Date(hold.reservedUntil).getTime() - Date.now();
-      setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
-    };
-
-    update();
-    const interval = setInterval(update, 1000);
-    return () => clearInterval(interval);
-  }, [hold, step]);
-
-  if (!flight) return null;
-
-  const seatClasses = [
-    {
-      name: 'Economy',
-      class: 'economy' as SeatClass,
-      price: flight.economy_price,
-      seats: flight.economy_seats_available,
-      icon: Plane,
-      color: 'text-blue-400',
-      bgColor: 'bg-blue-500/10',
-      borderColor: 'border-blue-500/30',
-      features: ['Standard seating', 'In-flight entertainment', 'Complimentary snacks'],
-    },
-    {
-      name: 'Business',
-      class: 'business' as SeatClass,
-      price: flight.business_price,
-      seats: flight.business_seats_available,
-      icon: Crown,
-      color: 'text-purple-400',
-      bgColor: 'bg-purple-500/10',
-      borderColor: 'border-purple-500/30',
-      features: ['Premium seating', 'Priority boarding', 'Gourmet meals', 'Extra legroom'],
-    },
-    {
-      name: 'Galaxium Class',
-      class: 'galaxium' as SeatClass,
-      price: flight.galaxium_price,
-      seats: flight.galaxium_seats_available,
-      icon: Rocket,
-      color: 'text-alien-green',
-      bgColor: 'bg-alien-green/10',
-      borderColor: 'border-alien-green/30',
-      features: ['Luxury pods', 'VIP lounge access', 'Personal concierge', 'Zero-G experience'],
-    },
-  ];
-
-  const selectedClassData = seatClasses.find((sc) => sc.class === selectedClass);
-
-  const minutes = Math.floor(timeLeft / 60000);
-  const seconds = Math.floor((timeLeft % 60000) / 1000);
-  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
-  const isExpired = hold !== null && timeLeft === 0;
-
-  const flightSummary = (
-    <div className="glass-card p-4 bg-white/5">
-      <div className="flex items-center gap-3 mb-3">
-        <div className="p-2 rounded-lg bg-cosmic-gradient">
-          <Plane className="text-white" size={20} />
-        </div>
-        <div>
-          <h3 className="text-lg font-bold text-star-white">
-            {flight.origin} → {flight.destination}
-          </h3>
-          <p className="text-xs text-star-white/60">Flight #{flight.flight_id}</p>
-        </div>
-      </div>
-      <div className="grid grid-cols-3 gap-3 text-sm">
-        <div>
-          <p className="text-xs text-star-white/60 mb-1">Departure</p>
-          <p className="text-star-white font-medium">
-            {formatDate(flight.departure_time, 'MMM dd')}
-          </p>
-        </div>
-        <div>
-          <p className="text-xs text-star-white/60 mb-1">Arrival</p>
-          <p className="text-star-white font-medium">
-            {formatDate(flight.arrival_time, 'MMM dd')}
-          </p>
-        </div>
-        <div>
-          <p className="text-xs text-star-white/60 mb-1">Duration</p>
-          <p className="text-star-white font-medium">
-            {calculateDuration(flight.departure_time, flight.arrival_time)}
-          </p>
-        </div>
-      </div>
-    </div>
-  );
-
-  const handleGetQuote = async () => {
-    if (!user) {
-      toast.error('Please sign in to get a quote');
-      return;
-    }
-
-    setIsLoading(true);
-    try {
-      const newQuote = await createQuote({
-        flightId: flight.flight_id,
-        seatClass: selectedClass,
-        quantity: 1,
-        travelerId: user.user_id,
-        travelerName: user.name,
-      });
-      setQuote(newQuote);
-      setStep('quote');
-    } catch {
-      toast.error('Failed to get quote. Make sure the inventory service is running.');
-    } finally {
-      setIsLoading(false);
-    }
-  };
-
-  const handlePlaceHold = async () => {
-    if (!quote) return;
-
-    setIsLoading(true);
-    try {
-      const newHold = await createHold(quote.quoteId);
-      setHold(newHold);
-      setStep('hold');
-
-      if (user) {
-        storeHold(user.user_id, {
-          holdId: newHold.holdId,
-          quoteId: quote.quoteId,
-          flightId: flight.flight_id,
-          seatClass: selectedClass,
-          pricePerSeat: quote.pricePerSeat,
-          totalPrice: quote.totalPrice,
-          reservedUntil: newHold.reservedUntil,
-        });
-      }
-
-      toast.success('Seat held! You have 15 minutes to confirm.');
-    } catch {
-      toast.error('Failed to place hold');
-    } finally {
-      setIsLoading(false);
-    }
-  };
-
-  const handleConfirmHold = async () => {
-    if (!hold || !user) return;
-
-    setIsLoading(true);
-    try {
-      const confirmed = await confirmHold(hold.holdId);
-      removeHold(user.user_id, hold.holdId);
-      toast.success(
-        `Booking confirmed! Reference: #${confirmed.externalBookingReference}`
-      );
-      onSuccess();
-      onClose();
-    } catch {
-      toast.error('Failed to confirm booking');
-    } finally {
-      setIsLoading(false);
-    }
-  };
-
-  const handleReleaseHold = async () => {
-    if (!hold || !user) return;
-
-    setIsLoading(true);
-    try {
-      await releaseHold(hold.holdId);
-      removeHold(user.user_id, hold.holdId);
-      toast.success('Hold released');
-      onClose();
-    } catch {
-      toast.error('Failed to release hold');
-    } finally {
-      setIsLoading(false);
-    }
-  };
-
-  const getModalTitle = () => {
-    switch (step) {
-      case 'select':
-        return 'Book Your Flight';
-      case 'quote':
-        return 'Your Price Quote';
-      case 'hold':
-        return 'Seat Reserved';
-    }
-  };
-
-  // Step 1: Seat class selection
-  const renderSelectStep = () => (
-    <div className="space-y-6">
-      {flightSummary}
-
-      <div>
-        <h4 className="text-sm font-semibold text-star-white mb-3">Select Seat Class</h4>
-        <div className="space-y-3">
-          {seatClasses.map((sc) => {
-            const Icon = sc.icon;
-            const isSelected = selectedClass === sc.class;
-            const isSoldOut = sc.seats === 0;
-
-            return (
-              <button
-                key={sc.class}
-                onClick={() => !isSoldOut && setSelectedClass(sc.class)}
-                disabled={isSoldOut}
-                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
-                  isSelected
-                    ? `${sc.borderColor} ${sc.bgColor}`
-                    : 'border-white/10 bg-white/5 hover:border-white/20'
-                } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
-              >
-                <div className="flex items-start justify-between mb-2">
-                  <div className="flex items-center gap-2">
-                    <Icon size={20} className={sc.color} />
-                    <span className="font-semibold text-star-white">{sc.name}</span>
-                    {isSelected && <Check size={18} className={sc.color} />}
-                  </div>
-                  <div className="text-right">
-                    <div className={`text-lg font-bold ${sc.color}`}>
-                      {formatCurrency(sc.price)}
-                    </div>
-                    <div className="text-xs text-star-white/60">
-                      {isSoldOut ? 'Sold Out' : `${sc.seats} left`}
-                    </div>
-                  </div>
-                </div>
-                <ul className="text-xs text-star-white/70 space-y-1">
-                  {sc.features.map((f, i) => (
-                    <li key={i}>• {f}</li>
-                  ))}
-                </ul>
-              </button>
-            );
-          })}
-        </div>
-      </div>
-
-      {user && (
-        <div className="glass-card p-4 bg-white/5">
-          <h4 className="text-sm font-semibold text-star-white mb-2">Passenger</h4>
-          <p className="text-star-white">{user.name}</p>
-          <p className="text-star-white/60 text-sm">{user.email}</p>
-        </div>
-      )}
-
-      <div className="flex gap-3">
-        <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
-          Cancel
-        </Button>
-        <Button onClick={handleGetQuote} isLoading={isLoading} className="flex-1">
-          Get Quote →
-        </Button>
-      </div>
-    </div>
-  );
-
-  // Step 2: Quote review
-  const renderQuoteStep = () => {
-    const Icon = selectedClassData?.icon || Plane;
-    return (
-      <div className="space-y-6">
-        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/30">
-          <Tag size={16} className="text-cosmic-purple" />
-          <span className="text-xs text-star-white/60">Quote ID</span>
-          <span className="font-mono font-bold text-cosmic-purple ml-auto">{quote?.quoteId}</span>
-        </div>
-
-        {flightSummary}
-
-        <div className="glass-card p-4 bg-white/5 space-y-3">
-          <h4 className="text-sm font-semibold text-star-white">Price Breakdown</h4>
-          <div className="flex items-center justify-between">
-            <div className="flex items-center gap-2">
-              <Icon size={16} className={selectedClassData?.color} />
-              <span className="text-sm text-star-white/70">{selectedClassData?.name} × 1</span>
-            </div>
-            <span className="text-star-white font-medium">
-              {formatCurrency(quote?.pricePerSeat || 0)}
-            </span>
-          </div>
-          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
-            <span className="font-semibold text-star-white">Total</span>
-            <span className="text-xl font-bold text-alien-green">
-              {formatCurrency(quote?.totalPrice || 0)}
-            </span>
-          </div>
-          <p className="text-xs text-star-white/50">
-            Quote valid for 24 hours · Price calculated by inventory service
-          </p>
-        </div>
-
-        <div className="flex gap-3">
-          <Button
-            variant="secondary"
-            onClick={() => setStep('select')}
-            disabled={isLoading}
-            className="flex-1"
-          >
-            <ArrowLeft size={16} /> Back
-          </Button>
-          <Button onClick={handlePlaceHold} isLoading={isLoading} className="flex-1">
-            <Timer size={16} /> Place Hold →
-          </Button>
-        </div>
-      </div>
-    );
-  };
-
-  // Step 3: Hold active with countdown
-  const renderHoldStep = () => (
-    <div className="space-y-6">
-      <div className="flex items-center gap-2 p-3 rounded-lg bg-alien-green/10 border border-alien-green/30">
-        <Zap size={16} className="text-alien-green" />
-        <span className="text-xs text-star-white/60">Hold ID</span>
-        <span className="font-mono font-bold text-alien-green ml-auto">{hold?.holdId}</span>
-      </div>
-
-      {/* Countdown timer */}
-      <div
-        className={`p-6 text-center rounded-xl border-2 ${
-          isExpired
-            ? 'border-red-500/50 bg-red-500/5'
-            : 'border-solar-orange/50 bg-solar-orange/5'
-        }`}
-      >
-        <p className="text-xs text-star-white/60 mb-2 uppercase tracking-widest">
-          {isExpired ? 'Hold Expired' : 'Time to Confirm'}
-        </p>
-        <div
-          className={`text-5xl font-mono font-bold tabular-nums ${
-            isExpired ? 'text-red-500' : 'text-solar-orange'
-          }`}
-        >
-          {isExpired ? 'EXPIRED' : timerDisplay}
-        </div>
-        {!isExpired && (
-          <p className="text-xs text-star-white/50 mt-2">
-            Seat is reserved — confirm before time runs out
-          </p>
-        )}
-      </div>
-
-      {flightSummary}
-
-      <div className="flex items-center justify-between p-4 rounded-xl bg-cosmic-gradient">
-        <div className="flex items-center gap-2">
-          <DollarSign className="text-white" size={20} />
-          <span className="text-white font-semibold">Total</span>
-        </div>
-        <span className="text-xl font-bold text-white">
-          {formatCurrency(quote?.totalPrice || 0)}
-        </span>
-      </div>
-
-      {isExpired ? (
-        <Button variant="secondary" onClick={onClose} className="w-full">
-          Close
-        </Button>
-      ) : (
-        <>
-          <div className="flex gap-3">
-            <Button
-              variant="danger"
-              onClick={handleReleaseHold}
-              isLoading={isLoading}
-              className="flex-1"
-            >
-              Release Hold
-            </Button>
-            <Button onClick={handleConfirmHold} isLoading={isLoading} className="flex-1">
-              Confirm Booking
-            </Button>
-          </div>
-          <p className="text-xs text-star-white/50 text-center">
-            Closing keeps your hold active — find it in My Bookings
-          </p>
-        </>
-      )}
-    </div>
-  );
-
-  return (
-    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
-      {step === 'select' && renderSelectStep()}
-      {step === 'quote' && renderQuoteStep()}
-      {step === 'hold' && renderHoldStep()}
-    </Modal>
-  );
-};
-
-// Made with Bob
+import { useState, useEffect } from 'react';
+import { useTranslation } from 'react-i18next';
+import type { Flight, SeatClass, Quote, Hold } from '../../types';
+import { Modal, Button } from '../common';
+import {
+  Plane,
+  DollarSign,
+  Crown,
+  Rocket,
+  Check,
+  ArrowLeft,
+  Tag,
+  Timer,
+  Zap,
+} from 'lucide-react';
+import { formatCurrency, formatDate, calculateDuration } from '../../utils/formatters';
+import { createQuote, createHold, confirmHold, releaseHold } from '../../services/api';
+import { storeHold, removeHold } from '../../utils/holdStorage';
+import { useUser } from '../../hooks/useUserContext';
+import toast from 'react-hot-toast';
+
+type Step = 'select' | 'quote' | 'hold';
+
+interface BookingModalProps {
+  isOpen: boolean;
+  onClose: () => void;
+  flight: Flight | null;
+  onSuccess: () => void;
+}
+
+export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
+  const { user } = useUser();
+  const { t } = useTranslation('bookings');
+  const [step, setStep] = useState<Step>('select');
+  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
+  const [isLoading, setIsLoading] = useState(false);
+  const [quote, setQuote] = useState<Quote | null>(null);
+  const [hold, setHold] = useState<Hold | null>(null);
+  const [timeLeft, setTimeLeft] = useState(0);
+
+  // Reset state when modal opens
+  useEffect(() => {
+    if (isOpen) {
+      setStep('select');
+      setSelectedClass('economy');
+      setQuote(null);
+      setHold(null);
+      setTimeLeft(0);
+    }
+  }, [isOpen]);
+
+  // Countdown timer
+  useEffect(() => {
+    if (!hold || step !== 'hold') return;
+
+    const update = () => {
+      const remaining = new Date(hold.reservedUntil).getTime() - Date.now();
+      setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
+    };
+
+    update();
+    const interval = setInterval(update, 1000);
+    return () => clearInterval(interval);
+  }, [hold, step]);
+
+  if (!flight) return null;
+
+  const seatClasses = [
+    {
+      name: t('bookingModal.seatClass.economy.name'),
+      class: 'economy' as SeatClass,
+      price: flight.economy_price,
+      seats: flight.economy_seats_available,
+      icon: Plane,
+      color: 'text-blue-400',
+      bgColor: 'bg-blue-500/10',
+      borderColor: 'border-blue-500/30',
+      features: t('bookingModal.seatClass.economy.features', { returnObjects: true }) as string[],
+    },
+    {
+      name: t('bookingModal.seatClass.business.name'),
+      class: 'business' as SeatClass,
+      price: flight.business_price,
+      seats: flight.business_seats_available,
+      icon: Crown,
+      color: 'text-purple-400',
+      bgColor: 'bg-purple-500/10',
+      borderColor: 'border-purple-500/30',
+      features: t('bookingModal.seatClass.business.features', { returnObjects: true }) as string[],
+    },
+    {
+      name: t('bookingModal.seatClass.galaxium.name'),
+      class: 'galaxium' as SeatClass,
+      price: flight.galaxium_price,
+      seats: flight.galaxium_seats_available,
+      icon: Rocket,
+      color: 'text-alien-green',
+      bgColor: 'bg-alien-green/10',
+      borderColor: 'border-alien-green/30',
+      features: t('bookingModal.seatClass.galaxium.features', { returnObjects: true }) as string[],
+    },
+  ];
+
+  const selectedClassData = seatClasses.find((sc) => sc.class === selectedClass);
+
+  const minutes = Math.floor(timeLeft / 60000);
+  const seconds = Math.floor((timeLeft % 60000) / 1000);
+  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
+  const isExpired = hold !== null && timeLeft === 0;
+
+  const flightSummary = (
+    <div className="glass-card p-4 bg-white/5">
+      <div className="flex items-center gap-3 mb-3">
+        <div className="p-2 rounded-lg bg-cosmic-gradient">
+          <Plane className="text-white" size={20} />
+        </div>
+        <div>
+          <h3 className="text-lg font-bold text-star-white">
+            {flight.origin} → {flight.destination}
+          </h3>
+          <p className="text-xs text-star-white/60">
+            {t('bookingModal.flightSummary.flightNumber', { id: flight.flight_id })}
+          </p>
+        </div>
+      </div>
+      <div className="grid grid-cols-3 gap-3 text-sm">
+        <div>
+          <p className="text-xs text-star-white/60 mb-1">
+            {t('bookingModal.flightSummary.departure')}
+          </p>
+          <p className="text-star-white font-medium">
+            {formatDate(flight.departure_time, 'MMM dd')}
+          </p>
+        </div>
+        <div>
+          <p className="text-xs text-star-white/60 mb-1">
+            {t('bookingModal.flightSummary.arrival')}
+          </p>
+          <p className="text-star-white font-medium">
+            {formatDate(flight.arrival_time, 'MMM dd')}
+          </p>
+        </div>
+        <div>
+          <p className="text-xs text-star-white/60 mb-1">
+            {t('bookingModal.flightSummary.duration')}
+          </p>
+          <p className="text-star-white font-medium">
+            {calculateDuration(flight.departure_time, flight.arrival_time)}
+          </p>
+        </div>
+      </div>
+    </div>
+  );
+
+  const handleGetQuote = async () => {
+    if (!user) {
+      toast.error(t('bookingModal.toasts.signInRequired'));
+      return;
+    }
+
+    setIsLoading(true);
+    try {
+      const newQuote = await createQuote({
+        flightId: flight.flight_id,
+        seatClass: selectedClass,
+        quantity: 1,
+        travelerId: user.user_id,
+        travelerName: user.name,
+      });
+      setQuote(newQuote);
+      setStep('quote');
+    } catch {
+      toast.error(t('bookingModal.toasts.quoteFailed'));
+    } finally {
+      setIsLoading(false);
+    }
+  };
+
+  const handlePlaceHold = async () => {
+    if (!quote) return;
+
+    setIsLoading(true);
+    try {
+      const newHold = await createHold(quote.quoteId);
+      setHold(newHold);
+      setStep('hold');
+
+      if (user) {
+        storeHold(user.user_id, {
+          holdId: newHold.holdId,
+          quoteId: quote.quoteId,
+          flightId: flight.flight_id,
+          seatClass: selectedClass,
+          pricePerSeat: quote.pricePerSeat,
+          totalPrice: quote.totalPrice,
+          reservedUntil: newHold.reservedUntil,
+        });
+      }
+
+      toast.success(t('bookingModal.toasts.holdPlaced'));
+    } catch {
+      toast.error(t('bookingModal.toasts.holdFailed'));
+    } finally {
+      setIsLoading(false);
+    }
+  };
+
+  const handleConfirmHold = async () => {
+    if (!hold || !user) return;
+
+    setIsLoading(true);
+    try {
+      const confirmed = await confirmHold(hold.holdId);
+      removeHold(user.user_id, hold.holdId);
+      toast.success(
+        t('bookingModal.toasts.bookingConfirmed', { ref: confirmed.externalBookingReference })
+      );
+      onSuccess();
+      onClose();
+    } catch {
+      toast.error(t('bookingModal.toasts.confirmFailed'));
+    } finally {
+      setIsLoading(false);
+    }
+  };
+
+  const handleReleaseHold = async () => {
+    if (!hold || !user) return;
+
+    setIsLoading(true);
+    try {
+      await releaseHold(hold.holdId);
+      removeHold(user.user_id, hold.holdId);
+      toast.success(t('bookingModal.toasts.holdReleased'));
+      onClose();
+    } catch {
+      toast.error(t('bookingModal.toasts.releaseFailed'));
+    } finally {
+      setIsLoading(false);
+    }
+  };
+
+  const getModalTitle = () => {
+    switch (step) {
+      case 'select':
+        return t('bookingModal.title.select');
+      case 'quote':
+        return t('bookingModal.title.quote');
+      case 'hold':
+        return t('bookingModal.title.hold');
+    }
+  };
+
+  // Step 1: Seat class selection
+  const renderSelectStep = () => (
+    <div className="space-y-6">
+      {flightSummary}
+
+      <div>
+        <h4 className="text-sm font-semibold text-star-white mb-3">
+          {t('bookingModal.selectStep.selectSeatClass')}
+        </h4>
+        <div className="space-y-3">
+          {seatClasses.map((sc) => {
+            const Icon = sc.icon;
+            const isSelected = selectedClass === sc.class;
+            const isSoldOut = sc.seats === 0;
+
+            return (
+              <button
+                key={sc.class}
+                onClick={() => !isSoldOut && setSelectedClass(sc.class)}
+                disabled={isSoldOut}
+                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
+                  isSelected
+                    ? `${sc.borderColor} ${sc.bgColor}`
+                    : 'border-white/10 bg-white/5 hover:border-white/20'
+                } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
+              >
+                <div className="flex items-start justify-between mb-2">
+                  <div className="flex items-center gap-2">
+                    <Icon size={20} className={sc.color} />
+                    <span className="font-semibold text-star-white">{sc.name}</span>
+                    {isSelected && <Check size={18} className={sc.color} />}
+                  </div>
+                  <div className="text-right">
+                    <div className={`text-lg font-bold ${sc.color}`}>
+                      {formatCurrency(sc.price)}
+                    </div>
+                    <div className="text-xs text-star-white/60">
+                      {isSoldOut
+                        ? t('bookingModal.selectStep.soldOut')
+                        : t('bookingModal.selectStep.seatsLeft', { count: sc.seats })}
+                    </div>
+                  </div>
+                </div>
+                <ul className="text-xs text-star-white/70 space-y-1">
+                  {sc.features.map((f, i) => (
+                    <li key={i}>• {f}</li>
+                  ))}
+                </ul>
+              </button>
+            );
+          })}
+        </div>
+      </div>
+
+      {user && (
+        <div className="glass-card p-4 bg-white/5">
+          <h4 className="text-sm font-semibold text-star-white mb-2">
+            {t('bookingModal.selectStep.passenger')}
+          </h4>
+          <p className="text-star-white">{user.name}</p>
+          <p className="text-star-white/60 text-sm">{user.email}</p>
+        </div>
+      )}
+
+      <div className="flex gap-3">
+        <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
+          {t('bookingModal.selectStep.cancel')}
+        </Button>
+        <Button onClick={handleGetQuote} isLoading={isLoading} className="flex-1">
+          {t('bookingModal.selectStep.getQuote')}
+        </Button>
+      </div>
+    </div>
+  );
+
+  // Step 2: Quote review
+  const renderQuoteStep = () => {
+    const Icon = selectedClassData?.icon || Plane;
+    return (
+      <div className="space-y-6">
+        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/30">
+          <Tag size={16} className="text-cosmic-purple" />
+          <span className="text-xs text-star-white/60">{t('bookingModal.quoteStep.quoteId')}</span>
+          <span className="font-mono font-bold text-cosmic-purple ml-auto">{quote?.quoteId}</span>
+        </div>
+
+        {flightSummary}
+
+        <div className="glass-card p-4 bg-white/5 space-y-3">
+          <h4 className="text-sm font-semibold text-star-white">
+            {t('bookingModal.quoteStep.priceBreakdown')}
+          </h4>
+          <div className="flex items-center justify-between">
+            <div className="flex items-center gap-2">
+              <Icon size={16} className={selectedClassData?.color} />
+              <span className="text-sm text-star-white/70">{selectedClassData?.name} × 1</span>
+            </div>
+            <span className="text-star-white font-medium">
+              {formatCurrency(quote?.pricePerSeat || 0)}
+            </span>
+          </div>
+          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
+            <span className="font-semibold text-star-white">
+              {t('bookingModal.quoteStep.total')}
+            </span>
+            <span className="text-xl font-bold text-alien-green">
+              {formatCurrency(quote?.totalPrice || 0)}
+            </span>
+          </div>
+          <p className="text-xs text-star-white/50">
+            {t('bookingModal.quoteStep.quoteValidNote')}
+          </p>
+        </div>
+
+        <div className="flex gap-3">
+          <Button
+            variant="secondary"
+            onClick={() => setStep('select')}
+            disabled={isLoading}
+            className="flex-1"
+          >
+            <ArrowLeft size={16} /> {t('bookingModal.quoteStep.back')}
+          </Button>
+          <Button onClick={handlePlaceHold} isLoading={isLoading} className="flex-1">
+            <Timer size={16} /> {t('bookingModal.quoteStep.placeHold')}
+          </Button>
+        </div>
+      </div>
+    );
+  };
+
+  // Step 3: Hold active with countdown
+  const renderHoldStep = () => (
+    <div className="space-y-6">
+      <div className="flex items-center gap-2 p-3 rounded-lg bg-alien-green/10 border border-alien-green/30">
+        <Zap size={16} className="text-alien-green" />
+        <span className="text-xs text-star-white/60">{t('bookingModal.holdStep.holdId')}</span>
+        <span className="font-mono font-bold text-alien-green ml-auto">{hold?.holdId}</span>
+      </div>
+
+      {/* Countdown timer */}
+      <div
+        className={`p-6 text-center rounded-xl border-2 ${
+          isExpired
+            ? 'border-red-500/50 bg-red-500/5'
+            : 'border-solar-orange/50 bg-solar-orange/5'
+        }`}
+      >
+        <p className="text-xs text-star-white/60 mb-2 uppercase tracking-widest">
+          {isExpired
+            ? t('bookingModal.holdStep.holdExpired')
+            : t('bookingModal.holdStep.timeToConfirm')}
+        </p>
+        <div
+          className={`text-5xl font-mono font-bold tabular-nums ${
+            isExpired ? 'text-red-500' : 'text-solar-orange'
+          }`}
+        >
+          {isExpired ? t('bookingModal.holdStep.expired') : timerDisplay}
+        </div>
+        {!isExpired && (
+          <p className="text-xs text-star-white/50 mt-2">
+            {t('bookingModal.holdStep.seatReservedNote')}
+          </p>
+        )}
+      </div>
+
+      {flightSummary}
+
+      <div className="flex items-center justify-between p-4 rounded-xl bg-cosmic-gradient">
+        <div className="flex items-center gap-2">
+          <DollarSign className="text-white" size={20} />
+          <span className="text-white font-semibold">{t('bookingModal.holdStep.total')}</span>
+        </div>
+        <span className="text-xl font-bold text-white">
+          {formatCurrency(quote?.totalPrice || 0)}
+        </span>
+      </div>
+
+      {isExpired ? (
+        <Button variant="secondary" onClick={onClose} className="w-full">
+          {t('bookingModal.holdStep.close')}
+        </Button>
+      ) : (
+        <>
+          <div className="flex gap-3">
+            <Button
+              variant="danger"
+              onClick={handleReleaseHold}
+              isLoading={isLoading}
+              className="flex-1"
+            >
+              {t('bookingModal.holdStep.releaseHold')}
+            </Button>
+            <Button onClick={handleConfirmHold} isLoading={isLoading} className="flex-1">
+              {t('bookingModal.holdStep.confirmBooking')}
+            </Button>
+          </div>
+          <p className="text-xs text-star-white/50 text-center">
+            {t('bookingModal.holdStep.holdActiveNote')}
+          </p>
+        </>
+      )}
+    </div>
+  );
+
+  return (
+    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
+      {step === 'select' && renderSelectStep()}
+      {step === 'quote' && renderQuoteStep()}
+      {step === 'hold' && renderHoldStep()}
+    </Modal>
+  );
+};
+
+// Made with Bob

</patch>

**Assistant:**



_spend: {'cost': 0.10467, 'contextTokens': 52335}_
