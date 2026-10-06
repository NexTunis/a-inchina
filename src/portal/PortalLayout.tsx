import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitch from '../components/LangSwitch'
import { Airplane, ChatsCircle, FileText, GraduationCap, House, SignOut } from '@phosphor-icons/react'
import { Avatar, Logo } from '../components/ui'
import { useStore } from '../lib/store'
import { sname } from '../lib/data'
import { cn } from '../lib/cn'

const NAV = [
  { to: '/portal', key: 'overview', icon: House, end: true },
  { to: '/portal/documents', key: 'documents', icon: FileText },
  { to: '/portal/applications', key: 'applications', icon: GraduationCap },
  { to: '/portal/arrival', key: 'arrival', icon: Airplane },
  { to: '/portal/messages', key: 'messages', icon: ChatsCircle },
]

export function useMe() {
  const { session, students } = useStore()
  return session?.role === 'student' ? students.find((s) => s.id === session.studentId) : undefined
}

export default function PortalLayout() {
  const { session, logout } = useStore()
  const me = useMe()
  const nav = useNavigate()
  const { t } = useTranslation()
  if (!session) return <Navigate to="/login" replace />
  if (session.role === 'admin') return <Navigate to="/admin" replace />
  if (!me) return <Navigate to="/login" replace />

  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <NavLink to="/" aria-label={t('common.brand')}><Logo /></NavLink>
          <div className="ms-auto flex items-center gap-3">
            <LangSwitch />
            <div className="hidden text-end sm:block"><p className="text-sm font-bold leading-tight">{sname(me)}</p><p className="text-xs text-ink-3">{t(`data.countries.${me.country}`)}</p></div>
            <Avatar name={sname(me)} />
            <button onClick={() => { logout(); nav('/') }} aria-label={t('common.logout')} className="grid size-10 place-items-center rounded-ctl text-ink-2 hover:bg-ink/5"><SignOut size={20} /></button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6" aria-label={t('portal.nav.aria')}>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => cn('flex shrink-0 items-center gap-2 border-b-2 px-3.5 py-3 text-sm font-bold transition', isActive ? 'border-crimson-600 text-crimson-700' : 'border-transparent text-ink-3 hover:text-ink')}>
              <n.icon size={18} weight="bold" />{t(`portal.nav.${n.key}`)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><Outlet /></main>
    </div>
  )
}
