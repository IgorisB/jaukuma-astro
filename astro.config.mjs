// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: 'lt',
    locales: ['lt', 'en', 'ru'],
    // You can add fallback or routing options here if needed
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
