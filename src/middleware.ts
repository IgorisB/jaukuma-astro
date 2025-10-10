import { defineMiddleware } from 'astro/middleware';

// Middleware for handling domain-level redirects and server-side logic
export const onRequest = defineMiddleware(async (context, next) => {
  const host = context.request.headers.get('host');
  const url = new URL(context.request.url);
  
  // Redirect non-www to www for production
  if (host && host === 'jaukuma.lt') {
    url.host = 'www.jaukuma.lt';
    return context.redirect(url.toString(), 301);
  }
  
  // Handle development environment
  const isDev = context.locals.runtime?.env?.NODE_ENV === 'development' || 
                context.url.hostname.includes('dev');
  
  const response = await next();
  
  if (isDev) {
    // Add noindex header to prevent search engine indexing
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  return response;
});