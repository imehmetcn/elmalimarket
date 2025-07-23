'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@prisma/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = ROUTES.LOGIN,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Kullanıcı giriş yapmamış
        router.push(redirectTo);
        return;
      }

      if (requireAdmin && user.role !== UserRole.ADMIN) {
        // Admin yetkisi gerekli ama kullanıcı admin değil
        router.push(ROUTES.HOME);
        return;
      }
    }
  }, [user, loading, requireAdmin, redirectTo, router]);

  // Loading durumunda spinner göster
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamış
  if (!user) {
    return null; // useEffect redirect yapacak
  }

  // Admin yetkisi gerekli ama kullanıcı admin değil
  if (requireAdmin && user.role !== UserRole.ADMIN) {
    return null; // useEffect redirect yapacak
  }

  // Her şey yolunda, children'ı render et
  return <>{children}</>;
}