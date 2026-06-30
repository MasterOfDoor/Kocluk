import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function VerifyEmailPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold mb-2">E-postanızı Doğrulayın</h1>
            <p className="text-gray-500 text-sm mb-6">
              Kayıt işleminiz başarılı! Hesabınızı aktifleştirmek için e-posta adresinize gönderdiğimiz
              doğrulama bağlantısına tıklayın.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>💡 İpucu:</strong> E-posta gelmedi mi? Spam/gereksiz klasörünüzü kontrol edin.
                Birkaç dakika bekledikten sonra tekrar kayıt olmayı deneyin.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-block w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
            >
              Giriş Sayfasına Dön
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
