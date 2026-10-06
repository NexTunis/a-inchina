import { useMemo, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Envelope, GraduationCap, Globe, MagnifyingGlass, MapPin, PencilSimple, Phone, Plus, Trash, User } from '@phosphor-icons/react'
import { Badge, Btn, Card, Empty, Field, Input, Select, Textarea } from '../components/ui'
import { ConfirmDialog, Modal } from '../components/Modal'
import { CITY_IDS, SCHOLARSHIP_IDS, cityName, uniName, type ScholarshipId, type University } from '../lib/data'
import { fmtNum } from '../lib/format'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { PageHead } from './AdminLayout'

const TONES = ['from-crimson-700 to-crimson-500', 'from-ink to-ink-2', 'from-gold-700 to-gold-500', 'from-crimson-800 to-crimson-600', 'from-ink-2 to-ink-3', 'from-crimson-600 to-gold-500']
const INTAKES = ['mar2027', 'sep2027']
const LANGS = ['English', 'Chinese'] as const
const OTHER = '__other'

interface FormState {
  nameEn: string; nameAr: string; zh: string; city: string; cityOther: string; website: string; contactName: string; email: string; phone: string
  programs: string; languages: University['languages']; fee: string; tuitionMin: string; tuitionMax: string
  scholarships: ScholarshipId[]; intakes: string[]; partnerSince: string; status: 'active' | 'paused'; notes: string
}
const EMPTY: FormState = {
  nameEn: '', nameAr: '', zh: '', city: 'shanghai', cityOther: '', website: '', contactName: '', email: '', phone: '', programs: '', languages: ['English'],
  fee: '500', tuitionMin: '', tuitionMax: '', scholarships: [], intakes: ['sep2027'], partnerSince: '2026', status: 'active', notes: '',
}
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export default function Universities() {
  const { universities, students, addUniversity, updateUniversity, removeUniversity } = useStore()
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('all')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<University | null>(null)
  const [deleting, setDeleting] = useState<University | null>(null)
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const set = <K extends keyof FormState>(k: K) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  const cities = useMemo(() => [...new Set(universities.map((u) => u.city))], [universities])
  const list = useMemo(() => universities.filter((u) =>
    (city === 'all' || u.city === city) &&
    (!q || `${uniName(u)} ${u.nameEn} ${u.zh} ${u.programs.join(' ')}`.toLowerCase().includes(q.toLowerCase())),
  ), [universities, city, q])
  const studentCount = (id: string) => students.filter((s) => s.applications.some((a) => a.universityId === id)).length

  const openAdd = () => { setEditing(null); setF(EMPTY); setErrors({}); setOpen(true) }
  const openEdit = (u: University) => {
    const known = CITY_IDS.includes(u.city as never)
    setEditing(u); setErrors({}); setOpen(true)
    setF({
      nameEn: u.nameEn, nameAr: u.nameAr ?? t(`data.unis.${u.id}.name`, { lng: 'ar', defaultValue: '' }), zh: u.zh, city: known ? u.city : OTHER, cityOther: known ? '' : u.city,
      website: u.website ?? '', contactName: u.contactName ?? '', email: u.email ?? '', phone: u.phone ?? '', programs: u.programs.map((p) => t(`data.programs.${p}`, { lng: 'en', defaultValue: p })).join(', '),
      languages: u.languages, fee: String(u.fee), tuitionMin: String(u.tuition[0]), tuitionMax: String(u.tuition[1]), scholarships: u.scholarships ?? [], intakes: u.intakes ?? [],
      partnerSince: u.partnerSince ?? '', status: u.status ?? 'active', notes: u.notes ?? '',
    })
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const er: typeof errors = {}
    const fee = Number(f.fee), min = Number(f.tuitionMin), max = Number(f.tuitionMax)
    const city = f.city === OTHER ? f.cityOther.trim() : f.city
    if (f.nameEn.trim().length < 3) er.nameEn = t('site.apply.errName')
    if (!city) er.cityOther = t('admin.unis.errCity')
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) er.email = t('site.apply.errEmail')
    if (f.website && !/^https?:\/\/\S+\.\S+/.test(f.website)) er.website = t('admin.unis.errWebsite')
    if (!f.languages.length) er.languages = t('admin.unis.errLang')
    if (isNaN(fee) || fee < 0) er.fee = t('admin.form.errAmount')
    if (!min || !max || min > max) er.tuitionMin = t('admin.unis.errTuition')
    setErrors(er)
    if (Object.keys(er).length) return

    // programs the admin types in English map back to the translated keys when they match
    const data: Omit<University, 'id'> = {
      nameEn: f.nameEn.trim(), nameAr: f.nameAr.trim() || undefined, zh: f.zh.trim() || f.nameEn.trim().slice(0, 1), city,
      programs: f.programs.split(',').map((p) => p.trim()).filter(Boolean), languages: f.languages, fee, tuition: [min, max],
      tone: editing?.tone ?? TONES[universities.length % TONES.length], website: f.website.trim() || undefined, contactName: f.contactName.trim() || undefined,
      email: f.email.trim() || undefined, phone: f.phone.trim() || undefined, scholarships: f.scholarships, intakes: f.intakes,
      partnerSince: f.partnerSince.trim() || undefined, status: f.status, notes: f.notes.trim() || undefined,
    }
    if (editing) updateUniversity(editing.id, data); else addUniversity(data)
    setOpen(false)
  }

  const delBlocked = deleting ? studentCount(deleting.id) > 0 : false
  const chip = (on: boolean) => cn('flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm font-bold transition', on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-ink/40')

  return (
    <div>
      <PageHead title={t('admin.unis.title')} text={t('admin.unis.text')}>
        <Btn onClick={openAdd}><Plus size={18} weight="bold" />{t('admin.unis.add')}</Btn>
      </PageHead>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <MagnifyingGlass className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-3" size={18} />
          <Input aria-label={t('admin.unis.search')} placeholder={t('admin.unis.search')} value={q} onChange={(e) => setQ(e.target.value)} className="ps-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', ...cities].map((c) => (
            <button key={c} onClick={() => setCity(c)} aria-pressed={city === c} className={cn('h-10 rounded-full px-4 text-sm font-bold transition', city === c ? 'bg-ink text-white' : 'border border-line bg-white text-ink-2 hover:border-ink/40')}>{c === 'all' ? t('common.all') : cityName(c)}</button>
          ))}
        </div>
      </div>

      {list.length === 0 ? <Card><Empty icon={<GraduationCap />} title={t('admin.unis.emptyTitle')} text={t('admin.unis.emptyText')} /></Card> : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((u) => (
            <Card key={u.id} className={cn('flex flex-col overflow-hidden', u.status === 'paused' && 'opacity-75')}>
              <div className="flex items-center gap-4 p-5">
                <div className={cn('zh grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl font-black text-white', u.tone)}>{u.zh}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-extrabold">{uniName(u)}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-ink-2"><MapPin size={15} className="text-crimson-600" />{cityName(u.city)}</p>
                </div>
                <Badge tone={u.status === 'paused' ? 'warn' : 'ok'}>{t(`admin.unis.status.${u.status ?? 'active'}`)}</Badge>
              </div>
              <div className="space-y-3 border-t border-line p-5 text-sm">
                <div className="flex flex-wrap gap-1.5">{u.programs.map((p) => <Badge key={p}>{t(`data.programs.${p}`, { defaultValue: p })}</Badge>)}</div>
                <dl className="grid grid-cols-3 gap-3">
                  <div><dt className="text-xs text-ink-3">{t('admin.unis.fee')}</dt><dd className="latin font-bold">{fmtNum(u.fee)} CNY</dd></div>
                  <div><dt className="text-xs text-ink-3">{t('admin.unis.tuition')}</dt><dd className="latin font-bold">{fmtNum(u.tuition[0])}-{fmtNum(u.tuition[1])}</dd></div>
                  <div><dt className="text-xs text-ink-3">{t('admin.unis.students')}</dt><dd className="latin font-bold">{studentCount(u.id)}</dd></div>
                </dl>
                <p className="text-ink-2">{u.languages.map((l) => t(`data.langs.${l}`)).join(t('common.and'))}{u.intakes?.length ? ` - ${u.intakes.map((i) => t(`data.intake.${i}`)).join(', ')}` : ''}</p>
                {!!u.scholarships?.length && <div className="flex flex-wrap gap-1.5">{u.scholarships.map((sc) => <Badge key={sc} tone="gold">{t(`data.scholarships.${sc}.name`)}</Badge>)}</div>}
                <ul className="latin space-y-1.5 text-ink-2">
                  {u.website && <li className="flex items-center gap-2"><Globe size={16} className="text-ink-3" /><a href={u.website} target="_blank" rel="noreferrer" className="truncate hover:text-crimson-700">{u.website.replace(/^https?:\/\//, '')}</a></li>}
                  {u.contactName && <li className="flex items-center gap-2"><User size={16} className="text-ink-3" />{u.contactName}</li>}
                  {u.email && <li className="flex items-center gap-2"><Envelope size={16} className="text-ink-3" />{u.email}</li>}
                  {u.phone && <li className="flex items-center gap-2"><Phone size={16} className="text-ink-3" />{u.phone}</li>}
                </ul>
                {u.notes && <p className="rounded-ctl bg-ink/4 px-3 py-2 text-ink-2">{u.notes}</p>}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line px-5 py-3">
                <p className="text-xs text-ink-3">{u.partnerSince ? t('admin.unis.since', { year: u.partnerSince }) : ''}</p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(u)} aria-label={`${t('common.edit')} ${uniName(u)}`} className="grid size-9 place-items-center rounded-ctl text-ink-2 hover:bg-ink/6"><PencilSimple size={18} /></button>
                  <button onClick={() => setDeleting(u)} aria-label={`${t('common.delete')} ${uniName(u)}`} className="grid size-9 place-items-center rounded-ctl text-crimson-700 hover:bg-crimson-50"><Trash size={18} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} size="lg" title={editing ? t('admin.unis.editTitle') : t('admin.unis.addTitle')} footer={<>
        <Btn variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Btn>
        <Btn type="submit" form="uni-form">{editing ? t('common.save') : t('admin.unis.add')}</Btn>
      </>}>
        <form id="uni-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label={t('admin.unis.nameEn')} error={errors.nameEn}><Input value={f.nameEn} onChange={set('nameEn')} autoFocus /></Field>
          <Field label={t('admin.unis.nameAr')}><Input value={f.nameAr} onChange={set('nameAr')} dir="rtl" /></Field>
          <Field label={t('admin.unis.zh')} hint={t('admin.unis.zhHint')}><Input value={f.zh} onChange={set('zh')} className="zh" maxLength={4} /></Field>
          <Field label={t('admin.unis.city')}><Select value={f.city} onChange={set('city')}>{CITY_IDS.map((c) => <option key={c} value={c}>{cityName(c)}</option>)}<option value={OTHER}>{t('admin.unis.otherCity')}</option></Select></Field>
          {f.city === OTHER && <div className="sm:col-span-2"><Field label={t('admin.unis.cityName')} error={errors.cityOther}><Input value={f.cityOther} onChange={set('cityOther')} /></Field></div>}
          <Field label={t('admin.unis.website')} error={errors.website}><Input value={f.website} onChange={set('website')} placeholder="https://" className="latin text-start" /></Field>
          <Field label={t('admin.unis.contact')}><Input value={f.contactName} onChange={set('contactName')} /></Field>
          <Field label={t('common.email')} error={errors.email}><Input type="email" value={f.email} onChange={set('email')} className="latin text-start" /></Field>
          <Field label={t('admin.staff.phone')}><Input type="tel" value={f.phone} onChange={set('phone')} className="latin text-start" /></Field>
          <div className="sm:col-span-2"><Field label={t('admin.unis.programs')} hint={t('admin.unis.programsHint')}><Input value={f.programs} onChange={set('programs')} /></Field></div>
          <Field label={t('admin.unis.fee')} error={errors.fee}><Input inputMode="numeric" value={f.fee} onChange={set('fee')} /></Field>
          <Field label={t('admin.unis.tuitionRange')} error={errors.tuitionMin}>
            <div className="flex items-center gap-2"><Input inputMode="numeric" value={f.tuitionMin} onChange={set('tuitionMin')} aria-label="min" /><span className="text-ink-3">-</span><Input inputMode="numeric" value={f.tuitionMax} onChange={set('tuitionMax')} aria-label="max" /></div>
          </Field>
          <div className="sm:col-span-2"><Field label={t('admin.unis.languages')} error={errors.languages}>
            <div className="flex flex-wrap gap-2">{LANGS.map((l) => <label key={l} className={chip(f.languages.includes(l))}><input type="checkbox" className="sr-only" checked={f.languages.includes(l)} onChange={() => setF((p) => ({ ...p, languages: toggle(p.languages, l) }))} />{t(`data.langs.${l}`)}</label>)}</div>
          </Field></div>
          <div className="sm:col-span-2"><Field label={t('admin.unis.scholarships')}>
            <div className="flex flex-wrap gap-2">{SCHOLARSHIP_IDS.map((sc) => <label key={sc} className={chip(f.scholarships.includes(sc))}><input type="checkbox" className="sr-only" checked={f.scholarships.includes(sc)} onChange={() => setF((p) => ({ ...p, scholarships: toggle(p.scholarships, sc) }))} />{t(`data.scholarships.${sc}.name`)}</label>)}</div>
          </Field></div>
          <div className="sm:col-span-2"><Field label={t('admin.unis.intakes')}>
            <div className="flex flex-wrap gap-2">{INTAKES.map((i) => <label key={i} className={chip(f.intakes.includes(i))}><input type="checkbox" className="sr-only" checked={f.intakes.includes(i)} onChange={() => setF((p) => ({ ...p, intakes: toggle(p.intakes, i) }))} />{t(`data.intake.${i}`)}</label>)}</div>
          </Field></div>
          <Field label={t('admin.unis.partnerSince')}><Input inputMode="numeric" value={f.partnerSince} onChange={set('partnerSince')} maxLength={4} className="latin text-start" /></Field>
          <Field label={t('admin.unis.statusLabel')} hint={t('admin.unis.statusHint')}><Select value={f.status} onChange={set('status')}><option value="active">{t('admin.unis.status.active')}</option><option value="paused">{t('admin.unis.status.paused')}</option></Select></Field>
          <div className="sm:col-span-2"><Field label={t('admin.unis.notes')}><Textarea value={f.notes} onChange={set('notes')} /></Field></div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => deleting && removeUniversity(deleting.id)}
        title={t('admin.unis.deleteTitle')} text={t('admin.unis.deleteText', { name: deleting ? uniName(deleting) : '' })}
        warning={delBlocked ? t('admin.unis.deleteBlocked', { n: deleting ? studentCount(deleting.id) : 0 }) : undefined} disabled={delBlocked} confirmLabel={t('admin.unis.deleteConfirm')}
      />
    </div>
  )
}
