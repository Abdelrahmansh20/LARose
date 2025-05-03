/*
  # Add admin role and initial admin user

  1. Changes
    - Add admin boolean column to auth.users
    - Create admin user
    - Add RLS policies for admin access
*/

-- Add admin column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_uid UUID;
BEGIN
  -- Create admin user if not exists
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    is_admin
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'DoaaAdmin@gmail.com',
    crypt('DoaaLaRose', gen_salt('bf')),
    NOW(),
    true
  )
  ON CONFLICT (email) DO UPDATE
  SET is_admin = true;
END;
$$ LANGUAGE plpgsql;

-- Execute function
SELECT create_admin_user();

-- Update RLS policies to allow admin access
CREATE POLICY "Admins can do everything"
  ON products
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.is_admin = true
  ));