import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, findBestOffer } from '../lib/utils';

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
            // Item already exists, increment quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += 1;

            const { appliedOffer } = findBestOffer(updatedItems);
            return { items: updatedItems, appliedOffer };
          } else {
            // Add new item with quantity of 1
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