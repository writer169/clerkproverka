'use client';

import { useState } from 'react';
import { Check, Clock, User, Calendar, Smartphone } from 'lucide-react';

export default function RequestCard({ request, onApprove }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await onApprove(request._id);
    } catch (error) {
      console.error('Ошибка одобрения:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return first + last || '?';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 hover:shadow-md transition-shadow duration-200">
      {/* Заголовок карточки */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {getInitials(request.firstName, request.lastName)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {request.firstName && request.lastName 
                ? `${request.firstName} ${request.lastName}`
                : 'Пользователь'
              }
            </h3>
            <p className="text-gray-600 text-xs truncate">{request.email}</p>
          </div>
        </div>
        <div className="flex items-center text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3 mr-1" />
          <span className="text-xs font-medium">Ожидает</span>
        </div>
      </div>

      {/* Информация о приложении */}
      <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded-lg">
        <Smartphone className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Приложение:</span>
        <span className="text-sm text-gray-900 font-semibold">{request.appName}</span>
      </div>

      {/* Дата запроса */}
      <div className="flex items-center space-x-2 mb-4 text-gray-600">
        <Calendar className="w-4 h-4" />
        <span className="text-xs">Запрос от {formatDate(request.requestedAt)}</span>
      </div>

      {/* Кнопка одобрения */}
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
          isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600 text-white active:bg-green-700'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <span>Обрабатывается...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Одобрить доступ</span>
          </>
        )}
      </button>
    </div>
  );
}