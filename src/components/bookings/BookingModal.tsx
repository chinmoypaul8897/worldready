import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Flight, SeatClass, Quote, Hold } from '../../types';
import { getDestinationByName } from '../../data/destinations';
import { Modal, Button } from '../common';
import {
  Plane,
  DollarSign,
  Crown,
  Rocket,
  Check,
  ArrowLeft,
  Tag,
  Timer,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatDate, calculateDuration } from '../../utils/formatters';
import { createQuote, createHold, confirmHold, releaseHold } from '../../services/api';
import { storeHold, removeHold } from '../../utils/holdStorage';
import { useUser } from '../../hooks/useUserContext';
import toast from 'react-hot-toast';

type Step = 'select' | 'quote' | 'hold';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  onSuccess: () => void;
}

export const BookingModal = ({ isOpen, onClose, flight, onSuccess }: BookingModalProps) => {
  const { user } = useUser();
  const { t } = useTranslation('bookings');
  const [step, setStep] = useState<Step>('select');
  const [selectedClass, setSelectedClass] = useState<SeatClass>('economy');
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setSelectedClass('economy');
      setQuote(null);
      setHold(null);
      setTimeLeft(0);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!hold || step !== 'hold') return;

    const update = () => {
      const remaining = new Date(hold.reservedUntil).getTime() - Date.now();
      setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [hold, step]);

  if (!flight) return null;

  const seatClasses = [
    {
      name: t('bookings.seatClass.economy'),
      class: 'economy' as SeatClass,
      price: flight.economy_price,
      seats: flight.economy_seats_available,
      icon: Plane,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      features: [
        t('bookings.features.economy.standardSeating'),
        t('bookings.features.economy.entertainment'),
        t('bookings.features.economy.snacks'),
      ],
    },
    {
      name: t('bookings.seatClass.business'),
      class: 'business' as SeatClass,
      price: flight.business_price,
      seats: flight.business_seats_available,
      icon: Crown,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      features: [
        t('bookings.features.business.premiumSeating'),
        t('bookings.features.business.priorityBoarding'),
        t('bookings.features.business.gourmetMeals'),
        t('bookings.features.business.extraLegroom'),
      ],
    },
    {
      name: t('bookings.seatClass.galaxiumClass'),
      class: 'galaxium' as SeatClass,
      price: flight.galaxium_price,
      seats: flight.galaxium_seats_available,
      icon: Rocket,
      color: 'text-alien-green',
      bgColor: 'bg-alien-green/10',
      borderColor: 'border-alien-green/30',
      features: [
        t('bookings.features.galaxium.luxuryPods'),
        t('bookings.features.galaxium.vipLounge'),
        t('bookings.features.galaxium.concierge'),
        t('bookings.features.galaxium.zeroG'),
      ],
    },
  ];

  const selectedClassData = seatClasses.find((sc) => sc.class === selectedClass);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = hold !== null && timeLeft === 0;

  const originData = getDestinationByName(flight.origin);
  const destData = getDestinationByName(flight.destination);

  const flightSummary = (
    <div className="glass-card p-4 bg-white/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-cosmic-gradient">
          <Plane className="text-white" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-star-white">
            {originData ? t(originData.name) : flight.origin} → {destData ? t(destData.name) : flight.destination}
          </h3>
          <p className="text-xs text-star-white/60">{t('bookings.card.flightId', { id: flight.flight_id })}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-sm">
        <div>
          <p className="text-xs text-star-white/60 mb-1">{t('bookings.modal.departure')}</p>
          <p className="text-star-white font-medium">
            {formatDate(flight.departure_time, 'MMM dd')}
          </p>
        </div>
        <div>
          <p className="text-xs text-star-white/60 mb-1">{t('bookings.modal.arrival')}</p>
          <p className="text-star-white font-medium">
            {formatDate(flight.arrival_time, 'MMM dd')}
          </p>
        </div>
        <div>
          <p className="text-xs text-star-white/60 mb-1">{t('bookings.modal.duration')}</p>
          <p className="text-star-white font-medium">
            {calculateDuration(flight.departure_time, flight.arrival_time)}
          </p>
        </div>
      </div>
    </div>
  );

  const handleGetQuote = async () => {
    if (!user) {
      toast.error(t('bookings.toast.signInRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const newQuote = await createQuote({
        flightId: flight.flight_id,
        seatClass: selectedClass,
        quantity: 1,
        travelerId: user.user_id,
        travelerName: user.name,
      });
      setQuote(newQuote);
      setStep('quote');
    } catch {
      toast.error(t('bookings.toast.getQuoteFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceHold = async () => {
    if (!quote) return;

    setIsLoading(true);
    try {
      const newHold = await createHold(quote.quoteId);
      setHold(newHold);
      setStep('hold');

      if (user) {
        storeHold(user.user_id, {
          holdId: newHold.holdId,
          quoteId: quote.quoteId,
          flightId: flight.flight_id,
          seatClass: selectedClass,
          pricePerSeat: quote.pricePerSeat,
          totalPrice: quote.totalPrice,
          reservedUntil: newHold.reservedUntil,
        });
      }

      toast.success(t('bookings.toast.seatHeld'));
    } catch {
      toast.error(t('bookings.toast.placeHoldFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmHold = async () => {
    if (!hold || !user) return;

    setIsLoading(true);
    try {
      const confirmed = await confirmHold(hold.holdId);
      removeHold(user.user_id, hold.holdId);
      toast.success(
        t('bookings.toast.bookingConfirmed', { ref: confirmed.externalBookingReference })
      );
      onSuccess();
      onClose();
    } catch {
      toast.error(t('bookings.toast.confirmFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReleaseHold = async () => {
    if (!hold || !user) return;

    setIsLoading(true);
    try {
      await releaseHold(hold.holdId);
      removeHold(user.user_id, hold.holdId);
      toast.success(t('bookings.toast.holdReleased'));
      onClose();
    } catch {
      toast.error(t('bookings.toast.releaseFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (step) {
      case 'select':
        return t('bookings.modal.titleSelect');
      case 'quote':
        return t('bookings.modal.titleQuote');
      case 'hold':
        return t('bookings.modal.titleHold');
    }
  };

  // Step 1: Seat class selection
  const renderSelectStep = () => (
    <div className="space-y-6">
      {flightSummary}

      <div>
        <h4 className="text-sm font-semibold text-star-white mb-3">{t('bookings.modal.selectSeatClass')}</h4>
        <div className="space-y-3">
          {seatClasses.map((sc) => {
            const Icon = sc.icon;
            const isSelected = selectedClass === sc.class;
            const isSoldOut = sc.seats === 0;

            return (
              <button
                key={sc.class}
                onClick={() => !isSoldOut && setSelectedClass(sc.class)}
                disabled={isSoldOut}
                className={`w-full p-4 rounded-lg border-2 transition-all text-start ${
                  isSelected
                    ? `${sc.borderColor} ${sc.bgColor}`
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className={sc.color} />
                    <span className="font-semibold text-star-white">{sc.name}</span>
                    {isSelected && <Check size={18} className={sc.color} />}
                  </div>
                  <div className="text-end">
                    <div className={`text-lg font-bold ${sc.color}`}>
                      {formatCurrency(sc.price)}
                    </div>
                    <div className="text-xs text-star-white/60">
                      {isSoldOut ? t('bookings.modal.soldOut') : t('bookings.modal.seatsLeft', { count: sc.seats })}
                    </div>
                  </div>
                </div>
                <ul className="text-xs text-star-white/70 space-y-1">
                  {sc.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>

      {user && (
        <div className="glass-card p-4 bg-white/5">
          <h4 className="text-sm font-semibold text-star-white mb-2">{t('bookings.modal.passenger')}</h4>
          <p className="text-star-white">{user.name}</p>
          <p className="text-star-white/60 text-sm">{user.email}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
          {t('bookings.modal.cancel')}
        </Button>
        <Button onClick={handleGetQuote} isLoading={isLoading} className="flex-1">
          {t('bookings.modal.getQuote')}
        </Button>
      </div>
    </div>
  );

  // Step 2: Quote review
  const renderQuoteStep = () => {
    const Icon = selectedClassData?.icon || Plane;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-cosmic-purple/10 border border-cosmic-purple/30">
          <Tag size={16} className="text-cosmic-purple" />
          <span className="text-xs text-star-white/60">{t('bookings.modal.quoteId')}</span>
          <span className="font-mono font-bold text-cosmic-purple ms-auto">{quote?.quoteId}</span>
        </div>

        {flightSummary}

        <div className="glass-card p-4 bg-white/5 space-y-3">
          <h4 className="text-sm font-semibold text-star-white">{t('bookings.modal.priceBreakdown')}</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon size={16} className={selectedClassData?.color} />
              <span className="text-sm text-star-white/70">{t('bookings.modal.seatLineItem', { name: selectedClassData?.name })}</span>
            </div>
            <span className="text-star-white font-medium">
              {formatCurrency(quote?.pricePerSeat || 0)}
            </span>
          </div>
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="font-semibold text-star-white">{t('bookings.modal.total')}</span>
            <span className="text-xl font-bold text-alien-green">
              {formatCurrency(quote?.totalPrice || 0)}
            </span>
          </div>
          <p className="text-xs text-star-white/50">
            {t('bookings.modal.quoteNote')}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setStep('select')}
            disabled={isLoading}
            className="flex-1"
          >
            <ArrowLeft size={16} className="rtl:-scale-x-100" /> {t('bookings.modal.back')}
          </Button>
          <Button onClick={handlePlaceHold} isLoading={isLoading} className="flex-1">
            <Timer size={16} /> {t('bookings.modal.placeHold')}
          </Button>
        </div>
      </div>
    );
  };

  // Step 3: Hold active with countdown
  const renderHoldStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-3 rounded-lg bg-alien-green/10 border border-alien-green/30">
        <Zap size={16} className="text-alien-green" />
        <span className="text-xs text-star-white/60">{t('bookings.modal.holdId')}</span>
        <span className="font-mono font-bold text-alien-green ms-auto">{hold?.holdId}</span>
      </div>

      {/* Countdown timer */}
      <div
        className={`p-6 text-center rounded-xl border-2 ${
          isExpired
            ? 'border-red-500/50 bg-red-500/5'
            : 'border-solar-orange/50 bg-solar-orange/5'
        }`}
      >
        <p className="text-xs text-star-white/60 mb-2 uppercase tracking-widest">
          {isExpired ? t('bookings.modal.holdExpired') : t('bookings.modal.timeToConfirm')}
        </p>
        <div
          className={`text-5xl font-mono font-bold tabular-nums ${
            isExpired ? 'text-red-500' : 'text-solar-orange'
          }`}
        >
          {isExpired ? t('bookings.modal.expired') : timerDisplay}
        </div>
        {!isExpired && (
          <p className="text-xs text-star-white/50 mt-2">
            {t('bookings.modal.seatReservedNote')}
          </p>
        )}
      </div>

      {flightSummary}

      <div className="flex items-center justify-between p-4 rounded-xl bg-cosmic-gradient">
        <div className="flex items-center gap-2">
          <DollarSign className="text-white" size={20} />
          <span className="text-white font-semibold">{t('bookings.modal.total')}</span>
        </div>
        <span className="text-xl font-bold text-white">
          {formatCurrency(quote?.totalPrice || 0)}
        </span>
      </div>

      {isExpired ? (
        <Button variant="secondary" onClick={onClose} className="w-full">
          {t('bookings.modal.close')}
        </Button>
      ) : (
        <>
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleReleaseHold}
              isLoading={isLoading}
              className="flex-1"
            >
              {t('bookings.modal.releaseHold')}
            </Button>
            <Button onClick={handleConfirmHold} isLoading={isLoading} className="flex-1">
              {t('bookings.modal.confirmBooking')}
            </Button>
          </div>
          <p className="text-xs text-star-white/50 text-center">
            {t('bookings.modal.closingNote')}
          </p>
        </>
      )}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getModalTitle()} size="md">
      {step === 'select' && renderSelectStep()}
      {step === 'quote' && renderQuoteStep()}
      {step === 'hold' && renderHoldStep()}
    </Modal>
  );
};

// Made with Bob
