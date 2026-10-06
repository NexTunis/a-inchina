import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '../components/Modal'
import { Btn, Field, Input, Select } from '../components/ui'
import { ADVISOR_ROLES, SCHOLARSHIP_IDS, SOURCE_IDS, STAGES, sname, stname, type Level, type ScholarshipId, type SourceId, type Student } from '../lib/data'
import { useStore } from '../lib/store'

const COUNTRIES = ['algeria', 'morocco', 'tunisia', 'jordan', 'palestine', 'libya', 'egypt', 'other']
const LEVELS: Level[] = ['bachelor', 'master', 'phd', 'language']
const INTAKES = ['mar2027', 'sep2027']

interface FormState {
  name: string; email: string; phone: string; country: string; age: string; level: Level; major: string; gpa: string
  scholarshipId: ScholarshipId; source: SourceId; advisorId: string; intake: string; stage: string; total: string; paid: string
}

interface Props { open: boolean; onClose: () => void; student?: Student; onSaved?: (s: Student) => void }

export default function StudentFormModal({ open, onClose, student, onSaved }: Props) {
  const { t, i18n } = useTranslation()
  const { staff, addStudent, updateStudent } = useStore()
  const advisors = staff.filter((s) => ADVISOR_ROLES.includes(s.role))
  const majorText = (m: string) => t(`data.programs.${m}`, { defaultValue: m })

  const empty = (): FormState => ({
    name: '', email: '', phone: '', country: 'algeria', age: '', level: 'bachelor', major: '', gpa: '', scholarshipId: 'cscB',
    source: 'website', advisorId: advisors[0]?.id ?? '', intake: 'sep2027', stage: '1', total: '6500', paid: '0',
  })
  const fromStudent = (s: Student): FormState => ({
    name: sname(s), email: s.email, phone: s.phone, country: s.country, age: String(s.age), level: s.level, major: majorText(s.major), gpa: String(s.gpa),
    scholarshipId: s.scholarshipId, source: s.source, advisorId: s.advisorId, intake: s.intake, stage: String(s.stage), total: String(s.fees.total), paid: String(s.fees.paid),
  })

  const [f, setF] = useState<FormState>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  useEffect(() => { if (open) { setF(student ? fromStudent(student) : empty()); setErrors({}) } }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof FormState>(k: K) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  function submit(e: FormEvent) {
    e.preventDefault()
    const er: typeof errors = {}
    const age = Number(f.age), gpa = Number(f.gpa), total = Number(f.total), paid = Number(f.paid)
    if (f.name.trim().length < 3) er.name = t('site.apply.errName')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = t('site.apply.errEmail')
    if (f.phone.replace(/\D/g, '').length < 8) er.phone = t('site.apply.errPhone')
    if (!age || age < 16 || age > 60) er.age = t('site.apply.errAge')
    if (!gpa || gpa < 40 || gpa > 100) er.gpa = t('site.apply.errGpa')
    if (f.major.trim().length < 2) er.major = t('site.apply.errMajor')
    if (isNaN(total) || total < 0) er.total = t('admin.form.errAmount')
    if (isNaN(paid) || paid < 0 || paid > total) er.paid = t('admin.form.errPaid')
    setErrors(er)
    if (Object.keys(er).length) return

    // keep the original major key when the text was not changed
    const major = student && f.major === majorText(student.major) ? student.major : f.major.trim()
    const base = {
      email: f.email.trim(), phone: f.phone.trim(), country: f.country, age, level: f.level, major, gpa, scholarshipId: f.scholarshipId,
      source: f.source, advisorId: f.advisorId, intake: f.intake, fees: { total, paid }, stage: Number(f.stage) as Student['stage'],
    }
    if (student) {
      // the name field edits the name of the language currently shown
      const names = i18n.language === 'en' ? { nameEn: f.name.trim() } : { name: f.name.trim() }
      updateStudent(student.id, { ...base, ...names })
      onSaved?.({ ...student, ...base, ...names })
    } else {
      // call addStudent first: with `onSaved?.(addStudent(...))` the argument is skipped when onSaved is undefined
      const created = addStudent({ ...base, name: f.name.trim(), nameEn: f.name.trim() })
      onSaved?.(created)
    }
    onClose()
  }

  const formId = 'student-form'
  return (
    <Modal open={open} onClose={onClose} size="lg" title={student ? t('admin.form.editTitle') : t('admin.form.addTitle')} footer={<>
      <Btn variant="ghost" onClick={onClose}>{t('common.cancel')}</Btn>
      <Btn type="submit" form={formId}>{student ? t('common.save') : t('admin.form.add')}</Btn>
    </>}>
      <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label={t('site.apply.name')} error={errors.name}><Input value={f.name} onChange={set('name')} autoFocus /></Field></div>
        <Field label={t('common.email')} error={errors.email}><Input type="email" value={f.email} onChange={set('email')} className="latin text-start" /></Field>
        <Field label={t('site.apply.phone')} error={errors.phone}><Input type="tel" value={f.phone} onChange={set('phone')} className="latin text-start" /></Field>
        <Field label={t('site.apply.country')}><Select value={f.country} onChange={set('country')}>{COUNTRIES.map((c) => <option key={c} value={c}>{t(`data.countries.${c}`)}</option>)}</Select></Field>
        <Field label={t('site.apply.age')} error={errors.age}><Input inputMode="numeric" value={f.age} onChange={set('age')} /></Field>
        <Field label={t('site.apply.level')}><Select value={f.level} onChange={set('level')}>{LEVELS.map((c) => <option key={c} value={c}>{t(`data.levels.${c}`)}</option>)}</Select></Field>
        <Field label={t('site.apply.gpa')} error={errors.gpa}><Input inputMode="numeric" value={f.gpa} onChange={set('gpa')} /></Field>
        <Field label={t('site.apply.major')} error={errors.major}><Input value={f.major} onChange={set('major')} /></Field>
        <Field label={t('site.apply.scholarship')}><Select value={f.scholarshipId} onChange={set('scholarshipId')}>{SCHOLARSHIP_IDS.map((id) => <option key={id} value={id}>{t(`data.scholarships.${id}.name`)}</option>)}</Select></Field>
        <Field label={t('site.apply.source')}><Select value={f.source} onChange={set('source')}>{SOURCE_IDS.map((id) => <option key={id} value={id}>{t(`data.sources.${id}`)}</option>)}</Select></Field>
        <Field label={t('admin.form.advisor')}><Select value={f.advisorId} onChange={set('advisorId')}>{advisors.map((a) => <option key={a.id} value={a.id}>{stname(a)}</option>)}</Select></Field>
        <Field label={t('admin.form.intake')}><Select value={f.intake} onChange={set('intake')}>{INTAKES.map((i) => <option key={i} value={i}>{t(`data.intake.${i}`)}</option>)}</Select></Field>
        <Field label={t('admin.form.stage')}><Select value={f.stage} onChange={set('stage')}>{STAGES.map((s) => <option key={s.id} value={s.id}>{s.id}. {t(`data.stages.${s.id}.label`)}</option>)}</Select></Field>
        <Field label={t('admin.form.total')} error={errors.total}><Input inputMode="numeric" value={f.total} onChange={set('total')} /></Field>
        <Field label={t('admin.form.paid')} error={errors.paid}><Input inputMode="numeric" value={f.paid} onChange={set('paid')} /></Field>
      </form>
    </Modal>
  )
}
