import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ProductCard } from '../components/product/ProductCard';
import { Filter, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);
  
  async function fetchProducts() {
    try {
      setLoading(true);
      let query = supabase.from('perfumes').select('*');
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // If no data yet, use placeholder products
      if (!data || data.length === 0) {
        setProducts(placeholderProducts);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(placeholderProducts);
    } finally {
      setLoading(false);
    }
  }
  
  const filteredProducts = products.filter((product) => {
    const matchesFilter = filter === 'all' || (product.category && product.category.toLowerCase() === filter.toLowerCase());
    const matchesSearch = (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                           (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));
                           
    return matchesFilter && matchesSearch;
  });
  
  const categories = ['All', 'Floral', 'Oriental', 'Fresh', 'Woody'];
  
  return (
    <div className="pt-24 pb-20 bg-beige-50 min-h-screen">
      <div className="container">
        <div className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-brown-800 mb-4">
            Our Collection
          </h1>
          <p className="text-brown-600 max-w-2xl">
            Explore our exquisite perfumes, designed to evoke emotions and create lasting impressions.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search perfumes..."
                className="input w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-500" size={18} />
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              className="btn btn-outline w-full flex items-center justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>
          
          <div className={`md:flex space-x-2 ${showFilters ? 'block' : 'hidden'}`}>
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${filter === category.toLowerCase() ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-beige-300 border-t-brown-600 animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brown-600 mb-4">No perfumes found matching your criteria.</p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                setFilter('all');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Placeholder products for development or when data isn't available
const placeholderProducts: Product[] = [
  {
    id: 1,
    name: "Enchanted Rose",
    price: 129.99,
    image_url: "https://images.pexels.com/photos/3427669/pexels-photo-3427669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Floral"
  },
  {
    id: 2,
    name: "Midnight Amber",
    price: 149.99,
    image_url: "https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Oriental"
  },
  {
    id: 3,
    name: "Citrus Breeze",
    price: 119.99,
    image_url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fresh"
  },
  {
    id: 4,
    name: "Velvet Oud",
    price: 179.99,
    image_url: "https://images.pexels.com/photos/7445032/pexels-photo-7445032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Woody"
  },
  {
    id: 5,
    name: "Ocean Mist",
    price: 135.99,
    image_url: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fresh"
  },
  {
    id: 6,
    name: "Vanilla Dreams",
    price: 125.99,
    image_url: "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Oriental"
  },
  {
    id: 7,
    name: "Cherry Blossom",
    price: 139.99,
    image_url: "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Floral"
  },
  {
    id: 8,
    name: "Sandalwood Mystique",
    price: 159.99,
    image_url: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Woody"
  }
];