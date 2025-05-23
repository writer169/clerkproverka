import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ADMIN_USER_ID } from '../../../../lib/config';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        isAuthenticated: false, 
        isAdmin: false 
      }, { status: 401 });
    }

    const isAdmin = userId === ADMIN_USER_ID;

    return NextResponse.json({ 
      isAuthenticated: true, 
      isAdmin,
      userId: isAdmin ? userId : null // Возвращаем ID только если админ
    });

  } catch (error) {
    console.error('Ошибка проверки прав:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}