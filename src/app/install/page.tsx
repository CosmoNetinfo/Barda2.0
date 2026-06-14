import Link from 'next/link'
import { Download, Share, MoreVertical, PlusSquare, ArrowLeft } from 'lucide-react'

export default function InstallGuidePage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-8 pb-24">
      <header className="flex items-center gap-4 border-b pb-6 border-gray-200">
        <Link href="/" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-barlow uppercase">Installa l&apos;App</h1>
          <p className="text-gray-500 font-medium mt-1">Aggiungi Bardò alla schermata home.</p>
        </div>
      </header>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-12">
        
        {/* iOS Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
              <Download size={24} />
            </div>
            <h2 className="text-2xl font-bold font-barlow uppercase text-gray-900">Per iPhone (iOS)</h2>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <ol className="space-y-6 relative border-l-2 border-blue-200 ml-3 pl-6">
              <li className="relative">
                <span className="absolute -left-[35px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <p className="font-bold text-gray-900 mb-1">Apri in Safari</p>
                <p className="text-gray-500 text-sm">Assicurati di usare Safari, non Chrome o l&apos;app Google.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">Tocca l&apos;icona Condividi <span className="bg-white p-1 rounded-md shadow-sm border border-gray-200 text-blue-500"><Share size={16} /></span></p>
                <p className="text-gray-500 text-sm">Si trova in basso al centro dello schermo.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">Scegli &quot;Aggiungi a schermata Home&quot; <span className="bg-white p-1 rounded-md shadow-sm border border-gray-200 text-gray-700"><PlusSquare size={16} /></span></p>
                <p className="text-gray-500 text-sm">Scorri il menu verso il basso per trovare questa opzione.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <p className="font-bold text-gray-900 mb-1">Tocca &quot;Aggiungi&quot;</p>
                <p className="text-gray-500 text-sm">In alto a destra.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* Android Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
              <Download size={24} />
            </div>
            <h2 className="text-2xl font-bold font-barlow uppercase text-gray-900">Per Android</h2>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <ol className="space-y-6 relative border-l-2 border-emerald-200 ml-3 pl-6">
              <li className="relative">
                <span className="absolute -left-[35px] bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <p className="font-bold text-gray-900 mb-1">Apri in Chrome</p>
                <p className="text-gray-500 text-sm">Assicurati di usare il browser Chrome.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">Tocca i 3 puntini <span className="bg-white p-1 rounded-md shadow-sm border border-gray-200 text-gray-700"><MoreVertical size={16} /></span></p>
                <p className="text-gray-500 text-sm">Si trovano in alto a destra.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <p className="font-bold text-gray-900 mb-1">Scegli &quot;Aggiungi a schermata Home&quot;</p>
                <p className="text-gray-500 text-sm">In alcuni telefoni potrebbe esserci scritto &quot;Installa app&quot;.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[35px] bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <p className="font-bold text-gray-900 mb-1">Conferma &quot;Installa&quot;</p>
              </li>
            </ol>
          </div>
        </section>

      </div>
    </div>
  )
}
