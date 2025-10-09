// Global application constants

// I18n configuration
// Extract hostname without protocol if present
const hostname = process.env.PROD_SITE || 'test.com';

// Allow override of languages via environment variable (comma-separated codes)
const envLangs = process.env.LANGUAGES;
let languages: string[];
if (envLangs) {
  languages = envLangs.split(',').map(l => l.trim()).filter(Boolean);
} else {
   languages = ['lt', 'en', 'ru'];
}

export { languages, hostname };

// Import locales directly without await
import lt from '../locales/lt.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export const locales: Record<string, any> = {
  'lt': lt,
  'en': en,
  'ru': ru,
} as const; 

// Helper functions

// Determine defaultLang: 1) env var, 2) hostname TLD, 3) fallback 'lt'
function getDefaultLang(): string {
  if (process.env.DEFAULT_LANG && languages.includes(process.env.DEFAULT_LANG)) {
    return process.env.DEFAULT_LANG;
  }
  if (hostname) {
    const tld = hostname.split('.').pop();
    if (tld && languages.includes(tld)) {
      return tld;
    }
  }
  return languages[0];
}

export const defaultLang = getDefaultLang();

// Pages routes for url paths
export const PAGES = {
    HOME: '',
    ABOUT: 'about',
    CONTACT: 'contact',
    SERVICES: {
        BOUQUETS: 'services/bouquets',
        DECORATION: 'services/decoration',
        PLANTS: 'services/plants',
        EVENTS: 'services/events',
        SUBSCRIPTION: 'services/subscription'
    }
} as const;

// Breakpoint configuration
export const BREAKPOINTS = {
    xs: 376,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

// Page size constraints
export const PAGE_SIZES = {
    max: BREAKPOINTS['2xl'],
    min: BREAKPOINTS.xs,
} as const;

// Social media URLs
export const SOCIAL_MEDIA = {
    INSTAGRAM: 'https://www.instagram.com/jaukuma',
    FACEBOOK: 'https://www.facebook.com/studija.jaukuma',
} as const;

// Contact information
export const CONTACT = {
    PHONE: '+37066821177',
} as const;