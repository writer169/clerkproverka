// app/dashboard/page.js
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';

export default async function Dashboard() {
  // Получаем текущего пользователя
  const user = await currentUser();

  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl mb-4">Добро пожаловать, {user.firstName || 'Пользователь'}!</h2>
        <p>Вы успешно авторизованы с помощью Clerk.</p>
      </div>
    </div>
  );
}