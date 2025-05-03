import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { ProductCard } from '../product/ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        // If we have no data yet, use placeholder products
        if (!data || data.length === 0) {
          setProducts(placeholderProducts);
        } else {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setProducts(placeholderProducts);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedProducts();
  }, []);
  
  return (
    <section className="py-20 bg-beige-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-4">
            Featured Collection
          </h2>
          <p className="text-brown-600 max-w-2xl mx-auto">
            Discover our most popular perfumes, curated for those who appreciate the finest fragrances.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-beige-300 border-t-brown-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <motion.button
            className="btn btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Products
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// Placeholder products for development or when data isn't available
const placeholderProducts: Product[] = [
  {
    id: 1,
    name: "Enchanted Rose",
    price: 129.99,
    image_url: "https://images.pexels.com/photos/3427669/pexels-photo-3427669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Floral",
    featured: true
  },
  {
    id: 2,
    name: "Midnight Amber",
    price: 149.99,
    image_url: "https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Oriental",
    featured: true
  },
  {
    id: 3,
    name: "Citrus Breeze",
    price: 119.99,
    image_url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fresh",
    featured: true
  },
  {
    id: 4,
    name: "Velvet Oud",
    price: 179.99,
    image_url: "https://images.pexels.com/photos/7445032/pexels-photo-7445032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Woody",
    featured: true
  }
];