import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'

const LANGUAGES: { code: string; label: string; emoji?: string }[] = [
  { code: 'en', label: 'EN', emoji: '🇺🇸' },
  { code: 'ko', label: '한국어', emoji: '🇰🇷' },
  { code: 'ja', label: '日本語', emoji: '🇯🇵' },
]

export default function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const [lang, setLang] = useState<string>(() => (typeof window !== 'undefined' ? (i18n?.language || localStorage.getItem('i18nextLng') || 'en') : 'en'))
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setLang(i18n?.language || localStorage.getItem('i18nextLng') || 'en')
  }, [i18n?.language])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const change = async (code: string) => {
    try {
      await i18n.changeLanguage(code)
      localStorage.setItem('i18nextLng', code)
      setLang(code)
    } catch (err) {
      console.warn('language change failed', err)
    } finally {
      setOpen(false)
    }
  }

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  return (
    <div ref={ref} className={`relative ${compact ? 'inline-block' : ''}`}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className={`flex items-center gap-2 bg-dark-card border border-dark-border text-gray-300 rounded-md px-3 py-1 text-sm hover:bg-dark-hover focus:outline-none ${compact ? 'px-2 py-0.5' : ''}`}
      >
        <span className="text-sm">{current.emoji} {current.label}</span>
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-40 bg-dark-card border border-dark-border rounded-md shadow-lg py-1 z-50">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              onClick={() => change(l.code)}
              className={`w-full text-left px-3 py-2 hover:bg-dark-hover ${l.code === lang ? 'text-primary font-semibold' : 'text-gray-300'}`}
            >
              <span className="mr-2">{l.emoji}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
