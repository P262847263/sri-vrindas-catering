import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuItem } from '../types';

export interface CartItem {
  item: MenuItem;
  quantity: number;
  // optional customization options collected from menu pages
  customization?: {
    notes?: string;
    [k: string]: any;
  } | null;
}

interface CartContextType {
  cart: CartItem[];
  // item may include an optional `customization` field when coming from customization dialog
  addToCart: (item: MenuItem & { customization?: any }) => void;
  // remove by id; if `customization` provided, only remove the matching entry (allow same item with different options)
  removeFromCart: (id: string, customization?: any) => void;
  changeQuantity: (id: string, delta: number, customization?: any) => void;
  clearCart: () => void;
  // control cart sidebar
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const savePendingAndRedirectToLogin = (pending: any, redirectPath = '/') => {
    try { sessionStorage.setItem('pendingCartAction', JSON.stringify(pending)); } catch (e) { console.warn('failed to save pendingCartAction', e); }
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const areCustomizationsEqual = (a: any, b: any) => {
    try {
      if (!a && !b) return true;
      return JSON.stringify(a || null) === JSON.stringify(b || null);
    } catch {
      return false;
    }
  };

  const addToCart = (item: MenuItem & { customization?: any }) => {
    // require login for mutating cart
    const token = localStorage.getItem('token');
    if (!token) {
      // Save the intended action and redirect to login
      savePendingAndRedirectToLogin({ type: 'add', item }, window.location.pathname || '/');
      return;
    }
    setCart((prev) => {
      const found = prev.find((ci) => ci.item._id === item._id && areCustomizationsEqual(ci.customization, (item as any).customization));
      if (found) {
        return prev.map((ci) =>
          ci.item._id === item._id && areCustomizationsEqual(ci.customization, (item as any).customization)
            ? { ...ci, quantity: ci.quantity + 1 }
            : ci
        );
      }
      return [...prev, { item, quantity: 1, customization: (item as any).customization || null }];
    });
  };

  const changeQuantity = (id: string, delta: number, customization?: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // save intent and redirect
      savePendingAndRedirectToLogin({ type: 'change', id, delta, customization }, window.location.pathname || '/');
      return;
    }
    setCart((prev) => {
      // When customization unspecified, prefer the entry without customization (default)
      let targetIndex = -1;
      if (customization !== undefined) {
        targetIndex = prev.findIndex((ci) => ci.item._id === id && areCustomizationsEqual(ci.customization, customization));
      } else {
        // prefer explicit null customization entry
        targetIndex = prev.findIndex((ci) => ci.item._id === id && (ci.customization === null || ci.customization === undefined));
        if (targetIndex === -1) {
          // fallback to first matching id
          targetIndex = prev.findIndex((ci) => ci.item._id === id);
        }
      }
      if (targetIndex === -1) return prev;
      const updated = [...prev];
      const newQty = updated[targetIndex].quantity + delta;
      if (newQty <= 0) {
        updated.splice(targetIndex, 1);
        return updated;
      }
      updated[targetIndex] = { ...updated[targetIndex], quantity: newQty };
      return updated;
    });
  };

  const removeFromCart = (id: string, customization?: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      savePendingAndRedirectToLogin({ type: 'remove', id, customization }, window.location.pathname || '/');
      return;
    }
    setCart((prev) => {
      if (customization === undefined) return prev.filter((ci) => ci.item._id !== id);
      // remove only entries that match both id and customization
      return prev.filter((ci) => !(ci.item._id === id && areCustomizationsEqual(ci.customization, customization)));
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart, cartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
