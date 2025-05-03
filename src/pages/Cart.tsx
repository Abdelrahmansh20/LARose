import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export function Cart() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    subtotal, 
    discount, 
    total,
    appliedOffer
  } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return null; // Prevent hydration mismatch
  }
  
  if (items.length === 0) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container">
          <h1 className="font-serif text-3xl text-brown-800 mb-8">Your Cart</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6">
              <ShoppingBag size={64} className="mx-auto text-beige-300" />
            </div>
            <h2 className="font-serif text-2xl text-brown-800 mb-4">Your cart is empty</h2>
            <p className="text-brown-600 mb-8">Looks like you haven't added any perfumes to your cart yet.</p>
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <h1 className="font-serif text-3xl text-brown-800 mb-8">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-beige-100">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-lg text-brown-800">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </h2>
                  <button 
                    className="text-sm text-brown-600 hover:text-brown-800"
                    onClick={() => clearCart()}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-beige-100">
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    layout
                  >
                    <div className="sm:w-20 sm:h-20 mb-4 sm:mb-0 flex-shrink-0">
                      <img 
                        src={item.image_url} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 sm:ml-6">
                      <h3 className="font-medium text-brown-800">{item.name}</h3>
                      <p className="text-brown-600 text-sm mb-2">Perfume</p>
                      <p className="font-semibold">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center mt-4 sm:mt-0">
                      <div className="flex items-center border border-beige-300 rounded-md">
                        <button
                          className="px-3 py-1 text-brown-600 hover:text-brown-800"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          className="px-3 py-1 text-brown-600 hover:text-brown-800"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <button 
                        className="ml-4 text-brown-500 hover:text-brown-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="font-serif text-xl text-brown-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-brown-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal())}</span>
                </div>
                
                {discount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      Discount
                      {appliedOffer && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          {appliedOffer}
                        </span>
                      )}
                    </span>
                    <span className="font-medium">-{formatPrice(discount())}</span>
                  </div>
                )}
                
                <div className="border-t border-beige-200 pt-4 flex justify-between text-lg font-semibold">
                  <span className="text-brown-800">Total</span>
                  <span className="text-brown-900">{formatPrice(total())}</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              
              <Link to="/shop" className="block text-center mt-4 text-sm text-brown-600 hover:text-brown-800">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}