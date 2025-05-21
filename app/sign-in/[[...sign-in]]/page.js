// app/sign-in/[[...sign-in]]/page.js
import { SignIn } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  // Проверяем, авторизован ли пользователь
  const user = await currentUser();
  
  // Если пользователь уже авторизован, перенаправляем на страницу dashboard
  if (user) {
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