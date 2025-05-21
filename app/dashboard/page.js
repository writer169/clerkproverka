// app/dashboard/page.js
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  // Используем auth() вместо currentUser()
  const { userId } = auth();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!userId) {
    redirect('/sign-in');
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