'use client';

import { useState } from 'react';
import { CheckCircle, X, User, Calendar, Globe, AlertTriangle } from 'lucide-react';
import { getAppName } from '../utils/appNames';

export default function RequestCard({ request, onApprove, onReject }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApprove(request._id);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject(request._id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setIsRejecting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50 transition-colors">
        <div className="flex flex-col space-y-3">
          {/* Заголовок и основная информация */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {request.userEmail}
                </span>
                <span className="text-sm text-gray-500">
                  ({request.userName})
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Запрос доступа к: <strong>{getAppName(request.appId)}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Подан: {formatDate(request.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          {request.reason && (
            <div className="bg-gray-50 rounded-md p-3">
              <p className="text-sm text-gray-600">
                <strong>Обоснование:</strong> {request.reason}
              </p>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleApprove}
              disabled={isApproving || isRejecting}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isApproving ? 'Одобряется...' : 'Одобрить'}</span>
            </button>
            
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isApproving || isRejecting}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Отказать</span>
            </button>
          </div>
        </div>
      </div>

      {/* Модальное окно для отказа */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Отклонить запрос
                </h3>
                <p className="text-sm text-gray-500">
                  Пользователь: {request.userEmail}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-2">
                Причина отказа (необязательно)
              </label>
              <textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Укажите причину отказа..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                disabled={isRejecting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isRejecting ? 'Отклоняется...' : 'Отклонить запрос'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}