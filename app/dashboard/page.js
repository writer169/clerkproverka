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
      {