/*
  # Fix admin authentication

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Allow users to check their admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial admin user
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users
WHERE email = 'DoaaAdmin@gmail.com'
ON CONFLICT (user_id) DO NOTHING;