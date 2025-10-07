# Astro Project Setup Guide

A comprehensive guide for creating an Astro project with internationalization, Cloudflare deployment, and best practices based on the jaukuma-astro project structure.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Project Structure](#project-structure)
4. [Core Configuration](#core-configuration)
5. [Internationalization Setup](#internationalization-setup)
6. [Component Architecture](#component-architecture)
7. [Styling System](#styling-system)
8. [Build and Deployment](#build-and-deployment)
9. [Development Workflow](#development-workflow)
10. [Best Practices](#best-practices)

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** for version control
- **VS Code** with Astro extension (recommended)

## Project Initialization

### 1. Create New Astro Project

```bash
# Option 1: Using Cloudflare template (recommended)
npm create cloudflare@latest my-astro-project -- --template=cloudflare/templates/astro-blog-starter-template

# Option 2: Create from scratch
npm create astro@latest my-astro-project
cd my-astro-project
```

### 2. Install Required Dependencies

```bash
npm install @astrojs/cloudflare @astrojs/mdx @astrojs/rss @astrojs/sitemap astro typescript
npm install --save-dev wrangler
```

### 3. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

## Project Structure

Create the following directory structure:

```
my-astro-project/
├── src/
│   ├── assets/                 # Static assets (images, fonts)
│   ├── components/
│   │   ├── controls/          # Interactive UI components
│   │   ├── pages/             # Page-specific components
│   │   └── sections/          # Layout sections
│   ├── i18n/                  # Internationalization utilities
│   ├── layouts/               # Page layouts
│   ├── lib/
│   │   ├── colors.ts          # Color system
│   │   ├── constants.ts       # Global constants
│   │   ├── index.ts           # Library exports
│   │   └── utils.ts           # Utility functions
│   ├── locales/               # Translation files
│   │   ├── en.json
│   │   ├── lt.json
│   │   └── ru.json
│   ├── pages/                 # Astro pages
│   │   ├── [locale]/          # Localized routes
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   └── index.astro
│   ├── scripts/               # Client-side scripts
│   ├── styles/
│   │   └── global.css         # Global styles
│   └── env.d.ts               # TypeScript environment types
├── public/                    # Public static files
├── docs/                      # Documentation
├── astro.config.mjs           # Astro configuration
├── package.json
├── tsconfig.json
├── wrangler.json              # Cloudflare Workers config
└── worker-configuration.d.ts  # Worker types
```

## Core Configuration

### 1. Package.json

```json
{
  "name": "my-astro-project",
  "description": "Build a personal website, blog, or portfolio with Astro.",
  "type": "module",
  "dependencies": {
    "@astrojs/cloudflare": "^12.5.0",
    "@astrojs/mdx": "^4.2.4",
    "@astrojs/rss": "^4.0.11",
    "@astrojs/sitemap": "^3.3.0",
    "astro": "^5.7.4",
    "typescript": "^5.8.3"
  },
  "devDependencies": {
    "wrangler": "^4.16.1"
  },
  "scripts": {
    "astro": "astro",
    "build": "astro build",
    "cf-typegen": "wrangler types",
    "check": "astro build && tsc && wrangler deploy --dry-run",
    "deploy": "wrangler deploy",
    "dev": "astro dev",
    "preview": "astro build && wrangler dev"
  }
}
```

### 2. Astro Configuration (astro.config.mjs)

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { hostname, languages, defaultLang } from "./src/lib/constants.ts";

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
```

### 3. TypeScript Configuration (tsconfig.json)

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

### 4. Wrangler Configuration (wrangler.json)

```json
{
  "name": "my-astro-project",
  "compatibility_date": "2025-04-01",
  "compatibility_flags": ["nodejs_compat"],
  "main": "./dist/_worker.js/index.js",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "observability": {
    "enabled": true
  },
  "upload_source_maps": true
}
```

## Internationalization Setup

### 1. Constants Configuration (src/lib/constants.ts)

```typescript
// Global application constants

// I18n configuration
export const hostname = process.env.PROD_SITE || 'localhost:4321';

// Allow override of languages via environment variable (comma-separated codes)
const envLangs = process.env.LANGUAGES;
let languages: string[];
if (envLangs) {
  languages = envLangs.split(',').map(l => l.trim()).filter(Boolean);
} else {
   languages = ['en', 'lt', 'ru']; // Customize your languages
}

export { languages };

// Import locales directly without await
import lt from '../locales/lt.json';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

export const locales: Record<string, any> = {
  'lt': lt,
  'en': en,
  'ru': ru,
} as const; 

// Determine defaultLang: 1) env var, 2) hostname TLD, 3) fallback
function getDefaultLang(): string {
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

export const defaultLang = getDefaultLang();

// Pages routes for url paths
export const PAGES = {
    HOME: '',
    ABOUT: 'about',
    CONTACT: 'contact',
    // Add your specific routes here
} as const;

// Breakpoint configuration
export const BREAKPOINTS = {
    xs: 376,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

// Page size constraints
export const PAGE_SIZES = {
    max: BREAKPOINTS['2xl'],
    min: BREAKPOINTS.xs,
} as const;
```

### 2. Utility Functions (src/lib/utils.ts)

```typescript
import { locales, defaultLang, languages } from './constants.js';

// Get translation for a given key and locale
export function getTranslation(key: string, locale: string = defaultLang): string {
  const keys = key.split('.');
  let value: any = locales[locale] || locales[defaultLang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

// Generate locale-aware path
export function getLocalePath(path: string, locale: string = defaultLang): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (locale === defaultLang) {
    return `/${cleanPath}`;
  }
  
  return `/${locale}/${cleanPath}`;
}

// Extract locale from URL path
export function getLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && languages.includes(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLang;
}

// Remove locale prefix from path
export function removeLocaleFromPath(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && languages.includes(firstSegment)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return path;
}
```

### 3. Locale Files

Create JSON files for each language in `src/locales/`:

**en.json:**
```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "contact": "Contact"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

**lt.json:**
```json
{
  "nav": {
    "home": "Pradžia",
    "about": "Apie",
    "contact": "Kontaktai"
  },
  "common": {
    "loading": "Kraunama...",
    "error": "Įvyko klaida"
  }
}
```

## Component Architecture

### 1. Base Layout (src/layouts/Layout.astro)

```astro
---
export interface Props {
  title: string;
  description?: string;
  locale?: string;
}

const { title, description, locale = 'en' } = Astro.props;
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  /* Global styles */
  html {
    font-family: system-ui, sans-serif;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
</style>
```

### 2. Page Structure

**Main pages (src/pages/index.astro, about.astro, contact.astro):**
```astro
---
import { defaultLang } from '../lib/constants.js';
import PageComponent from '../components/pages/page.index.astro';

// Redirect to default language
return Astro.redirect(`/${defaultLang}/`);
---
```

**Localized pages (src/pages/[locale]/index.astro):**
```astro
---
import Layout from '../../layouts/Layout.astro';
import { getTranslation } from '../../lib/utils.js';

const { locale } = Astro.params;
const title = getTranslation('page.home.title', locale);
---

<Layout title={title} locale={locale}>
  <!-- Page content -->
</Layout>
```

## Styling System

### 1. Global Styles (src/styles/global.css)

```css
/* CSS Custom Properties */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  
  /* Typography */
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--color-secondary);
}

/* Utility Classes */
.container {
  max-width: var(--breakpoint-xl);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .mobile-hidden {
    display: none;
  }
}

@media (min-width: 769px) {
  .desktop-hidden {
    display: none;
  }
}
```

### 2. Color System (src/lib/colors.ts)

```typescript
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    600: '#4b5563',
    900: '#111827',
  }
} as const;

export const CSS_COLOR_VARS = {
  '--color-primary': COLORS.primary[500],
  '--color-primary-dark': COLORS.primary[600],
  '--color-gray-light': COLORS.gray[100],
  '--color-gray': COLORS.gray[500],
  '--color-gray-dark': COLORS.gray[900],
} as const;
```

## Build and Deployment

### 1. Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run check

# Deploy to Cloudflare
npm run deploy
```

### 2. Environment Variables

Create a `.env` file for local development:

```env
# Production site URL
PROD_SITE=mydomain.com

# Supported languages (comma-separated)
LANGUAGES=en,lt,ru

# Default language
DEFAULT_LANG=en
```

### 3. Deployment Workflow

1. **Local Development:**
   ```bash
   npm run dev
   ```

2. **Build and Test:**
   ```bash
   npm run build
   npm run preview
   ```

3. **Type Check:**
   ```bash
   npm run check
   ```

4. **Deploy to Production:**
   ```bash
   npm run deploy
   ```

## Development Workflow

### 1. Creating New Pages

1. Create the main page file in `src/pages/` that redirects to default language
2. Create the localized version in `src/pages/[locale]/`
3. Add translations to locale JSON files
4. Update navigation components if needed

### 2. Adding New Components

1. Create component in appropriate directory (`controls/`, `sections/`, `pages/`)
2. Follow naming convention: `component-name.astro`
3. Add TypeScript props interface
4. Include necessary styling (scoped or global)

### 3. Internationalization

1. Add new translation keys to all locale JSON files
2. Use `getTranslation()` utility in components
3. Test all language versions
4. Update `getLocalePath()` for new routes

## Best Practices

### 1. Performance

- **Optimize Images:** Use Astro's image optimization features
- **Minimize JavaScript:** Keep client-side JS minimal
- **Use Static Generation:** Leverage Astro's SSG capabilities
- **Enable Compression:** Configure Cloudflare compression

### 2. SEO

- **Semantic HTML:** Use proper HTML5 semantic elements
- **Meta Tags:** Include proper meta descriptions and OpenGraph data
- **Sitemaps:** Use `@astrojs/sitemap` integration
- **Structured Data:** Add JSON-LD when appropriate

### 3. Accessibility

- **ARIA Labels:** Use proper ARIA attributes
- **Keyboard Navigation:** Ensure all interactive elements are keyboard accessible
- **Color Contrast:** Maintain WCAG AA contrast ratios
- **Screen Reader Support:** Test with screen readers

### 4. Code Organization

- **Component Composition:** Keep components small and focused
- **TypeScript:** Use strict TypeScript configuration
- **Constants:** Centralize configuration in constants file
- **Documentation:** Document complex logic and APIs

### 5. Deployment

- **Environment Variables:** Use environment-specific configurations
- **Preview Builds:** Always preview before deploying
- **Monitoring:** Enable Cloudflare observability
- **Source Maps:** Upload source maps for debugging

### 6. Testing

- **Type Checking:** Run TypeScript checks before deployment
- **Build Testing:** Test production builds locally
- **Cross-browser Testing:** Test on multiple browsers
- **Mobile Testing:** Verify responsive behavior

## Advanced Features

### 1. Progressive Enhancement

```typescript
// src/scripts/enhanced-navigation.ts
export function enhanceNavigation() {
  // Only run on client
  if (typeof window === 'undefined') return;
  
  // Add smooth scrolling
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('[data-smooth-scroll]')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
```

### 2. Dynamic Imports

```astro
---
// Lazy load heavy components
const HeavyComponent = import('../components/HeavyComponent.astro');
---

<div>
  {Astro.slots.render('heavy') && <HeavyComponent />}
</div>
```

### 3. API Routes

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get('email');
  
  // Process contact form
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
```

## Troubleshooting

### Common Issues

1. **Build Errors:**
   - Check TypeScript configuration
   - Verify all imports are correct
   - Ensure environment variables are set

2. **Deployment Issues:**
   - Verify Wrangler configuration
   - Check Cloudflare account permissions
   - Validate Worker size limits

3. **Internationalization Problems:**
   - Ensure all locale files have consistent structure
   - Check language codes match configuration
   - Verify routing setup

### Debugging Tips

- Use `npm run check` to validate before deployment
- Enable source maps for production debugging
- Test locally with `npm run preview`
- Monitor Cloudflare Workers analytics

---

This guide provides a solid foundation for creating performant, internationalized Astro websites with Cloudflare deployment. Customize the configurations and structure based on your specific project requirements.