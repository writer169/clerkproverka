'use client';

import Link from 'next/link';
import { Shield, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Анимированная иконка */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-pulse"></div>
            <div className="relative p-6 bg-red-100 rounded-full">
              <Shield className="w-16 h-16 text-red-600 mx-auto" />
            </div>
          </div>
        </div>

        {/* Основная карточка */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Заголовок */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-500" />
                <h1 className="text-2xl font-bold text-red-600">
                  Доступ запрещён
                </h1>
              </div>
              <p className="text-gray-600 leading-relaxed">
                У вас недостаточно прав для просмотра административной панели. 
                Эта страница доступна только пользователям с правами администратора.
              </p>
            </div>

            {/* Информационный блок */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Что это означает?
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Ваша учётная запись не имеет административных прав</li>
                <li>• Доступ к панели управления ограничен</li>
                <li>• Обратитесь к администратору для получения доступа</li>
              </ul>
            </div>

            {/* Кнопки действий */}
            <div className="space-y-3">
              <Link 
                href="/" 
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Link>
              
              <Link 
                href="/sign-in" 
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Войти другой учётной записью
              </Link>
            </div>
          </div>

          {/* Нижняя полоса */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Если вы считаете, что получили это сообщение по ошибке, 
              обратитесь к системному администратору
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Код ошибки: 403 - Недостаточно прав доступа
          </p>
        </div>
      </div>
    </div>
  );
}