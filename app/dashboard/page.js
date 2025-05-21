'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  // Показываем заглушку, пока проверяем авторизацию
  if (!isLoaded || !userId) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Добро пожаловать!</h2>
        <p>Вы успешно авторизованы с помощью Clerk.</p>
      </div>
    </div>
  );
}