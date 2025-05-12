import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useWishlistStore } from '../store/wishlistStore';

export function Wishlist() {
  const { user } = useAuth();
  const { items: wishlist, removeItem, setWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('users')
      .select('wishlist')
      .eq('email', user.email)
      .single();
      
    if (error) {
      console.error('Error fetching wishlist:', error);
    } else if (data?.wishlist) {
      setWishlist(data.wishlist);
    } else {
      setWishlist([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemoveFromWishlist = async (productId: number) => {
    if (!user) return;
    
    // Optimistic update
    removeItem(productId);
    
    // Update in Supabase
    const updatedWishlist = wishlist.filter(item => item.id !== productId);
    await supabase
      .from('users')
      .update({ wishlist: updatedWishlist })
      .eq('email', user.email);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-beige-50">
      {/* ... rest of your component ... */}
    </div>
  );
}