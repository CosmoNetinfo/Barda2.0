'use client'

import { useState } from 'react'
import { Link as LinkIcon, Check } from 'lucide-react'

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button 
      onClick={handleCopy}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
        copied 
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
    >
      {copied ? <Check size={18} className="text-emerald-600" /> : <LinkIcon size={18} className="text-gray-500" />}
      {copied ? 'Link copiato!' : 'Copia link'}
    </button>
  )
}
