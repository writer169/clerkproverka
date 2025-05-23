'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Inbox, XCircle, Clock } from 'lucide-react';
import RequestCard from '../../components/RequestCard';
import ApprovedRequestCard from '../../components/ApprovedRequestCard';

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
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

  const fetchPendingRequests = useCallback(async () => {
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
      console.error('Ошибка загрузки ожидающих запросов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApprovedRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/approved-requests');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки данных');
      }

      setApprovedRequests(data.requests || []);
    } catch (err) {
      console.error('Ошибка загрузки одобренных запросов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRejectedRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/rejected-requests');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки данных');
      }

      setRejectedRequests(data.requests || []);
    } catch (err) {
      console.error('Ошибка загрузки отклоненных запросов:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentTabData = useCallback(() => {
    switch (activeTab) {
      case 'pending':
        return fetchPendingRequests();
      case 'approved':
        return fetchApprovedRequests();
      case 'rejected':
        return fetchRejectedRequests();
      default:
        return fetchPendingRequests();
    }
  }, [activeTab, fetchPendingRequests, fetchApprovedRequests, fetchRejectedRequests]);

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

      // Обновляем список текущей вкладки
      await fetchCurrentTabData();
    } catch (err) {
      console.error('Ошибка одобрения запроса:', err);
      setError(err.message);
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      const response = await fetch('/api/admin/reject-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: requestId, reason }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка отклонения запроса');
      }

      // Показываем сообщение об успехе
      setSuccessMessage('Запрос успешно отклонен!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Обновляем список текущей вкладки
      await fetchCurrentTabData();
    } catch (err) {
      console.error('Ошибка отклонения запроса:', err);
      setError(err.message);
    }
  };

  // Загружаем данные при смене вкладки
  useEffect(() => {
    if (isAuthorized) {
      fetchCurrentTabData();
    }
  }, [isAuthorized, activeTab, fetchCurrentTabData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'pending':
        return requests;
      case 'approved':
        return approvedRequests;
      case 'rejected':
        return rejectedRequests;
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'pending':
        return 'Ожидающие одобрения';
      case 'approved':
        return 'Одобренные запросы';
      case 'rejected':
        return 'Отклоненные запросы';
      default:
        return 'Запросы';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'pending':
        return 'Запросы пользователей на доступ к приложениям';
      case 'approved':
        return 'Ранее одобренные запросы на доступ';
      case 'rejected':
        return 'Отклоненные запросы с указанием причин';
      default:
        return '';
    }
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'pending':
        return {
          icon: <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />,
          title: 'Нет ожидающих запросов',
          description: 'Все запросы на доступ обработаны'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />,
          title: 'Нет одобренных запросов',
          description: 'Одобренные запросы будут отображаться здесь'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />,
          title: 'Нет отклоненных запросов',
          description: 'Отклоненные запросы будут отображаться здесь'
        };
      default:
        return {
          icon: <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />,
          title: 'Нет данных',
          description: ''
        };
    }
  };

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

  const currentRequests = getCurrentRequests();
  const emptyState = getEmptyStateContent();

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
                onClick={fetchCurrentTabData}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-md">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Ожидающие</p>
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
                <p className="text-sm font-medium text-gray-600">Одобренные</p>
                <p className="text-2xl font-bold text-gray-900">{approvedRequests.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-md">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Отклоненные</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedRequests.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Табы */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4" aria-label="Tabs">
              <button
                onClick={() => handleTabChange('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Ожидающие</span>
                  {requests.length > 0 && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {requests.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleTabChange('approved')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'approved'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Одобренные</span>
                  {approvedRequests.length > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {approvedRequests.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleTabChange('rejected')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'rejected'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4" />
                  <span>Отклоненные</span>
                  {rejectedRequests.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {rejectedRequests.length}
                    </span>
                  )}
                </div>
              </button>
            </nav>
          </div>

          {/* Заголовок активной вкладки */}
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {getTabTitle()}
            </h2>
            <p className="text-sm text-gray-600">
              {getTabDescription()}
            </p>
          </div>

          {/* Содержимое */}
          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка запросов...</p>
              </div>
            ) : currentRequests.length === 0 ? (
              <div className="text-center py-8">
                {emptyState.icon}
                <p className="text-gray-600 font-medium">{emptyState.title}</p>
                <p className="text-gray-500 text-sm">
                  {emptyState.description}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {currentRequests.map((request) => (
                  activeTab === 'pending' ? (
                    <RequestCard
                      key={request._id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ) : (
                    <ApprovedRequestCard
                      key={request._id}
                      request={request}
                    />
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}