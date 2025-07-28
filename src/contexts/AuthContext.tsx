'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '@/lib/auth';
import { API_ROUTES } from '@/lib/constants';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Kullanıcı bilgilerini yenile
  const refreshUser = async () => {
    try {
      const response = await fetch(API_ROUTES.PROFILE, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          if (data.success) {
            const userData = {
              id: data.data.id,
              email: data.data.email,
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              role: data.data.role,
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            localStorage.removeItem('user');
          }
        } else {
          // Sadece beklenmeyen yanıt formatları için hata göster
          console.error('API yanıtı JSON değil:', await response.text());
          setUser(null);
        }
      } else {
        // 401 (Unauthorized) normal bir durum - kullanıcı giriş yapmamış
        // Sadece beklenmeyen hata kodları için console'a yazdır
        if (response.status !== 401) {
          console.error('Beklenmeyen API yanıt kodu:', response.status);
        }
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      // Network hataları vs. için hata göster
      console.error('Kullanıcı bilgileri alınamadı:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Giriş yapma
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(API_ROUTES.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        console.error('Giriş hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      return false;
    }
  };

  // Kayıt olma
  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch(API_ROUTES.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return true;
      } else {
        console.error('Kayıt hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      return false;
    }
  };

  // Çıkış yapma
  const logout = async () => {
    try {
      await fetch(API_ROUTES.LOGOUT, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Çıkış hatası:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // Sayfa yüklendiğinde localStorage'dan kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const checkStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Stored user varsa, server'dan güncel bilgileri al
          refreshUser();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Stored user data hatası:', error);
        localStorage.removeItem('user');
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}