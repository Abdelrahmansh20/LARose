import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/Button';
import { Heart, ShoppingCart, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function NavBar() {
  const { user, loading: isLoading, signOut } = useAuth();
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-beige-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-serif text-brown-800">
            LaRose
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-brown-600 hover:text-brown-800">
              Home
            </Link>
            <Link to="/products" className="text-brown-600 hover:text-brown-800">
              Products
            </Link>
            <Link to="/about" className="text-brown-600 hover:text-brown-800">
              About
            </Link>
            <Link to="/contact" className="text-brown-600 hover:text-brown-800">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <span className="text-brown-600">
                      Welcome, {username || 'User'}
                    </span>
                    <Link to="/wishlist" className="text-brown-600 hover:text-brown-800">
                      <Heart size={20} />
                    </Link>
                    <Link to="/cart" className="text-brown-600 hover:text-brown-800">
                      <ShoppingCart size={20} />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="text-brown-600 hover:text-brown-800"
                    >
                      <LogOut size={20} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm">
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