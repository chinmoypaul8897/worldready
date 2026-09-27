import i18next, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const mods = import.meta.glob('../locales/*/*.json', { eager: true });
const resources: Record<string, Record<string, unknown>> = {};
for (const p in mods) {
  const m = p.match(/\.\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!m) continue;
  const [, lng, ns] = m;
  (resources[lng] ??= {})[ns] = (mods[p] as { default: unknown }).default;
}

i18next.use(LanguageDetector).use(initReactI18next).init({
  resources: resources as Resource,
  supportedLngs: ['en', 'fr', 'ar', 'pseudo'],
  fallbackLng: 'en',
  ns: ['pages', 'flights', 'bookings', 'common', 'destinations'],
  defaultNS: 'common',
  nsSeparator: '.',
  interpolation: { escapeValue: false },
  returnNull: false,
  detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
});

const applyDir = (lng: string) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = i18next.dir(lng); // 'rtl' for ar, else 'ltr'
};
applyDir(i18next.language || 'en');
i18next.on('languageChanged', applyDir);

export default i18next;
