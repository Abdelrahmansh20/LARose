import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export const findBestOffer = (items: CartItem[]) => {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let appliedOffer: string | null = null;
  let discountedTotal = subtotal;

  // Offer 1: Buy 4, Get 1 Free
  let buy4Get1FreeDiscount = 0;
  if (totalQuantity >= 5) {
    const allItems = items
      .flatMap(item => Array(item.quantity).fill(item))
      .sort((a, b) => a.price - b.price);
    const freeItemsCount = Math.floor(totalQuantity / 5);
    const freeItems = allItems.slice(0, freeItemsCount);
    buy4Get1FreeDiscount = freeItems.reduce((sum, item) => sum + item.price, 0);
  }

  // Offer 2: 15% Off
  const fifteenPercentOffDiscount = subtotal * 0.15;

  // Choose the best offer
  if (buy4Get1FreeDiscount > fifteenPercentOffDiscount && totalQuantity >= 5) {
    appliedOffer = "Buy 4, Get 1 Free";
    discountedTotal = subtotal - buy4Get1FreeDiscount;
  } else if (fifteenPercentOffDiscount > 0) {
    appliedOffer = "15% Off";
    discountedTotal = subtotal - fifteenPercentOffDiscount;
  }

  return { appliedOffer, discountedTotal };
};

interface CartState {
  items: CartItem[];
  appliedOffer: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  discount: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedOffer: null,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === newItem.id
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;

            const { appliedOffer } = findBestOffer(updatedItems);
            return { items: updatedItems, appliedOffer };
          } else {
            const updatedItems = [...state.items, { ...newItem, quantity: 1 }];
            const { appliedOffer } = findBestOffer(updatedItems);
            return { items: updatedItems, appliedOffer };
          }
        });
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          const { appliedOffer } = findBestOffer(updatedItems);
          return { items: updatedItems, appliedOffer };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity < 1) {
            const updatedItems = state.items.filter((item) => item.id !== id);
            const { appliedOffer } = findBestOffer(updatedItems);
            return { items: updatedItems, appliedOffer };
          }

          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          
          const { appliedOffer } = findBestOffer(updatedItems);
          return { items: updatedItems, appliedOffer };
        });
      },

      clearCart: () => set({ items: [], appliedOffer: null }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      discount: () => {
        const subtotal = get().subtotal();
        const { discountedTotal } = findBestOffer(get().items);
        return subtotal - discountedTotal;
      },

      total: () => {
        const { discountedTotal } = findBestOffer(get().items);
        return discountedTotal;
      },
    }),
    {
      name: 'larose-cart',
    }
  )
);