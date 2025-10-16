// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { hostname, languages, defaultLang } from "./src/lib/constants.ts";


// https://astro.build/config
export default defineConfig({
  site: `https://${hostname}`,
  output: 'static',
  integrations: [mdx(), sitemap(), tailwind()],
  i18n: {
    defaultLocale: defaultLang,
    locales: languages,
  },
});