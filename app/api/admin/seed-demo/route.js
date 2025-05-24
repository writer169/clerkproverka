import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '../../../../lib/mongodb';

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;

// Демо-данные для тестирования
const DEMO_REQUESTS = [
  {
    userId: 'user_demo_1',
    appId: 'weather',
    status: 'pending',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
    approvedAt: null
  },
  {
    userId: 'user_demo_2',
    appId: 'notes',
    status: 'pending',
    requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 часов назад
    approvedAt: null
  },
  {
    userId: 'user_demo_3',
    appId: 'tasks',
    status: 'pending',
    requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 день назад
    approvedAt: null
  },
  {
    userId: 'user_demo_4',
    appId: 'calendar',
    status: 'pending',
    requestedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 часа назад
    approvedAt: null
  },
  {
    userId: 'user_demo_5',
    appId: 'chat',
    status: 'pending',
    requestedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
    approvedAt: null
  }
];

export async function POST() {
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
    const db = client.db('authapp'); // Исправлено: убраны лишние кавычки
    const collection = db.collection('auth_approvals');

    // Очищаем старые демо-данные
    await collection.deleteMany({ 
      userId: { $regex: '^user_demo_' } 
    });

    // Добавляем новые демо-данные
    const result = await collection.insertMany(DEMO_REQUESTS);

    return NextResponse.json({ 
      success: true,
      message: `Добавлено ${result.insertedCount} демо-запросов`,
      insertedCount: result.insertedCount
    });

  } catch (error) {
    console.error('Ошибка добавления демо-данных:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}