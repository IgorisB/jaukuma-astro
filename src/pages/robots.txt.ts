import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const isDev = url.hostname.includes('dev') || import.meta.env.DEV;
  
  const robotsTxt = isDev
    ? `User-agent: *
Disallow: /

Sitemap: https://www.jaukuma.lt/sitemap-index.xml`
    : `User-agent: *
Allow: /

Sitemap: https://www.jaukuma.lt/sitemap-index.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};