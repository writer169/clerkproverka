'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// Replace this with your actual admin user ID from Clerk
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || 'your_admin_user_id_here';

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!userId) {
        // Redirect to sign-in if not authenticated
        router.push('/sign-in');
      } else if (userId !== ADMIN_USER_ID) {
        // Redirect to unauthorized page if not the admin user
        router.push('/unauthorized');
      } else {
        // User is authenticated and is the admin
        setIsAuthorized(true);
      }
    }
  }, [isLoaded, userId, router]);

  // Show loading while checking authentication
  if (!isLoaded || !isAuthorized) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель управления (Только для администратора)</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Добро пожаловать, Администратор!</h2>
        <p>Вы успешно авторизованы как администратор.</p>
      </div>
    </div>
  );
}