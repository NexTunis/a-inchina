import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Envelope, IdentificationBadge, PencilSimple, Phone, Plus, Trash } from '@phosphor-icons/react'
import { Avatar, Badge, Btn, Card, Empty, Field, Input, Select } from '../components/ui'
import { ConfirmDialog, Modal } from '../components/Modal'
import { STAFF_ROLES, stname, type Hub, type Staff as StaffMember, type StaffRole } from '../lib/data'
import { useStore } from '../lib/store'
import { PageHead } from './AdminLayout'

const TONE: Record<StaffRole, 'neutral' | 'gold' | 'crimson' | 'ok' | 'dark'> = { admissions: 'crimson', scholarship: 'gold', visa: 'ok', ground: 'neutral', manager: 'dark' }

interface FormState { name: string; nameEn: string; role: StaffRole; email: string; phone: string; hub: Hub }
const EMPTY: FormState = { name: '', nameEn: '', role: 'admissions', email: '', phone: '', hub: 'shanghai' }

export default function Staff() {
  const { staff, students, addStaff, updateStaff, removeStaff } = useStore()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<StaffMember | null>(null)
  const [deleting, setDeleting] = useState<StaffMember | null>(null)
  const [f, setF] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const set = <K extends keyof FormState>(k: K) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }))

  const openAdd = () => { setEditing(null); setF(EMPTY); setErrors({}); setOpen(true) }
  const openEdit = (s: StaffMember) => { setEditing(s); setF({ name: s.name, nameEn: s.nameEn, role: s.role, email: s.email, phone: s.phone, hub: s.hub ?? 'shanghai' }); setErrors({}); setOpen(true) }

  const load = (id: string) => students.filter((s) => s.advisorId === id).length
  const arrivals = (id: string) => students.filter((s) => s.arrival?.driver === id).length

  function submit(e: FormEvent) {
    e.preventDefault()
    const er: typeof errors = {}
    if (f.nameEn.trim().length < 3) er.nameEn = t('site.apply.errName')
    if (f.name.trim().length < 3) er.name = t('site.apply.errName')
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = t('site.apply.errEmail')
    if (f.phone.replace(/\D/g, '').length < 8) er.phone = t('site.apply.errPhone')
    setErrors(er)
    if (Object.keys(er).length) return
    const data = { name: f.name.trim(), nameEn: f.nameEn.trim(), role: f.role, email: f.email.trim(), phone: f.phone.trim(), hub: f.role === 'ground' ? f.hub : undefined }
    if (editing) updateStaff(editing.id, data); else addStaff(data)
    setOpen(false)
  }

  const delBlocked = deleting ? load(deleting.id) > 0 || arrivals(deleting.id) > 0 : false

  return (
    <div>
      <PageHead title={t('admin.staff.title')} text={t('admin.staff.text')}>
        <Btn onClick={openAdd}><Plus size={18} weight="bold" />{t('admin.staff.add')}</Btn>
      </PageHead>

      {staff.length === 0 ? <Card><Empty icon={<IdentificationBadge />} title={t('admin.staff.emptyTitle')} text={t('admin.staff.emptyText')} /></Card> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {staff.map((m) => (
            <Card key={m.id} className="flex flex-col gap-4 p-5">
              <div className="flex items-start gap-3">
                <Avatar name={stname(m)} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-extrabold">{stname(m)}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5"><Badge tone={TONE[m.role]}>{t(`admin.staff.roles.${m.role}`)}</Badge>{m.hub && <Badge>{t(`data.hubs.${m.hub}`)}</Badge>}</div>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-ink-2">
                <p className="latin flex items-center gap-2"><Envelope size={16} className="text-ink-3" />{m.email}</p>
                <p className="latin flex items-center gap-2"><Phone size={16} className="text-ink-3" />{m.phone}</p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                <p className="text-sm text-ink-3">
                  {m.role === 'ground' ? t('admin.staff.arrivalsCount', { n: arrivals(m.id) }) : m.role === 'manager' ? t('admin.staff.managerNote') : t('admin.staff.studentsCount', { n: load(m.id) })}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(m)} aria-label={`${t('common.edit')} ${stname(m)}`} className="grid size-9 place-items-center rounded-ctl text-ink-2 hover:bg-ink/6"><PencilSimple size={18} /></button>
                  <button onClick={() => setDeleting(m)} aria-label={`${t('common.delete')} ${stname(m)}`} className="grid size-9 place-items-center rounded-ctl text-crimson-700 hover:bg-crimson-50"><Trash size={18} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? t('admin.staff.editTitle') : t('admin.staff.addTitle')} footer={<>
        <Btn variant="ghost" onClick={() => setOpen(false)}>{t('common.cancel')}</Btn>
        <Btn type="submit" form="staff-form">{editing ? t('common.save') : t('admin.staff.add')}</Btn>
      </>}>
        <form id="staff-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label={t('admin.staff.nameEn')} error={errors.nameEn}><Input value={f.nameEn} onChange={set('nameEn')} autoFocus /></Field>
          <Field label={t('admin.staff.nameAr')} error={errors.name}><Input value={f.name} onChange={set('name')} dir="rtl" /></Field>
          <Field label={t('admin.staff.role')}><Select value={f.role} onChange={set('role')}>{STAFF_ROLES.map((r) => <option key={r} value={r}>{t(`admin.staff.roles.${r}`)}</option>)}</Select></Field>
          {f.role === 'ground' && <Field label={t('admin.staff.hub')}><Select value={f.hub} onChange={set('hub')}><option value="shanghai">{t('data.hubs.shanghai')}</option><option value="beijing">{t('data.hubs.beijing')}</option></Select></Field>}
          <Field label={t('common.email')} error={errors.email}><Input type="email" value={f.email} onChange={set('email')} className="latin text-start" /></Field>
          <Field label={t('admin.staff.phone')} error={errors.phone}><Input type="tel" value={f.phone} onChange={set('phone')} className="latin text-start" /></Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting} onClose={() => setDeleting(null)} onConfirm={() => deleting && removeStaff(deleting.id)}
        title={t('admin.staff.deleteTitle')} text={t('admin.staff.deleteText', { name: deleting ? stname(deleting) : '' })}
        warning={delBlocked ? t('admin.staff.deleteBlocked') : undefined} disabled={delBlocked} confirmLabel={t('admin.staff.deleteConfirm')}
      />
    </div>
  )
}
