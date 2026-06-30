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
```

## 2. Supabase kurulumu

1. [supabase.com](https://supabase.com) → yeni proje oluştur
2. SQL Editor → `supabase/migrations/001_initial_schema.sql` dosyasını çalıştır
3. Project Settings → API → URL ve anon key'i kopyala

## 3. Ortam değişkenleri

`.env.local` dosyası oluştur:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Geliştirme sunucusu

```bash
npm run dev
# → http://localhost:3000
```

## 5. Deployment

**Vercel:**
```bash
npx vercel --prod
# Environment Variables'a .env.local içeriğini ekle
```

---

## Dosya yapısı

```
app/
  dashboard/page.tsx       ← Öğrenci listesi (Teacher view)
  student/[id]/page.tsx    ← Haftalık program
components/
  schedule/
    WeeklyGrid.tsx         ← 7×8 grid + DnD logic (COPY-ON-DROP)
    TaskCard.tsx           ← Tek görev kartı
    SlotModal.tsx          ← Boş slota tıklayınca açılan form
lib/
  supabase.ts              ← Client singleton
  tasks.ts                 ← CRUD + copyTaskToSlot()
types/index.ts             ← Task, User, SlotCoords, TaskFormValues
supabase/migrations/
  001_initial_schema.sql   ← Tüm tablolar + RLS + trigger
```

## Drag & Drop — Copy-on-Drop mantığı

`WeeklyGrid.tsx` içinde `handleDragEnd`:

```typescript
// Hedef slot boşsa → KOPYALA (orijinal yerinde kalır)
const copied = await copyTaskToSlot(activeTask, { day, slot })
setTasks(prev => [...prev, copied])
```

`copyTaskToSlot` (`lib/tasks.ts`): id ve koordinatları çıkarır,
kalan alanlarla yeni DB kaydı oluşturur.
