import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, CaretDown, Check, Envelope, Eye, PencilSimple, Phone, Plus, Trash, X } from '@phosphor-icons/react'
import { Avatar, Badge, Btn, Card, Empty, Progress, Select } from '../components/ui'
import { cn } from '../lib/cn'
import { ConfirmDialog } from '../components/Modal'
import { DocBadge } from '../components/docs'
import DocPreview from '../components/DocPreview'
import { APP_STATUSES, APP_TONE, CSC_RESULTS, DOC_TYPES, MAX_UNIVERSITIES, cityName, sname, stname, type AppStatus, type CscResult, type DocKey } from '../lib/data'
import { fmtDate, fmtNum } from '../lib/format'
import { useStaffMember, useStore } from '../lib/store'
import { stageTone } from './Students'
import StudentFormModal from './StudentFormModal'


export default function StudentDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { students, staff, universities, uname, setStage, setDoc, removeStudent, addApplication, removeApplication, setApplicationStatus, updateApplication, acceptOffer } = useStore()
  const { t } = useTranslation()
  const s = students.find((x) => x.id === id)
  const advisor = useStaffMember(s?.advisorId)
  const [docsOpen, setDocsOpen] = useState(true)
  const [shown, setShown] = useState({ stage: 0, dir: 1 })
  const [preview, setPreview] = useState<DocKey | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [pick, setPick] = useState('')
  if (!s) return <Empty icon={<X />} title={t('admin.detail.notFound')} text={t('admin.detail.notFoundText')} />

  // remember which way the stage moved so the animation slides forwards or backwards
  if (s.stage !== shown.stage) setShown({ stage: s.stage, dir: s.stage > shown.stage && shown.stage ? 1 : shown.stage ? -1 : 1 })
  const dir = shown.dir
  const verified = DOC_TYPES.filter((d) => s.docs[d.key].status === 'verified').length
  const docsBlocked = DOC_TYPES.some((d) => d.required && s.docs[d.key].status !== 'verified') && s.stage === 2
  const uniBlocked = s.stage === 3 && s.applications.length === 0
  const offerBlocked = s.stage === 4 && !s.applications.some((a) => a.status === 'admitted' || a.accepted)
  const acceptBlocked = s.stage === 5 && !s.applications.some((a) => a.accepted)
  const blocked = docsBlocked || uniBlocked || offerBlocked || acceptBlocked
  const available = universities.filter((u) => u.status !== 'paused' && !s.applications.some((a) => a.universityId === u.id))
  const advisorsLabel = advisor ? stname(advisor) : '-'

  return (
    <div className="space-y-6">
      <Link to="/admin/students" className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-3 hover:text-ink"><ArrowRight size={16} className="ltr:-scale-x-100" />{t('admin.detail.back')}</Link>

      <Card className="flex flex-wrap items-center gap-5 p-6">
        <Avatar name={sname(s)} size={64} />
        <div className="min-w-60 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-2xl font-black">{sname(s)}</h1><span className="relative inline-flex overflow-hidden"><AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <motion.span key={s.stage} custom={dir} initial={{ y: dir * 18, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -dir * 18, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 26 }}><Badge tone={stageTone(s.stage)}>{t(`data.stages.${s.stage}.label`)}</Badge></motion.span>
          </AnimatePresence></span></div>
          <p className="mt-1 text-ink-2">{t('admin.detail.summary', { country: t(`data.countries.${s.country}`), age: s.age, level: t(`data.levels.${s.level}`), major: t(`data.programs.${s.major}`, { defaultValue: s.major }) })}</p>
          <div className="latin mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-3"><span className="flex items-center gap-1.5"><Envelope size={16} />{s.email}</span><span className="flex items-center gap-1.5"><Phone size={16} />{s.phone}</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="ghost" size="sm" onClick={() => setEditOpen(true)}><PencilSimple size={16} />{t('common.edit')}</Btn>
          <Btn variant="soft" size="sm" onClick={() => setDeleteOpen(true)}><Trash size={16} />{t('common.delete')}</Btn>
          <Btn variant="ghost" size="sm" disabled={s.stage === 1} onClick={() => setStage(s.id, (s.stage - 1) as typeof s.stage)}>{t('admin.detail.prev')}</Btn>
          <Btn size="sm" disabled={s.stage === 8 || blocked} onClick={() => setStage(s.id, (s.stage + 1) as typeof s.stage)}>{t('admin.detail.next')}</Btn>
        </div>
        <ol className="relative mt-1 grid w-full grid-cols-8 gap-1" aria-label={t('admin.detail.changeStage')}>
          <span className="absolute inset-x-[6.25%] top-[13px] h-1 rounded-full bg-ink/10" aria-hidden />
          <motion.span className="absolute top-[13px] h-1 rounded-full bg-crimson-600 ltr:left-[6.25%] rtl:right-[6.25%]" aria-hidden initial={false} animate={{ width: `${((s.stage - 1) / 7) * 87.5}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
            const done = n < s.stage, current = n === s.stage
            return (
              <li key={n} className="relative flex flex-col items-center gap-1.5">
                <motion.span key={`${n}-${current}`} initial={false} animate={{ scale: current ? [1, 1.35, 1] : 1 }} transition={{ duration: 0.5 }}
                  className={cn('latin relative grid size-7 place-items-center rounded-full border-2 text-xs font-bold transition-colors duration-300', done || current ? 'border-crimson-600 bg-crimson-600 text-white' : 'border-ink/15 bg-white text-ink-3')}>
                  {done ? <Check size={14} weight="bold" /> : n}
                  {current && <motion.span className="absolute inset-0 rounded-full border-2 border-crimson-600" initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.9, opacity: 0 }} transition={{ duration: 1.1, repeat: 1 }} aria-hidden />}
                </motion.span>
                <span className={cn('hidden text-center text-[11px] font-semibold leading-tight xl:block', current ? 'text-ink' : 'text-ink-3')}>{t(`data.stages.${n}.label`)}</span>
              </li>
            )
          })}
        </ol>
        {docsBlocked && <p className="w-full rounded-ctl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-warn">{t('admin.detail.blocked')}</p>}
        {offerBlocked && <p className="w-full rounded-ctl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-warn">{t('admin.detail.needOffer')}</p>}
        {acceptBlocked && <p className="w-full rounded-ctl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-warn">{t('admin.detail.needAccept')}</p>}
        {uniBlocked && <p className="w-full rounded-ctl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-warn">{t('admin.detail.blockedUni')}</p>}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <button type="button" onClick={() => setDocsOpen((o) => !o)} aria-expanded={docsOpen} aria-controls="docs-list" className="flex w-full items-center gap-3 text-start">
              <h2 className="flex-1 font-extrabold">{t('admin.detail.docs')}</h2>
              <span className="latin text-sm text-ink-3">{verified}/{DOC_TYPES.length}</span>
              <span className="grid size-8 place-items-center rounded-full border border-line text-ink-2 transition hover:bg-ink/5"><CaretDown size={16} weight="bold" className={cn('transition-transform duration-300', docsOpen && 'rotate-180')} /></span>
            </button>
            <Progress value={(verified / DOC_TYPES.length) * 100} className="mt-3" />
            <AnimatePresence initial={false}>
              {docsOpen && (
                <motion.div id="docs-list" key="list" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <ul className="mt-4 divide-y divide-line">
              {DOC_TYPES.map((d) => {
                const st = s.docs[d.key]
                return (
                  <li key={d.key} className="py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="min-w-40 flex-1"><p className="font-bold">{t(`data.docs.${d.key}.label`)}</p>{st.uploadedAt && <p className="text-xs text-ink-3">{t('portal.docs.uploadedOn', { date: fmtDate(st.uploadedAt) })}</p>}</div>
                      <DocBadge status={st.status} />
                      {st.status !== 'missing' && (
                        <button onClick={() => setPreview(d.key)} className="flex h-9 items-center gap-1.5 rounded-ctl border border-line px-3 text-sm font-bold text-ink-2 hover:bg-ink/5"><Eye size={16} />{t('common.view')}</button>
                      )}
                    </div>
                    {st.status === 'rejected' && st.note && <p className="mt-1.5 text-sm text-crimson-700">{t(st.note, { defaultValue: st.note })}</p>}
                  </li>
                )
              })}
            </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card className="p-6">
            <h2 className="font-extrabold">{t('admin.detail.unis')}</h2>
            <p className="mt-1 text-sm text-ink-3">{t('admin.detail.unisText')}</p>
            {s.applications.length === 0 ? (
              <p className="mt-4 rounded-ctl border border-dashed border-ink/20 p-5 text-center text-sm text-ink-3">{t('admin.detail.noUnis')}</p>
            ) : (
              <ul className="mt-4 divide-y divide-line">
                {s.applications.map((a, i) => {
                  const form = s.scholarshipId === 'self' ? 'JW202' : 'JW201'
                  const field = 'flex flex-col gap-1 text-xs font-bold text-ink-3'
                  const box = 'flex h-9 cursor-pointer items-center gap-2 rounded-ctl border border-line px-3 text-sm font-semibold text-ink-2'
                  return (
                    <li key={a.universityId} className={cn('space-y-3 py-4', a.status === 'closed' && 'opacity-60')}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className="font-bold">{uname(a.universityId)}</p>
                        {i === 0 && <Badge tone="gold">{t('portal.apps.first')}</Badge>}
                        {a.accepted && <Badge tone="ok"><Check size={12} weight="bold" className="me-1" />{t('admin.detail.accepted')}</Badge>}
                        <span className="text-xs text-ink-3">{cityName(universities.find((u) => u.id === a.universityId)?.city ?? '')}</span>
                        <span className="ms-auto flex items-center gap-1">
                          <Badge tone={APP_TONE[a.status]}>{t(`portal.apps.status.${a.status}`)}</Badge>
                          <button onClick={() => removeApplication(s.id, a.universityId)} aria-label={`${t('common.remove')} ${uname(a.universityId)}`} className="grid size-8 place-items-center rounded-ctl text-crimson-700 hover:bg-crimson-50"><Trash size={17} /></button>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-end gap-3">
                        <label className={field}>{t('admin.detail.uniStatus')}
                          <Select aria-label={t('admin.detail.appStatus')} className="h-9 w-44 text-sm font-normal text-ink" value={a.status} onChange={(e) => setApplicationStatus(s.id, a.universityId, e.target.value as AppStatus)}>
                            {APP_STATUSES.map((x) => <option key={x} value={x}>{t(`portal.apps.status.${x}`)}</option>)}
                          </Select>
                        </label>
                        <label className={field}>{t('admin.detail.cscResult')}
                          <Select className="h-9 w-40 text-sm font-normal text-ink" value={a.cscResult ?? 'pending'} onChange={(e) => updateApplication(s.id, a.universityId, { cscResult: e.target.value as CscResult })}>
                            {CSC_RESULTS.map((x) => <option key={x} value={x}>{t(`portal.apps.cscResult.${x}`)}</option>)}
                          </Select>
                        </label>
                        <label className={field}>{t('admin.detail.appNo')}
                          <input className="latin h-9 w-40 rounded-ctl border border-line px-3 text-sm font-normal text-ink outline-none focus:border-crimson-600" defaultValue={a.appNo ?? ''} key={a.appNo ?? ''} onBlur={(e) => e.target.value.trim() !== (a.appNo ?? '') && updateApplication(s.id, a.universityId, { appNo: e.target.value.trim() || undefined })} />
                        </label>
                        <label className={box}><input type="checkbox" className="accent-crimson-600" checked={!!a.feePaid} onChange={(e) => updateApplication(s.id, a.universityId, { feePaid: e.target.checked })} />{t('admin.detail.feePaid')}</label>
                        {a.status === 'admitted' && (
                          <>
                            <label className={box}><input type="checkbox" className="accent-crimson-600" checked={!!a.jwSent} onChange={(e) => updateApplication(s.id, a.universityId, { jwSent: e.target.checked })} />{t('admin.detail.jw', { form })}</label>
                            {!a.accepted && <Btn size="sm" className="h-9" onClick={() => acceptOffer(s.id, a.universityId)}><Check size={16} weight="bold" />{t('admin.detail.accept')}</Btn>}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-ink-3">
                        {[a.submittedAt && t('admin.detail.submittedOn', { date: fmtDate(a.submittedAt) }), a.decidedAt && t('admin.detail.decidedOn', { date: fmtDate(a.decidedAt) }), a.status === 'closed' && t('admin.detail.closedNote')].filter(Boolean).join(' - ')}
                      </p>
                    </li>
                  )
                })}
              </ul>
            )}
            {s.applications.length >= MAX_UNIVERSITIES && <p className="mt-4 rounded-ctl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-warn">{t('admin.detail.capWarn', { n: MAX_UNIVERSITIES })}</p>}
            {available.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Select aria-label={t('admin.detail.addUni')} className="max-w-xs flex-1" value={pick} onChange={(e) => setPick(e.target.value)}>
                  <option value="">{t('admin.detail.pickUni')}</option>
                  {available.map((u) => <option key={u.id} value={u.id}>{uname(u.id)}</option>)}
                </Select>
                <Btn disabled={!pick} onClick={() => { addApplication(s.id, pick); setPick('') }}><Plus size={16} weight="bold" />{t('admin.detail.addUni')}</Btn>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-3 p-6">
            <h2 className="font-extrabold">{t('admin.detail.info')}</h2>
            <dl className="grid gap-2.5 text-sm">
              {([['scholarship', t(`data.scholarships.${s.scholarshipId}.name`)], ['intake', t(`data.intake.${s.intake}`)], ['gpa', `${s.gpa}%`], ['advisor', advisorsLabel], ['source', t(`data.sources.${s.source}`)], ['reference', s.reference ?? t('admin.detail.notFiled')]] as const).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3"><dt className="text-ink-3">{t(`admin.detail.fields.${k}`)}</dt><dd className="font-bold">{v}</dd></div>
              ))}
            </dl>
            <div className="pt-1"><label className="mb-1.5 block text-xs font-bold text-ink-3" htmlFor="stg">{t('admin.detail.changeStage')}</label>
              <Select id="stg" value={s.stage} onChange={(e) => setStage(s.id, Number(e.target.value) as typeof s.stage)}>{[1, 2, 3, 4, 5, 6, 7, 8].map((x) => <option key={x} value={x}>{x}. {t(`data.stages.${x}.label`)}</option>)}</Select></div>
          </Card>

          <Card className="space-y-3 p-6">
            <h2 className="font-extrabold">{t('admin.detail.fees')}</h2>
            <p className="latin text-2xl font-black">{fmtNum(s.fees.paid)} <span className="text-sm font-semibold text-ink-3">/ {fmtNum(s.fees.total)} USD</span></p>
            <Progress value={s.fees.total ? (s.fees.paid / s.fees.total) * 100 : 0} />
            <Badge tone={s.fees.paid >= s.fees.total ? 'ok' : 'warn'}>{s.fees.paid >= s.fees.total ? t('admin.detail.paid') : t('admin.detail.remaining', { amount: fmtNum(s.fees.total - s.fees.paid) })}</Badge>
          </Card>

          {s.arrival && (
            <Card className="space-y-2 p-6 text-sm">
              <h2 className="font-extrabold">{t('admin.detail.arrival')}</h2>
              <p>{fmtDate(s.arrival.date)} <span className="latin text-ink-3">{s.arrival.time}</span></p>
              <p className="latin text-ink-2">{s.arrival.flight === 'TBD' ? t('admin.arrivals.tbd') : s.arrival.flight} - {s.arrival.airport}</p>
              <p className="text-ink-2">{t('admin.detail.driver')}: {(() => { const d = staff.find((x) => x.id === s.arrival?.driver); return d ? stname(d) : t('admin.detail.unassigned') })()}</p>
            </Card>
          )}
        </div>
      </div>

      <DocPreview student={s} docKey={preview} onClose={() => setPreview(null)} onReview={preview ? (status, note) => setDoc(s.id, preview, status, note) : undefined} />
      <StudentFormModal open={editOpen} onClose={() => setEditOpen(false)} student={s} />
      <ConfirmDialog
        open={deleteOpen} onClose={() => setDeleteOpen(false)}
        onConfirm={() => { removeStudent(s.id); nav('/admin/students') }}
        title={t('admin.delete.title')} text={t('admin.delete.text', { name: sname(s) })}
        warning={t('admin.delete.warning')} confirmLabel={t('admin.delete.confirm')}
      />
    </div>
  )
}
