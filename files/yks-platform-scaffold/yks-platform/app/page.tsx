import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-white pb-32 pt-20 sm:pt-32 sm:pb-40">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2000')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
          <div className="relative container-app text-center max-w-4xl mx-auto px-4">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-md">
              Merhaba, Ben Zeynep Naz Karahangil! 👋
            </h1>
            <p className="text-xl sm:text-2xl font-medium mb-10 text-indigo-50 leading-relaxed drop-shadow">
              Sıradan bir koçluktan çok daha fazlası... Benimle birlikte hedeflediğin YKS sıralamasına ulaşmaya hazır mısın? 🚀
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-gray-50 shadow-xl text-lg px-8 py-4 rounded-full font-bold transform hover:scale-105 transition-all">
                  Hemen Kayıt Ol ve Başlayalım!
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Me Section with YKS Ranking Highlight */}
        <section className="relative -mt-20 z-10 px-4">
          <div className="container-app max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100 flex flex-col md:flex-row items-center gap-12">
            
            {/* Massive YKS Highlight */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-indigo-50 px-6 py-2 rounded-full text-indigo-600 font-bold tracking-wider uppercase text-sm mb-6 border border-indigo-100">
                Geleceğin Matematik Mühendisi
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Biraz Benden Bahsedelim...
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6 font-medium">
                2006 doğumluyum. Küçükken karate ile uğraşan, oldukça sportif, enerjik, çok eğlenceli ve itiraf etmeliyim ki biraz spastik birisiyim! 🤪
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Şu anda <strong>Yıldız Teknik Üniversitesi'nde Matematik Mühendisliği</strong> okuyorum. Daha önce bir etüt merkezinde 1 yıl kadar öğretmenlik deneyimim oldu, yani öğrenci psikolojisini ve sürecin zorluklarını çok iyi biliyorum.
              </p>
              
              <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 border-l-4 border-amber-500 p-6 rounded-r-2xl transform hover:-translate-y-1 transition-transform shadow-sm">
                <p className="text-sm text-amber-800 font-bold uppercase tracking-wider mb-1">Başarımın Kanıtı</p>
                <div className="flex items-baseline justify-center md:justify-start gap-3">
                  <span className="text-6xl font-black text-amber-600 tracking-tighter">13.105</span>
                  <span className="text-2xl font-bold text-amber-700 leading-tight">Sayısal<br/>Sıralama</span>
                </div>
                <p className="text-amber-800 mt-4 font-medium">
                  Bu zorlu yollardan ben de geçtim. Şimdi sıra sende! Başarıya giden yolda sana rehberlik etmek için buradayım.
                </p>
              </div>
            </div>

            {/* Profile Image (Using Zenep.jpeg) */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 shrink-0 relative rounded-full overflow-hidden shadow-2xl border-4 border-white ring-4 ring-indigo-50">
              <img src="/images/gallery/Zenep.jpeg" alt="Zeynep Naz Karahangil" className="object-cover w-full h-full" />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-24 bg-slate-50">
          <div className="container-app max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benim Dünyamdan Kareler 📸</h2>
              <p className="text-gray-500">Çalışırken, eğlenirken, hayatın içinden...</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[250px]">
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group md:col-span-2 md:row-span-2">
                <img src="/images/gallery/6.jpeg" alt="Zeynep 1" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <img src="/images/gallery/123.jpeg" alt="Zeynep 2" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <img src="/images/gallery/4.jpeg" alt="Zeynep 3" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                <img src="/images/gallery/5.jpeg" alt="Zeynep 4" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group md:col-span-2">
                <img src="/images/gallery/11.jpeg" alt="Zeynep 5" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="container-app text-center max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Hazır Mısın? 🎯</h2>
            <p className="text-xl text-gray-500 mb-10 leading-relaxed">
              Kayıt ol, programını birlikte oluşturalım ve seni hayallerindeki üniversiteye adım adım yaklaştıralım!
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg text-lg px-10 py-4 rounded-full font-bold transform hover:scale-105 transition-all">
                Aramıza Katıl
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
