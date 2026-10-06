import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LangSwitch from '../components/LangSwitch'
import { Airplane, ChartPieSlice, FileMagnifyingGlass, GraduationCap, IdentificationBadge, Kanban, SignOut, UsersThree, ArrowCounterClockwise, Globe } from '@phosphor-icons/react'
import { Avatar, Logo } from '../components/ui'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { DOC_TYPES } from '../lib/data'

export default function AdminLayout() {
  const { session, logout, students, universities, resetDemo } = useStore()
  const nav = useNavigate()
  const { t } = useTranslation()
  if (!session) return <Navigate to="/login" replace />
  if (session.role !== 'admin') return <Navigate to="/portal" replace />

  const pendingDocs = students.reduce((n, s) => n + DOC_TYPES.filter((d) => s.docs[d.key].status === 'pending').length, 0)
  const items = [
    { to: '/admin', label: t('admin.nav.dashboard'), icon: ChartPieSlice, end: true },
    { to: '/admin/students', label: t('admin.nav.students'), icon: UsersThree, badge: students.length },
    { to: '/admin/pipeline', label: t('admin.nav.pipeline'), icon: Kanban },
    { to: '/admin/documents', label: t('admin.nav.documents'), icon: FileMagnifyingGlass, badge: pendingDocs, hot: true },
    { to: '/admin/universities', label: t('admin.nav.universities'), icon: GraduationCap, badge: universities.length },
    { to: '/admin/arrivals', label: t('admin.nav.arrivals'), icon: Airplane },
    { to: '/admin/staff', label: t('admin.nav.staff'), icon: IdentificationBadge },
  ]

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-e">
        <div className="flex h-full flex-col gap-2 p-3 lg:p-4">
          <div className="flex items-center justify-between px-2 py-2 lg:py-4"><Logo /><span className="flex items-center gap-2 lg:hidden"><LangSwitch /><NavLink to="/" aria-label={t('admin.nav.publicSite')} className="grid size-9 place-items-center rounded-ctl text-ink-3 hover:bg-ink/5"><Globe size={20} /></NavLink></span></div>
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label={t('admin.nav.aria')}>
            {items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cn('flex shrink-0 items-center gap-3 rounded-ctl px-3 py-2.5 text-sm font-bold transition', isActive ? 'bg-crimson-50 text-crimson-700' : 'text-ink-2 hover:bg-ink/5')}>
                <it.icon size={20} weight="bold" />
                <span className="flex-1 whitespace-nowrap">{it.label}</span>
                {it.badge ? <span className={cn('latin rounded-full px-2 py-0.5 text-xs font-bold', it.hot ? 'bg-crimson-600 text-white' : 'bg-ink/8 text-ink-2')}>{it.badge}</span> : null}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto hidden space-y-1 lg:block">
            <div className="px-2 pb-2"><LangSwitch /></div>
            <NavLink to="/" className="flex items-center gap-3 rounded-ctl px-3 py-2.5 text-sm font-semibold text-ink-3 hover:bg-ink/5"><Globe size={18} />{t('admin.nav.publicSite')}</NavLink>
            <button onClick={resetDemo} className="flex w-full items-center gap-3 rounded-ctl px-3 py-2.5 text-sm font-semibold text-ink-3 hover:bg-ink/5"><ArrowCounterClockwise size={18} />{t('admin.nav.reset')}</button>
            <div className="flex items-center gap-3 border-t border-line px-2 pt-4">
              <Avatar name="Admin User" size={38} />
              <div className="flex-1"><p className="text-sm font-bold leading-tight">{t('admin.nav.admin')}</p><p className="latin text-xs text-ink-3">admin@admin.com</p></div>
              <button onClick={() => { logout(); nav('/') }} aria-label={t('common.logout')} className="grid size-9 place-items-center rounded-ctl text-ink-2 hover:bg-ink/5"><SignOut size={19} /></button>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-7 sm:px-8 lg:py-9"><Outlet /></main>
    </div>
  )
}

export function PageHead({ title, text, children }: { title: string; text?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-black tracking-tight">{title}</h1>{text && <p className="mt-1 text-ink-2">{text}</p>}</div>
      {children}
    </div>
  )
}
