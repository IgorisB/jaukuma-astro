import { defineMiddleware } from 'astro/middleware';
import { isDevelopment } from  './lib/constants.ts';

// Middleware for static site to add noindex header for development environments
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  console.log("IsDevelopment:", isDevelopment);
  // Add noindex header for development environments
  // Using the helper function which works in both server and static contexts
  if (isDevelopment) {
    response.headers.set('X-Robots-Tag','noindex, nofollow');
  }
  
  return response;
});