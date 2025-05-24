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

    // Получаем одобренные запросы, отсортированные по дате одобрения (новые сначала)
    const approvedRequests = await collection
      .find({ status: 'approved' })
      .sort({ approvedAt: -1 })
      .toArray();

    // Преобразуем данные для фронтенда с правильной обработкой пользовательских данных
    const formattedRequests = approvedRequests.map((request) => ({
      _id: request._id.toString(),
      userId: request.userId,
      email: request.userEmail || 'Не указан',
      firstName: request.userFirstName || '',
      lastName: request.userLastName || '',
      appId: request.appId,
      appName: getAppName(request.appId),
      status: request.status,
      requestedAt: request.requestedAt,
      approvedAt: request.approvedAt,
      rejectedAt: request.rejectedAt || null,
      rejectionReason: request.rejectionReason || null
    }));

    return NextResponse.json({
      requests: formattedRequests,
      count: formattedRequests.length
    });

  } catch (error) {
    console.error('Ошибка получения одобренных запросов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}