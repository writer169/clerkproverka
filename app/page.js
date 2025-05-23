'use client';

import Link from 'next/link';
import { Shield, Users, Settings, ArrowRight } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID || 'your_admin_user_id_here';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Если пользователь авторизован и является админом, перенаправляем в панель
    if (isLoaded && userId === ADMIN_USER_ID) {
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Административная панель
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Система управления авторизацией для контроля доступа пользователей к приложениям
            </p>
          </div>

          {/* Карточки функций */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Управление пользователями
              </h3>
              <p className="text-gray-600 text-sm">
                Просматривайте и обрабатывайте запросы пользователей на доступ к приложениям
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Безопасный доступ
              </h3>
              <p className="text-gray-600 text-sm">
                Контролируйте доступ к системе с помощью надёжной аутентификации через Clerk
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Простое управление
              </h3>
              <p className="text-gray-600 text-sm">
                Интуитивный интерфейс для быстрого одобрения или отклонения запросов
              </p>
            </div>
          </div>

          {/* Основная карточка */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Начать работу
                </h2>
                <p className="text-gray-600 mb-6">
                  Войдите в систему для доступа к панели администратора
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 min-w-[140px]"
                  >
                    Войти
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 min-w-[140px]"
                  >
                    Регистрация
                  </Link>
                </div>
              </div>

              {/* Предупреждение для администраторов */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">
                      Только для администраторов
                    </h4>
                    <p className="text-sm text-amber-700">
                      Доступ к панели управления имеют только пользователи с правами администратора. 
                      Если у вас нет соответствующих прав, вы будете перенаправлены на страницу с 
                      уведомлением о недостатке полномочий.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Система работает на базе Next.js, MongoDB и Clerk для обеспечения 
              надёжной аутентификации и безопасности данных
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}