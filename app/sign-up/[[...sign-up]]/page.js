'use client';

import { SignUp } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // useEffect должен быть ВНУТРИ компонента (такой же как в sign-in)
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
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        // Убираем afterSignUpUrl, чтобы использовать логику выше
      />
    </div>
  );
}