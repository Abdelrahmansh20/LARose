import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-beige-100 text-brown-800 pt-12 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-xl mb-4">LaRose</h3>
            <p className="text-brown-600 mb-6">
              Luxury perfumes that capture the essence of elegance and sophistication.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-brown-600 hover:text-brown-800 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-brown-600 hover:text-brown-800 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-brown-600 hover:text-brown-800 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-brown-800 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-brown-600 hover:text-brown-800 transition-colors">
                  All Perfumes
                </Link>
              </li>
              <li>
                <Link to="/collections/new" className="text-brown-600 hover:text-brown-800 transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections/bestsellers" className="text-brown-600 hover:text-brown-800 transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link to="/special-offers" className="text-brown-600 hover:text-brown-800 transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-brown-800 mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-brown-600 hover:text-brown-800 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-brown-600 hover:text-brown-800 transition-colors">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-brown-600 hover:text-brown-800 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-brown-600 hover:text-brown-800 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-brown-800 mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-brown-600 mt-0.5" />
                <span className="text-brown-600">123 Luxury Ave, New York, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-brown-600" />
                <span className="text-brown-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-brown-600" />
                <span className="text-brown-600">contact@larose-perfumes.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-beige-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-brown-600 text-sm mb-4 md:mb-0">
              &copy; {currentYear} LaRose. All rights reserved.
            </p>
            
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-sm text-brown-600 hover:text-brown-800 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-brown-600 hover:text-brown-800 transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-sm text-brown-600 hover:text-brown-800 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}