import { ui, defaultLang, languages } from './ui';

export function getLangFromUrl(url: URL) {
  // Try to get language from TLD
  const hostnameParts = url.hostname.split('.');
  const tld = hostnameParts[hostnameParts.length - 1];
  if (tld in ui) return tld as keyof typeof ui;

  // Fallback: get language from path
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;

  // Default
  return defaultLang;
}

export function useTranslationsFromUrl(url: URL) {
  const lang = getLangFromUrl(url);
  return useTranslations(lang);
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return key in ui[lang] ? (ui[lang] as any)[key] : ui[defaultLang][key];
  };
} 

export function getStaticPaths() {
  return Object.keys(languages).map((locale) => ({
    params: { locale }
  }));
}