import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Avatar, Progress } from '../components/ui'
import { DOC_TYPES, STAGES, primaryUni, sname, type StageId } from '../lib/data'
import { useStore } from '../lib/store'
import { cn } from '../lib/cn'
import { PageHead } from './AdminLayout'

export default function Pipeline() {
  const { students, setStage, uname } = useStore()
  const { t } = useTranslation()
  const [over, setOver] = useState<number | null>(null)

  return (
    <div>
      <PageHead title={t('admin.pipeline.title')} text={t('admin.pipeline.text')} />
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
        {STAGES.map((st) => {
          const col = students.filter((s) => s.stage === st.id)
          return (
            <section
              key={st.id} aria-label={t(`data.stages.${st.id}.label`)}
              onDragOver={(e) => { e.preventDefault(); setOver(st.id) }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => { const id = e.dataTransfer.getData('text/plain'); setOver(null); if (id) setStage(id, st.id) }}
              className={cn('w-72 shrink-0 rounded-card bg-ink/[0.045] p-3 transition', over === st.id && 'bg-crimson-50 ring-2 ring-crimson-600/40')}
            >
              <header className="mb-3 flex items-center justify-between px-1.5 pt-1">
                <h2 className="text-sm font-extrabold">{t(`data.stages.${st.id}.label`)}</h2>
                <span className="latin grid min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold">{col.length}</span>
              </header>
              <ul className="space-y-2.5">
                {col.map((s) => {
                  const ok = DOC_TYPES.filter((d) => s.docs[d.key].status === 'verified').length
                  return (
                    <li key={s.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', s.id)} className="cursor-grab rounded-2xl border border-line bg-white p-3.5 active:cursor-grabbing">
                      <Link to={`/admin/students/${s.id}`} className="flex items-center gap-2.5">
                        <Avatar name={sname(s)} size={32} />
                        <div className="min-w-0"><p className="truncate text-sm font-bold">{sname(s)}</p><p className="truncate text-xs text-ink-3">{primaryUni(s) ? uname(primaryUni(s)!) : t('admin.students.noUni')}</p></div>
                      </Link>
                      <div className="mt-3 flex items-center gap-2"><Progress value={(ok / DOC_TYPES.length) * 100} className="flex-1" /><span className="latin text-[11px] font-bold text-ink-3">{ok}/{DOC_TYPES.length}</span></div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-xs text-ink-3">{t(`data.countries.${s.country}`)}</span>
                        <div className="flex gap-1">
                          <button disabled={s.stage === 1} onClick={() => setStage(s.id, (s.stage - 1) as StageId)} aria-label={t('admin.pipeline.prev')} className="grid size-7 place-items-center rounded-lg hover:bg-ink/6 disabled:opacity-30"><CaretRight size={14} weight="bold" className="ltr:-scale-x-100" /></button>
                          <button disabled={s.stage === 8} onClick={() => setStage(s.id, (s.stage + 1) as StageId)} aria-label={t('admin.pipeline.next')} className="grid size-7 place-items-center rounded-lg hover:bg-ink/6 disabled:opacity-30"><CaretLeft size={14} weight="bold" className="ltr:-scale-x-100" /></button>
                        </div>
                      </div>
                    </li>
                  )
                })}
                {col.length === 0 && <li className="rounded-2xl border border-dashed border-ink/20 p-5 text-center text-xs text-ink-3">{t('admin.pipeline.empty')}</li>}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
