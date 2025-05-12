import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
  onRemoveFromWishlist?: (productId: number) => void;
}

export function ProductCard({ product, onRemoveFromWishlist }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('wishlist')
        .eq('email', user.email)
        .single();
      const wishlist = data?.wishlist || [];
      setIsWishlisted(!!wishlist.find((item: any) => item.id === product.id));
    };
    checkWishlist();
    // eslint-disable-next-line
  }, [user, product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('You need to be logged in to add to wishlist.');
      return;
    }
    const { data } = await supabase
      .from('users')
      .select('wishlist')
      .eq('email', user.email)
      .single();
    let wishlist = data?.wishlist || [];
    if (wishlist.find((item: any) => item.id === product.id)) {
      wishlist = wishlist.filter((item: any) => item.id !== product.id);
      setIsWishlisted(false);
      await supabase
        .from('users')
        .update({ wishlist })
        .eq('email', user.email);
      if (typeof onRemoveFromWishlist === 'function') {
        onRemoveFromWishlist(product.id);
      }
    } else {
      wishlist = [...wishlist, product];
      setIsWishlisted(true);
      await supabase
        .from('users')
        .update({ wishlist })
        .eq('email', user.email);
    }
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  return (
    <motion.div
      className="card card-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 z-10">
            <button title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} className={`bg-white p-2 rounded-full shadow-sm transition-colors ${isWishlisted ? 'text-red-500' : 'text-brown-700 hover:text-brown-900'}`} onClick={handleWishlist}>
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          <motion.div
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="primary" className="w-full" onClick={handleAddToCart}>
              <ShoppingBag size={16} className="mr-2" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-brown-800">{product.name}</h3>
          <p className="text-brown-600 text-sm mb-2">{product.category}</p>
          <p className="font-semibold text-brown-900">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}