import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye, FileMagnifyingGlass } from '@phosphor-icons/react'
import { Avatar, Card, Empty } from '../components/ui'
import { DocBadge } from '../components/docs'
import DocPreview from '../components/DocPreview'
import { DOC_TYPES, sname, type DocKey, type DocStatus } from '../lib/data'
import { fmtShort } from '../lib/format'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { PageHead } from './AdminLayout'

const TABS: DocStatus[] = ['pending', 'rejected', 'missing']
const COLS = 'md:grid-cols-[minmax(11rem,1.1fr)_minmax(13rem,1.5fr)_4.5rem_8.5rem_auto]'

export default function AdminDocuments() {
  const { students, setDoc } = useStore()
  const { t } = useTranslation()
  const [tab, setTab] = useState<DocStatus>('pending')
  const [preview, setPreview] = useState<{ studentId: string; key: DocKey } | null>(null)

  const rows = useMemo(() => students.flatMap((s) => DOC_TYPES.filter((d) => s.docs[d.key].status === tab && (tab !== 'missing' || (d.required && s.stage <= 3))).map((d) => ({ s, d, st: s.docs[d.key] }))), [students, tab])
  const count = (v: DocStatus) => students.reduce((n, s) => n + DOC_TYPES.filter((d) => s.docs[d.key].status === v && (v !== 'missing' || (d.required && s.stage <= 3))).length, 0)
  const previewStudent = preview ? students.find((s) => s.id === preview.studentId) : undefined

  return (
    <div>
      <PageHead title={t('admin.docs.title')} text={t('admin.docs.text')} />
      <div className="mb-5 flex flex-wrap gap-2" role="tablist">
        {TABS.map((v) => (
          <button key={v} role="tab" aria-selected={tab === v} onClick={() => setTab(v)} className={cn('flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition', tab === v ? 'bg-ink text-white' : 'border border-line bg-white text-ink-2 hover:border-ink/40')}>
            {t(`common.docStatus.${v}`)}<span className={cn('latin rounded-full px-1.5 text-xs', tab === v ? 'bg-white/20' : 'bg-ink/8')}>{count(v)}</span>
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        {rows.length === 0 ? <Empty icon={<FileMagnifyingGlass />} title={t('admin.docs.emptyTitle')} text={t('admin.docs.emptyText')} /> : (
          <ul className="divide-y divide-line">
            {rows.map(({ s, d, st }) => {
              return (
                <li key={s.id + d.key} className="p-4">
                  <div className={cn('grid items-center gap-x-4 gap-y-3', COLS)}>
                    <Link to={`/admin/students/${s.id}`} className="flex items-center gap-3"><Avatar name={sname(s)} /><div className="min-w-0"><p className="truncate font-bold">{sname(s)}</p><p className="text-xs text-ink-3">{t(`data.countries.${s.country}`)}</p></div></Link>
                    <div><p className="font-bold">{t(`data.docs.${d.key}.label`)}</p><p className="max-w-80 text-xs text-ink-3">{t(`data.docs.${d.key}.rule`)}</p></div>
                    <span className="text-xs text-ink-3">{st.uploadedAt ? fmtShort(st.uploadedAt) : ''}</span>
                    <div><DocBadge status={st.status} /></div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {tab !== 'missing' && (
                        <button onClick={() => setPreview({ studentId: s.id, key: d.key })} className="flex h-9 items-center gap-1.5 rounded-ctl border border-line px-3 text-sm font-bold text-ink-2 hover:bg-ink/5"><Eye size={16} />{t('common.view')}</button>
                      )}
                    </div>
                  </div>
                  {st.status === 'rejected' && st.note && <p className="mt-2 text-sm text-crimson-700">{t(st.note, { defaultValue: st.note })}</p>}
                </li>
              )
            })}
          </ul>
        )}
      </Card>
      {previewStudent && (
        <DocPreview student={previewStudent} docKey={preview?.key ?? null} onClose={() => setPreview(null)} onReview={preview ? (status, note) => setDoc(preview.studentId, preview.key, status, note) : undefined} />
      )}
    </div>
  )
}
