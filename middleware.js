// middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';

// Защищаем все маршруты, кроме указанных в publicRoutes
export default clerkMiddleware({
  // Публичные маршруты, доступные без авторизации
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: [
    // Применять middleware ко всем маршрутам, кроме статических файлов и _next
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};