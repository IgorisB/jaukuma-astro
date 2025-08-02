import { getDefaultLang } from './utils';
// Global application constants

// I18n configuration
export const hostname = process.env.PROD_SITE || 'test.com';

// Allow override of languages via environment variable (comma-separated codes)
const envLangs = process.env.LANGUAGES;
let languages: string[];
if (envLangs) {
  languages = envLangs.split(',').map(l => l.trim()).filter(Boolean);
} else {
   languages = ['lt', 'en', 'ru'];
}

export { languages };
export const locales: Record<string, any> = {
  'lt': await import('../locales/lt.json').then(m => m.default),
  'en': await import('../locales/en.json').then(m => m.default),
  'ru': await import('../locales/ru.json').then(m => m.default),
} as const; 


// Pages routes for url paths
export const PAGES = {
    HOME: '',
    ABOUT: 'about',
} as const;