import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import { Button } from '../components/ui/Button';
import { Heart, Minus, Plus, Star, ShoppingBag, Share2 } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);
  
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !product) return;
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
  }, [user, product]);
  
  async function fetchProduct() {
    try {
      setLoading(true);
      
      const productId = parseInt(id as string);
      
      if (isNaN(productId)) {
        throw new Error('Invalid product ID');
      }
      
      const { data, error } = await supabase
        .from('perfumes')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        console.log('Product data:', data);
        const normalizedData = {
          id: data.id,
          name: data.Name,
          description: data.Description || "",
          price: data.Price,
          image_url: data.Image_url,
          category: data.Category || "",
        };
        setProduct(normalizedData);
      } else {
        // If no data, find in placeholder
        const placeholderProduct = placeholderProducts.find(p => p.id === productId);
        if (placeholderProduct) {
          setProduct(placeholderProduct);
        } else {
          throw new Error('Product not found');
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
        });
      }
    }
  };
  
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || !product) {
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
    } else {
      wishlist = [...wishlist, product];
      setIsWishlisted(true);
    }
    await supabase
      .from('users')
      .update({ wishlist })
      .eq('email', user.email);
    window.dispatchEvent(new Event('wishlist-updated'));
  };
  
  if (loading) {
    return (
      <div className="pt-24 pb-20 flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 rounded-full border-4 border-beige-300 border-t-brown-600 animate-spin" />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="pt-24 pb-20 min-h-screen">
        <div className="container">
          <div className="text-center py-12">
            <h2 className="font-serif text-2xl text-brown-800 mb-4">Product Not Found</h2>
            <p className="text-brown-600 mb-6">Sorry, the product you are looking for does not exist.</p>
            <Link to="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-20 bg-beige-50 min-h-screen">
      <div className="container">
        <div className="mb-8">
          <Link to="/shop" className="text-brown-600 hover:text-brown-800 transition-colors">
            ← Back to Shop
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <motion.div 
              className="bg-white p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-auto rounded"
              />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-sm h-full">
              <span className="inline-block bg-beige-200 text-brown-700 px-3 py-1 rounded-full text-sm mb-4">
                {product.category}
              </span>
              
              <h1 className="font-serif text-3xl text-brown-800 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={star <= 4 ? "currentColor" : "none"} 
                    />
                  ))}
                </div>
                <span className="text-brown-600 text-sm ml-2">4.0 (24 reviews)</span>
              </div>
              
              <p className="text-2xl font-semibold text-brown-800 mb-6">
                {formatPrice(product.price)}
              </p>
              
              <p className="text-brown-600 mb-8">
                {product.description || "A captivating fragrance that combines delicate floral notes with warm amber undertones, creating a sophisticated and alluring scent that lingers throughout the day."}
              </p>
              
              <div className="mb-6">
                <label className="block text-brown-700 mb-2">Quantity</label>
                <div className="flex items-center border border-beige-300 rounded-md w-32">
                  <button
                    className="px-3 py-1 text-brown-600 hover:text-brown-800"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 text-center">{quantity}</span>
                  <button
                    className="px-3 py-1 text-brown-600 hover:text-brown-800"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} className="mr-2" />
                  Add to Cart
                </Button>
                <button
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className={`btn btn-outline flex items-center justify-center flex-1 sm:flex-none ${isWishlisted ? 'text-red-500' : 'text-brown-700 hover:text-brown-900'}`}
                  onClick={handleWishlist}
                  style={{ border: '1px solid #e0cfc2' }}
                >
                  <Heart size={18} className="mr-2" fill={isWishlisted ? 'currentColor' : 'none'} />
                  Wishlist
                </button>
              </div>
              
              <div className="border-t border-beige-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-brown-700">SKU</span>
                  <span className="text-brown-600">LR-P{product.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-brown-700 mr-4">Share</span>
                  <div className="flex space-x-3 text-brown-600">
                    <button className="hover:text-brown-800" title="Share on Facebook">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </button>
                    <button className="hover:text-brown-800" title="Share on Twitter">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </button>
                    <button className="hover:text-brown-800" title="Share on Instagram">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                    </button>
                    <button className="hover:text-brown-800" title="Share">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16">
          <h2 className="font-serif text-2xl text-brown-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {placeholderProducts
              .filter(relatedProduct => relatedProduct.id !== parseInt(id as string))
              .slice(0, 4)
              .map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Placeholder products for development or when data isn't available
const placeholderProducts: Product[] = [
  {
    id: 1,
    name: "Enchanted Rose",
    description: "A captivating floral fragrance with notes of Bulgarian rose, jasmine, and a hint of vanilla. Perfect for romantic evenings.",
    price: 129.99,
    image_url: "https://images.pexels.com/photos/3427669/pexels-photo-3427669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Floral"
  },
  {
    id: 2,
    name: "Midnight Amber",
    description: "A sophisticated oriental scent featuring warm amber, spicy cardamom, and exotic sandalwood. Ideal for those who appreciate depth and mystery.",
    price: 149.99,
    image_url: "https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Oriental"
  },
  {
    id: 3,
    name: "Citrus Breeze",
    description: "A refreshing blend of bergamot, lemon, and grapefruit with undertones of mint and sea breeze. Perfect for daytime wear.",
    price: 119.99,
    image_url: "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fresh"
  },
  {
    id: 4,
    name: "Velvet Oud",
    description: "A luxurious woody fragrance featuring rare oud, cedarwood, and patchouli with hints of smoky vanilla. A statement scent for confident individuals.",
    price: 179.99,
    image_url: "https://images.pexels.com/photos/7445032/pexels-photo-7445032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Woody"
  },
  {
    id: 5,
    name: "Ocean Mist",
    description: "A clean, aquatic fragrance with notes of sea salt, cucumber, and white musk. Evokes the feeling of a seaside retreat.",
    price: 135.99,
    image_url: "https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Fresh"
  }
];