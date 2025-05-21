// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

// Самая простая конфигурация middleware без дополнительных настроек
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};