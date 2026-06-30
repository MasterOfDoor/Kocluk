-- ============================================================
-- YKS Koçluk Platformu — Teacher Approval & Requests
-- ============================================================

-- Add admin to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

-- New enums
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected');

-- Extend users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS approval_status approval_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- ─── teacher_requests ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  teacher_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      request_status NOT NULL DEFAULT 'pending',
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  CHECK (student_id != teacher_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS teacher_requests_one_pending
  ON teacher_requests (student_id, teacher_id)
  WHERE status = 'pending';

ALTER TABLE teacher_requests ENABLE ROW LEVEL SECURITY;

-- ─── Update users RLS ────────────────────────────────────────
DROP POLICY IF EXISTS "users_self" ON users;

CREATE POLICY "users_self_all" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "students_see_approved_teachers" ON users
  FOR SELECT USING (
    role = 'teacher' AND approval_status = 'approved'
  );

CREATE POLICY "admin_manage_users" ON users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ─── teacher_requests RLS ────────────────────────────────────
CREATE POLICY "student_insert_requests" ON teacher_requests
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "student_select_own_requests" ON teacher_requests
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "teacher_select_incoming_requests" ON teacher_requests
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "teacher_update_incoming_requests" ON teacher_requests
  FOR UPDATE USING (auth.uid() = teacher_id);

-- ─── teacher_student_relations: student can see own teacher ────
CREATE POLICY "student_sees_own_teacher" ON teacher_student_relations
  FOR SELECT USING (auth.uid() = student_id);

-- ─── Accept request → create relation ────────────────────────
CREATE OR REPLACE FUNCTION public.handle_request_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = NOW();

  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO teacher_student_relations (teacher_id, student_id)
    VALUES (NEW.teacher_id, NEW.student_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_request_status_change ON teacher_requests;
CREATE TRIGGER on_request_status_change
  BEFORE UPDATE ON teacher_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_request_status_change();

-- ─── Updated signup trigger ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_role_val user_role;
  approval_val approval_status;
BEGIN
  user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student');

  IF user_role_val = 'teacher' THEN
    approval_val := 'pending';
  ELSE
    approval_val := 'approved';
  END IF;

  INSERT INTO public.users (id, email, name, role, approval_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    user_role_val,
    approval_val
  );

  RETURN NEW;
END;
$$;

-- ─── Storage: avatars bucket ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatar_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatar_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatar_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatar_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
