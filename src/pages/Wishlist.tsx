import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { useAuth } from '../hooks/useAuth';

export function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('wishlist')
      .eq('email', user.email)
      .single();
    if (data && data.wishlist) {
      setWishlist(data.wishlist);
    } else {
      setWishlist([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlist-updated', handleWishlistUpdate);
    };
  }, [user]);

  // دالة لحذف منتج من الـ wishlist في الـ state مباشرة
  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      <div className="container">
        <h1 className="font-serif text-3xl text-brown-800 mb-8">My Wishlist</h1>
        {loading ? (
          <div>Loading...</div>
        ) : wishlist.length === 0 ? (
          <div>No products in your wishlist yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} onRemoveFromWishlist={handleRemoveFromWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 