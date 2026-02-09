// Global application constants

// Extract hostname without protocol if present
const hostname = process.env.HOSTNAME || "test.com";

// Allow override of languages via environment variable (comma-separated codes)
const envLangs = process.env.LANGUAGES;
let languages: string[];
if (envLangs) {
  languages = envLangs
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
} else {
  languages = ["lt", "en", "ru"];
}

export { languages, hostname };

// Import locales directly without await
import lt from "../locales/lt.json";
import en from "../locales/en.json";
import ru from "../locales/ru.json";

export const locales: Record<string, any> = {
  lt: lt,
  en: en,
  ru: ru,
} as const;

// Computed constants
export const defaultLang = languages[0]; // Simple fallback, more complex logic moved to utils

export const isDevelopment = process.env.MODE == "development";

// Pages routes for url paths
export const PAGES = {
  HOME: "",
  ABOUT: "about",
  CONTACT: "contact",
  SERVICES: {
    BOUQUETS: "services/bouquets",
    DECORATION: "services/decoration",
    PLANTS: "services/plants",
    EVENTS: "services/events",
    SUBSCRIPTION: "services/subscription",
  },
  CONTENT: {
    VIDEO_SURVEILLANCE: "vaizdo-stebejimas-savitarnose",
  },
} as const;

// Locale-aware page slugs for pages with translated URLs
// Maps canonical page key → locale-specific slug
export const PAGE_SLUGS: Record<string, Record<string, string>> = {
  [PAGES.ABOUT]: { lt: "apie-mus", en: "about", ru: "about" },
  [PAGES.CONTACT]: { lt: "kontaktai", en: "contact", ru: "contact" },
};

// Breakpoint configuration
export const BREAKPOINTS = {
  xs: 376,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Page size constraints
export const PAGE_SIZES = {
  max: BREAKPOINTS["2xl"],
  min: BREAKPOINTS.xs,
} as const;

// Social media URLs
export const SOCIAL_MEDIA = {
  INSTAGRAM: "https://www.instagram.com/jaukuma",
  FACEBOOK: "https://www.facebook.com/studija.jaukuma",
} as const;

// Contact information
export const CONTACT = {
  PHONE: "+37066821177",
  PHONE_DISPLAY: "+370 668 21177",
  EMAIL: "studija@jaukuma.lt",
  MESSENGER: "https://m.me/studija.jaukuma",
} as const;

// Store locations
export interface Location {
  id: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl: string;
  phone: string;
  image: string;
}

export const LOCATIONS: Location[] = [
  {
    id: "pilaite",
    coordinates: { lat: 54.7024199, lng: 25.1763126 },
    googleMapsUrl: "https://maps.app.goo.gl/zSE68o8uiVocDfRA7",
    phone: "+37066821177",
    image: "/images/store-pilaite.webp",
  },
  {
    id: "silas-bajorai",
    coordinates: { lat: 54.7578642, lng: 25.2235841 },
    googleMapsUrl: "https://maps.app.goo.gl/uRcTPd2rH8BM4sMR6",
    phone: "+37066821177",
    image: "/images/store-silas-bajorai.webp",
  },
  {
    id: "silas-zujunai",
    coordinates: { lat: 54.7127783, lng: 25.1597642 },
    googleMapsUrl: "https://maps.app.goo.gl/fVB1y5DGnxBmvDbH9",
    phone: "+37066821177",
    image: "/images/store-silas-zujunai.webp",
  },
  {
    id: "silas-giruliai",
    coordinates: { lat: 54.73782, lng: 25.21829 },
    googleMapsUrl: "https://maps.app.goo.gl/2d2CCnVAAS2DZpBZ7",
    phone: "+37066821177",
    image: "/images/store-silas-perkunkiemis.webp",
  },
] as const;
