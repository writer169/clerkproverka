import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
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

    const requestsWithUserInfo = await Promise.all(
      pendingRequests.map(async (request) => {
        try {
          // Получаем пользователя по ID из запроса
          const user = await clerkClient.users.getUser(request.userId);
          
          return {
            _id: request._id.toString(),
            userId: request.userId,
            email: user?.emailAddresses[0]?.emailAddress || 'Неизвестно',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            appId: request.appId,
            appName: getAppName(request.appId),
            status: request.status,
            requestedAt: request.requestedAt,
            approvedAt: request.approvedAt
          };
        } catch (error) {
          console.error('Ошибка получения пользователя:', error);
          return {
            _id: request._id.toString(),
            userId: request.userId,
            email: 'Ошибка загрузки',
            firstName: '',
            lastName: '',
            appId: request.appId,
            appName: getAppName(request.appId),
            status: request.status,
            requestedAt: request.requestedAt,
            approvedAt: request.approvedAt
          };
        }
      })
    );

    return NextResponse.json({ requests: requestsWithUserInfo });
  } catch (error) {
    console.error('Ошибка получения ожидающих запросов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}