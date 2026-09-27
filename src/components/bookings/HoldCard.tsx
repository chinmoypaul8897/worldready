import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Flight, StoredHold } from '../../types';
import { getDestinationByName } from '../../data/destinations';
import { Card, Button } from '../common';
import { Zap, Plane, Crown, Rocket, Timer, CheckCircle, XCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { confirmHold, releaseHold } from '../../services/api';
import { removeHold } from '../../utils/holdStorage';
import { useUser } from '../../hooks/useUserContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface HoldCardProps {
  storedHold: StoredHold;
  flight?: Flight;
  onAction: () => void; // called after confirm or release to refresh parent
}

export const HoldCard = ({ storedHold, flight, onAction }: HoldCardProps) => {
  const { user } = useUser();
  const { t } = useTranslation('bookings');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);

  useEffect(() => {
    const update = () => {
      const remaining = new Date(storedHold.reservedUntil).getTime() - Date.now();
      setTimeLeft(isNaN(remaining) ? 0 : Math.max(0, remaining));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [storedHold.reservedUntil]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isExpired = timeLeft === 0;

  const isLoading = isConfirming || isReleasing;

  const getSeatIcon = () => {
    switch (storedHold.seatClass) {
      case 'business':
        return <Crown size={16} className="text-purple-400" />;
      case 'galaxium':
        return <Rocket size={16} className="text-alien-green" />;
      default:
        return <Plane size={16} className="text-blue-400" />;
    }
  };

  const getSeatClassName = () => {
    switch (storedHold.seatClass) {
      case 'business':
        return t('bookings.seatClass.business');
      case 'galaxium':
        return t('bookings.seatClass.galaxiumClass');
      default:
        return t('bookings.seatClass.economy');
    }
  };

  const handleConfirm = async () => {
    if (!user) return;
    setIsConfirming(true);
    try {
      const confirmed = await confirmHold(storedHold.holdId);
      removeHold(user.user_id, storedHold.holdId);
      toast.success(t('bookings.toast.bookingConfirmed', { ref: confirmed.externalBookingReference }));
      onAction();
    } catch {
      toast.error(t('bookings.toast.confirmFailed'));
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRelease = async () => {
    if (!user) return;
    setIsReleasing(true);
    try {
      await releaseHold(storedHold.holdId);
      removeHold(user.user_id, storedHold.holdId);
      toast.success(t('bookings.toast.holdReleased'));
      onAction();
    } catch {
      toast.error(t('bookings.toast.releaseFailed'));
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border ${isExpired ? 'border-red-500/30' : 'border-solar-orange/30'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isExpired ? 'bg-red-500/20' : 'bg-solar-orange/20'
              }`}
            >
              <Zap
                className={isExpired ? 'text-red-400' : 'text-solar-orange'}
                size={20}
              />
            </div>
            <div>
              <p className="text-xs text-star-white/60 font-mono">{storedHold.holdId}</p>
              <div className="flex items-center gap-2 mt-1">
                {isExpired ? (
                  <>
                    <XCircle className="text-red-500" size={16} />
                    <span className="text-sm font-semibold text-red-500">{t('bookings.hold.expired')}</span>
                  </>
                ) : (
                  <>
                    <Timer className="text-solar-orange" size={16} />
                    <span className="text-sm font-semibold text-solar-orange">
                      {t('bookings.hold.heldTimer', { timer: timerDisplay })}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Flight details */}
        <div className="space-y-3 mb-4">
          {flight ? (
            <div>
              <h3 className="text-xl font-bold text-star-white mb-1">
                {(() => { const o = getDestinationByName(flight.origin); return o ? t(o.name) : flight.origin; })()} → {(() => { const d = getDestinationByName(flight.destination); return d ? t(d.name) : flight.destination; })()}
              </h3>
              <p className="text-sm text-star-white/60">{t('bookings.card.flightId', { id: flight.flight_id })}</p>
            </div>
          ) : (
            <p className="text-sm text-star-white/60">{t('bookings.card.flightId', { id: storedHold.flightId })}</p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              {getSeatIcon()}
              <span className="text-sm text-star-white/70">{getSeatClassName()}</span>
            </div>
            <span className="text-lg font-bold text-star-white">
              {storedHold.totalPrice != null && !isNaN(storedHold.totalPrice)
                ? formatCurrency(storedHold.totalPrice)
                : '—'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isExpired && (
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleRelease}
              isLoading={isReleasing}
              disabled={isLoading}
              className="flex-1"
            >
              {t('bookings.hold.release')}
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              isLoading={isConfirming}
              disabled={isLoading}
              className="flex-1"
            >
              <CheckCircle size={14} /> {t('bookings.hold.confirm')}
            </Button>
          </div>
        )}

        {isExpired && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (user) removeHold(user.user_id, storedHold.holdId);
              onAction();
            }}
            className="w-full"
          >
            {t('bookings.hold.dismiss')}
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

// Made with Bob
