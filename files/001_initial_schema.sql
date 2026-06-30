-- ============================================================
-- YKS Koçluk Platformu — Initial Schema
-- ============================================================

-- Roles enum
CREATE TYPE user_role AS ENUM ('teacher', 'student');

-- Task category enum
CREATE TYPE task_category AS ENUM ('Soru Bankası', 'Konu Tekrarı', 'Deneme', 'Video');

-- ─── users ───────────────────────────────────────────────────
CREATE TABLE users (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  role      user_role NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── teacher_student_relations ───────────────────────────────
CREATE TABLE teacher_student_relations (
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, student_id)
);

-- ─── tasks ───────────────────────────────────────────────────
CREATE TABLE tasks (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week    SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  slot_index     SMALLINT NOT NULL CHECK (slot_index BETWEEN 0 AND 7),
  category       task_category NOT NULL,
  title          TEXT NOT NULL,
  content        TEXT,
  duration_hours NUMERIC(4,1) NOT NULL DEFAULT 1,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  -- one task per slot per student
  UNIQUE (student_id, day_of_week, slot_index)
);

-- ─── RLS ─────────────────────────────────────────────────────
ALTER TABLE users                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_student_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks                    ENABLE ROW LEVEL SECURITY;

-- users: everyone reads own row; insert on signup
CREATE POLICY "users_self" ON users
  FOR ALL USING (auth.uid() = id);

-- teacher sees their students
CREATE POLICY "teacher_sees_students" ON teacher_student_relations
  FOR SELECT USING (auth.uid() = teacher_id);

-- tasks: teacher CRUD for own students
CREATE POLICY "teacher_task_crud" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM teacher_student_relations tsr
      WHERE tsr.teacher_id = auth.uid()
        AND tsr.student_id = tasks.student_id
    )
  );

-- student sees own tasks (read-only)
CREATE POLICY "student_task_read" ON tasks
  FOR SELECT USING (auth.uid() = student_id);

-- ─── Helper function: new user signup ────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
