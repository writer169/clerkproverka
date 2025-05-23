import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';
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
    const requests = await collection
      .find({ status: 'approved' })
      .sort({ approvedAt: -1 })
      .toArray();

    return NextResponse.json({
      requests,
      count: requests.length
    });

  } catch (error) {
    console.error('Ошибка получения одобренных запросов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}