import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Heart, ShoppingCart, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/cartStore'; // Assuming you have a cart store
import { useWishlistStore } from '../../store/wishlistStore'; // Assuming you have a wishlist store

export function NavBar() {
  const { user, loading: isLoading, signOut } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart and wishlist counts from stores
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const heroSectionHeight = window.innerHeight * 0.2;
      setIsScrolled(window.scrollY > heroSectionHeight);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHomePage]);

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.email) {
        try {
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user profile:', error);
            return;
          }

          if (profile) {
            setUsername(profile.username || '');
          } else {
            console.log('No profile found for user:', user.email);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
        }
      } else {
        setUsername('');
      }
    };

    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Determine text and background colors
  const textColor = isHomePage && !isScrolled ? 'text-white' : 'text-brown-800';
  const hoverColor = isHomePage && !isScrolled ? 'hover:text-beige-200' : 'hover:text-brown-600';
  const bgColor = isHomePage && !isScrolled ? 'bg-transparent' : 'bg-white shadow-sm';
  const counterBgColor = isHomePage && !isScrolled ? 'bg-white text-brown-800' : 'bg-brown-600 text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`text-2xl font-serif ${textColor}`}>
            LaRose
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${textColor} ${hoverColor} transition-colors`}>
              Home
            </Link>
            <Link to="/products" className={`${textColor} ${hoverColor} transition-colors`}>
              Products
            </Link>
            <Link to="/about" className={`${textColor} ${hoverColor} transition-colors`}>
              About
            </Link>
            <Link to="/contact" className={`${textColor} ${hoverColor} transition-colors`}>
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <span className={`${textColor} hidden sm:inline`}>
                      Welcome, {username || 'User'}
                    </span>
                    <Link to="/wishlist" className={`${textColor} ${hoverColor} relative`}>
                      <Heart size={20} />
                      {wishlistCount > 0 && (
                        <span className={`absolute -top-2 -right-2 ${counterBgColor} text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className={`${textColor} ${hoverColor} relative`}>
                      <ShoppingCart size={20} />
                      {cartCount > 0 && (
                        <span className={`absolute -top-2 -right-2 ${counterBgColor} text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className={`${textColor} ${hoverColor}`}
                    >
                      <LogOut size={20} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className={`${textColor} ${hoverColor}`}>
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button 
                        variant="primary" 
                        size="sm"
                        className={isHomePage && !isScrolled ? 'bg-white text-brown-800 hover:bg-beige-100' : ''}
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}