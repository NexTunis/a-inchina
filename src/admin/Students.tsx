import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MagnifyingGlass, PencilSimple, Plus, Trash, UsersThree } from '@phosphor-icons/react'
import { Avatar, Badge, Btn, Card, Empty, Input, Progress, Select } from '../components/ui'
import { ConfirmDialog } from '../components/Modal'
import { STAGES, primaryUni, sname, stname, type Student } from '../lib/data'
import { fmtShort } from '../lib/format'
import { useStaffMember, useStore } from '../lib/store'
import { PageHead } from './AdminLayout'
import StudentFormModal from './StudentFormModal'

export function stageTone(stage: number): 'neutral' | 'warn' | 'crimson' | 'ok' | 'gold' {
  return stage <= 2 ? 'neutral' : stage <= 4 ? 'warn' : stage <= 6 ? 'gold' : 'ok'
}

function AdvisorName({ id }: { id: string }) {
  const a = useStaffMember(id)
  return <>{a ? stname(a) : '-'}</>
}

export default function Students() {
  const { students, removeStudent, uname } = useStore()
  const nav = useNavigate()
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const [stage, setStage] = useState('all')
  const [country, setCountry] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Student | undefined>()
  const [deleting, setDeleting] = useState<Student | null>(null)
  const countries = [...new Set(students.map((s) => s.country))]
  const list = useMemo(() => students.filter((s) =>
    (stage === 'all' || s.stage === Number(stage)) && (country === 'all' || s.country === country) &&
    (!q || (sname(s) + s.name + s.email + t(`data.programs.${s.major}`, { defaultValue: s.major })).toLowerCase().includes(q.toLowerCase())),
  ), [students, q, stage, country, t])

  const openAdd = () => { setEditing(undefined); setFormOpen(true) }
  const openEdit = (s: Student) => { setEditing(s); setFormOpen(true) }

  return (
    <div>
      <PageHead title={t('admin.students.title')} text={t('admin.students.count', { n: students.length })}>
        <Btn onClick={openAdd}><Plus size={18} weight="bold" />{t('admin.form.add')}</Btn>
      </PageHead>
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_12rem_12rem]">
        <div className="relative">
          <MagnifyingGlass className="pointer-events-none absolute inset-y-0 start-3.5 my-auto text-ink-3" size={18} />
          <Input aria-label={t('admin.students.search')} placeholder={t('admin.students.search')} value={q} onChange={(e) => setQ(e.target.value)} className="ps-10" />
        </div>
        <Select aria-label={t('admin.students.stage')} value={stage} onChange={(e) => setStage(e.target.value)}><option value="all">{t('admin.students.allStages')}</option>{STAGES.map((s) => <option key={s.id} value={s.id}>{t(`data.stages.${s.id}.label`)}</option>)}</Select>
        <Select aria-label={t('admin.students.country')} value={country} onChange={(e) => setCountry(e.target.value)}><option value="all">{t('admin.students.allCountries')}</option>{countries.map((c) => <option key={c} value={c}>{t(`data.countries.${c}`)}</option>)}</Select>
      </div>

      <Card className="overflow-hidden">
        {list.length === 0 ? <Empty icon={<UsersThree />} title={t('admin.students.emptyTitle')} text={t('admin.students.emptyText')} /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-start text-sm">
              <thead className="bg-paper text-xs font-bold text-ink-3">
                <tr>{['student', 'country', 'level', 'university', 'status', 'progress', 'advisor', 'updated'].map((h) => <th key={h} className="px-4 py-3 text-start">{t(`admin.students.cols.${h}`)}</th>)}<th className="px-4 py-3"><span className="sr-only">{t('common.actions')}</span></th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((s) => {
                  const uid = primaryUni(s)
                  return (
                    <tr key={s.id} tabIndex={0} onClick={() => nav(`/admin/students/${s.id}`)} onKeyDown={(e) => e.key === 'Enter' && nav(`/admin/students/${s.id}`)} className="cursor-pointer transition hover:bg-crimson-50/50 focus-visible:bg-crimson-50/50">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><Avatar name={sname(s)} /><div><p className="font-bold">{sname(s)}</p><p className="text-xs text-ink-3"><span className="latin">{s.email}</span></p></div></div></td>
                      <td className="px-4 py-3">{t(`data.countries.${s.country}`)}</td>
                      <td className="px-4 py-3"><p className="font-semibold">{t(`data.levels.${s.level}`)}</p><p className="text-xs text-ink-3">{t(`data.programs.${s.major}`, { defaultValue: s.major })}</p></td>
                      <td className="px-4 py-3">{uid ? <>{uname(uid)}{s.applications.length > 1 && <span className="ms-1.5 text-xs text-ink-3">+{s.applications.length - 1}</span>}</> : <span className="text-ink-3">{t('admin.students.noUni')}</span>}</td>
                      <td className="px-4 py-3"><Badge tone={stageTone(s.stage)}>{t(`data.stages.${s.stage}.label`)}</Badge></td>
                      <td className="w-36 px-4 py-3"><Progress value={(s.stage / 8) * 100} /></td>
                      <td className="px-4 py-3"><AdvisorName id={s.advisorId} /></td>
                      <td className="px-4 py-3 text-ink-3">{fmtShort(s.updatedAt)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(s)} aria-label={`${t('common.edit')} ${sname(s)}`} className="grid size-9 place-items-center rounded-ctl text-ink-2 hover:bg-ink/6"><PencilSimple size={18} /></button>
                          <button onClick={() => setDeleting(s)} aria-label={`${t('common.delete')} ${sname(s)}`} className="grid size-9 place-items-center rounded-ctl text-crimson-700 hover:bg-crimson-50"><Trash size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <StudentFormModal open={formOpen} onClose={() => setFormOpen(false)} student={editing} />
      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => deleting && removeStudent(deleting.id)}
        title={t('admin.delete.title')} text={t('admin.delete.text', { name: deleting ? sname(deleting) : '' })}
        warning={t('admin.delete.warning')} confirmLabel={t('admin.delete.confirm')}
      />
    </div>
  )
}
