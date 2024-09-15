import './globals.css';
import { ReactNode } from 'react';
import MainLayout from '../layouts/MainLayout';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {/* Wrap the content in AuthProvider to ensure useAuth has access */}
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
