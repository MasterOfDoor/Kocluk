import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm">YKS</span>
              Koçluk
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              YKS hazırlık sürecinizde size özel haftalık programlar ve deneyimli öğretmenlerle hedeflerinize ulaşın.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">Özellikler</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition-colors">Nasıl Çalışır</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Kayıt Ol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm">Yasal</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="cursor-default">Hakkında</span></li>
              <li><span className="cursor-default">Gizlilik Politikası</span></li>
              <li><span className="cursor-default">İletişim</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} YKS Koçluk Platformu. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
