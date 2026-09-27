import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FlightFilters as FlightFiltersType } from '../../services/api';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlightFiltersProps {
  filters: FlightFiltersType;
  onFiltersChange: (filters: FlightFiltersType) => void;
  onReset: () => void;
}

export const FlightFilters = ({ filters, onFiltersChange, onReset }: FlightFiltersProps) => {
  const { t } = useTranslation('flights');
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FlightFiltersType, value: FlightFiltersType[typeof key]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: keyof FlightFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const activeFilterCount = Object.keys(filters).length;

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-star-white hover:text-cosmic-purple transition-colors"
        >
          <Filter size={20} />
          <span className="font-semibold">{t('flights.filters.title')}</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-cosmic-purple/20 text-cosmic-purple text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-star-white/70 hover:text-star-white transition-colors"
          >
            {t('flights.filters.resetAll')}
          </button>
        )}
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Phase 1: Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.sortBy')}</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.sort_by || 'departure_time'}
                  onChange={(e) => updateFilter('sort_by', e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                >
                  <option value="departure_time">{t('flights.filters.sortDepartureTime')}</option>
                  <option value="base_price">{t('flights.filters.sortPrice')}</option>
                  <option value="duration">{t('flights.filters.sortDuration')}</option>
                  <option value="seats_available">{t('flights.filters.sortAvailability')}</option>
                </select>
                <select
                  value={filters.sort_order || 'asc'}
                  onChange={(e) => updateFilter('sort_order', e.target.value)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                >
                  <option value="asc">{t('flights.filters.ascending')}</option>
                  <option value="desc">{t('flights.filters.descending')}</option>
                </select>
              </div>
            </div>

            {/* Phase 1: Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.departureDate')}</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="date"
                    value={filters.departure_date_from || ''}
                    onChange={(e) => updateFilter('departure_date_from', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                  />
                  <span className="text-xs text-star-white/50 mt-1">{t('flights.filters.dateFrom')}</span>
                </div>
                <div>
                  <input
                    type="date"
                    value={filters.departure_date_to || ''}
                    onChange={(e) => updateFilter('departure_date_to', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                  />
                  <span className="text-xs text-star-white/50 mt-1">{t('flights.filters.dateTo')}</span>
                </div>
              </div>
            </div>

            {/* Phase 1: Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.priceRange')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t('flights.filters.minPlaceholder')}
                  value={filters.min_price || ''}
                  onChange={(e) => updateFilter('min_price', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                />
                <input
                  type="number"
                  placeholder={t('flights.filters.maxPlaceholder')}
                  value={filters.max_price || ''}
                  onChange={(e) => updateFilter('max_price', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
            </div>

            {/* Phase 1: Seat Class */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.seatClass')}</label>
              <div className="flex gap-2">
                {[
                  { value: 'economy', labelKey: 'flights.filters.seatEconomy' },
                  { value: 'business', labelKey: 'flights.filters.seatBusiness' },
                  { value: 'galaxium', labelKey: 'flights.filters.seatGalaxium' },
                ].map((seatClass) => (
                  <button
                    key={seatClass.value}
                    onClick={() => updateFilter('seat_class', filters.seat_class === seatClass.value ? undefined : seatClass.value)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.seat_class === seatClass.value
                        ? 'bg-cosmic-purple text-white'
                        : 'bg-white/5 text-star-white/70 hover:bg-white/10'
                    }`}
                  >
                    {t(seatClass.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase 2: Time of Day */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.timeOfDay')}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'morning', label: t('flights.filters.timeMorning') },
                  { value: 'afternoon', label: t('flights.filters.timeAfternoon') },
                  { value: 'evening', label: t('flights.filters.timeEvening') },
                  { value: 'night', label: t('flights.filters.timeNight') },
                ].map((period) => (
                  <button
                    key={period.value}
                    onClick={() =>
                      updateFilter(
                        'departure_time_period',
                        filters.departure_time_period === period.value ? undefined : period.value
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.departure_time_period === period.value
                        ? 'bg-cosmic-purple text-white'
                        : 'bg-white/5 text-star-white/70 hover:bg-white/10'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase 2: Duration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.flightDuration')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder={t('flights.filters.minDurationPlaceholder')}
                  value={filters.min_duration || ''}
                  onChange={(e) => updateFilter('min_duration', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                />
                <input
                  type="number"
                  placeholder={t('flights.filters.maxDurationPlaceholder')}
                  value={filters.max_duration || ''}
                  onChange={(e) => updateFilter('max_duration', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
                />
              </div>
            </div>

            {/* Phase 2: Minimum Seats */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.minSeats')}</label>
              <input
                type="number"
                placeholder={t('flights.filters.seatsPlaceholder')}
                value={filters.min_seats_available || ''}
                onChange={(e) =>
                  updateFilter('min_seats_available', e.target.value ? parseInt(e.target.value) : undefined)
                }
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-star-white text-sm focus:outline-none focus:ring-2 focus:ring-cosmic-purple"
              />
            </div>

            {/* Phase 3: Route Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-star-white">{t('flights.filters.routeCategory')}</label>
              <div className="flex gap-2">
                {[
                  { value: 'inner_planets', label: t('flights.filters.routeInnerPlanets') },
                  { value: 'outer_planets', label: t('flights.filters.routeOuterPlanets') },
                  { value: 'moons', label: t('flights.filters.routeMoons') },
                ].map((category) => (
                  <button
                    key={category.value}
                    onClick={() =>
                      updateFilter('route_category', filters.route_category === category.value ? undefined : category.value)
                    }
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.route_category === category.value
                        ? 'bg-cosmic-purple text-white'
                        : 'bg-white/5 text-star-white/70 hover:bg-white/10'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          {Object.entries(filters).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-1 px-3 py-1 bg-cosmic-purple/20 text-cosmic-purple text-sm rounded-full"
            >
              <span>
                {key.replace(/_/g, ' ')}: {String(value)}
              </span>
              <button
                onClick={() => removeFilter(key as keyof FlightFiltersType)}
                className="hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Made with Bob