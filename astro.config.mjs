// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { getDefaultLang } from "./src/lib/utils.ts";
import { hostname, languages } from "./src/lib/constants.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://" + hostname,
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: getDefaultLang(),
    locales: languages,
    // You can add fallback or routing options here if needed
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
});
