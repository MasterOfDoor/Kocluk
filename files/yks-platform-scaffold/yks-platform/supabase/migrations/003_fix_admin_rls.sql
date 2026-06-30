-- Fix RLS policy to allow service role to update user roles
-- This is needed for admin role assignment during signup

DROP POLICY IF EXISTS "users_self" ON users;

CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "service_role_bypass" ON users
  FOR ALL USING (auth.role() = 'service_role');
