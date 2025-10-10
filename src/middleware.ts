import { defineMiddleware } from 'astro/middleware';

// Middleware for handling any future server-side logic
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Check if we're in development mode
  const isDev = context.locals.runtime?.env?.NODE_ENV === 'development' || 
                context.url.hostname.includes('dev');
  
  if (isDev) {
    // Add noindex header to prevent search engine indexing
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  return response;
});