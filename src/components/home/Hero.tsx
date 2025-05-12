import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Hero() {
  return (
    <div className="relative  min-h-screen flex items-center">
      <div className="absolute  inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Luxury perfume bottles"
          className="w-full h-full  object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-lg">
          <motion.h1 
            className="font-serif text-4xl md:text-6xl text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Your Signature Scent
          </motion.h1>
          
          <motion.p 
            className="text-beige-100 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Crafted with passion and precision, LaRose perfumes embody elegance and sophistication for those who appreciate the art of fragrance.
          </motion.p>
          
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/shop">
              <Button variant="primary" size="lg">
                Shop Now
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/20">
                Explore Collections
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}