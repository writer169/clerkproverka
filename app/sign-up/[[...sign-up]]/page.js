// app/sign-up/[[...sign-up]]/page.js
import { SignUp } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function SignUpPage() {
  // Используем auth() вместо currentUser()
  const { userId } = auth();
  
  // Если пользователь уже авторизован, перенаправляем на страницу dashboard
  if (userId) {
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