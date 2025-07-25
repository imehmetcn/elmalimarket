'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sepet bilgilerini yenile
  const refreshCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setItems(data.data.items || []);
        setTotalItems(data.data.totalItems || 0);
        setTotalAmount(data.data.totalAmount || 0);
      }
    } catch (error) {
      console.error('Sepet bilgileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sepete ürün ekleme
  const addToCart = async (productId: string, quantity: number = 1): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCart();
        return true;
      } else {
        console.error('Sepete ekleme hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Sepete ekleme hatası:', error);
      return false;
    }
  };

  // Sepet öğesi miktarını güncelleme
  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await response.json();

      if (data.success) {
        await refreshCart();
        return true;
      } else {
        console.error('Sepet güncelleme hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Sepet güncelleme hatası:', error);
      return false;
    }
  };

  // Sepetten ürün çıkarma
  const removeFromCart = async (itemId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/remove?itemId=${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        await refreshCart();
        return true;
      } else {
        console.error('Sepetten çıkarma hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Sepetten çıkarma hatası:', error);
      return false;
    }
  };

  // Sepeti temizleme
  const clearCart = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        await refreshCart();
        return true;
      } else {
        console.error('Sepet temizleme hatası:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Sepet temizleme hatası:', error);
      return false;
    }
  };

  // Sayfa yüklendiğinde sepet bilgilerini al
  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    items,
    totalItems,
    totalAmount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}