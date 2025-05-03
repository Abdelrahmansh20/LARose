import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Calculate discount based on offer type
export function applySpecialOffer(
  cartItems: CartItem[],
  offerType: 'percent15' | 'buy4get1' | null
): { discountedTotal: number; savings: number; appliedOffer: string | null } {
  if (!cartItems.length) {
    return { discountedTotal: 0, savings: 0, appliedOffer: null };
  }

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (offerType === 'percent15') {
    const discountedTotal = originalTotal * 0.85;
    return {
      discountedTotal,
      savings: originalTotal - discountedTotal,
      appliedOffer: '15% Off',
    };
  }

  if (offerType === 'buy4get1' && cartItems.length >= 5) {
    // Sort items by price and get the 5 most expensive ones
    const sortedItems = [...cartItems].sort((a, b) => b.price - a.price);
    const top5Items = sortedItems.slice(0, 5);
    
    // If we have 5 or more items, get the price of the 5th most expensive item (free)
    if (top5Items.length >= 5) {
      const freeItemPrice = top5Items[4].price;
      return {
        discountedTotal: originalTotal - freeItemPrice,
        savings: freeItemPrice,
        appliedOffer: 'Buy 4 Get 1 Free',
      };
    }
  }

  return { discountedTotal: originalTotal, savings: 0, appliedOffer: null };
}

// Find the best offer for the current cart
export function findBestOffer(cartItems: CartItem[]): {
  discountedTotal: number;
  savings: number;
  appliedOffer: string | null;
} {
  const percent15 = applySpecialOffer(cartItems, 'percent15');
  const buy4get1 = applySpecialOffer(cartItems, 'buy4get1');

  if (buy4get1.savings >= percent15.savings) {
    return buy4get1;
  } else {
    return percent15;
  }
}

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};