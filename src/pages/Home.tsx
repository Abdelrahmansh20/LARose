import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/home/Hero';
import { SpecialOffers } from '../components/home/SpecialOffers';
import { supabase } from '../../supabase/migrations/supabaseClient';
import "./Home.css";

export function Home() {
  const [bestSelling, setBestSelling] = useState([]);
  const [menPerfumes, setMenPerfumes] = useState([]);
  const [womenPerfumes, setWomenPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const { data: best, error: bestErr } = await supabase
          .from('perfumes')
          .select('*')
          .eq('Is_best_seller', true);

        const { data: men, error: menErr } = await supabase
          .from('perfumes')
          .select('*')
          .eq('Gender', 'men');

        const { data: women, error: womenErr } = await supabase
          .from('perfumes')
          .select('*')
          .eq('Gender', 'women');

        if (bestErr || menErr || womenErr) {
          console.error('Error fetching data:', bestErr || menErr || womenErr);
        }

        setBestSelling(best || []);
        setMenPerfumes(men || []);
        setWomenPerfumes(women || []);
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/category/${category}`);
  };

  const HeartIcon = ({ isFilled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={`w-6 h-6 transition-colors ${
        isFilled ? 'fill-brown-800 text-brown-800' : 'text-gray-300 hover:text-brown-600'
      }`}
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );

  const ShoppingBagIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );

  const ArrowIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path 
        fillRule="evenodd" 
        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  const ProductCard = ({ item }) => {
    const isFavorite = wishlist.includes(item.id);
    
    return (
      <div
  onClick={() => navigate(`/product/${item.id}`)}
  className="cursor-pointer"
>
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all relative bg-white group"
      >
        {/* Favorite Button */}
        <button
          onClick={() => toggleWishlist(item.id)}
          className="absolute fav-icon top-3 right-3 p-2 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <HeartIcon isFilled={isFavorite} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
          <img
            src={item.Image_url}
            alt={item.Name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {item.Name || 'اسم غير متوفر'}
          </h3>
          <p className="text-sm text-gray-500">
            {item.Brand || 'علامة تجارية غير متوفرة'}
          </p>
          <p className="text-lg font-bold text-gray-900">${item.Price || '--'}</p>
        </div>

        {/* Add to Cart Button */}
        <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-brown-800 hover:bg-brown-700 text-white rounded-md transition-colors">
          <ShoppingBagIcon />
          Add to Cart
        </button>
      </motion.div>
      </div>
    );
  };

  const SeeMoreButton = ({ onClick, bgClass, hoverBgClass }) => (
    <motion.button 
      onClick={onClick}
      className={`px-10 py-3 ${bgClass} hover:${hoverBgClass} text-brown-800 rounded-md font-medium transition-colors duration-300 flex items-center justify-center mx-auto gap-2 group`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.95 }}
    >
      See More
      <ArrowIcon />
    </motion.button>
  );

  return (
    <div>
      <Hero />
      
      {/* Best Selling Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-8 text-center">
            Best Selling
          </h2>
          {loading ? (
            <p className="text-center text-brown-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {bestSelling.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              {bestSelling.length > 4 && (
                <div className="text-center mt-10">
                  <SeeMoreButton 
                    onClick={() => navigateToCategory('best-selling')}
                    bgClass="bg-beige-100"
                    hoverBgClass="bg-beige-200"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Men's Perfumes Section */}
      <section className="py-12 bg-beige-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-8 text-center">
            Men's Perfumes
          </h2>
          {loading ? (
            <p className="text-center text-brown-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {menPerfumes.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              {menPerfumes.length > 4 && (
                <div className="text-center mt-10">
                  <SeeMoreButton 
                    onClick={() => navigateToCategory('men')}
                    bgClass="bg-beige-200"
                    hoverBgClass="bg-beige-300"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Women's Perfumes Section */}
      <section className="py-12 bg-beige-100">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-8 text-center">
            Women's Perfumes
          </h2>
          {loading ? (
            <p className="text-center text-brown-600">Loading...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {womenPerfumes.slice(0, 4).map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
              {womenPerfumes.length > 4 && (
                <div className="text-center mt-10">
                  <SeeMoreButton 
                    onClick={() => navigateToCategory('women')}
                    bgClass="bg-beige-300"
                    hoverBgClass="bg-beige-400"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <SpecialOffers />
      
      {/* باقي الأقسام كما هي بدون تغيير */}
      <section className="py-20 bg-beige-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="../../images/istockphoto-1326570912-612x612.jpg" 
                alt="LaRose Perfumery" 
                className="rounded-lg shadow-md w-full h-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-4">
                The Art of Perfumery
              </h2>
              <p className="text-brown-600 mb-6">
                At LaRose, we believe that perfume is more than just a fragrance—it's a form of self-expression, a reflection of personality, and a lasting impression.
              </p>
              <p className="text-brown-600 mb-6">
                Each LaRose creation is meticulously crafted by our master perfumers, who blend the finest ingredients from around the world. We carefully select rare flowers, exotic spices, and precious woods to create perfumes that tell a story.
              </p>
              {/* <button className="btn btn-outline">
                Our Story
              </button> */}
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-beige-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-4">
              Join Our Community
            </h2>
            <p className="text-brown-600 max-w-2xl mx-auto">
              Sign up for our newsletter to receive updates on new collections, exclusive offers, and perfumery insights.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input flex-1"
                required
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}