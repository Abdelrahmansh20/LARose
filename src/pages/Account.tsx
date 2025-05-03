import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { User, Package, LogOut } from 'lucide-react';

interface Order {
  id: number;
  created_at: string;
  status: string;
  total: number;
  special_offer_applied: string | null;
}

export function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-lg shadow-sm p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-beige-200 p-3 rounded-full">
                  <User size={24} className="text-brown-600" />
                </div>
                <div className="ml-4">
                  <h1 className="font-serif text-2xl text-brown-800">My Account</h1>
                  <p className="text-brown-600">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={handleSignOut}
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </Button>
            </div>

            <div className="border-t border-beige-200 pt-6">
              <h2 className="font-serif text-xl text-brown-800 mb-4 flex items-center">
                <Package size={20} className="mr-2" />
                Order History
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-12 h-12 rounded-full border-4 border-beige-300 border-t-brown-600 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-brown-600 mb-4">You haven't placed any orders yet.</p>
                  <Button variant="primary" onClick={() => navigate('/shop')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <motion.div
                      key={order.id}
                      className="border border-beige-200 rounded-lg p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-brown-800">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-brown-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-brown-800">
                            ${order.total.toFixed(2)}
                          </p>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-beige-200 text-brown-700">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      {order.special_offer_applied && (
                        <p className="text-sm text-green-600 mt-2">
                          Offer applied: {order.special_offer_applied}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}