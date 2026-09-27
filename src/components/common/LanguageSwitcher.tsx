import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
] as const;

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div className="flex gap-1">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`px-2 py-1 text-sm rounded ${
            current === code
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-gray-300 hover:text-white'
          }`}
          aria-current={current === code ? 'true' : undefined}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
