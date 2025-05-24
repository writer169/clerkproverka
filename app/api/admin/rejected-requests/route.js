import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';
import { getAppName } from '../../../../utils/appNames';
import { ADMIN_USER_ID } from '../../../../lib/config';

export async function GET() {
  try {
    // Проверяем аутентификацию
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    // Проверяем права администратора
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db('authapp');
    const collection = db.collection('auth_approvals');

    // Получаем отклоненные запросы, отсортированные по дате отклонения (новые сначала)
    const rejectedRequests = await collection
      .find({ status: 'rejected' })
      .sort({ rejectedAt: -1 })
      .toArray();

    // Преобразуем данные для фронтенда с правильной обработкой пользовательских данных
    const formattedRequests = rejectedRequests.map((request) => ({
      _id: request._id.toString(),
      userId: request.userId,
      email: request.userEmail || 'Не указан',
      firstName: request.userFirstName || '',
      lastName: request.userLastName || '',
      appId: request.appId,
      appName: getAppName(request.appId),
      status: request.status,
      requestedAt: request.requestedAt,
      approvedAt: request.approvedAt || null,
      rejectedAt: request.rejectedAt,
      rejectionReason: request.rejectionReason || 'Не указана'
    }));

    return NextResponse.json({
      requests: formattedRequests,
      count: formattedRequests.length
    });

  } catch (error) {
    console.error('Ошибка получения отклоненных запросов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}