import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, WarningCircle, ArrowRight } from '@phosphor-icons/react'
import { Btn, Card, Field, Input, Select } from '../components/ui'
import { ADVISOR_ROLES, SCHOLARSHIP_IDS, SOURCE_IDS, sname, type Level, type ScholarshipId, type SourceId, type Student } from '../lib/data'
import { useStore } from '../lib/store'

const COUNTRIES = ['algeria', 'morocco', 'tunisia', 'jordan', 'palestine', 'libya', 'egypt', 'other']
const LEVELS: Level[] = ['bachelor', 'master', 'phd', 'language']
const MAX_AGE: Record<Level, number> = { bachelor: 25, master: 35, phd: 40, language: 60 }

type Form = { name: string; email: string; phone: string; country: string; age: string; level: Level; major: string; gpa: string; scholarshipId: ScholarshipId; source: SourceId | '' }
const EMPTY: Form = { name: '', email: '', phone: '', country: 'algeria', age: '', level: 'bachelor', major: '', gpa: '', scholarshipId: 'cscB', source: '' }

export default function Apply() {
  const { t } = useTranslation()
  const { addStudent, login, staff, students } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ student: Student; ok: boolean; reasons: string[] } | null>(null)
  const set = <K extends keyof Form>(k: K) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  function submit(e: FormEvent) {
    e.preventDefault()
    const er: typeof errors = {}
    if (f.name.trim().length < 3) er.name = t('site.apply.errName')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = t('site.apply.errEmail')
    if (f.phone.replace(/\D/g, '').length < 8) er.phone = t('site.apply.errPhone')
    const age = Number(f.age), gpa = Number(f.gpa)
    if (!age || age < 16 || age > 60) er.age = t('site.apply.errAge')
    if (!gpa || gpa < 40 || gpa > 100) er.gpa = t('site.apply.errGpa')
    if (f.major.trim().length < 2) er.major = t('site.apply.errMajor')
    if (!f.source) er.source = t('site.apply.errSource')
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true)
    setTimeout(() => {
      const reasons: string[] = []
      if (age >= MAX_AGE[f.level]) reasons.push(t('site.apply.reasonAge', { level: t(`data.levels.${f.level}`), max: MAX_AGE[f.level] }))
      if (f.level === 'bachelor' && gpa < 75) reasons.push(t('site.apply.reasonGpa'))
      // new applications go to the advisor with the lightest load
      const advisors = staff.filter((m) => ADVISOR_ROLES.includes(m.role))
      const advisorId = [...advisors].sort((x, y) => students.filter((s) => s.advisorId === x.id).length - students.filter((s) => s.advisorId === y.id).length)[0]?.id ?? ''
      const student = addStudent({ advisorId, intake: 'sep2027', name: f.name.trim(), nameEn: f.name.trim(), email: f.email.trim(), phone: f.phone, country: f.country, age, level: f.level, major: f.major.trim(), gpa, scholarshipId: f.scholarshipId, source: f.source as SourceId })
      setDone({ student, ok: reasons.length === 0, reasons })
      setBusy(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 1100)
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card className="space-y-6 p-8">
          <div className="flex items-center gap-4">
            {done.ok ? <CheckCircle size={48} weight="fill" className="text-ok" /> : <WarningCircle size={48} weight="fill" className="text-warn" />}
            <div>
              <h1 className="text-2xl font-black">{t('site.apply.doneTitle', { name: sname(done.student).split(' ')[0] })}</h1>
              <p className="text-ink-3">{t('site.apply.ref')} <span className="latin font-bold text-ink">AIC-{done.student.id.slice(1).padStart(4, '0')}</span></p>
            </div>
          </div>
          {done.ok
            ? <p className="rounded-ctl bg-emerald-50 p-4 font-semibold text-ok">{t('site.apply.okText')}</p>
            : <div className="rounded-ctl bg-amber-50 p-4 text-warn">
                <p className="font-bold">{t('site.apply.reviewTitle')}</p>
                <ul className="mt-1 list-disc ps-5 text-sm">{done.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                <p className="mt-2 text-sm">{t('site.apply.reviewNote')}</p>
              </div>}
          <p className="text-ink-2">{t('site.apply.account')} <span className="latin font-bold">student123</span></p>
          <div className="flex flex-wrap gap-3">
            <Btn onClick={() => { login(done.student.email, 'student123'); nav('/portal') }}>{t('site.apply.openAccount')} <ArrowRight size={16} weight="bold" className="rtl:-scale-x-100" /></Btn>
            <Btn variant="ghost" to="/">{t('site.apply.backHome')}</Btn>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <h1 className="text-4xl font-black leading-tight tracking-tight">{t('site.apply.title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">{t('site.apply.text')}</p>
        <ul className="mt-6 space-y-3 text-ink-2">
          {(t('site.apply.points', { returnObjects: true }) as string[]).map((p) => (
            <li key={p} className="flex items-center gap-2.5"><CheckCircle size={20} weight="fill" className="text-crimson-600" />{p}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={submit} noValidate className="grid gap-5 rounded-card border border-line bg-white p-6 sm:grid-cols-2 sm:p-8">
        <div className="sm:col-span-2"><Field label={t('site.apply.name')} error={errors.name}><Input value={f.name} onChange={set('name')} autoComplete="name" /></Field></div>
        <Field label={t('common.email')} error={errors.email}><Input type="email" value={f.email} onChange={set('email')} autoComplete="email" className="latin text-start" /></Field>
        <Field label={t('site.apply.phone')} error={errors.phone}><Input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" className="latin text-start" /></Field>
        <Field label={t('site.apply.country')}><Select value={f.country} onChange={set('country')}>{COUNTRIES.map((c) => <option key={c} value={c}>{t(`data.countries.${c}`)}</option>)}</Select></Field>
        <Field label={t('site.apply.age')} error={errors.age}><Input inputMode="numeric" value={f.age} onChange={set('age')} /></Field>
        <Field label={t('site.apply.level')}><Select value={f.level} onChange={set('level')}>{LEVELS.map((c) => <option key={c} value={c}>{t(`data.levels.${c}`)}</option>)}</Select></Field>
        <Field label={t('site.apply.gpa')} error={errors.gpa}><Input inputMode="numeric" value={f.gpa} onChange={set('gpa')} /></Field>
        <Field label={t('site.apply.major')} error={errors.major}><Input value={f.major} onChange={set('major')} /></Field>
        <Field label={t('site.apply.scholarship')}><Select value={f.scholarshipId} onChange={set('scholarshipId')}>{SCHOLARSHIP_IDS.map((id) => <option key={id} value={id}>{t(`data.scholarships.${id}.name`)}</option>)}</Select></Field>
        <div className="sm:col-span-2"><Field label={t('site.apply.source')} error={errors.source}><Select value={f.source} onChange={set('source')}><option value="">{t('site.apply.sourcePlaceholder')}</option>{SOURCE_IDS.map((id) => <option key={id} value={id}>{t(`data.sources.${id}`)}</option>)}</Select></Field></div>
        <div className="sm:col-span-2"><Btn type="submit" size="lg" className="w-full" disabled={busy}>{busy ? t('site.apply.sending') : t('site.apply.submit')}</Btn></div>
      </form>
    </div>
  )
}
