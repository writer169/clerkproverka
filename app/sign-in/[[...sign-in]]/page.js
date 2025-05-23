'use client';

import { SignIn } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // useEffect должен быть ВНУТРИ компонента
  useEffect(() => {
    const checkAndRedirect = async () => {
      if (isLoaded && userId) {
        try {
          const response = await fetch('/api/auth/check-admin');
          const data = await response.json();

          if (data.isAdmin) {
            router.push('/dashboard');
          } else {
            router.push('/unauthorized');
          }
        } catch (error) {
          console.error('Ошибка проверки прав:', error);
          router.push('/unauthorized');
        }
      }
    };

    checkAndRedirect();
  }, [isLoaded, userId, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        // Убираем afterSignInUrl, чтобы использовать логику выше
      />
    </div>
  );
}