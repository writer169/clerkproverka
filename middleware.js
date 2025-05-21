// middleware.js
import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
  // или используйте ignoredRoutes для путей, которые не нуждаются в проверке аутентификации
  // ignoredRoutes: ["/((?!api|trpc))(_next|.+\..+)(.*)"],
});

export const config = {
  matcher: [
    // Применять middleware ко всем маршрутам, кроме статических файлов и _next
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};