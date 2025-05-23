import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';
import { getAppName } from '../../../../utils/appNames';

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

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
    const db = client.db('your_database_name');
    const collection = db.collection('auth_approvals');

    const pendingRequests = await collection
      .find({ status: 'pending' })
      .sort({ requestedAt: -1 })
      .toArray();

    const requestsWithUserInfo = await Promise.all(
      pendingRequests.map(async (request) => {
        try {
          const user = await currentUser();
          if (user?.id !== request.userId) {
            throw new Error('User not found or mismatch');
          }
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