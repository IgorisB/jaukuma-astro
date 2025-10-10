// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { hostname, languages, defaultLang } from "./src/lib/constants.ts";

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || process.env.HOSTNAME?.includes('dev');

// Set site URL based on environment
const siteUrl = process.env.HOSTNAME ? `https://${process.env.HOSTNAME}` : `https://${hostname}`;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static', // Ensure server-side execution for middleware
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: defaultLang,
    locales: languages,
    // You can add fallback or routing options here if needed
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});