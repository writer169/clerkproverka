'use client';

import Link from 'next/link';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h1>
        <p className="mb-6">У вас нет прав для просмотра панели управления. Эта страница доступна только администраторам.</p>
        <Link 
          href="/" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}