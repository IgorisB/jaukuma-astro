import type { APIRoute } from 'astro';
export const prerender = true;
export const GET: APIRoute = ({ request }) => {
  
  console.log(`ROBOTS: ${import.meta.env.ROBOTS}`);
  
  const robotsTxt = `User-agent: *
${import.meta.env.ROBOTS || 'Disallow'}: /
Sitemap: https://www.jaukuma.lt/sitemap-index.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};