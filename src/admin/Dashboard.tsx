import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, Airplane, Coins, FileMagnifyingGlass, UsersThree, UserPlus } from '@phosphor-icons/react'
import { Avatar, Badge, Card } from '../components/ui'
import { DOC_TYPES, MONTHLY_LEADS, SOURCE_IDS, STAGES, sname } from '../lib/data'
import { fmtMonth, fmtNum, fmtShort } from '../lib/format'
import { useStore } from '../lib/store'
import { PageHead } from './AdminLayout'

const PIE = ['#c8102e', '#e6b009', '#1a1d20', '#5f666d', '#e0314d', '#a35f00', '#9aa1a8']
const tip = { borderRadius: 12, border: '1px solid #e4e6e9', fontFamily: 'var(--font-sans)' }

export default function Dashboard() {
  const { students } = useStore()
  const { t } = useTranslation()
  const monthly = MONTHLY_LEADS.map((m) => ({ ...m, m: fmtMonth(m.month) }))
  const sources = SOURCE_IDS.map((id) => {
    const count = students.filter((s) => s.source === id).length
    return { id, count, name: t(`data.sources.${id}`), value: students.length ? Math.round((count / students.length) * 100) : 0 }
  }).filter((s) => s.count > 0).sort((a, b) => b.count - a.count)
  const pending = students.reduce((n, s) => n + DOC_TYPES.filter((d) => s.docs[d.key].status === 'pending').length, 0)
  const leadsWeek = students.filter((s) => s.createdAt >= '2026-09-29').length
  const arrivals = students.filter((s) => s.arrival && s.stage === 6)
  const paid = students.reduce((n, s) => n + s.fees.paid, 0)
  const due = students.reduce((n, s) => n + (s.fees.total - s.fees.paid), 0)
  const byStage = STAGES.map((s) => ({ ...s, n: students.filter((x) => x.stage === s.id).length }))
  const max = Math.max(...byStage.map((s) => s.n), 1)
  const recent = [...students].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6)

  const kpis = [
    { icon: UsersThree, label: t('admin.dash.active'), value: students.length, to: '/admin/students' },
    { icon: UserPlus, label: t('admin.dash.newWeek'), value: leadsWeek, to: '/admin/pipeline' },
    { icon: FileMagnifyingGlass, label: t('admin.dash.pendingDocs'), value: pending, to: '/admin/documents', hot: true },
    { icon: Airplane, label: t('admin.dash.arrivals'), value: arrivals.length, to: '/admin/arrivals' },
  ]

  return (
    <div>
      <PageHead title={t('admin.dash.title')} text={t('admin.dash.text')} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className="group rounded-card border border-line bg-white p-5 transition hover:border-crimson-600/50">
            <div className="flex items-center justify-between">
              <span className={`grid size-10 place-items-center rounded-full ${k.hot ? 'bg-crimson-600 text-white' : 'bg-crimson-50 text-crimson-600'}`}><k.icon size={20} weight="bold" /></span>
              <ArrowRight size={16} className="text-ink-3 transition group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
            </div>
            <p className="mt-4 text-4xl font-black"><span className="latin">{k.value}</span></p>
            <p className="mt-1 text-sm font-semibold text-ink-3">{k.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between"><h2 className="font-extrabold">{t('admin.dash.leadsTitle')}</h2>
            <div className="flex gap-4 text-xs font-semibold text-ink-2"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-crimson-600" />{t('admin.dash.leads')}</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-gold-500" />{t('admin.dash.enrolled')}</span></div>
          </div>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#c8102e" stopOpacity="0.28" /><stop offset="1" stopColor="#c8102e" stopOpacity="0" /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e4e6e9" />
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#5f666d', fontFamily: 'var(--font-sans)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#5f666d' }} />
                <Tooltip contentStyle={tip} />
                <Area type="monotone" dataKey="leads" name={t('admin.dash.leads')} stroke="#c8102e" strokeWidth={2.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="enrolled" name={t('admin.dash.enrolled')} stroke="#e6b009" strokeWidth={2.5} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col p-6">
          <h2 className="font-extrabold">{t('admin.dash.sources')}</h2>
          <p className="mt-1 text-sm text-ink-3">{t('admin.dash.sourcesNote')}</p>
          <div className="flex flex-1 items-center gap-4">
            <div className="size-40 shrink-0" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={sources} dataKey="count" nameKey="name" innerRadius={44} outerRadius={72} paddingAngle={2} stroke="none">{sources.map((_, i) => <Cell key={i} fill={PIE[i]} />)}</Pie><Tooltip contentStyle={tip} formatter={(v) => `${v}`} /></PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-2 text-sm">
              {sources.map((s, i) => <li key={s.id} className="flex items-center gap-2"><i className="size-2.5 rounded-sm" style={{ background: PIE[i] }} /><span className="flex-1 font-semibold">{s.name}</span><span className="latin font-bold">{s.count} <span className="font-medium text-ink-3">({s.value}%)</span></span></li>)}
            </ul>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Card className="p-6">
          <h2 className="font-extrabold">{t('admin.dash.byStage')}</h2>
          <ul className="mt-5 space-y-3">
            {byStage.map((s) => (
              <li key={s.id} className="flex items-center gap-3 text-sm">
                <span className="w-44 shrink-0 font-semibold text-ink-2">{t(`data.stages.${s.id}.label`)}</span>
                <span className="h-5 rounded-md bg-crimson-600" style={{ width: `${(s.n / max) * 100}%`, minWidth: s.n ? 8 : 0, opacity: 0.35 + 0.65 * (s.n / max) }} />
                <span className="latin font-bold">{s.n}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between"><h2 className="font-extrabold">{t('admin.dash.recent')}</h2><Link to="/admin/students" className="text-sm font-bold text-crimson-700">{t('admin.dash.allStudents')}</Link></div>
          <ul className="mt-4 divide-y divide-line">
            {recent.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/students/${s.id}`} className="flex items-center gap-3 py-3 transition hover:opacity-80">
                  <Avatar name={sname(s)} />
                  <div className="min-w-0 flex-1"><p className="truncate font-bold">{sname(s)}</p><p className="text-xs text-ink-3">{t(`data.stages.${s.stage}.label`)}</p></div>
                  <span className="text-xs text-ink-3">{fmtShort(s.updatedAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4 p-6">
        <span className="grid size-10 place-items-center rounded-full bg-gold-100 text-gold-700"><Coins size={20} weight="bold" /></span>
        <div><p className="text-sm text-ink-3">{t('admin.dash.collected')}</p><p className="latin text-2xl font-black">{fmtNum(paid)} <span className="text-sm">USD</span></p></div>
        <div><p className="text-sm text-ink-3">{t('admin.dash.outstanding')}</p><p className="latin text-2xl font-black">{fmtNum(due)} <span className="text-sm">USD</span></p></div>
        <Badge tone="gold" className="ms-auto">{t('common.demoData')}</Badge>
      </Card>
    </div>
  )
}
