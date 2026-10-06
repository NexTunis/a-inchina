import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { Airplane, Bed, CheckCircle, Phone, SimCard, Van } from '@phosphor-icons/react'
import { Badge, Btn, Card, Field, Input } from '../components/ui'
import { stname } from '../lib/data'
import { fmtDate } from '../lib/format'
import { useStore } from '../lib/store'
import { useMe } from './PortalLayout'

export default function Arrival() {
  const me = useMe()!
  const { t } = useTranslation()
  const { updateArrival, setStage, staff } = useStore()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [flight, setFlight] = useState('')
  const [err, setErr] = useState('')
  const a = me.arrival

  if (me.stage < 5) {
    return (
      <Card className="grid place-items-center gap-3 px-6 py-16 text-center">
        <Airplane size={44} className="text-ink/25" />
        <h1 className="text-xl font-extrabold">{t('portal.arrival.earlyTitle')}</h1>
        <p className="max-w-md text-ink-2">{t('portal.arrival.earlyText')}</p>
      </Card>
    )
  }

  const hasFlight = a && a.flight !== 'TBD'

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!date || !time || flight.trim().length < 3) { setErr(t('portal.arrival.err')); return }
    setErr('')
    if (me.stage === 5) setStage(me.id, 6)
    updateArrival(me.id, { date, time, flight: flight.toUpperCase() })
  }

  const team = staff.find((g) => g.id === a?.driver)
  const steps = a ? [
    { i: Airplane, k: 'flight', ok: !!hasFlight },
    { i: Van, k: 'driver', ok: a.pickup !== 'pending' },
    { i: Bed, k: 'housing', ok: a.housing !== 'pending' },
    { i: SimCard, k: 'pickup', ok: a.pickup === 'done' },
  ] : []

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black">{t('portal.arrival.title')}</h1><p className="mt-1 text-ink-2">{t('portal.arrival.text')}</p></div>

      {!hasFlight ? (
        <Card className="p-6 sm:p-8">
          <form onSubmit={submit} className="grid gap-5 sm:grid-cols-3" noValidate>
            <Field label={t('portal.arrival.date')}><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="latin text-start" /></Field>
            <Field label={t('portal.arrival.time')}><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="latin text-start" /></Field>
            <Field label={t('portal.arrival.flight')} hint={t('portal.arrival.flightHint')}><Input value={flight} onChange={(e) => setFlight(e.target.value)} className="latin text-start" /></Field>
            {err && <p className="text-sm font-semibold text-crimson-700 sm:col-span-3">{err}</p>}
            <div className="sm:col-span-3"><Btn type="submit">{t('portal.arrival.submit')}</Btn></div>
          </form>
        </Card>
      ) : a && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="overflow-hidden">
            <div className="relative bg-ink p-6 text-white">
              <div className="dots-light absolute inset-0 opacity-50" aria-hidden />
              <div className="relative flex items-center justify-between gap-4">
                <div><p className="text-sm text-white/70">{t('portal.arrival.date')}</p><p className="text-2xl font-black">{fmtDate(a.date)}</p><p className="latin text-white/80">{a.time}</p></div>
                <motion.span animate={{ x: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="text-crimson-500"><Airplane size={44} weight="fill" className="rotate-90 rtl:-rotate-90" /></motion.span>
                <div className="text-end"><p className="text-sm text-white/70">{t('portal.arrival.airport')}</p><p className="latin text-2xl font-black">{a.airport === 'PVG' ? 'Shanghai PVG' : 'Beijing PEK'}</p><p className="latin text-white/80">{a.flight}</p></div>
              </div>
            </div>
            <ol className="space-y-1 p-5">
              {steps.map((s) => (
                <li key={s.k} className="flex items-center gap-3 rounded-ctl p-2.5">
                  <span className={`grid size-10 place-items-center rounded-full ${s.ok ? 'bg-emerald-50 text-ok' : 'bg-ink/6 text-ink-3'}`}><s.i size={20} weight="bold" /></span>
                  <span className="flex-1 font-bold">{t(`portal.arrival.steps.${s.k}`)}</span>
                  {s.ok ? <CheckCircle size={24} weight="fill" className="text-ok" /> : <Badge>{t('portal.arrival.soon')}</Badge>}
                </li>
              ))}
            </ol>
          </Card>

          <Card className="space-y-4 p-6">
            <h2 className="font-extrabold">{t('portal.arrival.team')}</h2>
            {team ? (
              <div className="space-y-2">
                <p className="text-lg font-black">{stname(team)}</p>
                <p className="text-sm text-ink-3">{t('portal.arrival.teamSub', { hub: team.hub ? t(`data.hubs.${team.hub}`) : '' })}</p>
                <p className="latin flex items-center gap-2 font-bold"><Phone size={18} className="text-crimson-600" />{team.phone}</p>
              </div>
            ) : <p className="text-sm text-ink-2">{t('portal.arrival.noDriver')}</p>}
            <p className="rounded-ctl bg-gold-100 p-3 text-sm font-semibold text-gold-700">{t('portal.arrival.sign')}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
