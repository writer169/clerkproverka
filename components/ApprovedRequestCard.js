'use client';

import { CheckCircle, X, User, Calendar, Globe, Clock } from 'lucide-react';
import { getAppName } from '../utils/appNames';

export default function ApprovedRequestCard({ request }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    if (request.status === 'approved') {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (request.status === 'rejected') {
      return <X className="w-5 h-5 text-red-500" />;
    }
    return <Clock className="w-5 h-5 text-orange-500" />;
  };

  const getStatusText = () => {
    if (request.status === 'approved') {
      return { text: 'Одобрен', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (request.status === 'rejected') {
      return { text: 'Отклонен', color: 'text-red-600', bg: 'bg-red-50' };
    }
    return { text: 'Ожидает', color: 'text-orange-600', bg: 'bg-orange-50' };
  };

  const statusInfo = getStatusText();

  return (
    <div className="border-b border-gray-200 last:border-b-0 p-4">
      <div className="flex flex-col space-y-3">
        {/* Заголовок и статус */}
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
                Доступ к: <strong>{getAppName(request.appId)}</strong>
              </span>
            </div>
          </div>

          {/* Статус */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
            {getStatusIcon()}
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Даты */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-1 sm:space-y-0 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Подан: {formatDate(request.createdAt)}</span>
          </div>
          
          {request.status === 'approved' && request.approvedAt && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Одобрен: {formatDate(request.approvedAt)}</span>
            </div>
          )}
          
          {request.status === 'rejected' && request.rejectedAt && (
            <div className="flex items-center space-x-2">
              <X className="w-4 h-4 text-red-500" />
              <span>Отклонен: {formatDate(request.rejectedAt)}</span>
            </div>
          )}
        </div>

        {/* Причина отказа */}
        {request.status === 'rejected' && request.rejectionReason && (
          <div className="bg-red-50 rounded-md p-3">
            <p className="text-sm text-red-800">
              <strong>Причина отказа:</strong> {request.rejectionReason}
            </p>
          </div>
        )}

        {/* Обоснование запроса */}
        {request.reason && (
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-600">
              <strong>Обоснование:</strong> {request.reason}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}