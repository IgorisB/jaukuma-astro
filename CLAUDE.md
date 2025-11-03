# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multilingual Astro-based floristry business website (Jaukuma - Lithuanian for "coziness") with strict component hierarchy and i18n patterns. Supports Lithuanian (lt), English (en), and Russian (ru).

**Tech Stack**: Astro 5.7+, TypeScript, MDX, deployed on Cloudflare Pages

## Essential Commands

```bash
# Development
npm run dev                    # Dev server at localhost:4321
npm run build:dev             # Development build (with noindex headers)
npm run build                 # Production build
npm run preview               # Build and preview locally
npm run check                 # Type-check with astro build && tsc

# Deployment
npm run deploy:dev            # Deploy to dev.jaukuma.lt (from dev branch)
npm run deploy:prod           # Deploy to www.jaukuma.lt (from main branch)
```

## Multi-Language Architecture

### Language Configuration
- **Languages**: `['lt', 'en', 'ru']` defined in [src/lib/constants.ts](src/lib/constants.ts)
- **Default language**: First in array (lt), with smart TLD detection via `getDefaultLang()`
- **URL structure**:
  - Default language uses root URLs: `/about`
  - Other languages are prefixed: `/en/about`, `/ru/about`
- **Translations**: JSON files in [src/locales/](src/locales/) accessed via `useTranslations()`

### i18n Utilities
```typescript
// Get language from URL
const lang = getLangFromUrl(Astro.url);

// Get translation function
const t = useTranslationsFromUrl(Astro.url);
const title = t('page.index.title'); // Gets from locales/{lang}.json

// Generate locale-specific URLs
const url = getLocalePath('en', currentPath);
```

### Rich Text Support
- **Support HTML tags** in locale JSON files: `<strong>`, `<em>`, `<b>`, `<i>`
- **Use `set:html` directive** to preserve formatting: `<p set:html={t('key')} />`
- **Example**: `"section.about.mission": "Our <strong>mission</strong> – to create..."`

## Component Hierarchy (Critical)

### Strict 3-Tier System
```
src/components/
├── pages/          # page.{name}.astro - Complete page layouts
├── sections/       # section.{name}.astro - Major page blocks
└── controls/       # control.{name}.astro - Reusable UI elements
```

### Naming Conventions
- **Page components**: `page.{name}.astro` or `page.{name}.{device}.astro`
- **Section components**: `section.{name}.astro` or `section.{name}.{device}.astro`
- **Control components**: `control.{name}.astro` or `control.{name}.{device}.astro`
- **Device suffixes** (optional): `.desktop`, `.tablet`, `.mobile`

### Component Responsibilities
- **Pages** (`src/pages/`): Thin routing layers that import corresponding `page.*` components
- **Page components**: Define complete page structure, compose sections, handle page-level data
- **Sections**: Self-contained major blocks (hero, footer, about), include controls
- **Controls**: Highly reusable UI elements (buttons, nav, forms)

### Responsive Design Strategy
- **Use device-specific components** only when strong separation is needed
- **Fallback order**: Mobile → Tablet → Desktop → Base component
- **Breakpoints**: XS (376px), SM (640px), MD (768px), LG (1024px), XL (1280px), 2XL (1536px)
  - Desktop: LG to 2XL
  - Tablet: MD to LG
  - Mobile: up to MD

## Page Structure (Critical)

### Dual-Location Requirement
**Every page MUST exist in both locations with identical structure:**
1. Root pages: `src/pages/{name}.astro` (for default language)
2. Localized pages: `src/pages/[locale]/{name}.astro` (for all languages)

### Adding New Pages
1. Create `src/pages/{name}.astro` (thin wrapper importing page component)
2. Create `src/pages/[locale]/{name}.astro` (identical structure)
3. Create `src/components/pages/page.{name}.astro` (actual content)
4. Add translations to all locale JSON files ([src/locales/](src/locales/))
5. Update `PAGES` constant in [src/lib/constants.ts](src/lib/constants.ts) if needed

## CSS Architecture

