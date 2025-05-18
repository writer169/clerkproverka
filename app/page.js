// app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>My Clerk App</h1>
      <p>Please <Link href="/sign-in">sign in</Link> or <Link href="/sign-up">sign up</Link>.</p>
    </div>
  );
}