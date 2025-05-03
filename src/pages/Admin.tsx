import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Package, Edit, Trash2, Plus, AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  stock: number;
  featured: boolean;
}

export function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      fetchProducts();
    }
  }, [user, isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (!data) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  const toggleFeatured = async (id: number, featured: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !featured })
        .eq('id', id);

      if (error) throw error;

      setProducts(products.map(product =>
        product.id === id ? { ...product, featured: !featured } : product
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
      setError('Failed to update featured status');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-brown-800">Admin Dashboard</h1>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/products/new')}
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-beige-300 border-t-brown-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-beige-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-brown-800">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-brown-800">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-brown-800">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-brown-800">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-brown-800">Featured</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-brown-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-beige-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="font-medium text-brown-800">{product.name}</div>
                          <div className="text-sm text-brown-600 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-brown-600">{product.category}</td>
                    <td className="px-6 py-4 text-brown-600">${product.price}</td>
                    <td className="px-6 py-4 text-brown-600">{product.stock}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(product.id, product.featured)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.featured
                            ? 'bg-brown-100 text-brown-800'
                            : 'bg-beige-100 text-beige-800'
                        }`}
                      >
                        {product.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}