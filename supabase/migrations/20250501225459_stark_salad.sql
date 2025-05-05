/*
  # Initial database schema for Luxe Perfumery

  1. New Tables
    - `categories` - Stores perfume categories
    - `products` - Stores perfume product information
    - `user_profiles` - Stores user profile information
    - `cart_items` - Stores items in users' shopping carts
    - `wishlist_items` - Stores items in users' wishlists
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public access to product and category data
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  price decimal NOT NULL,
  sale_price decimal,
  stock integer NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) NOT NULL,
  image_url text NOT NULL,
  additional_images text[],
  featured boolean DEFAULT false,
  new_arrival boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Products Policies
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- User Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Cart Items Policies
CREATE POLICY "Users can view their own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Wishlist Items Policies
CREATE POLICY "Users can view their own wishlist items"
  ON wishlist_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items"
  ON wishlist_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items"
  ON wishlist_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data for categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Women''s Perfumes', 'womens', 'Elegant and sophisticated fragrances for women', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg'),
('Men''s Perfumes', 'mens', 'Bold and masculine fragrances for men', 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg'),
('Unisex Fragrances', 'unisex', 'Contemporary scents designed for everyone', 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg'),
('Gift Sets', 'gift-sets', 'Curated collections perfect for gifting', 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg');

-- Insert sample products
INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, image_url, additional_images, featured, new_arrival) VALUES
('Ethereal Bloom', 'ethereal-bloom', 'A delicate floral bouquet with notes of rose, jasmine, and a hint of citrus. Perfect for daytime wear.', 89.99, NULL, 25, (SELECT id FROM categories WHERE slug = 'womens'), 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg', ARRAY['https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg', 'https://images.pexels.com/photos/3768146/pexels-photo-3768146.jpeg'], true, false),

('Midnight Oud', 'midnight-oud', 'An intense and sophisticated fragrance with notes of oud, amber, and spices. Perfect for evening occasions.', 120.00, 99.99, 18, (SELECT id FROM categories WHERE slug = 'mens'), 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg', ARRAY['https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg'], true, false),

('Velvet Amber', 'velvet-amber', 'A warm and sensual blend of amber, vanilla, and sandalwood. Perfect for both men and women.', 110.00, NULL, 30, (SELECT id FROM categories WHERE slug = 'unisex'), 'https://images.pexels.com/photos/7487210/pexels-photo-7487210.jpeg', NULL, true, true),

('Citrus Breeze', 'citrus-breeze', 'A refreshing blend of bergamot, lemon, and orange blossom. Ideal for hot summer days.', 75.00, 65.00, 40, (SELECT id FROM categories WHERE slug = 'womens'), 'https://images.pexels.com/photos/2827392/pexels-photo-2827392.jpeg', NULL, false, true),

('Noir Elegance', 'noir-elegance', 'A sophisticated blend of black pepper, cedarwood, and vetiver. Perfect for the modern gentleman.', 95.00, NULL, 22, (SELECT id FROM categories WHERE slug = 'mens'), 'https://images.pexels.com/photos/3655782/pexels-photo-3655782.jpeg', NULL, false, true),

('Luxury Collection', 'luxury-collection', 'A curated set of our three bestselling fragrances in travel-friendly sizes. Perfect for gifting or trying new scents.', 150.00, 135.00, 15, (SELECT id FROM categories WHERE slug = 'gift-sets'), 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg', ARRAY['https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg', 'https://images.pexels.com/photos/1022923/pexels-photo-1022923.jpeg', 'https://images.pexels.com/photos/7487210/pexels-photo-7487210.jpeg'], true, false),

('Ocean Mist', 'ocean-mist', 'A fresh and invigorating scent with notes of sea salt, driftwood, and white musk. Perfect for everyday wear.', 80.00, NULL, 35, (SELECT id FROM categories WHERE slug = 'unisex'), 'https://images.pexels.com/photos/4110339/pexels-photo-4110339.jpeg', NULL, false, true),

('Rose Eternal', 'rose-eternal', 'A timeless floral fragrance centered around the world''s finest roses, with hints of peony and lily of the valley.', 115.00, NULL, 20, (SELECT id FROM categories WHERE slug = 'womens'), 'https://images.pexels.com/photos/3214959/pexels-photo-3214959.jpeg', NULL, true, false);