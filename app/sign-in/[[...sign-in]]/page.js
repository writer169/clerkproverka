// app/sign-in/[[...sign-in]]/page.js
import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function SignInPage() {
  // Используем auth() вместо currentUser()
  const { userId } = auth();
  
  // Если пользователь уже авторизован, перенаправляем на страницу dashboard
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
}