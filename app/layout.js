// app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata = {
  title: 'My Clerk App',
  description: 'Next.js app with Clerk authentication',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}