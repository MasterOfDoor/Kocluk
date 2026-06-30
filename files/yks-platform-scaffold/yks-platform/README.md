# YKS Koçluk Platformu — Kurulum

## 1. Geliştirme ortamı

```bash
npx create-next-app@latest yks-platform --typescript --tailwind --app
cd yks-platform

# Bağımlılıkları kur
npm install @supabase/supabase-js @supabase/ssr @dnd-kit/core @dnd-kit/utilities
```

Klasörleri bu scaffold'dan kopyala:
```
components/  →  components/
lib/         →  lib/
types/       →  types/
app/         →  app/  (mevcut dosyaların üzerine)
middleware.ts
tailwind.config.ts
```

## 2. Supabase kurulumu

1. [supabase.com](https://supabase.com) → yeni proje oluştur
2. SQL Editor → migration dosyalarını sırayla çalıştır:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_teacher_approval_and_requests.sql`
3. Project Settings → API → URL ve anon key'i kopyala

## 3. Ortam değişkenleri

`.env.local` dosyası oluştur (`.env.local.example` referans al):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=admin@example.com
```

`ADMIN_EMAILS` listesindeki e-postalar kayıt olduğunda otomatik admin rolü alır.

## 4. Geliştirme sunucusu

```bash
npm run dev
# → http://localhost:3000
```

## 5. Özellikler

- **Landing page** — hero, özellikler, nasıl çalışır, CTA
- **Auth** — kayıt (öğrenci/öğretmen), giriş, middleware ile rol koruması
- **Öğretmen onayı** — admin panelinden onay/red (`/admin/teachers`)
- **Öğretmen keşfi** — öğrenciler onaylı öğretmenleri görür (`/teachers`)
- **İstek akışı** — öğrenci istek gönderir, öğretmen kabul/red eder
- **Haftalık program** — öğretmen düzenler, öğrenci read-only görür

## 6. Deployment

**Vercel:**
```bash
npx vercel --prod
# Environment Variables'a .env.local içeriğini ekle
```

---

## Dosya yapısı

```
app/
  page.tsx                 ← Landing page
  login/ register/         ← Auth
  teachers/                ← Öğretmen listesi (öğrenci)
  my-schedule/             ← Öğrenci programı (read-only)
  dashboard/               ← Öğretmen: öğrenciler, istekler, profil
  admin/teachers/          ← Admin onay paneli
  student/[id]/            ← Öğretmen: öğrenci programı
components/
  layout/ ui/ teachers/ schedule/
lib/
  supabase/ auth.ts teachers.ts requests.ts admin.ts tasks.ts
middleware.ts
supabase/migrations/
  001_initial_schema.sql
  002_teacher_approval_and_requests.sql
```
