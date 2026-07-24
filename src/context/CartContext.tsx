import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';

export type CartItem = {
  id: number;
  name: string;
  material: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  cartTotal: number;
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartStorageKey = (email: string) => `drimayko-cart-${email}`;

const readStoredCart = (email: string): CartItem[] => {
  try {
    const raw = localStorage.getItem(cartStorageKey(email));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredCart = (email: string, items: CartItem[]) => {
  localStorage.setItem(cartStorageKey(email), JSON.stringify(items));
};

const mergeCarts = (saved: CartItem[], guest: CartItem[]): CartItem[] => {
  const map = new Map<number, CartItem>();

  saved.forEach((item) => {
    map.set(item.id, { ...item });
  });

  guest.forEach((item) => {
    const existing = map.get(item.id);
    if (existing) {
      map.set(item.id, { ...existing, quantity: existing.quantity + item.quantity });
    } else {
      map.set(item.id, { ...item });
    }
  });

  return Array.from(map.values());
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    user?.email ? readStoredCart(user.email) : [],
  );
  const previousEmailRef = useRef<string | null>(user?.email ?? null);

  useEffect(() => {
    const email = user?.email ?? null;

    if (email === previousEmailRef.current) return;

    if (email) {
      const saved = readStoredCart(email);
      setCartItems((guestItems) => {
        if (previousEmailRef.current === null && guestItems.length > 0) {
          return mergeCarts(saved, guestItems);
        }
        return saved;
      });
    } else if (previousEmailRef.current) {
      setCartItems([]);
    }

    previousEmailRef.current = email;
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    writeStoredCart(user.email, cartItems);
  }, [cartItems, user?.email]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>) => {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.id === product.id);
      if (existingItem) {
        return items.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(
    () => ({ cartItems, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }),
    [cartItems, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
