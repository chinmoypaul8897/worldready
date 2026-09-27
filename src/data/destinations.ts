// Display-string fields (name, tagline, description, facts.*, hazards[*], gallery[*].alt,
// gallery[*].description) now hold i18next key paths.
// Callers should resolve them via: t(destination.name), t(destination.tagline), etc.
// The `nameEn` field retains the stable English text for programmatic lookups (e.g. getDestinationByName).

export interface DestinationData {
  slug: string;
  /** i18next key — resolve with t(destination.name) */
  name: string;
  /** Stable English name used for lookups; do NOT translate */
  nameEn: string;
  /** i18next key — resolve with t(destination.tagline) */
  tagline: string;
  /** i18next key — resolve with t(destination.description) */
  description: string;
  facts: {
    /** i18next key */
    gravity: string;
    /** i18next key */
    distanceFromEarth: string;
    /** i18next key */
    typicalTransitTime: string;
    /** i18next key */
    surfaceTemp: string;
    /** i18next key */
    moons: string;
    /** i18next key */
    atmosphere: string;
  };
  /** i18next keys — resolve each element with t(key) */
  hazards: string[];
  gallery: {
    /** i18next key for alt text */
    alt: string;
    /** i18next key for caption */
    description: string;
    colorClass: string;
  }[];
  accentColor: string;
  bgAccent: string;
  borderAccent: string;
}

