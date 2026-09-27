import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDestinationBySlug, getDestinationByName } from '../data/destinations';
import type { DestinationData } from '../data/destinations';
import { getFlights } from '../services/api';
import type { Flight } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatTime, formatDate, formatCurrency } from '../utils/formatters';

// Animated section wrapper — staggered entrance matching site-wide style
const Section = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Label used inside the facts grid
const FactTile = ({ label, value }: { label: string; value: string }) => (
  <div className="glass-card p-4">
    <p className="text-xs text-star-white/50 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-star-white font-semibold">{value}</p>
  </div>
);

export const DestinationDetail = () => {
  const { t } = useTranslation('pages');
  const { slug = '' } = useParams<{ slug: string }>();
  const destination: DestinationData | null = getDestinationBySlug(slug);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [flightsLoading, setFlightsLoading] = useState(true);

  useEffect(() => {
    if (!destination) {
      setFlightsLoading(false);
      return;
    }

    const loadFlights = async () => {
      setFlightsLoading(true);
      try {
        const data = await getFlights({ destination: destination.nameEn });
        // Guard against ilike over-matching (e.g. "Moon" matching "Moon → Mars")
        setFlights(data.filter((f) => f.destination === destination.nameEn).slice(0, 5));
      } catch {
        toast.error(t('pages.destination.toastFlightsError'));
      } finally {
        setFlightsLoading(false);
      }
    };

    loadFlights();
  }, [destination, t]);

  // ── Unknown slug ─────────────────────────────────────────────────────────────
  if (!destination) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 max-w-md"
        >
          <Rocket size={48} className="mx-auto mb-6 text-cosmic-purple" />
          <h1 className="text-3xl font-bold text-star-white mb-4">
            {t('pages.destination.notFoundTitle')}
          </h1>
          <p className="text-star-white/70 mb-8">
            <Trans
              i18nKey="pages.destination.notFoundBody"
              values={{ slug }}
              components={[<span className="font-mono text-cosmic-purple" />]}
            />
          </p>
          <Link to="/">
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-cosmic-gradient text-white font-semibold hover:opacity-90 transition-opacity">
              <ArrowLeft size={18} className="rtl:-scale-x-100" />
              {t('pages.destination.backToHome')}
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const { name, nameEn, tagline, description, facts, hazards, gallery, accentColor, bgAccent, borderAccent } = destination;

  return (
    <div className="space-y-12">
      {/* Back link */}
      <Section delay={0}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-star-white/60 hover:text-star-white transition-colors text-sm"
        >
          <ArrowLeft size={16} className="rtl:-scale-x-100" />
          {t('pages.destination.allDestinations')}
        </Link>
      </Section>

      {/* ── 1. Hero ─────────────────────────────────────────────────────────── */}
      <Section delay={0.05}>
        <div className={`glass-card p-10 ${bgAccent} border ${borderAccent}`}>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${bgAccent} border ${borderAccent} ${accentColor}`}>
              {t('pages.destination.destinationBadge')}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-star-white mb-3">{t(name)}</h1>
          <p className={`text-xl font-medium mb-4 ${accentColor}`}>{t(tagline)}</p>
          <p className="text-star-white/80 max-w-3xl leading-relaxed">{t(description)}</p>
        </div>
      </Section>

      {/* ── 2. Facts ────────────────────────────────────────────────────────── */}
      <Section delay={0.1}>
        <h2 className="text-2xl font-bold text-star-white mb-6">{t('pages.destination.quickFacts')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FactTile label={t('pages.destination.factGravity')} value={t(facts.gravity)} />
          <FactTile label={t('pages.destination.factDistance')} value={t(facts.distanceFromEarth)} />
          <FactTile label={t('pages.destination.factTransitTime')} value={t(facts.typicalTransitTime)} />
          <FactTile label={t('pages.destination.factSurfaceTemp')} value={t(facts.surfaceTemp)} />
          <FactTile label={t('pages.destination.factMoons')} value={t(facts.moons)} />
          <FactTile label={t('pages.destination.factAtmosphere')} value={t(facts.atmosphere)} />
        </div>
      </Section>

      {/* ── 3. Hazards ──────────────────────────────────────────────────────── */}
      <Section delay={0.2}>
        <div className="glass-card p-6 border border-solar-orange/30 bg-solar-orange/5">
          <div className="flex items-center gap-3 mb-5">
            <AlertTriangle size={22} className="text-solar-orange flex-shrink-0" />
            <h2 className="text-2xl font-bold text-star-white">{t('pages.destination.hazardAdvisory')}</h2>
          </div>
          <ul className="space-y-3">
            {hazards.map((hazard, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-2 h-2 rounded-full bg-solar-orange flex-shrink-0" />
                <span className="text-star-white/80">{t(hazard)}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── 4. Gallery ──────────────────────────────────────────────────────── */}
      <Section delay={0.3}>
        <h2 className="text-2xl font-bold text-star-white mb-6">{t('pages.destination.gallery')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((item, i) => (
            <div
              key={i}
              className={`glass-card p-0 overflow-hidden border ${borderAccent}`}
            >
              {/* Placeholder tile — CSS only, no external images */}
              <div className={`h-36 ${item.colorClass} flex items-end`} aria-label={t(item.alt)}>
                <div className="w-full px-4 py-2 bg-space-dark/60 backdrop-blur-sm">
                  <p className="text-xs text-star-white/70">{t(item.alt)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-star-white/80">{t(item.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. Flights departing soon ───────────────────────────────────────── */}
      <Section delay={0.4}>
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-star-white mb-2">{t('pages.destination.flightsSoonTitle')}</h2>
          <p className="text-star-white/60 text-sm mb-6">
            {t('pages.destination.flightsSoonSubtitle', { name: t(name) })}
          </p>

          {flightsLoading ? (
            <LoadingSpinner size="sm" text={t('pages.destination.loadingSchedules')} />
          ) : flights.length === 0 ? (
            <div className="text-center py-10">
              <Rocket size={36} className="mx-auto mb-3 text-star-white/30" />
              <p className="text-star-white/60">{t('pages.destination.noFlightsTitle', { name: t(name) })}</p>
              <p className="text-star-white/40 text-sm mt-1">
                {t('pages.destination.noFlightsHint')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {flights.map((flight) => (
                <div
                  key={flight.flight_id}
                  className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border ${borderAccent} ${bgAccent}`}
                >
                  <div>
                    <p className="text-star-white font-semibold">
                      {(() => { const o = getDestinationByName(flight.origin); return o ? t(o.name) : flight.origin; })()} → {(() => { const d = getDestinationByName(flight.destination); return d ? t(d.name) : flight.destination; })()}
                    </p>
                    <p className="text-star-white/60 text-sm">
                      {formatDate(flight.departure_time, 'MMM dd, yyyy')} · {formatTime(flight.departure_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-end">
                      <p className="text-xs text-star-white/50">{t('pages.destination.priceFrom')}</p>
                      <p className={`font-bold ${accentColor}`}>{formatCurrency(flight.economy_price)}</p>
                    </div>
                    <Link
                      to={`/flights?destination=${encodeURIComponent(nameEn)}`}
                      className="px-4 py-2 rounded-lg bg-cosmic-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                    >
                      {t('pages.destination.bookButton')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

// Made with Bob
