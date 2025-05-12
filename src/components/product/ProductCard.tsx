import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

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
            <button className="bg-white p-2 rounded-full shadow-sm text-brown-700 hover:text-brown-900 transition-colors">
              <Heart size={18} />
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