### Global CSS Rules ([src/styles/global.css](src/styles/global.css))
- **Contains only**: CSS variables, global reset, typography, utility classes, container classes
- **MUST NOT contain**: Component-specific styles

### Component-Specific Styles
- **Every component** MUST have its own scoped styles (inline or separate file)
- Co-locate styles with components or use dedicated styles directory
- Use BEM methodology for complex components

### Units and Measurements
- **PREFER**: `rem` for all measurements (font-size, padding, margin, width, height)
- **USE `px` only for**: Borders, shadows, media query breakpoints, or when explicitly requested

### Color Palette
```css
--color-main-primary: #333F48;      /* Dark blue-gray - headings, important elements */
--color-main-secondary: #D6D2C4;    /* Light beige - backgrounds */
--color-additional-red: #A45248;    /* Rust red - CTAs, highlights */
--color-additional-blue: #166886;   /* Steel blue - links, interactive */
--color-additional-green: #6A7866;  /* Sage green - success, nature */
--color-light: #F3F1E8;             /* Lighter shade for backgrounds */
```

### Typography
- **Headings**: 'Playfair Display' serif
- **Body text**: 'Source Sans Pro' sans-serif
- **Font weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Line heights**: 1.2 for headings, 1.6 for body text

### Clean Code Standards
- **DON'T create unused CSS rules** - only define actively used styles
- **EXCEPTION**: Define defaults when required for browser compatibility
- **MINIMIZE** CSS bundle size and avoid deep nesting

## Parallax System

Hardware-accelerated parallax implementation in [src/scripts/parallax.ts](src/scripts/parallax.ts):
- Uses Intersection Observer + throttled scroll events
- GPU-accelerated with `translate3d()`
- Supports reduced motion preference
- Mobile optimization with reduced intensity
- Auto-initializes on page load

### Usage
```astro
<div class="parallax-hero">
  <div class="parallax-background" style="background-image: url(...)"></div>
  <div class="parallax-content">
    <!-- Content here -->
  </div>
</div>
```

## Environment Configuration

### Development Mode
- Set via `MODE=development` environment variable
- Used by [src/middleware.ts](src/middleware.ts) to add `X-Robots-Tag: noindex, nofollow`
- Build with `npm run build:dev`

### Hostname Detection
- Configured via `HOSTNAME` environment variable
- Falls back to `test.com` if not set
- Used for SEO canonical URLs and hreflang tags

### Branch Strategy
- `dev` branch → `dev.jaukuma.lt`
- `main` branch → `www.jaukuma.lt`

## Critical Files

- [src/lib/constants.ts](src/lib/constants.ts) - Languages, hostname, breakpoints, page routes, social media, contact info
- [src/lib/utils.ts](src/lib/utils.ts) - i18n utilities, URL helpers, translation functions
- [src/middleware.ts](src/middleware.ts) - Development environment headers (noindex)
- [astro.config.mjs](astro.config.mjs) - Astro i18n configuration, integrations (MDX, sitemap)
- [src/layouts/Layout.astro](src/layouts/Layout.astro) - Base layout with SEO, fonts, footer
- [src/components/Seo.astro](src/components/Seo.astro) - SEO meta tags, OpenGraph, hreflang
- [src/styles/global.css](src/styles/global.css) - Global styles, CSS variables, utility classes
- [.cursor/rules/styling.mdc](.cursor/rules/styling.mdc) - Detailed component conventions (363 lines)

## SEO and Meta Tags

- **SEO component** ([src/components/Seo.astro](src/components/Seo.astro)) handles:
  - OpenGraph and Twitter cards
  - Canonical URLs
  - Hreflang tags for all languages
  - Locale-specific meta tags
- **Development mode** adds noindex headers automatically
- **Sitemap** generated via `@astrojs/sitemap` integration

## Business Context

**Jaukuma** is a Lithuanian floristry business offering:
- Event decoration
- Flower subscriptions
- Custom arrangements
- Office and home floral services

The brand emphasizes "coziness" (jaukuma in Lithuanian) and affordable luxury.

**Contact**: Phone: +37066821177
**Social**: Instagram (@jaukuma), Facebook (studija.jaukuma)
