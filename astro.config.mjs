// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { defaultLang, hostname, languages } from "./src/i18n/config.js";

// https://astro.build/config
export default defineConfig({
  site: "https://" + hostname,
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
