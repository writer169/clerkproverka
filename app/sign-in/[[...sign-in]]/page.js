'use client';

import { SignIn } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || 'your_admin_user_id_here';

export default function SignInPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      // Проверяем права администратора и перенаправляем соответственно
      if (userId === ADMIN_USER_ID) {
        router.push('/dashboard');
      } else {
        router.push('/unauthorized');
      }
    }
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