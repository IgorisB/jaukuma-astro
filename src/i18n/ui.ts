export const languages = {
  lt: 'Lietuvių',
  en: 'English',
  ru: 'Русский',
};

export const defaultLang = 'lt';

export const ui = {
  lt: await import('../locales/lt.json').then(m => m.default),
  en: await import('../locales/en.json').then(m => m.default),
  ru: await import('../locales/ru.json').then(m => m.default),
} as const; 