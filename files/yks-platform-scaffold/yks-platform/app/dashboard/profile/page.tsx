'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { createClient } from '@/lib/supabase/client'
import { uploadAvatar, updateTeacherProfile } from '@/lib/teachers'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('users')
        .select('name, bio, avatar_url')
        .eq('id', user.id)
        .single()

      if (profile) {
        setName(profile.name)
        setBio(profile.bio ?? '')
        setAvatarUrl(profile.avatar_url)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await updateTeacherProfile({ bio })
      setMessage('Profil güncellendi.')
    } catch {
      setMessage('Güncelleme başarısız.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMessage('')
    try {
      const url = await uploadAvatar(file)
      setAvatarUrl(url)
      setMessage('Fotoğraf yüklendi.')
    } catch {
      setMessage('Fotoğraf yüklenemedi.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <><Header /><LoadingSpinner /><Footer /></>

  return (
    <>
      <Header />
      <main className="flex-1 container-app py-10">
        <h1 className="text-2xl font-bold mb-8">Profil Düzenle</h1>
        <form onSubmit={handleSave} className="max-w-lg space-y-6">
          <div className="flex items-center gap-4">
            <Avatar src={avatarUrl} name={name} size="lg" />
            <div>
              <label className="cursor-pointer text-sm text-indigo-600 hover:underline">
                {uploading ? 'Yükleniyor…' : 'Fotoğraf değiştir'}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploading} />
              </label>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 2MB</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Ad Soyad</label>
            <input
              value={name}
              disabled
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Hakkımda</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={5}
              placeholder="Deneyimleriniz, uzmanlık alanlarınız…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {message && <p className="text-sm text-indigo-600">{message}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </Button>
        </form>
      </main>
      <Footer />
    </>
  )
}
