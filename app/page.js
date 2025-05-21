// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">My Clerk App</h1>
        <p className="mb-6 text-center">
          Пожалуйста, <Link href="/sign-in" className="text-blue-600 hover:underline">войдите</Link> или <Link href="/sign-up" className="text-blue-600 hover:underline">зарегистрируйтесь</Link>.
        </p>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-700">
            Обратите внимание, что доступ к панели управления имеет только администратор. 
            Если вы не администратор, вы не сможете получить доступ к панели управления.
          </p>
        </div>
      </div>
    </div>
  );
}