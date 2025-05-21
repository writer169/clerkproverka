// app/sign-up/[[...sign-up]]/page.js
import { SignUp } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function SignUpPage() {
  // Проверяем, авторизован ли пользователь
  const user = await currentUser();
  
  // Если пользователь уже авторизован, перенаправляем на страницу dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUp 
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
}