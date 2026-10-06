import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Circle, ArrowRight, Hourglass } from '@phosphor-icons/react'
import { Avatar, Badge, Btn, Card, Progress } from '../components/ui'
import { DOC_TYPES, STAGES, primaryUni, sname, stname } from '../lib/data'
import { fmtDate } from '../lib/format'
import { cn } from '../lib/cn'
import { useStaffMember, useStore } from '../lib/store'
import { useMe } from './PortalLayout'

export default function Overview() {
  const me = useMe()!
  const { uname } = useStore()
  const { t } = useTranslation()
  const adv = useStaffMember(me.advisorId)
  const pct = Math.round((me.stage / STAGES.length) * 100)
  const docsOk = DOC_TYPES.filter((d) => me.docs[d.key].status === 'verified').length
  const issues = DOC_TYPES.filter((d) => ['rejected', 'missing'].includes(me.docs[d.key].status) && d.required)

  const next =
    issues.length ? { t: t('portal.overview.nextDocs', { n: issues.length }), to: '/portal/documents', cta: t('portal.overview.nextDocsCta') }
    : me.stage === 5 ? { t: t('portal.overview.nextFlight'), to: '/portal/arrival', cta: t('portal.overview.nextFlightCta') }
    : { t: t('portal.overview.nextNone'), to: '/portal/messages', cta: t('portal.overview.nextNoneCta') }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-card bg-crimson-600 p-7 text-white sm:p-9">
        <div className="dots-light absolute inset-0 opacity-50" aria-hidden />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="text-white/80">{t('portal.overview.hello', { name: sname(me).split(' ')[0] })}</p>
            <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">{t('portal.overview.stageNow', { stage: t(`data.stages.${me.stage}.label`) })}</h1>
            <p className="mt-2 max-w-lg text-white/85">{t(`data.stages.${me.stage}.hint`)}</p>
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm font-bold"><span>{t('portal.overview.progress')}</span><span className="latin">{pct}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/25"><motion.div className="h-full rounded-full bg-gold-300" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} /></div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="p-6">
          <h2 className="text-lg font-extrabold">{t('portal.overview.stages')}</h2>
          <ol className="mt-5 space-y-0">
            {STAGES.map((s, i) => {
              const done = s.id < me.stage, cur = s.id === me.stage
              return (
                <li key={s.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STAGES.length - 1 && <span className={cn('absolute start-[15px] top-8 h-[calc(100%-2rem)] w-0.5', done ? 'bg-crimson-600' : 'bg-ink/10')} aria-hidden />}
                  <span className="relative z-0 mt-0.5 shrink-0">
                    {done ? <CheckCircle size={32} weight="fill" className="text-crimson-600" />
                      : cur ? <span className="grid size-8 place-items-center rounded-full bg-gold-500 text-ink"><Hourglass size={18} weight="bold" /></span>
                      : <Circle size={32} className="text-ink/20" />}
                  </span>
                  <div className={cn(!done && !cur && 'opacity-55')}>
                    <p className="flex items-center gap-2 font-extrabold">{t(`data.stages.${s.id}.label`)}{cur && <Badge tone="gold">{t('portal.overview.current')}</Badge>}</p>
                    <p className="text-sm text-ink-2">{t(`data.stages.${s.id}.hint`)}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-3 border-gold-500/60 bg-gold-100/50 p-6">
            <p className="text-sm font-bold text-gold-700">{t('portal.overview.next')}</p>
            <p className="text-lg font-extrabold leading-snug">{next.t}</p>
            <Btn to={next.to} size="sm" variant="dark">{next.cta} <ArrowRight size={14} weight="bold" className="rtl:-scale-x-100" /></Btn>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-extrabold">{t('portal.overview.summary')}</h2>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-ink-3">{t('portal.overview.university')}</dt><dd className="font-bold">{primaryUni(me) ? uname(primaryUni(me)!) : t('portal.overview.noUni')}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-3">{t('portal.overview.major')}</dt><dd className="font-bold">{t(`data.programs.${me.major}`, { defaultValue: me.major })}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-3">{t('portal.overview.intake')}</dt><dd className="font-bold">{t(`data.intake.${me.intake}`)}</dd></div>
              {me.reference && <div className="flex justify-between gap-3"><dt className="text-ink-3">{t('portal.overview.reference')}</dt><dd className="latin font-bold">{me.reference}</dd></div>}
              <div className="flex justify-between gap-3"><dt className="text-ink-3">{t('portal.overview.updated')}</dt><dd className="font-bold">{fmtDate(me.updatedAt)}</dd></div>
            </dl>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-ink-3"><span>{t('portal.overview.verifiedDocs')}</span><span className="latin">{docsOk}/{DOC_TYPES.length}</span></div>
              <Progress value={(docsOk / DOC_TYPES.length) * 100} />
            </div>
          </Card>

          <Card className="flex items-center gap-4 p-5">
            <Avatar name={adv ? stname(adv) : '?'} size={48} />
            <div className="flex-1"><p className="text-xs text-ink-3">{t('portal.overview.advisor')}</p><p className="font-extrabold">{adv ? stname(adv) : '-'}</p><p className="text-xs text-ink-3">{adv ? t(`admin.staff.roles.${adv.role}`) : ''}</p></div>
            <Link to="/portal/messages" className="rounded-ctl bg-crimson-50 px-3 py-2 text-sm font-bold text-crimson-700 hover:bg-crimson-100">{t('portal.overview.message')}</Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
