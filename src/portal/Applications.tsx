import { useTranslation } from 'react-i18next'
import { CheckCircle, GraduationCap, Hourglass, MapPin } from '@phosphor-icons/react'
import { useState } from 'react'
import { Badge, Btn, Card, Empty } from '../components/ui'
import { ConfirmDialog } from '../components/Modal'
import { fmtDate } from '../lib/format'
import { APP_TONE, cityName, uniName } from '../lib/data'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { useMe } from './PortalLayout'

export default function Applications() {
  const me = useMe()!
  const { universities, uname, acceptOffer } = useStore()
  const [confirming, setConfirming] = useState<string | null>(null)
  const { t, i18n } = useTranslation()
  const sid = me.scholarshipId
  const admitted = me.applications.some((a) => a.status === 'admitted')

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">{t('portal.apps.title')}</h1><p className="mt-1 text-ink-2">{t('portal.apps.text')}</p></div>

      {me.applications.length === 0 ? (
        <Card><Empty icon={<GraduationCap />} title={t('portal.apps.emptyTitle')} text={t('portal.apps.emptyText')} /></Card>
      ) : (
        <div className="grid gap-4">
          {me.applications.map((a, i) => {
            const u = universities.find((x) => x.id === a.universityId)
            if (!u) return null
            return (
              <Card key={a.universityId} className={cn('p-5', i === 0 && 'border-crimson-600/40', a.status === 'closed' && 'opacity-60')}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className={cn('zh grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-3xl font-black text-white', u.tone)}>{u.zh}</div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold">{uniName(u)}</h2>
                    {i === 0 && <Badge tone="gold">{t('portal.apps.first')}</Badge>}
                  </div>
                  {i18n.language === 'ar' && <p className="latin text-sm text-ink-3">{u.nameEn}</p>}
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-2"><MapPin size={16} className="text-crimson-600" />{cityName(u.city)}, {t(`data.programs.${me.major}`, { defaultValue: me.major })}</p>
                </div>
                <div className="text-start sm:text-end">
                  <Badge tone={APP_TONE[a.status]}>{t(`portal.apps.status.${a.status}`)}</Badge>
                  {a.accepted && <Badge tone="ok" className="mt-2">{t('portal.apps.accepted')}</Badge>}
                  {a.appNo && <p className="latin mt-2 text-xs text-ink-3">{t('portal.apps.appNo')}: {a.appNo}</p>}
                </div>
                </div>
                {(a.submittedAt || a.decidedAt || a.status === 'admitted') && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-sm text-ink-2">
                    {a.submittedAt && <span>{t('portal.apps.submitted', { date: fmtDate(a.submittedAt) })}</span>}
                    {a.decidedAt && <span>{t('portal.apps.decided', { date: fmtDate(a.decidedAt) })}</span>}
                    {a.status === 'admitted' && (
                      <span className="flex items-center gap-1.5">{t('portal.apps.csc')}: <Badge tone={a.cscResult === 'selected' ? 'ok' : a.cscResult === 'notSelected' ? 'bad' : 'warn'}>{t(`portal.apps.cscResult.${a.cscResult ?? 'pending'}`)}</Badge></span>
                    )}
                    {a.status === 'admitted' && a.accepted && (
                      <span className="flex items-center gap-1.5">{t('portal.apps.jw', { form: me.scholarshipId === 'self' ? 'JW202' : 'JW201' })}: <Badge tone={a.jwSent ? 'ok' : 'neutral'}>{a.jwSent ? t('portal.apps.jwSent') : t('portal.apps.jwWait')}</Badge></span>
                    )}
                    {a.status === 'admitted' && !a.accepted && <Btn size="sm" className="ms-auto" onClick={() => setConfirming(a.universityId)}>{t('portal.apps.confirm')}</Btn>}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirming} onClose={() => setConfirming(null)} onConfirm={() => confirming && acceptOffer(me.id, confirming)}
        title={t('portal.apps.confirm')} text={t('portal.apps.confirmText', { name: confirming ? uname(confirming) : '' })} confirmLabel={t('portal.apps.confirm')}
      />

      <Card className="grid gap-6 p-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm font-bold text-crimson-700">{t('portal.apps.target')}</p>
          <h2 className="mt-1 text-2xl font-black">{t(`data.scholarships.${sid}.name`)}</h2>
          <p className="mt-1 text-sm text-ink-3">{t(`data.scholarships.${sid}.source`)}</p>
          <p className="mt-2 text-xs text-ink-3">{t('portal.apps.cscNote')}</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-bold">{admitted ? <><CheckCircle size={20} weight="fill" className="text-ok" />{t('portal.apps.nominated')}</> : <><Hourglass size={20} className="text-warn" />{t('portal.apps.waiting')}</>}</p>
        </div>
        <ul className="grid gap-2 text-sm sm:grid-cols-2">
          {(t(`data.scholarships.${sid}.covers`, { returnObjects: true }) as string[]).map((c) => <li key={c} className="flex items-center gap-2 rounded-ctl bg-paper px-3 py-2.5 font-semibold"><CheckCircle size={18} weight="fill" className="text-ok" />{c}</li>)}
          <li className="rounded-ctl bg-gold-100 px-3 py-2.5 font-semibold sm:col-span-2">{t('portal.apps.stipend')}: {t(`data.scholarships.${sid}.stipend`)}</li>
        </ul>
      </Card>
    </div>
  )
}
