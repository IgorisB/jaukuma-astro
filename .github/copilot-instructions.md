# Jaukuma Astro - AI Coding Instructions

## Architecture Overview

This is a multilingual Astro-based floristry business website with strict i18n patterns and component hierarchy.

### Multi-Language Architecture
- **Languages**: Lithuanian (lt), English (en), Russian (ru) - configured in `src/lib/constants.ts`
- **Default language**: First language in array (lt), with smart TLD detection
- **URL structure**: Root URLs for default lang (`/about`), prefixed for others (`/en/about`)
- **Pages must exist in both** `src/pages/` (root) and `src/pages/[locale]/` (localized) with identical structure
- **Translations**: JSON files in `src/locales/` accessed via `useTranslations()` utility

### Component Hierarchy (Strict Convention)
```
src/components/
├── pages/          # page.{name}.astro - Complete page layouts
├── sections/       # section.{name}.astro - Major page blocks  
└── controls/       # control.{name}.astro - Reusable UI elements
```

**Critical**: Pages in `src/pages/` are thin routing layers that import corresponding `page.*` components for actual content.

## Key Development Patterns

### Internationalization
```typescript
// In any component
const lang = getLangFromUrl(Astro.url);
const t = useTranslationsFromUrl(Astro.url);
const title = t('page.index.title'); // Gets from locales/{lang}.json
```

### Environment-Based Configuration
- **Development mode**: `isDevelopment` from constants, adds noindex headers
- **Hostname detection**: Auto-configures based on environment or falls back to `test.com`
- **Build environments**: `npm run build:dev` vs `npm run build` for different deployment targets

### Parallax System
- Hardware-accelerated parallax in `src/scripts/parallax.ts`
- Intersection Observer + throttled scroll events
- Reduced motion support and mobile optimization
- Initialize with `new ParallaxController()` in components

## Development Workflow

### Essential Commands
```bash
npm run dev                    # Dev server at localhost:4321
npm run build:dev             # Development build (with noindex)
npm run build                 # Production build  
npm run deploy:dev            # Deploy to dev.jaukuma.lt
npm run deploy:prod           # Deploy to www.jaukuma.lt
```

### Branch Strategy
- `dev` branch → `dev.jaukuma.lt` 
- `main` branch → `www.jaukuma.lt`

### Adding New Pages
1. Create in `src/pages/{name}.astro` (thin wrapper)
2. Create in `src/pages/[locale]/{name}.astro` (identical structure)
3. Create `src/components/pages/page.{name}.astro` (actual content)
4. Add translations to all locale JSON files
5. Update `PAGES` constant in `src/lib/constants.ts` if needed

## Project Context

**Business**: Jaukuma is a Lithuanian floristry business offering event decoration, subscriptions, and custom arrangements. The brand emphasizes "coziness" (jaukuma in Lithuanian) and affordable luxury.

**Tech Stack**: Astro 5.7+ with TypeScript, MDX, Sitemap generation, deployed on Cloudflare Pages.

**Styling**: Global CSS with custom properties, responsive design with defined breakpoints in constants.

## Critical Files
- `src/lib/constants.ts` - Languages, hostname, breakpoints, page routes
- `src/lib/utils.ts` - i18n utilities, URL helpers, translation functions  
- `src/middleware.ts` - Development environment headers
- `astro.config.mjs` - i18n configuration, integrations
- `.cursor/rules/styling.mdc` - Detailed component conventions (363 lines)