import { defaultLang, languages, locales } from './config';

export function getLangFromUrl(url: URL) {
  // get language from path
  const [, lang] = url.pathname.split('/');
  if (lang in locales) return lang as keyof typeof locales;
  // Default
  return defaultLang;
}

export function useTranslationsFromUrl(url: URL) {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}

export function useTranslations(lang: string) {
  return function t(key: string) {
    return key in locales[lang] ? (locales[lang])[key] : locales[defaultLang][key];
  };
}

export function getStaticPaths() {
  return languages.map((locale) => ({
    params: { locale }
  }));
}

// Generates a locale-specific URL for the current page
export function getLocalePath(code: string, url: URL) {
  const segments = url.pathname.split('/').filter(Boolean);
  // Remove the first segment if it matches a language code
  if (segments.length && languages.includes(segments[0])) {
    segments.shift();
  }
  const path = segments.join('/');
  if (code === defaultLang) {
    return path ? `/${path}` : '/';
  } else {
    return path ? `/${code}/${path}` : `/${code}/`;
  }
}