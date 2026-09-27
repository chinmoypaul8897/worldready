import { format, parseISO } from 'date-fns';
import { enUS, frCA, arSA } from 'date-fns/locale';
import i18next from '../i18n';

// Map language code -> date-fns locale
const dateFnsLocales: Record<string, typeof enUS> = {
  en: enUS,
  pseudo: enUS,
  fr: frCA,
  ar: arSA,
};

// Map language code -> BCP-47 locale tag
const bcp47: Record<string, string> = {
  en: 'en-US',
  pseudo: 'en-US',
  fr: 'fr-CA',
  ar: 'ar',
};

// Map language code -> currency
const currencies: Record<string, string> = {
  en: 'USD',
  pseudo: 'USD',
  fr: 'CAD',
  ar: 'USD',
};

function activeLng(locale?: string): string {
  return locale ?? i18next.language ?? 'en';
}

/**
 * Format a date string to a readable format
 * @param dateString ISO date string
 * @param formatString date-fns format string (default: 'MMM dd, yyyy HH:mm')
 * @param locale optional BCP-47 override (defaults to active i18next language)
 */
export const formatDate = (
  dateString: string,
  formatString: string = 'MMM dd, yyyy HH:mm',
  locale?: string
): string => {
  try {
    const date = parseISO(dateString);
    const lng = activeLng(locale);

    if (lng === 'en' || lng === 'pseudo') {
      // English parity: use date-fns with enUS (same as original)
      return format(date, formatString, { locale: enUS });
    }

    // For non-English, use Intl.DateTimeFormat for locale-native output
    const tag = bcp47[lng] ?? 'en-US';
    const dfLocale = dateFnsLocales[lng] ?? enUS;
    // If a custom formatString was passed, honour it with date-fns + locale
    if (formatString !== 'MMM dd, yyyy HH:mm') {
      return format(date, formatString, { locale: dfLocale });
    }
    // Default format: locale-native long datetime
    return new Intl.DateTimeFormat(tag, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format date to short format (e.g., "Jan 1, 2099")
 * @param locale optional BCP-47 override
 */
export const formatDateShort = (dateString: string, locale?: string): string => {
  const lng = activeLng(locale);
  if (lng === 'en' || lng === 'pseudo') {
    return formatDate(dateString, 'MMM dd, yyyy', locale);
  }
  try {
    const date = parseISO(dateString);
    const tag = bcp47[lng] ?? 'en-US';
    return new Intl.DateTimeFormat(tag, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Format time only (e.g., "09:00")
 * @param locale optional BCP-47 override
 */
export const formatTime = (dateString: string, locale?: string): string => {
  return formatDate(dateString, 'HH:mm', locale);
};

/**
 * Format currency
 * @param amount Amount in dollars
 * @param locale optional BCP-47 override
 */
export const formatCurrency = (amount: number, locale?: string): string => {
  const lng = activeLng(locale);
  if (lng === 'en' || lng === 'pseudo') {
    // English parity: identical to original implementation
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  const tag = bcp47[lng] ?? 'en-US';
  const currency = currencies[lng] ?? 'USD';
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  if (lng === 'ar') {
    opts.numberingSystem = 'latn';
  }
  return new Intl.NumberFormat(tag, opts).format(amount);
};

/**
 * Format large numbers with commas
 * @param locale optional BCP-47 override
 */
export const formatNumber = (num: number, locale?: string): string => {
  const lng = activeLng(locale);
  if (lng === 'en' || lng === 'pseudo') {
    // English parity: identical to original
    return new Intl.NumberFormat('en-US').format(num);
  }
  const tag = bcp47[lng] ?? 'en-US';
  const opts: Intl.NumberFormatOptions = {};
  if (lng === 'ar') {
    opts.numberingSystem = 'latn';
  }
  return new Intl.NumberFormat(tag, opts).format(num);
};

/**
 * Get relative time (e.g., "2 hours ago")
 * @param locale optional BCP-47 override
 */
export const getRelativeTime = (dateString: string, locale?: string): string => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const lng = activeLng(locale);

    if (lng === 'en' || lng === 'pseudo') {
      // English parity: identical to original implementation
      if (diffInSeconds < 60) return 'just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      return formatDateShort(dateString, locale);
    }

    // Non-English: use Intl.RelativeTimeFormat
    const tag = bcp47[lng] ?? 'en-US';
    const rtf = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' });
    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    return formatDateShort(dateString, locale);
  } catch {
    return dateString;
  }
};

/**
 * Calculate flight duration in hours
 */
export const calculateDuration = (
  departureTime: string,
  arrivalTime: string
): string => {
  try {
    const departure = parseISO(departureTime);
    const arrival = parseISO(arrivalTime);
    const diffInHours = (arrival.getTime() - departure.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.round(diffInHours * 60)} min`;
    }

    const hours = Math.floor(diffInHours);
    const minutes = Math.round((diffInHours - hours) * 60);

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  } catch {
    return 'N/A';
  }
};

// Made with Bob
