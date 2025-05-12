import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabase/migrations/supabaseClient';

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartStatus, setCartStatus] = useState('');

  const toggleWishlist = async () => {
    try {
      setIsFavorite(prev => !prev);
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  const addToCart = () => {
    setCartStatus(`${product.Name} added to cart!`);
    setTimeout(() => setCartStatus(''), 3000);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('perfumes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error}</p>
    );

  if (!product)
    return (
      <p className="text-center mt-10 text-red-500">Product not found</p>
    );

  return (
    <div className="container mt-20 mx-auto px-4 py-10 max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={product.Image_url}
            alt={product.Name}
            className="w-full h-96 object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.png';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="text-sm text-gray-500 uppercase tracking-wider">{product.Brand}</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.Name}</h1>
            <div className="flex items-center mt-4">
              <span className="text-2xl font-bold text-amber-900">${product.Price}</span>
              {product.oldPrice && (
                <span className="ml-2 text-gray-500 line-through">${product.oldPrice}</span>
              )}
            </div>
          </div>

          {product.Description && (
            <div className="prose max-w-none text-gray-700">
              <p>{product.Description}</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCart}
                className="flex justify-center items-center gap-2 bg-amber-900 hover:bg-amber-800 text-white h-12 w-48 rounded-lg transition font-medium"
                aria-label={`Add ${product.Name} to cart`}
              >
                Add to Cart
                <ShoppingBagIcon />
              </button>

              <button
                onClick={toggleWishlist}
                className={`flex items-center justify-center gap-2 h-12 w-48 rounded-lg transition font-medium ${
                  isFavorite
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-amber-300'
                }`}
                aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isFavorite ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-amber-900"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 
                        7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 
                        3 16.5 3 19.58 3 22 5.42 22 8.5c0 
                        3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    In Wishlist
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7 text-amber-900"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12.1 8.64l-.1.1-.11-.11C10.14 6.61 7 7.56 7 10.3c0 1.45.91 2.83 2.62 
                          4.29 1.05.86 2.02 1.5 2.38 1.71.36-.21 1.33-.85 2.38-1.71C16.09 
                          13.13 17 11.75 17 10.3c0-2.74-3.14-3.69-4.9-1.66z"
                      />
                    </svg>
                    Add to Wishlist
                  </>
                )}
              </button>
            </div>

            {cartStatus && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
                {cartStatus}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.Category && (
              <div>
                <span className="text-gray-500">Category</span>
                <p className="font-medium">{product.Category}</p>
              </div>
            )}
            {product.Size && (
              <div>
                <span className="text-gray-500">Size</span>
                <p className="font-medium">{product.Size}ml</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}