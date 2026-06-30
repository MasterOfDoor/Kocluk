import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

const FEATURES = [
  {
    title: 'Haftalık Program',
    description: '7 günlük, 8 slotluk esnek programınızı öğretmeninizle birlikte oluşturun ve takip edin.',
    icon: '📅',
  },
  {
    title: 'Öğretmen Eşleşmesi',
    description: 'Onaylı öğretmenleri inceleyin, profillerini görün ve size uygun olanı seçin.',
    icon: '👨‍🏫',
  },
  {
    title: 'İlerleme Takibi',
    description: 'Soru bankası, deneme ve video çalışmalarınızı kategorize ederek ilerlemenizi görün.',
    icon: '📈',
  },
]

const STEPS = [
  { step: '1', title: 'Kayıt Ol', description: 'Öğrenci veya öğretmen olarak ücretsiz hesap oluşturun.' },
  { step: '2', title: 'Öğretmen Seç', description: 'Profilleri inceleyin ve istek gönderin.' },
  { step: '3', title: 'Program Oluştur', description: 'Öğretmeninizle birlikte haftalık programınızı planlayın.' },
]

const STATS = [
  { value: '500+', label: 'Aktif Öğrenci' },
  { value: '50+', label: 'Onaylı Öğretmen' },
  { value: '10K+', label: 'Tamamlanan Görev' },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-indigo-700/80 to-purple-800/70"></div>
          </div>
          <div className="relative container-app py-24 md:py-32">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                YKS&apos;ye Hazırlıkta Yanınızdayız
              </h1>
              <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Kişiselleştirilmiş haftalık programlar, deneyimli öğretmenler ve
                hedef odaklı koçluk ile sınav sürecinizi verimli yönetin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                    Ücretsiz Kayıt Ol
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="secondary" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                    Giriş Yap
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="relative py-20 bg-white overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80')] bg-cover bg-center"></div>
          </div>
          <div className="relative container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Platform Özellikleri</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                YKS hazırlık sürecinizi uçtan uca yönetmenizi sağlayan araçlar
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {FEATURES.map(f => (
                <div key={f.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative py-20 bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80')] bg-cover bg-center"></div>
          </div>
          <div className="relative container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Nasıl Çalışır?</h2>
              <p className="text-gray-500">Üç basit adımda başlayın</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {STEPS.map(s => (
                <div key={s.step} className="relative text-center bg-white/60 backdrop-blur-sm p-6 rounded-2xl">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section className="py-16 bg-white">
          <div className="container-app">
            <div className="grid grid-cols-3 gap-8 text-center">
              {STATS.map(s => (
                <div key={s.label}>
                  <p className="text-3xl md:text-4xl font-bold text-indigo-600">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-indigo-600">
          <div className="container-app text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Hemen Başlayın</h2>
            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
              Ücretsiz hesap oluşturun, size uygun öğretmeni bulun ve hedeflerinize odaklanın.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                Kayıt Ol
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
