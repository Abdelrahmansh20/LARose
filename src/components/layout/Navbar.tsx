import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { SearchIcon, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.totalItems());
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-sm py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="font-serif text-2xl font-medium text-brown-800"
        >
          LaRose
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/shop" 
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            Shop
          </Link>
          <Link 
            to="/collections" 
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            Collections
          </Link>
          <Link 
            to="/about" 
            className="text-brown-700 hover:text-brown-900 transition-colors"
          >
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="text-brown-700 hover:text-brown-900">
            <SearchIcon size={20} />
          </button>
          
          <Link to="/cart" className="text-brown-700 hover:text-brown-900 relative">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brown-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          <Link to={user ? "/account" : "/login"}>
            <Button variant="ghost" size="sm" className="text-brown-700 hover:text-brown-900">
              <User size={20} />
            </Button>
          </Link>
          
          <button 
            className="md:hidden text-brown-700 hover:text-brown-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-beige-100"
          >
            <div className="container py-4 space-y-3">
              <Link 
                to="/" 
                className="block text-brown-700 hover:text-brown-900 py-2"
              >
                Home
              </Link>
              <Link 
                to="/shop" 
                className="block text-brown-700 hover:text-brown-900 py-2"
              >
                Shop
              </Link>
              <Link 
                to="/collections" 
                className="block text-brown-700 hover:text-brown-900 py-2"
              >
                Collections
              </Link>
              <Link 
                to="/about" 
                className="block text-brown-700 hover:text-brown-900 py-2"
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}