import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { CreditCard, Truck, Shield, AlertCircle } from 'lucide-react';

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, subtotal, discount, total, appliedOffer, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please sign in to complete your purchase');
      return;
    }
    
    try {
      setError('');
      setIsSubmitting(true);
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total(),
          special_offer_applied: appliedOffer,
          status: 'processing'
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/account');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError('Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-3xl text-brown-800 mb-8">Checkout</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
              <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Shipping Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="font-serif text-xl text-brown-800 mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="input"
                        value={shippingDetails.firstName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="input"
                        value={shippingDetails.lastName}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="input"
                        value={shippingDetails.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        className="input"
                        value={shippingDetails.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="input"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="input"
                        value={shippingDetails.state}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        className="input"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        className="input"
                        value={shippingDetails.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="font-serif text-xl text-brown-800 mb-4">Payment Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        className="input"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-brown-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        className="input"
                        value={paymentDetails.cardName}
                        onChange={handlePaymentChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brown-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          className="input"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-brown-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          className="input"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  <CreditCard size={18} className="mr-2" />
                  Place Order
                </Button>
              </motion.form>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                <h2 className="font-serif text-xl text-brown-800 mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-brown-800">{item.name}</h3>
                        <p className="text-sm text-brown-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-brown-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-beige-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal())}</span>
                  </div>
                  
                  {discount() > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
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
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-brown-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  
                  <div className="border-t border-beige-200 pt-2 flex justify-between text-lg font-semibold">
                    <span className="text-brown-800">Total</span>
                    <span className="text-brown-900">{formatPrice(total())}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-brown-600">
                    <Truck size={16} className="mr-2" />
                    <span>Free shipping on all orders</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-brown-600">
                    <Shield size={16} className="mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}