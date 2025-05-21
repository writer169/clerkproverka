// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

// Без дополнительной конфигурации, но с указанием публичных маршрутов
const publicRoutes = [
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
];

export default clerkMiddleware({
  publicRoutes: publicRoutes,
  // При отсутствии аутентификации перейти на страницу sign-in
  // Пример использования с redirection, если оно поддерживается вашей версией
  // afterAuth(auth, req) {
  //   if (!auth.userId && !publicRoutes.some(pattern => 
  //     new RegExp(`^${pattern.replace(/\(.*\)/g, '.*')}$`).test(req.url.pathname)
  //   )) {
  //     return Response.redirect(new URL('/sign-in', req.url));
  //   }
  // }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|.*\\..*|api|trpc).*)',
    '/',
  ],
};