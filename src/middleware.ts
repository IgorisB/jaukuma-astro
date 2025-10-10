import { defineMiddleware } from 'astro/middleware';

// Simplified middleware that doesn't access request headers
export const onRequest = defineMiddleware(async (context, next) => {
  // Handle development environment without accessing request headers
  const isDev = context.url.hostname.includes('dev');
  
  const response = await next();
  
  // Add noindex header for development environments
  if (isDev) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  return response;
});
