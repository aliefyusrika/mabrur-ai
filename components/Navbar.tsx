import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/90 backdrop-blur-md border-b border-navy-100/50">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image 
            src="/logo.png" 
            alt="Mabrur.ai" 
            width={36} 
            height={36}
            className="rounded-xl"
          />
          <span className="text-navy-900 font-bold text-xl tracking-tight">Mabrur.ai</span>
        </Link>
        <Link 
          href="/jamaah" 
          className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 text-sm font-semibold rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all shadow-sm"
        >
          Login Jamaah
        </Link>
      </div>
    </nav>
  )
}
