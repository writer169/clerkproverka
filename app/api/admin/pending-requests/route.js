import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';
import { getAppName } from '../../../../utils/appNames';
import { ADMIN_USER_ID } from '../../../../lib/config';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('authapp');
    const collection = db.collection('auth_approvals');

    const pendingRequests = await collection
      .find({ status: 'pending' })
      .sort({ requestedAt: -1 })
      .toArray();

    // Преобразуем данные для фронтенда
    const formattedRequests = pendingRequests.map((request) => ({
      _id: request._id.toString(),
      userId: request.userId,
      email: request.userEmail || 'Не указан',
      firstName: request.userFirstName || '',
      lastName: request.userLastName || '',
      appId: request.appId,
      appName: getAppName(request.appId),
      status: request.status,
      requestedAt: request.requestedAt,
      approvedAt: request.approvedAt
    }));

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Ошибка получения ожидающих запросов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}