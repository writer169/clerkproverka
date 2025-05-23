'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Inbox } from 'lucide-react';
import RequestCard from '../../components/RequestCard';

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // useEffect для проверки авторизации должен быть ВНУТРИ компонента
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isLoaded) {
        if (!userId) {
          router.push('/sign-in');
          return;
        }

        try {
          const response = await fetch('/api/auth/check-admin');
          const data = await response.json();

          if (!data.isAdmin) {
            router.push('/unauthorized');
          } else {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error('Ошибка проверки прав:', error);
          router.push('/unauthorized');
        }
      }
    };

    checkAdminAccess();
  }, [isLoaded, userId, router]);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/pending-requests');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки данных');
      }

      setRequests(data.requests || []);
    } catch (err) {
      console.error('Ошибка загрузки запросов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch('/api/admin/approve-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка одобрения запроса');
      }

      // Показываем сообщение об успехе
      setSuccessMessage('Запрос успешно одобрен!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Обновляем список запросов
      await fetchRequests();
    } catch (err) {
      console.error('Ошибка одобрения запроса:', err);
      setError(err.message);
    }
  };

  // Загружаем запросы при авторизации
  useEffect(() => {
    if (isAuthorized) {
      fetchRequests();
    }
  }, [isAuthorized, fetchRequests]);

  // Показываем загрузку пока проверяем авторизацию
  if (!isLoaded || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Панель администратора
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Управление запросами на доступ к приложениям
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchRequests}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Обновить</span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Уведомления */}
        {successMessage && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-green-800 text-sm font-medium">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-md">
                <Inbox className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ожидающие запросы</p>
                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Статус системы</p>
                <p className="text-sm font-bold text-green-600">Активна</p>
              </div>
            </div>
          </div>
        </div>

        {/* Список запросов */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ожидающие одобрения
            </h2>
            <p className="text-sm text-gray-600">
              Запросы пользователей на доступ к приложениям
            </p>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка запросов...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Нет ожидающих запросов</p>
                <p className="text-gray-500 text-sm">
                  Все запросы на доступ обработаны
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}