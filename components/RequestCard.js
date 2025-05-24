'use client';

import { useState } from 'react';
import { Check, X, User, Mail, Calendar, Clock } from 'lucide-react';

export default function RequestCard({ request, onApprove, onReject }) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(request._id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Пожалуйста, укажите причину отклонения');
      return;
    }

    setIsProcessing(true);
    try {
      await onReject(request._id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = () => {
    const { firstName, lastName, email } = request;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) {
      return firstName;
    }
    
    if (lastName) {
      return lastName;
    }
    
    return email || 'Неизвестный пользователь';
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Информация о пользователе */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getUserDisplayName()}
                </h3>
                {request.email && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    <span>{request.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Информация о запросе */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Приложение:</span>
                <span className="text-sm text-gray-900 font-semibold">
                  {request.appName}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">ID приложения:</span>
                <span className="text-sm text-gray-600 font-mono">
                  {request.appId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Дата запроса:</span>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(request.requestedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Статус:</span>
                <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3" />
                  <span>Ожидает рассмотрения</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Действия */}
        <div className="mt-4 flex items-center justify-end space-x-3">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
            <span>Отклонить</span>
          </button>
          
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Обработка...' : 'Одобрить'}</span>
          </button>
        </div>
      </div>

      {/* Модальное окно для отклонения */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Отклонить запрос
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Вы отклоняете запрос пользователя <strong>{getUserDisplayName()}</strong> на доступ к приложению <strong>{request.appName}</strong>.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Причина отклонения:
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Укажите причину отклонения запроса..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={isProcessing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Отмена
              </button>
              
              <button
                onClick={handleReject}
                disabled={isProcessing || !rejectReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Отклонение...' : 'Отклонить запрос'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}