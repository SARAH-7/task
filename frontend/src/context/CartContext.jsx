import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { menuItemId, name, price, quantity = 1 } = action.payload;
      const existing = state.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        return state.map((i) =>
          i.menuItemId === menuItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...state, { menuItemId, name, price, quantity }];
    }
    case 'SET_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((i) => i.menuItemId !== menuItemId);
      }
      return state.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      );
    }
    case 'REMOVE':
      return state.filter((i) => i.menuItemId !== action.payload.menuItemId);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

const CART_STORAGE_KEY = 'food_delivery_cart';

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {}
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    dispatch({
      type: 'ADD',
      payload: {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
      },
    });
  };

  const setQuantity = (menuItemId, quantity) => {
    dispatch({ type: 'SET_QUANTITY', payload: { menuItemId, quantity } });
  };

  const removeFromCart = (menuItemId) => {
    dispatch({ type: 'REMOVE', payload: { menuItemId } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        setQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
