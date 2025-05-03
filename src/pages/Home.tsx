import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/home/Hero';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { SpecialOffers } from '../components/home/SpecialOffers';

export function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <SpecialOffers />
      
      <section className="py-20 bg-beige-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="https://images.pexels.com/photos/2559749/pexels-photo-2559749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
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
              <button className="btn btn-outline">
                Our Story
              </button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-beige-200">
        <div className="container">
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