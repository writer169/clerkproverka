import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb';
import { ADMIN_USER_ID } from '../../../../lib/config';

export async function POST(request) {
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

    // Получаем данные из запроса
    const body = await request.json();
    const { id, reason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Отсутствует ID запроса' }, { status: 400 });
    }

    // Подключаемся к MongoDB
    const client = await clientPromise;
    const db = client.db('authapp');
    const collection = db.collection('auth_approvals');

    // Проверяем существование запроса
    const existingRequest = await collection.findOne({
      _id: new ObjectId(id),
      status: 'pending'
    });

    if (!existingRequest) {
      return NextResponse.json({
        error: 'Запрос не найден или уже обработан'
      }, { status: 404 });
    }

    // Обновляем статус запроса
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: reason || 'Не указана'
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        error: 'Не удалось обновить запрос'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Запрос успешно отклонен'
    });

  } catch (error) {
    console.error('Ошибка отклонения запроса:', error);

    if (error.name === 'BSONError') {
      return NextResponse.json({
        error: 'Неверный формат ID'
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}