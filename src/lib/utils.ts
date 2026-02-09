// General utility functions

import { languages, locales, hostname, PAGE_SLUGS } from './constants';

// Language and internationalization utilities
export function getLangFromUrl(url: URL) {
  // get language from path
  const [, lang] = url.pathname.split('/');
  if (lang in locales) return lang as keyof typeof locales;
  // Default
  return getDefaultLang();
}

export function useTranslationsFromUrl(url: URL) {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}

export function useTranslations(lang: string) {
  return function t(key: string) {
    return key in locales[lang] ? (locales[lang])[key] : locales[getDefaultLang()][key];
  };
}

export function getStaticPaths() {
  return languages.map((locale) => ({
    params: { locale }
  }));
}

// Generates a locale-specific URL for the current page
export function getLocalePath(code: string, path: string) {
  const segments = path.split('/').filter(Boolean);
  // Remove the first segment if it matches a language code
  let sourceLang: string | undefined;
  if (segments.length && languages.includes(segments[0])) {
    sourceLang = segments.shift();
  }
  let newPath = segments.join('/');

  // Translate slug between locales using PAGE_SLUGS
  newPath = translateSlug(newPath, sourceLang || getDefaultLang(), code);

  const defaultLang = getDefaultLang();
  if (code === defaultLang) {
    return newPath ? `/${newPath}` : '/';
  } else {
    return newPath ? `/${code}/${newPath}` : `/${code}/`;
  }
}

// Translates a page slug from one locale to another using PAGE_SLUGS mapping
function translateSlug(slug: string, fromLang: string, toLang: string): string {
  // Find the canonical key by looking up the slug in the source language
  for (const [canonicalKey, slugsByLocale] of Object.entries(PAGE_SLUGS)) {
    if (slugsByLocale[fromLang] === slug || canonicalKey === slug) {
      return slugsByLocale[toLang] || slug;
    }
  }
  return slug;
}

// Determine defaultLang: 1) env var, 2) hostname TLD, 3) fallback 'lt'
export function getDefaultLang(): string {
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