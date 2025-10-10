import { defineMiddleware } from 'astro/middleware';

// Middleware to handle redirects and environment-specific logic
export const onRequest = defineMiddleware(async (context, next) => {
  // Only run this middleware on the server side
  if (import.meta.env.SSR) {
    const host = context.request.headers.get('host');
    
    // In production, redirect non-www to www
    if (host === 'jaukuma.lt') {
      const url = new URL(context.request.url);
      url.hostname = 'www.jaukuma.lt';
      return context.redirect(url.toString(), 301);
    }
  }
  
  // Continue with the normal request processing
  return next();
});