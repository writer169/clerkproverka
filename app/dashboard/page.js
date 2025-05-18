// app/dashboard/page.js
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <p>You are authenticated with Clerk.</p>
      <SignOutButton />
    </div>
  );
}