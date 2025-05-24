'use client';

import { User, Mail, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ApprovedRequestCard({ request }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
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

  const getStatusInfo = () => {
    switch (request.status) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Одобрен',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          date: request.approvedAt,
          dateLabel: 'Дата одобрения:'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: 'Отклонен',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          date: request.rejectedAt,
          dateLabel: 'Дата отклонения:'
        };
      default:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          label: 'Неизвестно',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          date: null,
          dateLabel: 'Дата:'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Информация о пользователе */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                request.status === 'approved' ? 'bg-green-100' : 
                request.status === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                <User className={`w-5 h-5 ${
                  request.status === 'approved' ? 'text-green-600' : 
                  request.status === 'rejected' ? 'text-red-600' : 'text-gray-600'
                }`} />
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
              <span className="text-sm font-medium text-gray-700">{statusInfo.dateLabel}</span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(statusInfo.date)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Статус:</span>
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </span>
            </div>

            {/* Причина отклонения для отклоненных запросов */}
            {request.status === 'rejected' && request.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm font-medium text-red-800 mb-1">Причина отклонения:</p>
                <p className="text-sm text-red-700">{request.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}