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
} as const;
