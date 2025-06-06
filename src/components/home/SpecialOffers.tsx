import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function SpecialOffers() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/shop');
  };

  return (
    <section className="py-16 bg-beige-100">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brown-800 mb-4">
            Special Offers
          </h2>
          <p className="text-brown-600 max-w-2xl mx-auto">
            Take advantage of our limited-time promotions and discover premium fragrances at exceptional values.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm border border-beige-200 flex flex-col min-h-[300px]"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col h-full">
              <h3 className="font-serif text-2xl text-brown-800 mb-2">15% Off Your Purchase</h3>
              <p className="text-brown-600 mb-4">
                Enjoy a 15% discount on all perfumes in our collection. Don’t miss out on this limited-time offer!
              </p>
              <div className="mt-auto flex flex-col gap-4">
                <div className="bg-beige-200 text-brown-800 font-medium p-4 rounded-md">
                  <p>Applied automatically at checkout when selected</p>
                </div>
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleShopNow}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-8 rounded-lg shadow-sm border border-beige-200 flex flex-col min-h-[300px]"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col h-full">
              <h3 className="font-serif text-2xl text-brown-800 mb-2">Buy 4, Get 1 Free</h3>
              <p className="text-brown-600 mb-4">
                Purchase any 4 perfumes and get the 5th one free (lowest priced item).
              </p>
              <div className="mt-auto flex flex-col gap-4">
                <div className="bg-beige-200 text-brown-800 font-medium p-4 rounded-md">
                  <p>Add 5 perfumes to your cart to activate this offer</p>
                </div>
                <button 
                  className="btn btn-primary w-full"
                  onClick={handleShopNow}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}