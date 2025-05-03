/*
  # Create initial schema for LaRose Perfumes

  1. New Tables
    - `products`
      - `id` (serial, primary key)
      - `created_at` (timestamptz)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `category` (text)
      - `stock` (integer)
      - `featured` (boolean)
    - `orders`
      - `id` (serial, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `status` (text)
      - `total` (numeric)
      - `special_offer_applied` (text)
    - `order_items`
      - `id` (serial, primary key)
      - `order_id` (integer, references orders)
      - `product_id` (integer, references products)
      - `quantity` (integer)
      - `price` (numeric)
    - `reviews`
      - `id` (serial, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `product_id` (integer, references products)
      - `rating` (integer)
      - `comment` (text)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public access to products data
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 100,
  featured BOOLEAN DEFAULT false
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC NOT NULL,
  special_offer_applied TEXT
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  product_id INTEGER REFERENCES products(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  USING (true);

-- Create policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON orders
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own order items"
  ON order_items
  FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Create policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Insert sample data for products
INSERT INTO products (name, description, price, image_url, category, featured)
VALUES
  ('Enchanted Rose', 'A captivating floral fragrance with notes of Bulgarian rose, jasmine, and a hint of vanilla. Perfect for romantic evenings.', 129.99, 'https://images.pexels.com/photos/3427669/pexels-photo-3427669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Floral', true),
  ('Midnight Amber', 'A sophisticated oriental scent featuring warm amber, spicy cardamom, and exotic sandalwood. Ideal for those who appreciate depth and mystery.', 149.99, 'https://images.pexels.com/photos/965990/pexels-photo-965990.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Oriental', true),
  ('Citrus Breeze', 'A refreshing blend of bergamot, lemon, and grapefruit with undertones of mint and sea breeze. Perfect for daytime wear.', 119.99, 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fresh', true),
  ('Velvet Oud', 'A luxurious woody fragrance featuring rare oud, cedarwood, and patchouli with hints of smoky vanilla. A statement scent for confident individuals.', 179.99, 'https://images.pexels.com/photos/7445032/pexels-photo-7445032.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Woody', true),
  ('Ocean Mist', 'A clean, aquatic fragrance with notes of sea salt, cucumber, and white musk. Evokes the feeling of a seaside retreat.', 135.99, 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Fresh', false),
  ('Vanilla Dreams', 'A warm and comforting scent with Madagascan vanilla, tonka bean, and creamy sandalwood. Like a sweet embrace on a cold evening.', 125.99, 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Oriental', false),
  ('Cherry Blossom', 'A delicate floral fragrance capturing the essence of spring with notes of Japanese cherry blossom, rose, and a hint of almond.', 139.99, 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Floral', false),
  ('Sandalwood Mystique', 'An exotic woody fragrance with Indian sandalwood, vanilla, and musk creating an intoxicating, long-lasting scent.', 159.99, 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', 'Woody', false);