import { defineMiddleware } from 'astro/middleware';

// Middleware for handling any future server-side logic
export const onRequest = defineMiddleware(async (context, next) => {
  // Continue with the normal request processing
  return next();
});