const destinations: DestinationData[] = [
  {
    slug: 'earth',
    name: 'destinations.earth.name',
    nameEn: 'Earth',
    tagline: 'destinations.earth.tagline',
    description: 'destinations.earth.description',
    facts: {
      gravity: 'destinations.earth.facts.gravity',
      distanceFromEarth: 'destinations.earth.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.earth.facts.typicalTransitTime',
      surfaceTemp: 'destinations.earth.facts.surfaceTemp',
      moons: 'destinations.earth.facts.moons',
      atmosphere: 'destinations.earth.facts.atmosphere',
    },
    hazards: [
      'destinations.earth.hazards.item0',
      'destinations.earth.hazards.item1',
      'destinations.earth.hazards.item2',
      'destinations.earth.hazards.item3',
    ],
    gallery: [
      { alt: 'destinations.earth.gallery.item0.alt', description: 'destinations.earth.gallery.item0.description', colorClass: 'bg-blue-500/20' },
      { alt: 'destinations.earth.gallery.item1.alt', description: 'destinations.earth.gallery.item1.description', colorClass: 'bg-cyan-500/20' },
      { alt: 'destinations.earth.gallery.item2.alt', description: 'destinations.earth.gallery.item2.description', colorClass: 'bg-indigo-500/20' },
    ],
    accentColor: 'text-space-blue',
    bgAccent: 'bg-blue-500/10',
    borderAccent: 'border-blue-500/30',
  },
  {
    slug: 'mars',
    name: 'destinations.mars.name',
    nameEn: 'Mars',
    tagline: 'destinations.mars.tagline',
    description: 'destinations.mars.description',
    facts: {
      gravity: 'destinations.mars.facts.gravity',
      distanceFromEarth: 'destinations.mars.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.mars.facts.typicalTransitTime',
      surfaceTemp: 'destinations.mars.facts.surfaceTemp',
      moons: 'destinations.mars.facts.moons',
      atmosphere: 'destinations.mars.facts.atmosphere',
    },
    hazards: [
      'destinations.mars.hazards.item0',
      'destinations.mars.hazards.item1',
      'destinations.mars.hazards.item2',
      'destinations.mars.hazards.item3',
      'destinations.mars.hazards.item4',
    ],
    gallery: [
      { alt: 'destinations.mars.gallery.item0.alt', description: 'destinations.mars.gallery.item0.description', colorClass: 'bg-orange-600/20' },
      { alt: 'destinations.mars.gallery.item1.alt', description: 'destinations.mars.gallery.item1.description', colorClass: 'bg-red-700/20' },
      { alt: 'destinations.mars.gallery.item2.alt', description: 'destinations.mars.gallery.item2.description', colorClass: 'bg-rose-300/20' },
    ],
    accentColor: 'text-solar-orange',
    bgAccent: 'bg-solar-orange/10',
    borderAccent: 'border-solar-orange/30',
  },
  {
    slug: 'moon',
    name: 'destinations.moon.name',
    nameEn: 'Moon',
    tagline: 'destinations.moon.tagline',
    description: 'destinations.moon.description',
    facts: {
      gravity: 'destinations.moon.facts.gravity',
      distanceFromEarth: 'destinations.moon.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.moon.facts.typicalTransitTime',
      surfaceTemp: 'destinations.moon.facts.surfaceTemp',
      moons: 'destinations.moon.facts.moons',
      atmosphere: 'destinations.moon.facts.atmosphere',
    },
    hazards: [
      'destinations.moon.hazards.item0',
      'destinations.moon.hazards.item1',
      'destinations.moon.hazards.item2',
      'destinations.moon.hazards.item3',
    ],
    gallery: [
      { alt: 'destinations.moon.gallery.item0.alt', description: 'destinations.moon.gallery.item0.description', colorClass: 'bg-gray-400/20' },
      { alt: 'destinations.moon.gallery.item1.alt', description: 'destinations.moon.gallery.item1.description', colorClass: 'bg-slate-400/20' },
      { alt: 'destinations.moon.gallery.item2.alt', description: 'destinations.moon.gallery.item2.description', colorClass: 'bg-zinc-400/20' },
    ],
    accentColor: 'text-star-white',
    bgAccent: 'bg-white/10',
    borderAccent: 'border-white/30',
  },
  {
    slug: 'venus',
    name: 'destinations.venus.name',
    nameEn: 'Venus',
    tagline: 'destinations.venus.tagline',
    description: 'destinations.venus.description',
    facts: {
      gravity: 'destinations.venus.facts.gravity',
      distanceFromEarth: 'destinations.venus.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.venus.facts.typicalTransitTime',
      surfaceTemp: 'destinations.venus.facts.surfaceTemp',
      moons: 'destinations.venus.facts.moons',
      atmosphere: 'destinations.venus.facts.atmosphere',
    },
    hazards: [
      'destinations.venus.hazards.item0',
      'destinations.venus.hazards.item1',
      'destinations.venus.hazards.item2',
      'destinations.venus.hazards.item3',
      'destinations.venus.hazards.item4',
    ],
    gallery: [
      { alt: 'destinations.venus.gallery.item0.alt', description: 'destinations.venus.gallery.item0.description', colorClass: 'bg-yellow-500/20' },
      { alt: 'destinations.venus.gallery.item1.alt', description: 'destinations.venus.gallery.item1.description', colorClass: 'bg-amber-600/20' },
      { alt: 'destinations.venus.gallery.item2.alt', description: 'destinations.venus.gallery.item2.description', colorClass: 'bg-yellow-300/20' },
    ],
    accentColor: 'text-solar-orange',
    bgAccent: 'bg-yellow-500/10',
    borderAccent: 'border-yellow-500/30',
  },
  {
    slug: 'jupiter',
    name: 'destinations.jupiter.name',
    nameEn: 'Jupiter',
    tagline: 'destinations.jupiter.tagline',
    description: 'destinations.jupiter.description',
    facts: {
      gravity: 'destinations.jupiter.facts.gravity',
      distanceFromEarth: 'destinations.jupiter.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.jupiter.facts.typicalTransitTime',
      surfaceTemp: 'destinations.jupiter.facts.surfaceTemp',
      moons: 'destinations.jupiter.facts.moons',
      atmosphere: 'destinations.jupiter.facts.atmosphere',
    },
    hazards: [
      'destinations.jupiter.hazards.item0',
      'destinations.jupiter.hazards.item1',
      'destinations.jupiter.hazards.item2',
      'destinations.jupiter.hazards.item3',
      'destinations.jupiter.hazards.item4',
    ],
    gallery: [
      { alt: 'destinations.jupiter.gallery.item0.alt', description: 'destinations.jupiter.gallery.item0.description', colorClass: 'bg-orange-400/20' },
      { alt: 'destinations.jupiter.gallery.item1.alt', description: 'destinations.jupiter.gallery.item1.description', colorClass: 'bg-amber-700/20' },
      { alt: 'destinations.jupiter.gallery.item2.alt', description: 'destinations.jupiter.gallery.item2.description', colorClass: 'bg-red-400/20' },
    ],
    accentColor: 'text-solar-orange',
    bgAccent: 'bg-orange-500/10',
    borderAccent: 'border-orange-500/30',
  },
  {
    slug: 'europa',
    name: 'destinations.europa.name',
    nameEn: 'Europa',
    tagline: 'destinations.europa.tagline',
    description: 'destinations.europa.description',
    facts: {
      gravity: 'destinations.europa.facts.gravity',
      distanceFromEarth: 'destinations.europa.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.europa.facts.typicalTransitTime',
      surfaceTemp: 'destinations.europa.facts.surfaceTemp',
      moons: 'destinations.europa.facts.moons',
      atmosphere: 'destinations.europa.facts.atmosphere',
    },
    hazards: [
      'destinations.europa.hazards.item0',
      'destinations.europa.hazards.item1',
      'destinations.europa.hazards.item2',
      'destinations.europa.hazards.item3',
    ],
    gallery: [
      { alt: 'destinations.europa.gallery.item0.alt', description: 'destinations.europa.gallery.item0.description', colorClass: 'bg-cyan-400/20' },
      { alt: 'destinations.europa.gallery.item1.alt', description: 'destinations.europa.gallery.item1.description', colorClass: 'bg-teal-400/20' },
      { alt: 'destinations.europa.gallery.item2.alt', description: 'destinations.europa.gallery.item2.description', colorClass: 'bg-blue-400/20' },
    ],
    accentColor: 'text-alien-green',
    bgAccent: 'bg-alien-green/10',
    borderAccent: 'border-alien-green/30',
  },
  {
    slug: 'pluto',
    name: 'destinations.pluto.name',
    nameEn: 'Pluto',
    tagline: 'destinations.pluto.tagline',
    description: 'destinations.pluto.description',
    facts: {
      gravity: 'destinations.pluto.facts.gravity',
      distanceFromEarth: 'destinations.pluto.facts.distanceFromEarth',
      typicalTransitTime: 'destinations.pluto.facts.typicalTransitTime',
      surfaceTemp: 'destinations.pluto.facts.surfaceTemp',
      moons: 'destinations.pluto.facts.moons',
      atmosphere: 'destinations.pluto.facts.atmosphere',
    },
    hazards: [
      'destinations.pluto.hazards.item0',
      'destinations.pluto.hazards.item1',
      'destinations.pluto.hazards.item2',
      'destinations.pluto.hazards.item3',
      'destinations.pluto.hazards.item4',
    ],
    gallery: [
      { alt: 'destinations.pluto.gallery.item0.alt', description: 'destinations.pluto.gallery.item0.description', colorClass: 'bg-purple-400/20' },
      { alt: 'destinations.pluto.gallery.item1.alt', description: 'destinations.pluto.gallery.item1.description', colorClass: 'bg-violet-500/20' },
      { alt: 'destinations.pluto.gallery.item2.alt', description: 'destinations.pluto.gallery.item2.description', colorClass: 'bg-indigo-400/20' },
    ],
    accentColor: 'text-cosmic-purple',
    bgAccent: 'bg-cosmic-purple/10',
    borderAccent: 'border-cosmic-purple/30',
  },
];

// Lookup by URL slug (case-insensitive)
export const getDestinationBySlug = (slug: string): DestinationData | null =>
  destinations.find((d) => d.slug === slug.toLowerCase()) ?? null;

// Lookup by display name (used to linkify destination names in FlightCard).
// Uses the stable `nameEn` field (English text) rather than the i18n key stored in `name`.
export const getDestinationByName = (name: string): DestinationData | null =>
  destinations.find((d) => d.nameEn.toLowerCase() === name.toLowerCase()) ?? null;

// All destinations for the homepage grid
export const ALL_DESTINATIONS: ReadonlyArray<DestinationData> = destinations;

// Made with Bob
