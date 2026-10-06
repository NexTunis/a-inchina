import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { List, X, TelegramLogo, YoutubeLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react'
import { Btn, Logo } from '../components/ui'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import ChatWidget from './ChatWidget'
import LangSwitch from '../components/LangSwitch'

const LINKS = [
  { to: '/universities', key: 'universities' },
  { to: '/scholarships', key: 'scholarships' },
  { to: '/#process', key: 'process' },
  { to: '/#vlogs', key: 'vlogs' },
]

export default function SiteLayout() {
  const { session } = useStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
    if (!loc.hash) { window.scrollTo(0, 0); return }
    const t = setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
    return () => clearTimeout(t)
  }, [loc.pathname, loc.hash])
  const home = session?.role === 'admin' ? '/admin' : '/portal'

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link to="/" aria-label={t('common.brand')}><Logo /></Link>
          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label={t('site.nav.main')}>
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('rounded-ctl px-3.5 py-2 text-[15px] font-semibold text-ink-2 transition hover:bg-ink/5 hover:text-ink', isActive && !l.to.includes('#') && 'text-crimson-700')}>{t(`site.nav.${l.key}`)}</NavLink>
            ))}
          </nav>
          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <LangSwitch />
            {session ? <Btn to={home} variant="dark" size="sm">{session.role === 'admin' ? t('site.nav.admin') : t('site.nav.account')}</Btn> : <Btn to="/login" variant="ghost" size="sm" className="max-sm:hidden">{t('common.login')}</Btn>}
            <Btn to="/apply" size="sm" className="max-sm:hidden">{t('common.apply')}</Btn>
            <button className="grid size-10 place-items-center rounded-ctl hover:bg-ink/5 lg:hidden" onClick={() => setOpen((o) => !o)} aria-label={t('site.nav.menu')} aria-expanded={open}>
              {open ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-line bg-paper px-4 py-3 lg:hidden" aria-label={t('site.nav.menu')}>
            {LINKS.map((l) => <Link key={l.to} to={l.to} className="block rounded-ctl px-3 py-3 font-semibold hover:bg-ink/5">{t(`site.nav.${l.key}`)}</Link>)}
            {!session && <Btn to="/login" variant="ghost" className="mt-2 w-full">{t('common.login')}</Btn>}
            <Btn to="/apply" className="mt-2 w-full">{t('common.apply')}</Btn>
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo light />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">{t('site.footer.tagline')}</p>
            <div className="flex gap-2">
              {[[YoutubeLogo, 'YouTube'], [InstagramLogo, 'Instagram'], [TiktokLogo, 'TikTok'], [TelegramLogo, 'Telegram']].map(([I, n]) => {
                const Icon = I as typeof YoutubeLogo
                return <span key={n as string} aria-label={n as string} className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-crimson-600"><Icon size={20} /></span>
              })}
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-bold">{t('site.footer.site')}</p>
            {LINKS.map((l) => <Link key={l.to} to={l.to} className="block text-white/70 hover:text-white">{t(`site.nav.${l.key}`)}</Link>)}
            <Link to="/apply" className="block text-white/70 hover:text-white">{t('site.footer.applyForm')}</Link>
          </div>
          <div className="space-y-3 text-sm text-white/70">
            <p className="font-bold text-white">{t('site.footer.contact')}</p>
            <p className="latin">@anood_inchina</p>
            <p className="latin">anoodcoperations@gmail.com</p>
            <p>{t('site.footer.location')}</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">{t('site.footer.demo')}</div>
      </footer>
      <ChatWidget />
    </div>
  )
}
